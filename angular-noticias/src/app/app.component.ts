import { Component } from '@angular/core';
import { ListadoNoticiasComponent } from './components/listado-noticias/listado-noticias.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ListadoNoticiasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'NovaNews · Versión Angular';
}
