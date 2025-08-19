import { Libro } from "./Libro";
import { Socio } from "./Socio"
import {Autor} from "./Autor"
import {EventoBiblioteca} from "./EventoBiblioteca"

class Biblioteca {
  private inventario: Libro[] = [];
  private socios: Socio[] = [];
  private DURACION = 14;

  // Funciones de libros
  agregarLibro(titulo: string, autor: Autor, isbn: string): Libro {
    const libroCreado = new Libro(titulo, autor, isbn);
    this.inventario.push(libroCreado);
    return libroCreado;
  }

  buscarLibro(isbn: string): Libro | null {
    return this.inventario.find(libro => libro.getIsbn() === isbn) ?? null;
  }

  // Funciones de socios
  registrarSocio(id: number, nombre: string, apellido: string) {
    const socioCreado = new Socio(id, nombre, apellido);
    this.socios.push(socioCreado);
    return socioCreado;
  }

  buscarSocio(id: number): Socio | null {
    return this.socios.find((socio) => socio.id === id) ?? null;
  }

  retirarLibro(socioId: number, libroISBN: string): void {
    if (this.tieneMultaPendiente(socioId)) {
      throw new Error("El socio tiene una multa pendiente y no puede retirar libros.");
    }
    const socio = this.buscarSocio(socioId);
    const libro = this.buscarLibro(libroISBN);

    if (!socio || !libro) {
      throw new Error("Socio o libro no encontrado al retirar el libro.");
    }
    if (!libro.estaDisponible) {
      throw new Error("Libro no esta disponible");
    }
    socio.prestarLibro(libro, this.DURACION);
  }

  recomendarLibros(socio: Socio): Libro[] {
    const historial = socio.getHistorialLectura();
    if (historial.length === 0) {
      return [];
    }
    
    const autoresLeidos = new Set(historial.map(libro => libro.getAutor()));
    const librosLeidosIsbns = new Set(historial.map(libro => libro.getIsbn()));

    const recomendaciones = this.inventario.filter(libro =>
      !librosLeidosIsbns.has(libro.getIsbn()) && autoresLeidos.has(libro.getAutor()));

    return recomendaciones;
  }

  tieneMultaPendiente(socioId: number): boolean {
    const socio = this.buscarSocio(socioId);
    if (!socio) {
      return false;
    }
    return socio.tieneMulta();
  }

  devolverLibro(socioId: number, libroISBN: string, fechaDevolucion?: Date) {
    const socio = this.buscarSocio(socioId);
    const libro = this.buscarLibro(libroISBN);

    if (!socio || !libro) {
      throw new Error("Socio o libro no encontrado al devolver el libro.");
    }

    socio.devolverLibro(libro, fechaDevolucion);

    // El libro ahora está disponible, ya sea para la siguiente reserva o para el inventario general.
    libro.estaDisponible = true;

    // Check reservation queue
    const socioNotificado = libro.verificarDisponibilidadReserva();
    if (socioNotificado) {
      console.log(`Notificación: El libro "${libro.getTitulo()}" está disponible para ${socioNotificado.nombre} ${socioNotificado.apellido}.`);
      this.retirarLibro(socioNotificado.id, libro.getIsbn());
    }
  }

  cancelarReserva(socio: Socio, libro: Libro) {
    if (!libro || !socio) {
      throw new Error("Socio o libro no encontrado al cancelar la reserva.");
    }

    libro.cancelarReserva(socio);
  }

  reservarLibro(socio: Socio, libro: Libro): boolean {
    if (!libro.estaDisponible) {
      libro.agregarReserva(socio);
      return true; // Reservation was made
    } else {
      return false; // No reservation needed
    }
  }

   buscarLibrosPorAutor(autor: Autor): Libro[] {
    return this.inventario.filter(libro => libro.getAutor() === autor);
  }

  notificarSocios(mensaje: string, socios: Socio[]) {
    console.log(`\n--- Notificación de la Biblioteca ---`);
    console.log(`Mensaje: ${mensaje}`);
    socios.forEach(socio => {
        console.log(`Notificación enviada a: ${socio.nombre} ${socio.apellido}`);
    });
    console.log(`------------------------------------`);
  }
}
export const biblioteca = new Biblioteca();
export type { Biblioteca };
