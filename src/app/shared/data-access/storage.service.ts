import { HttpClient } from "@angular/common/http";
import { inject, Injectable, InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export interface StorageConfig {
  baseUrl: string;
}

export const STORAGE_CONFIG = new InjectionToken<StorageConfig>('STORAGE_CONFIG');

/*
  Services will use a different instances of this service,
  and because the custom config, we need to create some
  boilerplate for the injection. An abscract class approach
  coud be preferable.
*/
@Injectable()
export class StorageService<T extends { id: string | number }> {
  private http = inject(HttpClient);
  private config = inject(STORAGE_CONFIG);

  private get baseUrl(): string {
    return this.config.baseUrl;
  }

  loadAll(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl);
  }

  getById(id: string | number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  add(item: Omit<T, 'id'>): Observable<T> {
    return this.http.post<T>(this.baseUrl, item);
  }

  remove(id: string | number): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${id.toString()}`);
  }

  edit(item: T): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${item.id}`, item);
  }
}

export function provideStorageService<T extends { id: string | number }>(
  baseUrl: string, http: HttpClient
) {
  return [
    {
      provide: STORAGE_CONFIG,
      useValue: { baseUrl }
    },
    {
      provide: HttpClient,
      useValue: http
    },
    StorageService<T>
  ];
}
