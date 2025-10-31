import { Component, computed, effect, inject } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { HeroesService } from "../../shared/data-access/heroes.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { AddHero, Hero } from "../../shared/interfaces/hero";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CdkListboxModule } from "@angular/cdk/listbox";
import { ArrowLeft, LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'manage-hero',
  template: `
    <div class="manage-hero__header">
      <h2>
        {{ heroId() && hero() ? 'Edit ' + hero()!.name : 'Create new hero' }}
      </h2>

      <button class="btn btn--blue" routerLink="/heroes">
        <lucide-icon [img]="arrow" />
        Back to list
      </button>
    </div>

    <div class="divider divider__green"></div>

    <div class="manage-hero__container">
      <img
        [src]="hero() ? hero() : 'assets/images/no-image.png'"
        [alt]="hero()" />

      <form class="form-group" [formGroup]="heroForm" (ngSubmit)="onSubmit()">

        <div class="form-field name">
          <label for="hero-name">Super hero</label>
          <input
            id="hero-name"
            type="text"
            required
            formControlName="name"
            class="show-uppercase"
          />
        </div>
        <div class="form-group biography" formGroupName="biography">
          <div class="form-field">
            <label for="full-name">Full name</label>
            <input
              id="full-name"
              type="text"
              formControlName="full-name"
            />
          </div>
          <div class="form-field">
            <label for="alter-ego">Alter ego</label>
            <input
              id="alter-ego"
              type="text"
              formControlName="alter-egos"
            />
          </div>
          <div class="form-field">
            <label for="appearence">First appearence</label>
            <input
              id="first-appearance"
              type="text"
              formControlName="first-appearance"
            />
          </div>
          <div class="form-field">
            <label for="aliases">Aliases</label>
            <input
              id="aliases"
              type="text"
              formControlName="aliases"
            />
          </div>
          <div class="form-field">
            <label for="publisher">Publisher</label>
            <ul cdkListbox
              formControlName="publisher"
              id="publisher"
              aria-labelledby="publisher"
            >
              @for (publisher of publishers(); track $index) {
                <li [cdkOption]="publisher">
                  {{ publisher }}
                </li>
              }
            </ul>
          </div>
          <div class="form-field">
            <label for="publisher">Alignment</label>
            <!-- TODO -->
          </div>
        </div>
        <div class="form-field image" formGroupName="image">
          <label for="image">Image url</label>
          <input
            id="image"
            type="text"
            formControlName="url"
          />
        </div>

        <div class="actions">
          @if (heroId()) {
            <button
              class="btn btn--fill btn--red actions__remove"
              (click)="heroesService.remove$.next(heroId()!)"
            >
              Delete
            </button>
          }
          <button
            class="btn btn--fill btn--blue actions__save"
            type="submit"
            [disabled]="heroForm.invalid"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrl: 'manage-hero.component.scss',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CdkListboxModule,
    LucideAngularModule
  ],
})
export default class ManageHeroComponent {
  heroesService = inject(HeroesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  readonly arrow = ArrowLeft;

  publishers = toSignal(this.heroesService.getPublishers());
  params = toSignal(this.route.paramMap);
  heroId = computed(() => this.params()?.get('id'));

  hero = computed<Hero | null>(() =>
    !!this.heroId()
      ? this.heroesService.heroes().find(
          ({id}) => id === this.params()?.get('id')
        ) ?? null
      : null
  );

  heroForm = this.fb.group({
    name: ['', Validators.required],
    biography: this.fb.group({
      ['full-name']: [''],
      ['alter-egos']: [''],
      aliases: [ [''] ],
      ['first-appearance']: [''],
      publisher: ['', Validators.required],
      alignment: ['', Validators.required],
    }),
    image: this.fb.group({
      url: [''],
    })
  });

  constructor() {
    effect(() => {
      const hero = this.hero();

      if (hero) {
        this.heroForm.patchValue({
          name: hero.name,
          biography: {
            ['full-name']: hero.biography['full-name'],
            ['alter-egos']: hero.biography['alter-egos'],
            aliases: hero.biography['aliases'],
            ['first-appearance']: hero.biography['first-appearance'],
            publisher: hero.biography.publisher,
            alignment: hero.biography.alignment,
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.heroId() && this.hero()) {
      this.heroesService.edit$.next({
        ...this.hero()!,
        ...this.heroForm.getRawValue() as Hero
      });
    } else {
      this.heroesService.add$.next(this.heroForm.getRawValue() as AddHero);
    }
    // TODO: every source action should first put status to loading
    // to avoid the next if to be true if the API response is slow, and its
    // possible error, is slow. Use timers to test it an ensure redirection awaits.
    if (
      !this.heroesService.error() &&
      this.heroesService.status() === 'loaded'
    ) {
      this.router.navigate(['heroes']);
    }
  }
}
