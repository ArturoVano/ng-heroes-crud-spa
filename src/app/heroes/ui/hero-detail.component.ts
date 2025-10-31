import { Component, input, output } from "@angular/core";
import { Hero } from "../../shared/interfaces/hero";
import { ArrowLeft, LucideAngularModule } from "lucide-angular";


@Component({
  selector: 'hero-detail',
  template: `
    @if (hero(); as hero) {
      <div class="detail">

        <img
          class="detail__image"
          [src]="hero.image?.url ? hero.image?.url : 'assets/images/no-image.png'"
          [alt]="hero.name"
        />

        <div class="detail__details">
          <div class="detail__header">
            <h3 class="title">
              {{ hero.name }}
              <span class="subtitle">{{ hero.biography['full-name'] }}</span>
            </h3>
          </div>

          <div class="detail__content">
            <ul>
              <li>{{ hero.biography['first-appearance'] }}</li>
              <li>{{ hero.biography.aliases }}</li>
              <li>{{ hero.biography.publisher }}</li>
              <li><strong>Alter egos </strong>{{ hero.biography['alter-egos'] }}</li>
            </ul>

            <button (click)="close.emit()">
              <lucide-icon [img]="arrow" />
              Back to list
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: '',
  imports: [LucideAngularModule]
})
export class HeroDetailComponent {
  hero = input.required<Hero>();
  close = output();

  readonly arrow = ArrowLeft;
}
