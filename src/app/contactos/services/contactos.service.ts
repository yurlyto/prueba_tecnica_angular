import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { forkJoin, map, Observable, tap } from 'rxjs';
import { Contacto } from '../interfaces/contacto';
import { StateContacto } from '../interfaces/state-contacto';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  private http = inject(HttpClient);
  private url = 'http://127.0.0.1:8000/api/v1/contactos';
  #state = signal<StateContacto>({
      loading: true,
      contactos: []
    })

  getContactos(): Observable<Contacto[]> {
    return this.http.get<Contacto[]>(this.url);
  }

  addContacto(contacto: Contacto): Observable<Contacto> {
    return this.http.post<Contacto>(this.url, contacto);
  }

  updateContacto(contacto: Contacto): Observable<Contacto> {
    return this.http.put<Contacto>(`${this.url}/${contacto.id}`, contacto);
  }

  deleteContacto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  deleteContactos(contactos: Contacto[]): Observable<void> {
      const deleteRequests = contactos.map(contacto => 
        this.http.delete<void>(`${this.url}contactos/${contacto.id}`)
      );
  
      return forkJoin(deleteRequests).pipe(
        map(() => undefined),
        tap(() => {
          const ids = contactos.map(contacto => contacto.id);
          const currentContactos = this.#state().contactos.filter(contacto => !ids.includes(contacto.id));
          this.#state.set({
            loading: false,
            contactos: currentContactos
          });
        })
      );
    }
}
