import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { StateEntidad } from '../interfaces/state-entidad';
import { Entidad } from '../interfaces/entidad';
import { delay, forkJoin, Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntidadesService {
  private http = inject(HttpClient)
  url: string = "http://127.0.0.1:8000/api/v1/"
  #state = signal<StateEntidad>({
    loading: true,
    entidades: []
  })

  entidades = computed(() => this.#state().entidades);
  loading = computed(() => this.#state().loading);
  constructor() {
    this.refresh();
  }

  /** Método para refrescar los datos */

  get(): Observable<Entidad[]> {
    return this.http.get<Entidad[]>(`${this.url}entidades`);
  }
  
  refresh(): void {
    this.#state.set({ loading: true, entidades: [] }) // Actualiza el estado a "cargando" y vacia las entidades
    this.http.get<Entidad[]>(`${this.url}entidades`).subscribe({
      next: (res) => {
        this.#state.set({
          loading: false,
          entidades: res,
        });
      },
      error: (error) => {
        console.error('Error al cargar entidades:', error);
      }
    });

  }
  delete(entidad: Entidad): void {
    this.http.delete<Entidad>(`${this.url}entidades/${entidad.id}`).subscribe({
      next: (res) => {
        this.refresh();
      },
      error: (error) => {
        console.error('Error al eliminar la entidad:', error);
      }
    });
  }

  updateEntidad(entidad: Entidad) {
    return this.http.put<Entidad>(`${this.url}entidades/${entidad.id}`, entidad)
      .subscribe({
        next: (updatedEntidad) => {
          const currentEntidades = this.#state().entidades;
          const index = currentEntidades.findIndex(e => e.id === entidad.id);
          if (index !== -1) {
            const updatedEntidades = [...currentEntidades];
            updatedEntidades[index] = updatedEntidad;
            this.#state.set({
              loading: false,
              entidades: updatedEntidades
            });
          }
        },
        error: (error) => {
          console.error('Error updating entidad:', error);
          // Handle error appropriately
        }
      });
  }

  addEntidad(entidad: Entidad) {
    return this.http.post<Entidad>(`${this.url}entidades`, entidad)
      .subscribe({
        next: (newEntidad) => {
          const currentEntidades = this.#state().entidades;
          this.#state.set({
            loading: false,
            entidades: [...currentEntidades, newEntidad]
          });
        },
        error: (error) => {
          console.error('Error adding entidad:', error);
          // Handle error appropriately
        }
      });
  }

  deleteEntidades(entidades: Entidad[]): Observable<void> {
    const deleteRequests = entidades.map(entidad => 
      this.http.delete<void>(`${this.url}entidades/${entidad.id}`)
    );

    return forkJoin(deleteRequests).pipe(
      map(() => undefined),
      tap(() => {
        const ids = entidades.map(entidad => entidad.id);
        const currentEntidades = this.#state().entidades.filter(entidad => !ids.includes(entidad.id));
        this.#state.set({
          loading: false,
          entidades: currentEntidades
        });
      })
    );
  }
}
