import { Socio } from "./Socio";
import { Autor } from "./Autor";

export class Libro {
  private titulo: string;
  private autor: Autor;
  private isbn: string;
  public estaDisponible: boolean = true;
  private reservas: Socio[] = [];

  constructor(titulo: string, autor: Autor, isbn: string) {
    this.titulo = titulo;
    this.autor = autor;
    this.isbn = isbn;
  }

  agregarReserva(socio: Socio) {
    this.reservas.push(socio);
  }

  cancelarReserva(socio: Socio) {
    const index = this.reservas.findIndex(s => s.id === socio.id);
    if (index > -1) {
      this.reservas.splice(index, 1);
    }
  }

  verificarDisponibilidadReserva(): Socio | undefined {
    return this.reservas.shift(); // Devuelve y remueve el primer socio en la cola de reserva
  }

  getAutor(): Autor {
    return this.autor;
  }

  getIsbn(): string {
    return this.isbn;
  }

  getTitulo(): string {
    return this.titulo;
  }
}
