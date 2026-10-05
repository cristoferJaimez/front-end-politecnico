import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Noticia {
  id: string;
  categoria: string;
  titulo: string;
  resumen: string;
  fecha: string;
  autor: string;
  imagen?: string;
  cuerpo?: string[];
}

/**
 * Obtiene el catálogo de noticias desde el mismo archivo noticias.json
 * usado por la versión HTML/CSS/JS de NovaNews, para mantener los
 * datos consistentes entre ambas versiones del sitio.
 */
@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  constructor(private http: HttpClient) { }

  obtenerNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>('noticias.json');
  }
}
