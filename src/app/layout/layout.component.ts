import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./ui/header/header.component";
import { FooterComponent } from "./ui/footer/footer.component";


@Component({
  selector: 'layout',
  template: `
    <header class="header">
      <hero-header
        [username]="'Arturo'"
        (logout)="logout()"
      />
    </header>

    <main class="main">
      <router-outlet />
    </main>

    <footer class="footer">
      <hero-footer />
    </footer>
  `,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  host: { class: 'layout' }
})
export default class LayoutComponent {

  logout() {}
}
