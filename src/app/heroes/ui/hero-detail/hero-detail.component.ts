import { Component, input, output } from "@angular/core";
import { Hero } from "../../../shared/interfaces/hero";
import { LucideAngularModule } from "lucide-angular";
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
            [src]="'assets/images/no-image.png'"
            [alt]="hero.name"
          />
        </div>

        <div class="detail__details">
          <h2 class="hero-name">Superman</h2>
          <p class="hero-fullname">Clark Kent</p>

          <div class="detail__content">
            <div class="detail__block">
              <div class="label">Alter Egos</div>
              <div class="value">{{ hero.biography['alter-egos'] }}</div>
            </div>

            <div class="detail__block">
              <div class="label">Aliases</div>
              <div class="aliases-list">
                @for (alias of hero.biography.aliases; track $index) {
                  <span class="alias-tag">{{ alias }}</span>
                }
              </div>
            </div>

            <div class="detail__block">
              <div class="label">First Appearance</div>
              <div class="value">{{ hero.biography['first-appearance']  }}</div>
            </div>

            <div class="detail__block">
                <div class="label">Publisher</div>
                <div class="value">DC Comics</div>
            </div>

            <button (click)="close.emit()">
              <lucide-icon name="arrow-left" />
              Back to list
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: 'hero-detail.component.scss',
  imports: [LucideAngularModule, NgClass]
})
export class HeroDetailComponent {
  hero = input.required<Hero>();
  close = output();
}
