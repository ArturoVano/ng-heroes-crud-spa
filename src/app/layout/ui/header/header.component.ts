import { Component, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LogOut, LucideAngularModule } from "lucide-angular";


@Component({
  selector: 'hero-header',
  template: `
    <div class="header__wrapper">
      <div class="header__logo">
        <a routerLink="/heroes">MyApp</a>
      </div>

      <nav class="header__auth">
        <div class="user">
          <div class="user__logo">
            <span>{{ 'AV' }}</span>
          </div>
          <span class="user__name">{{ username() }}</span>
        </div>
        <button class="btn btn-logout" (click)="logout.emit()">
          <lucide-icon [img]="logoutIcon" />
        </button>
      </nav>
    </div>
  `,
  styleUrls: ['header.component.scss'],
  imports: [RouterLink, LucideAngularModule],

})
export class HeaderComponent {
  username = input<string>();
  logout = output();

  logoutIcon = LogOut;
}
