import { Injectable } from '@angular/core';

const CLAVE_STORAGE = 'novanews_favoritos';

/**
 * Guarda y consulta los IDs de noticias favoritas en localStorage,
 * igual que la versión HTML/CSS/JS de NovaNews, para que el
 * comportamiento sea equivalente entre ambas versiones.
 */
@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  private readonly favoritos: Set<string>;

  constructor() {
    this.favoritos = new Set(this.leerDeStorage());
  }

  private leerDeStorage(): string[] {
    try {
      const data = localStorage.getItem(CLAVE_STORAGE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private guardarEnStorage(): void {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify([...this.favoritos]));
  }

  esFavorita(id: string): boolean {
    return this.favoritos.has(id);
  }

  alternarFavorita(id: string): void {
    if (this.favoritos.has(id)) {
      this.favoritos.delete(id);
    } else {
      this.favoritos.add(id);
    }
    this.guardarEnStorage();
  }

  obtenerFavoritas(): string[] {
    return [...this.favoritos];
  }
}
