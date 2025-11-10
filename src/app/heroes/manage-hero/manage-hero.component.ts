import { Component, computed, effect, inject } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { HeroesService } from "../../shared/data-access/heroes.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { AddHero, Hero } from "../../shared/interfaces/hero";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { LucideAngularModule } from "lucide-angular";
import { HttpClient } from "@angular/common/http";


interface HeroFormModel {
  name: FormControl<string>;
  biography: FormGroup<{
    fullName: FormControl<string>;
    alterEgos: FormControl<string>;
    aliases: FormControl<string[]>;
    firstAppearance: FormControl<string>;
    publisher: FormControl<string>;
    alignment: FormControl<string>;
  }>;
  image: FormGroup<{
    url: FormControl<string>;
  }>;
}

@Component({
  selector: 'manage-hero',
  template: `
    <div class="manage-hero">
      <div class="manage-hero__header">
        <div class="manage-hero__title">
          <h1 class="hero-title">
            {{ hero() ? 'Edit ' + hero()!.name : 'Create new hero' }}
          </h1>
          <p class="hero-subtitle">{{
            hero()
              ? 'Edit a hero to make at your desire'
              : 'Create a new hero with all their details'
          }}</p>
        </div>

        <div class="manage-hero__btn">
          <button class="btn btn--green" routerLink="/heroes">
            <lucide-icon name="arrow-left" />
            Back to list
          </button>
        </div>
      </div>

      <div class="form-layout">

        <form class="form-group" [formGroup]="heroForm" (ngSubmit)="onSubmit()">
          <h2 class="form-group__title">Hero Information</h2>

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
          <!-- <div class="form-group biography" formGroupName="biography"> -->
            <div formGroupName="biography">
              <div class="form-field">
                <label for="full-name">Full name</label>
                <input
                  id="full-name"
                  type="text"
                  formControlName="fullName"
                />
              </div>
              <div class="form-field">
                <label for="alter-ego">Alter ego</label>
                <input
                  id="alter-ego"
                  type="text"
                  formControlName="alterEgos"
                />
              </div>
              <div class="form-field">
                <label for="appearence">First appearence</label>
                <input
                  id="appearence"
                  type="text"
                  placeholder="e.g., ACTION COMICS #1"
                  formControlName="firstAppearance"
                />
              </div>
              <!-- <div class="form-field">
                <label for="aliases">Aliases</label>
                <div class="aliases-input">
                  <input
                    id="aliases"
                    type="text"
                    formControlName="aliases"
                    placeholder="Add any alias as yoy want..."
                  />
                  <button class="btn">
                    <lucide-icon name="plus"/>
                  </button>
                </div>
                <div class="aliases-list">
                  @for (alias of aliases; track $index) {
                    <div class="chip">
                      {{ alias }}
                      <button>
                        <lucide-icon name="x"></lucide-icon>
                      </button>
                    </div>
                  }
                </div>
              </div> -->
              <div class="form-field">
                <label for="alignment">Alignment</label>

                <div class="alignment-select">
                    <button
                      class="alignment-select__option"
                      [class.selected]="">
                      {{ 'Good' }}
                    </button>
                    <button
                    class="alignment-select__option"
                    [class.selected]="">
                      {{ 'Bad' }}
                    </button>
                </div>

              </div>
            </div>
          <div class="form-field image" formGroupName="image">
            <label for="image">Image url</label>
            <input
              id="image"
              type="text"
              formControlName="url"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div class="actions">
            @if (heroId()) {
              <button
                class="btn actions__remove"
                (click)="
                  heroesService.remove$.next(heroId())
                "
              >
                Delete
              </button>
            }
            <button
              class="btn btn--primary actions__save"
              type="submit"
              [disabled]="heroForm.invalid"
              [tabIndex]="heroForm.invalid ? -1 : 0"
            >
              Save
            </button>
          </div>
        </form>

        <div class="image-section">
          <div class="form-group">
            <div class="image-preview" id="image-preview">
              <img
                [src]="hero()?.images?.lg ? hero()!.images!.lg : 'assets/no-image.png'"
                [alt]="'Hero image'"
                />
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styleUrl: 'manage-hero.component.scss',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    LucideAngularModule,
  ],
})
export default class ManageHeroComponent {
  heroesService = inject(HeroesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  http = inject(HttpClient);

  publishers = toSignal(this.heroesService.getPublishers());
  params = toSignal(this.route.paramMap);
  heroId = computed(() => Number(this.params()?.get('id')));

  hero = computed<Hero | null>(() =>
    !!this.heroId()
      ? this.heroesService.heroes().find(
          ({id}) => Number(id) === this.heroId()
        ) ?? null
      : null
  );

  heroForm : FormGroup<HeroFormModel> = this.fb.group({
    name: this.fb.control('', { validators: Validators.required, nonNullable: true }),
    biography: this.fb.group({
      fullName: this.fb.control('', { nonNullable: true }),
      alterEgos: this.fb.control('', { nonNullable: true }),
      aliases: this.fb.control<string[]>([], {
        validators: Validators.minLength(3),
        nonNullable: true
      }),
      firstAppearance: this.fb.control('', { nonNullable: true }),
      publisher: this.fb.control('', { validators: Validators.required, nonNullable: true }),
      alignment: this.fb.control('', { validators: Validators.required, nonNullable: true }),
    }),
    image: this.fb.group({
      url: this.fb.control('', { nonNullable: true }),
    })
  });


  get aliases() {
    const value = this.heroForm.controls.biography.controls.aliases.value
    return value ?? [];
  }

  constructor() {
    effect(() => {
      const hero = this.hero();

      if (hero) {
        this.heroForm.patchValue({
          name: hero.name,
          biography: {
            fullName: hero.biography.fullName,
            alterEgos: hero.biography.alterEgos,
            aliases: hero.biography['aliases'],
            firstAppearance: hero.biography.firstAppearance,
            publisher: hero.biography.publisher,
            alignment: hero.biography.alignment,
          }
        });
      }
    });

    effect(() => {
      if (
        !this.heroesService.error() &&
        this.heroesService.status() === 'loading'
      ) {
        this.router.navigate(['heroes']);
      }
    });
  }

  onSubmit(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    };

    const newImage = this.heroForm.controls.image.controls.url.value ?? undefined;

    if (this.heroId() && this.hero()) {
      this.heroesService.edit$.next({
        ...this.hero()!,
        ...this.heroForm.getRawValue(),
        images: { lg: newImage }
      } as Hero);
    } else {
      this.heroesService.add$.next(
        {
          ...this.heroForm.getRawValue(),
          images: { lg: newImage }
        } as AddHero
      );
    }
    // TODO: every source action should first put status to loading
    // to avoid the next if to be true if the API response is slow, and its
    // possible error, is slow. Use timers to test it an ensure redirection awaits.
  }

}
