import { Component, input, output } from "@angular/core";
import { Hero } from "../../../shared/interfaces/hero";
import { NgClass } from "@angular/common";

@Component({
  selector: 'hero-item',
  template: `
    @if (hero(); as hero) {
      <div class="item">

        <ng-content />

        <button class="card" (click)="detail.emit(hero)">

          @if (hero.biography.alignment) {
            <span
              class="chip"
              [ngClass]="'chip--' + hero.biography.alignment"
            >
              {{ hero.biography.alignment }}
            </span>
          }

          <img class="card__image"
            [src]="hero?.images?.lg ? hero.images!.lg : 'assets/no-image.png'"
            [alt]="'Hero image'"
            [alt]="hero.name" />

          <div class="card__content">
            <div class="card__info">
              <h3 class="name">{{ hero.name }}</h3>
              <p class="card-subtitle">{{ hero.biography.fullName }}</p>
            </div>
            <div class="card__stats">
              <p class="card-subtitle">{{ 'First appearance' }}</p>
              <p class="first-appearance">
                {{ hero.biography.firstAppearance }}
              </p>

            </div>
          </div>
        </button>
      </div>
    }
  `,
  styleUrls: ['hero-item.component.scss'],
  imports: [NgClass]
})
export class HeroItemComponent {
  hero = input.required<Hero>();
  detail = output<Hero>();
}
