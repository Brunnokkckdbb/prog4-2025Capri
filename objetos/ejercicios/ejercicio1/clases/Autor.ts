class Autor {
  public nombre: string;
  public biografia: string;
  public anoNacimiento: number;

  constructor(nombre: string, biografia: string, anoNacimiento: number) {
    this.nombre = nombre;
    this.biografia = biografia;
    this.anoNacimiento = anoNacimiento;
  }
}

export { Autor };