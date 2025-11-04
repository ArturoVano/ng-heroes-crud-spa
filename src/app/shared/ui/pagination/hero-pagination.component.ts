import { Component, computed, input, output } from "@angular/core";
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'hero-pagination',
  template: `
    <nav class="pagination" role="navigation" aria-label="Pagination">
      <button
        [disabled]="currentPage() === 1"
        class="page-btn arrow"
        aria-label="Previous page"
        (click)="pageChange.emit(currentPage()-1)"
      >
        <lucide-icon name="chevron-left" />
      </button>

      @for (page of pages(); track page) {
        <button
          class="page-btn"
          [class.active]="page === currentPage()"
          [attr.data-page]="page"
          (click)="pageChange.emit(page)"
        >
          {{ page }}
        </button>
      }

      <button
        [disabled]="currentPage() === totalPages()"
        class="page-btn arrow"
        aria-label="Next page"
        (click)="pageChange.emit(currentPage()+1)"
      >
        <lucide-icon name="chevron-right" />
      </button>
    </nav>
  `,
  styleUrl: 'hero-pagination.component.scss',
  imports: [LucideAngularModule]
})
export class HeroPaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();

  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );
}
