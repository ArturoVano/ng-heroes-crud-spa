import { Component, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";


@Component({
  selector: 'hero-header',
  template: `
    <header class="header">
      <div class="header__wrapper">
        <div class="header__logo">
          <a routerLink="/heroes">MyApp</a>
        </div>

        <nav class="header__auth">
          <span class="username">Welcome, {{ username() }}</span>
          <button class="btn btn--purple btn-logout" (click)="logout.emit()">Log Out</button>
        </nav>
      </div>
    </header>
  `,
  styleUrls: ['header.component.scss'],
  imports: [RouterLink]
})
export class HeaderComponent {
  username = input<string>();
  logout = output();
}
