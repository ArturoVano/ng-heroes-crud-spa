import { Component } from "@angular/core";


@Component({
  selector: 'hero-footer',
  template: `
    <footer class="footer">
      <div class="footer__wraper">
        <nav class="footer__navigation">
          <a routerLink="/about">Linkedin</a>
          <a routerLink="/contact">Contact</a>
          <a routerLink="/privacy">GitHub</a>
        </nav>
        <p class="footer__copyright">
          &copy; 2025 HeroApp. All rights reserved.
        </p>
      </div>
    </footer>
  `,
  styleUrls: ['footer.component.scss']
})
export class FooterComponent {
}
