import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./ui/header/header.component";
import { FooterComponent } from "./ui/footer/footer.component";


@Component({
  selector: 'layout',
  template: `
    <hero-header
      [username]="'Arturo'"
      (logout)="logout()"
    />

    <router-outlet />

    <hero-footer />
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
