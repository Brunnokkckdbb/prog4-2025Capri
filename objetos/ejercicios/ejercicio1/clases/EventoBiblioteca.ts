import { Socio } from "./Socio";

class EventoBiblioteca {
  public titulo: string;
  public descripcion: string;
  public fecha: Date;
  public sociosInscritos: Socio[] = [];

  constructor(titulo: string, descripcion: string, fecha: Date) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fecha = fecha;
  }

  inscribirSocio(socio: Socio) {
    this.sociosInscritos.push(socio);
  }
}

export { EventoBiblioteca };