import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Noticia, NoticiasService } from '../../services/noticias.service';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiaCardComponent } from '../noticia-card/noticia-card.component';

/**
 * Componente contenedor: carga el catálogo de noticias (NoticiasService),
 * permite filtrarlas por texto mediante two-way binding ([(ngModel)]) y
 * delega la gestión de favoritos (FavoritosService) a cada tarjeta hija.
 */
@Component({
  selector: 'app-listado-noticias',
  standalone: true,
  imports: [CommonModule, FormsModule, NoticiaCardComponent],
  templateUrl: './listado-noticias.component.html',
  styleUrl: './listado-noticias.component.css'
})
export class ListadoNoticiasComponent implements OnInit {
  noticias: Noticia[] = [];
  textoBusqueda = '';
  soloFavoritas = false;
  cargando = true;

  constructor(
    private readonly noticiasService: NoticiasService,
    private readonly favoritosService: FavoritosService
  ) {}

  ngOnInit(): void {
    this.noticiasService.obtenerNoticias().subscribe({
      next: (noticias) => {
        this.noticias = noticias;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  get noticiasFiltradas(): Noticia[] {
    const texto = this.textoBusqueda.trim().toLowerCase();

    return this.noticias.filter((noticia) => {
      const coincideTexto =
        !texto ||
        noticia.titulo.toLowerCase().includes(texto) ||
        noticia.categoria.toLowerCase().includes(texto);

      const coincideFavorita = !this.soloFavoritas || this.esFavorita(noticia.id);

      return coincideTexto && coincideFavorita;
    });
  }

  esFavorita(id: string): boolean {
    return this.favoritosService.esFavorita(id);
  }

  alternarFavorita(id: string): void {
    this.favoritosService.alternarFavorita(id);
  }
}
