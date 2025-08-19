import { biblioteca } from "./Biblioteca";
import { Autor } from "./Autor";
import { Libro } from "./Libro";
import { Socio } from "./Socio";
import { EventoBiblioteca } from "./EventoBiblioteca";

/*

Este archivo es un test de integración para la biblioteca.
Realiza pruebas sobre las funcionalidades de la biblioteca, incluyendo:
lo hice para que sea mas sinple corroborar que las funcionalidades de préstamo, devolución, reservas, multas, y recomendaciones funcionan correctamente.
Tuve que modificar un poco el código de las clases para cumplir las tareas y eso tambien me llevo a modificar el archivo tsconfig 

*/

// 1. Setting up instances
const autor1 = new Autor("Gabriel Garcia Marquez", "A great author", 1927);
const autor2 = new Autor("Jane Austen", "English novelist", 1775);

const libro1 = biblioteca.agregarLibro("Cien años de soledad", autor1, "12345");
const libro2 = biblioteca.agregarLibro("Orgullo y prejuicio", autor2, "67890");
const libro3 = biblioteca.agregarLibro("El amor en los tiempos del colera", autor1, "24680");
const libro4 = biblioteca.agregarLibro("Sense and Sensibility", autor2, "54321"); // Libro nuevo para recomendaciones

const socio1 = biblioteca.registrarSocio(1, "John", "Doe");
const socio2 = biblioteca.registrarSocio(2, "Jane", "Smith");

const evento1 = new EventoBiblioteca("Book Club", "Discussing classics", new Date());

// 2. Testing Book Reservations
console.log("\nTesting Book Reservations:");
biblioteca.retirarLibro(socio1.id, libro1.getIsbn()); // libro1 is lent to socio1
console.log(`Libro 1 "${libro1.getTitulo()}" prestado a socio 1 "${socio1.nombre}"`);

try {
  biblioteca.retirarLibro(socio2.id, libro1.getIsbn());
} catch (e: any) {
  console.log(e.message); //
}
if (biblioteca.reservarLibro(socio2, libro1)) {
  console.log(`Socio ${socio2.nombre} ${socio2.apellido} ha reservado el libro "${libro1.getTitulo()}".`);
} else {
  console.log(`El libro "${libro1.getTitulo()}" está disponible, no se necesita reserva.`);
}
biblioteca.devolverLibro(socio1.id, libro1.getIsbn()); // socio1 returns libro1
if (!libro1.estaDisponible && socio2.getLibrosPrestados().includes(libro1)) {
  console.log(`El libro "${libro1.getTitulo()}" fue automáticamente prestado a ${socio2.nombre} desde la reserva.`);
} else {
  console.log(`Error en la lógica de reserva: el libro no fue prestado automáticamente.`);
}

// 3. Testing Fine Calculation
console.log("\nTesting Fine Calculation:");
biblioteca.retirarLibro(socio1.id, libro2.getIsbn());

// Simulate an overdue return by creating a future date
const fechaDevolucionTardia = new Date();
fechaDevolucionTardia.setDate(fechaDevolucionTardia.getDate() + 15); // Advance time by 15 days
biblioteca.devolverLibro(socio1.id, libro2.getIsbn(), fechaDevolucionTardia);

if (biblioteca.tieneMultaPendiente(socio1.id)) {
  console.log(`${socio1.nombre} tiene una multa pendiente.`);
}

try {
  biblioteca.retirarLibro(socio1.id, libro2.getIsbn()); //Try to lend another book
} catch (e: any) {
  console.log(e.message); //
}

// Clear the fine
socio1.pagarMulta();
console.log(`${socio1.nombre} pagó su multa.`);
biblioteca.retirarLibro(socio1.id, libro2.getIsbn()); //Now it should work
console.log(`Libro 2 "${libro2.getTitulo()}" prestado a socio 1 "${socio1.nombre}"`);

// 4. Testing Author Management
console.log("\nTesting Author Management:");
const librosAutor1 = biblioteca.buscarLibrosPorAutor(autor1);
console.log(`Libros de ${autor1.nombre}:`, librosAutor1.map(libro => libro.getTitulo())); // Ahora debería mostrar 2 libros

// 5. Testing Event Notifications
console.log("\nTesting Event Notifications:");
evento1.inscribirSocio(socio1);
evento1.inscribirSocio(socio2);
biblioteca.notificarSocios("¡No te pierdas nuestro club de lectura!", evento1.sociosInscritos);

// 6. Testing Reading History and Recommendations
console.log("\nTesting Reading History and Recommendations:");
biblioteca.retirarLibro(socio1.id, libro3.getIsbn());
biblioteca.devolverLibro(socio1.id, libro3.getIsbn());

const recommendations = biblioteca.recomendarLibros(socio1);
console.log(`Libros recomendados para ${socio1.nombre}:`, recommendations.map(libro => libro.getTitulo())); // Ahora debería recomendar "Sense and Sensibility"