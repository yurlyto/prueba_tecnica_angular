import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { StateEntidad } from '../interfaces/state-entidad';
import { Entidad } from '../interfaces/entidad';

@Injectable({
  providedIn: 'root'
})
export class EntidadesService {
  private http=inject(HttpClient)
  url:string="http://127.0.0.1:8000/api/"
  #state = signal<StateEntidad>({
    loading: true,
    entidades: []
  })

  entidades=computed(()=>this.#state().entidades);
  loading=computed(()=>this.#state().loading);
  constructor() { 
    this.http.get<Entidad[]>(`${this.url}entidades`).subscribe(res=>{
      this.#state.set({
        loading:false,
        entidades: res 
      })
    })
  }

}
