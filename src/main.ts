import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [HttpClientModule, FormsModule, CommonModule],
  template: `
    <div class="container mt-5">
    <h2>Es festivo</h2>
    
    <form (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="year">Año:</label>
        <input type="text" class="form-control" id="year" [(ngModel)]="year" name="year" required pattern="^[0-9]{4}$">
      </div>

      <div class="form-group">
        <label for="month">Mes:</label>
        <input type="text" class="form-control" id="mes" [(ngModel)]="mes" name="mes" required pattern="^(0[1-9]|1[0-2])$">
      </div>

      <div class="form-group">
        <label for="day">Día:</label>
        <input type="text" class="form-control" id="dia" [(ngModel)]="dia" name="dia" required pattern="^(0[1-9]|[12][0-9]|3[01])$">
      </div>

      <button type="submit" class="btn btn-primary mt-3">Enviar</button>
    </form>
  </div>

  <hr/>
  <div class="container mt-5">
      <h2>Festivos por Año</h2>

      <div class="form-group">
        <label for="anio">Año:</label>
        <input
          type="text"
          class="form-control"
          id="year"
          [(ngModel)]="anio"
          name="anio"
          required
          pattern="^[0-9]{4}$"
        />
      </div>
      <button (click)="buscarFestivos()" class="btn btn-primary mt-3">
        Buscar
      </button>

      <!-- Tabla para mostrar los festivos -->
      <table class="table table-striped mt-4">
        <thead>
          <tr>
            <th>Festivo</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let festivo of festivos">
            <td>{{ festivo.festivo }}</td>
            <td>{{ festivo.fecha }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class App {
  year: string = '';
  mes: string = '';
  dia: string = '';
  festivos: { festivo: string; fecha: string }[] = [];
  anio: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.year = currentYear.toString();
    this.buscarFestivos();
  }

  onSubmit() {
    if (this.year && this.dia && this.mes) {
      this.http
        .get(
          'http://localhost:8080/festivos/verificar/' +
            this.year +
            '/' +
            this.mes +
            '/' +
            this.dia
        )
        .subscribe(
          (response) => {
            alert('Respuesta ' + response);
          },
          (error) => {
            alert('Ocurrió un error: ' + error.message);
          }
        );
    } else {
      alert('Por favor, completa todos los campos de la fecha.');
    }
  }

  buscarFestivos() {
    if (this.anio) {
      this.http
        .get<{ festivo: string; fecha: string }[]>(
          `http://localhost:8080/festivos/obtener/${this.anio}`
        )
        .subscribe(
          (response) => {
            this.festivos = response;
            console.log('Festivos recibidos:', this.festivos);
          },
          (error) => {
            console.error('Error al obtener los festivos:', error);
            this.festivos = [
              { festivo: 'Festivo de ejemplo', fecha: `${this.anio}-01-01` },
              {
                festivo: 'Otro festivo de ejemplo',
                fecha: `${this.anio}-12-25`,
              },
            ];
            console.log('Festivos de ejemplo cargados:', this.festivos);
          }
        );
    } else {
      alert('Por favor, ingresa un año válido.');
    }
  }
}

bootstrapApplication(App);
