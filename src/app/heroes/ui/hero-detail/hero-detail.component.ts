import { Component, computed, input, output } from "@angular/core";
import { Alignment, Hero } from "../../../shared/interfaces/hero";
import { NgClass } from "@angular/common";


@Component({
  selector: 'hero-detail',
  template: `
    @if (hero(); as hero) {
      <div class="detail">

        <button
          class="close-btn"
          aria-label="Close modal"
          (click)="close.emit()"
        >×</button>

        <div class="detail__image">
          @if (hero.biography.alignment) {
            <span
              class="chip"
              [ngClass]="'chip--' + hero.biography.alignment"
            >
              {{ hero.biography.alignment }}
            </span>
          }
          <img
            class="hero-image"
            [src]="hero?.images?.lg ? hero.images!.lg : 'assets/no-image.png'"
            [alt]="hero.name"
          />
        </div>

        <div class="detail__details">
          <h2 class="hero-name">{{ hero.name }}</h2>
          <p class="hero-fullname">{{ hero.biography.fullName }}</p>

          <div class="detail__content">
            <div class="detail__block">
              <div class="label" [class.label--red]="isBad()">Alter Egos</div>
              <div class="value">{{ hero.biography.alterEgos }}</div>
            </div>

            <div class="detail__block">
              <div class="label" [class.label--red]="isBad()">Aliases</div>
              <div class="aliases-list">
                @for (alias of hero.biography.aliases; track $index) {
                  <span class="chip">{{ alias }}</span>
                }
              </div>
            </div>

            <div class="detail__block">
              <div class="label" [class.label--red]="isBad()">First Appearance</div>
              <div class="value">{{ hero.biography.firstAppearance }}</div>
            </div>

            <div class="detail__block">
                <div class="label" [class.label--red]="isBad()">Publisher</div>
                <div class="value">{{ hero.biography.publisher }}</div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: 'hero-detail.component.scss',
  imports: [NgClass]
})
export class HeroDetailComponent {
  hero = input.required<Hero>();
  close = output();

  isBad = computed(() =>
    this.hero().biography.alignment === Alignment.BAD
  );
}



