import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Noticia } from '../../services/noticias.service';

/**
 * Componente de presentación: muestra una noticia en formato tarjeta.
 * Recibe los datos por @Input (property binding) y notifica el clic
 * de "favorito" al componente padre mediante @Output (event binding).
 */
@Component({
  selector: 'app-noticia-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './noticia-card.component.html',
  styleUrl: './noticia-card.component.css'
})
export class NoticiaCardComponent {
  @Input({ required: true }) noticia!: Noticia;
  @Input() esFavorita = false;

  @Output() toggleFavorito = new EventEmitter<string>();

  onToggleFavorito(): void {
    this.toggleFavorito.emit(this.noticia.id);
  }
}
