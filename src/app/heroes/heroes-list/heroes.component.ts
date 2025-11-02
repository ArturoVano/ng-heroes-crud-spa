import { Component, computed, inject, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

import { LucideAngularModule } from "lucide-angular";

import { HeroItemComponent } from "../ui/hero-item/hero-item.component";
import { ModalComponent } from "../../shared/ui/modal.component";
import { HeroDetailComponent } from "../ui/hero-detail/hero-detail.component";
import { HeroesService } from "../../shared/data-access/heroes.service";
import { Hero } from "../../shared/interfaces/hero";
import { HeroPaginationComponent } from "../../shared/ui/pagination/hero-pagination.component";
import { PAGINATION_CONFIG } from "../../config/pagination.config";


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
            <lucide-icon class="search-icon" name="search" />
        </div>

        <button
          routerLink="./add"
          class="actions__add btn btn--fill btn--blue"
        >
          <lucide-icon name="plus" />
          New hero
        </button>
      </div>

      <div class="heroes-grid">
        @for (hero of paginatedHeroes(); track hero) {
          <hero-item
            [hero]="hero"
            (detail)="openDetail.set(hero)"
          >
            <a [routerLink]="['./edit', hero.id]" class="edit-link">
              <lucide-icon name="pencil" />
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

      @if (totalPages()) {
        <hero-pagination
          [currentPage]="currentPage()"
          [totalPages]="totalPages()"
          (pageChange)="currentPage.set($event)"
        />
      }

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
    HeroPaginationComponent,
    LucideAngularModule,
    RouterLink
  ],
  styleUrls: ['./heroes.component.scss'],
  host: { class: 'heroes' }
})
export default class HeroesComponent {
  heroesService = inject(HeroesService);

  readonly #itemsPerPage = PAGINATION_CONFIG.ITEMS_PER_PAGE;

  currentPage = signal(1);
  openDetail = signal<Hero | null>(null);
  totalPages = computed<number>(() =>
    Math.ceil(
      this.heroesService.heroes().length / PAGINATION_CONFIG.ITEMS_PER_PAGE
    )
  );
  paginatedHeroes = computed(() => {
    const allHeroes = this.heroesService.heroes();
    const start = (this.currentPage() - 1) * this.#itemsPerPage;
    const end = start + this.#itemsPerPage;

    return allHeroes.slice(start, end);
  });

  // protected scrollToTop(): void {
    // if (typeof window !== 'undefined' && window.scrollTo) {
      // window.scrollTo({ top: 0, behavior: 'smooth' });
    // }
  // }

}
