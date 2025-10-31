import { Component, input, OnInit, output } from "@angular/core";
import { Hero } from "../../../shared/interfaces/hero";

@Component({
  selector: 'hero-item',
  template: `
    @if (hero(); as hero) {
      <div class="item">

        <ng-content />

        <button class="card" (click)="detail.emit(hero)">
          <img class="card__image"
            [src]="'assets/no-image.png'"
            [alt]="hero.name"
            >

          <div class="card__content">
            <div class="card__info">
              <h4 class="name">{{ hero.name }}</h4>
              <p>{{ hero.biography['full-name'] }}</p>
            </div>
            <div class="card__stats">
              <p class="first-appearance">
                {{ hero.biography['first-appearance'] }}
              </p>

              <span class="chip-label">
                {{ hero.biography.alignment }}
              </span>
            </div>
          </div>
        </button>
      </div>
    }
  `,
  styleUrls: ['hero-item.component.scss'],
})
export class HeroItemComponent implements OnInit {
  hero = input.required<Hero>();
  detail = output<Hero>();

  ngOnInit() {
    console.log(this.hero().image?.url)
  }

handleImageError(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = 'assets/no-image.png';
}
}
