import { Component, input, output } from "@angular/core";

@Component({
  selector: 'hero-pagination',
  template: `
    <nav class="pagination" role="navigation" aria-label="Pagination">
      <button class="page-btn arrow" aria-label="Previous page">
        <span>‹</span>
      </button>

      @for (page of pages(); track page) {
        <button
          class="page-btn"
          [attr.data-page]="page"
          (click)="changePage.emit(page)"
        >
          {{ page }}
        </button>
      }

      <button class="page-btn arrow" aria-label="Next page">
        <span>›</span>
      </button>
    </nav>
  `,
  styleUrl: 'hero-pagination.component.scss'
})
export class HeroPaginationComponent {
  pages = input.required<number[]>();
  changePage = output<number>();
}
