import { Libro } from "./Libro";

const FINE_PER_DAY = 50;
class Socio {
  public readonly id: number;
  public readonly nombre: string;
  public readonly apellido: string;
  private librosPrestados: Libro[] = [];
  private fechaPrestamo: { [key: string]: Date } = {};
  private historialLectura: Libro[] = [];
  private duracionesPrestamo: { [key: string]: number } = {};
  private multaPendiente: number = 0;

  constructor(id: number, nombre: string, apellido: string) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
  }

  getHistorialLectura(): Libro[] {
    return [...this.historialLectura]; // Devolver una copia para proteger el estado interno
  }

  getLibrosPrestados(): Libro[] {
    return [...this.librosPrestados]; // Devolver una copia
  }

  calcularMulta(libro: Libro, fechaDevolucion: Date = new Date()): number {
    const fechaPrestamoLibro = this.fechaPrestamo[libro.getIsbn()];
    const duracionPrestamo = this.duracionesPrestamo[libro.getIsbn()];
    if (!fechaPrestamoLibro || duracionPrestamo === undefined) {
      return 0;
    }
    const diff = fechaDevolucion.getTime() - fechaPrestamoLibro.getTime();
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    if (diffDays > duracionPrestamo) {
      const diasRetraso = diffDays - duracionPrestamo;
      return diasRetraso * FINE_PER_DAY;
    }

    return 0;
  }


  prestarLibro(libro: Libro, duracion: number) {
    this.librosPrestados.push(libro);
    libro.estaDisponible = false;
    this.duracionesPrestamo[libro.getIsbn()] = duracion;
    this.fechaPrestamo[libro.getIsbn()] = new Date();
  }

  devolverLibro(libro: Libro, fechaDevolucion?: Date) {
    const index = this.librosPrestados.indexOf(libro);
    if (index > -1) {
      const multa = this.calcularMulta(libro, fechaDevolucion);
      this.multaPendiente += multa;
      this.librosPrestados.splice(index, 1);
      // La biblioteca se encargará del estado del libro.
      delete this.duracionesPrestamo[libro.getIsbn()];
      delete this.fechaPrestamo[libro.getIsbn()];
      this.historialLectura.push(libro);

    } else {

      throw new Error(
        `El socio ${this.nombre} ${this.apellido} no tiene el libro "${libro.getTitulo()}" prestado.`
      );
    }
  }

  tieneMulta(): boolean {
    return this.multaPendiente > 0;
  }

  pagarMulta() {
    this.multaPendiente = 0;
  }
}

export { Socio };
