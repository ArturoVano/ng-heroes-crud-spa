import { Component, computed, effect, inject } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { HeroesService } from "../../shared/data-access/heroes.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { AddHero, Hero } from "../../shared/interfaces/hero";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { LucideAngularModule } from "lucide-angular";
import { HttpClient } from "@angular/common/http";
import { HeroFormModel } from "../interfaces/hero-form";

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

            <div class="form-field">
              <label for="publisher">Publisher</label>
              <select formControlName="publisher" id="publisher">
                <button>
                  <selectedcontent></selectedcontent>
                </button>
                @for (publisher of publishers(); track $index) {
                  <option [value]="publisher">{{ publisher }}</option>
                }
              </select>
            </div>

            <div class="form-field">
              <label>Alignment</label>
              <div class="alignment-select">
                <label class="alignment-select__option">
                  <input
                    type="radio"
                    formControlName="alignment"
                    [value]="'good'"
                  />
                  <span class="alignment-select__label">Good</span>
                </label>

                <label class="alignment-select__option">
                  <input
                    type="radio"
                    formControlName="alignment"
                    [value]="'bad'"
                  />
                  <span class="alignment-select__label">Bad</span>
                </label>
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
                  heroesService.remove$.next(heroId()!)
                "
              >
                Delete
              </button>
            }
            <button
              class="btn btn--primary actions__save"
              type="submit"
              [disabled]="heroForm.invalid"
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
  heroId = computed(() => this.params()?.get('id'));

  hero = computed<Hero | null>(() =>
    !!this.heroId()
      ? this.heroesService.heroes().find(
          ({id}) => id.toString() === this.heroId()
        ) ?? null
      : null
  );

  heroForm : FormGroup<HeroFormModel> = this.fb.group({
    name: this.fb.control('', { validators: Validators.required, nonNullable: true }),
    biography: this.fb.group({
      fullName: this.fb.control('', { nonNullable: true }),
      alterEgos: this.fb.control('', { nonNullable: true }),
      firstAppearance: this.fb.control('', { nonNullable: true }),
      publisher: this.fb.control('', { validators: Validators.required, nonNullable: true }),
      alignment: this.fb.control('', { validators: Validators.required, nonNullable: true }),
    }),
    image: this.fb.group({
      url: this.fb.control('', { nonNullable: true }),
    })
  });

  constructor() {
    effect(() => {
      const hero = this.hero();

      if (hero) {
        this.heroForm.patchValue({
          name: hero.name,
          biography: {
            fullName: hero.biography.fullName,
            alterEgos: hero.biography.alterEgos,
            firstAppearance: hero.biography.firstAppearance,
            publisher: hero.biography.publisher,
            alignment: hero.biography.alignment,
          },
          image: { url: hero.images?.lg }
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
  }
}
