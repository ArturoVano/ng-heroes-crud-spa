import { Component, inject, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { HeroItemComponent } from "../ui/hero-item/hero-item.component";
import { ModalComponent } from "../../shared/ui/modal.component";
import { HeroDetailComponent } from "../ui/hero-detail.component";
import { HeroesService } from "../../shared/data-access/heroes.service";
import { Hero } from "../../shared/interfaces/hero";
import { RouterLink } from "@angular/router";
import { LucideAngularModule, Pencil, Plus, Search } from "lucide-angular";


@Component({
  selector: 'heroes',
  template: `
    <div class="heroes__header">
      <h1>Heroes list</h1>
    </div>

    <div class="divider divider__purple"></div>

    <div class="heroes__wrapper">
      <div class="actions">
        <div class="actions__search">
          <label for="search-box">Search heroes</label>
            <input
              id="search-box"
              class="search-box"
              type="search"
              [placeholder]="'Search a hero...'"
              [formControl]="heroesService.heroSearchControl"
            />
            <lucide-icon class="search-icon" [img]="searchIcon" />
        </div>

        <button
          routerLink="./add"
          class="actions__add btn btn--fill btn--blue"
        >
          <lucide-icon [img]="plusIcon" />
          New hero
        </button>
      </div>


      <div class="heroes-grid">
        @for (hero of heroesService.heroes(); track hero) {
          <hero-item
            [hero]="hero"
            (detail)="openDetail.set(hero)"
          >
            <a [routerLink]="['./edit', hero.id]" class="edit-link">
              <lucide-icon [img]="pencilIcon" />
            </a>
          </hero-item>
        } @empty {
          <div class="no-heroes-card">
            @if (heroesService.localHeroes()) {
              <h4>Sorry, we couldn't find any heroes matching your search</h4>
              <p>Try searching with different terms or explore other options</p>
            } @else {
              <h4>There are no heroes</h4>
              <p>Click to ask for heroes in web</p>
              <button >
                Ask for heroes
              </button>
            }
          </div>
        }
      </div>

      <modal [isOpen]="!!openDetail()">
        <ng-template>
          <hero-detail
            [hero]="openDetail()!"
            (close)="openDetail.set(null)"
          />
        </ng-template>
      </modal>
    </div>
  `,
  imports: [
    ReactiveFormsModule,
    HeroItemComponent,
    ModalComponent,
    HeroDetailComponent,
    LucideAngularModule,
    RouterLink
  ],
  styleUrls: ['./heroes.component.scss'],
  host: { class: 'heroes' }
})
export default class Heroes {
  heroesService = inject(HeroesService);
  openDetail = signal<Hero | null>(null);

  readonly pencilIcon = Pencil;
  readonly searchIcon = Search;
  readonly plusIcon = Plus;
}
