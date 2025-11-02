import { computed, inject, Injectable, Injector, signal } from "@angular/core";
import { AddHero, Hero, RemoveHero } from "../interfaces/hero";
import { FormControl } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, debounceTime, distinctUntilChanged, EMPTY, forkJoin, map, Observable, of, startWith, Subject, switchMap, tap } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { provideStorageService, StorageService } from "./storage.service";
import { HttpClient } from "@angular/common/http";
import { LOCAL_STORAGE } from "./local-storage.token";

export type Status = 'pending' | 'loaded' | 'loading';

export interface HeroesState {
  heroes: Hero[],
  pages: number,
  localHeroes: boolean,
  status: Status,
  error: string | null,
}

@Injectable({ providedIn: 'root' })
export class HeroesService {
  private storage: StorageService<Hero>;
  private externalStorage: StorageService<Hero>;
  private http = inject(HttpClient);
  private localStorage = inject(LOCAL_STORAGE);

  private EXTERNAL_HEROES = 80;
  private HEROES_PER_PAGE = 12;

  heroSearchControl = new FormControl('');

  // state
  private state = signal<HeroesState>({
    heroes: [],
    pages: 0,
    localHeroes: true,
    status: 'pending',
    error: null
  });

  // selectors
  heroes = computed(() => this.state().heroes);
  localHeroes = computed(() => this.state().localHeroes);
  status = computed(() => this.state().status);
  error = computed(() => this.state().error);
  pages = computed(() => this.state().pages);

  // sources
  add$ = new Subject<AddHero>();
  edit$ = new Subject<Hero>();
  remove$ = new Subject<RemoveHero>();
  private error$ = new Subject<string | null>();
  searchChanged$ = this.heroSearchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    startWith('')
  );

  heroesLoaded$ = this.searchChanged$.pipe(
    switchMap((term) =>
      this.storage.loadAll().pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        }),
        map((heroes) => ({
          heroes: term && term.length > 3
            ? this.filterHeroesByTerm(heroes, term)
            : heroes,
          localHeroes: heroes.length > 0 ? true : false
        })),
      )
    ),
  );

  constructor() {
    // Custom configuration for StorageService
    const injector = Injector.create({
      providers: provideStorageService<Hero>(
        environment.heroesUrl,
        this.http
      )
    });
    const injectorTwo = Injector.create({
      providers: provideStorageService<Hero>(
        environment.externalHeroesUrl,
        this.http
      )
    });

    this.storage = injector.get(StorageService);
    this.externalStorage = injectorTwo.get(StorageService);

    // reducers
    this.heroesLoaded$
      .pipe(takeUntilDestroyed())
      .subscribe(({ heroes, localHeroes }) =>{
        console.log(heroes.length);
        console.log(Math.ceil(heroes.length / this.HEROES_PER_PAGE));
        this.state.update((state) => ({
          ...state,
          heroes,
          pages: Math.ceil(heroes.length / this.HEROES_PER_PAGE),
          localHeroes,
          status: 'loaded',
        }))
      });

    this.error$
      .pipe(takeUntilDestroyed())
      .subscribe((error) =>
        this.state.update((state) => ({
          ...state,
          error,
          status: 'pending'
        }))
      );

    this.add$.pipe(
      takeUntilDestroyed(),
      switchMap((hero) => this.storage.add(hero)),
      catchError((error) => {
        this.error$.next(error);
        return EMPTY;
      })
    ).subscribe();

    this.edit$.pipe(
      takeUntilDestroyed(),
      switchMap((hero) => this.storage.edit(hero)),
      catchError((error) => {
        this.error$.next(error);
        return EMPTY;
      })
    ).subscribe();

    this.remove$
      .pipe(
        takeUntilDestroyed(),
        switchMap((hero) => this.storage.remove(hero)),
        catchError((error) => {
          this.error$.next(error);
          return EMPTY;
        })
      ).subscribe();
  }

  getPublishers(): Observable<string[]> {
    let localPublishers = this.localStorage.getItem('publishers');
    if (localPublishers) {
      return of(JSON.parse(localPublishers) as string[])
    }

    const publishers: Observable<string>[] = [];
    for (let i = 1; i <= this.EXTERNAL_HEROES; i++) {
      publishers.push(
        this.externalStorage.getById(i).pipe(
          map((hero) => hero.biography.publisher)
        )
      );
    }
    return forkJoin(publishers).pipe(
      map(publishers => Array.from(new Set(publishers))),
      tap((publishers) => this.localStorage.setItem(
        'publishers',
        JSON.stringify(publishers)
      ))
    );
  }

  private filterHeroesByTerm(heroes: Hero[], term: string) {
    return heroes.filter(({name}) =>
      name.toLocaleLowerCase().includes(term!.toLocaleLowerCase())
    );
  }
}
