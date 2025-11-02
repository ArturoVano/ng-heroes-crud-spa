import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import {  LucideAngularModule, Pencil, Plus, Search, LogOut } from 'lucide-angular';
import { routes } from './app.routes';

const lucideIcons = {
  Plus, Search, Pencil, LogOut
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      LucideAngularModule.pick(lucideIcons)
    )
  ]
};


