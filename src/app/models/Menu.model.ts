export interface Menu {
  plate_id?: string; // UUID opcional, generado automáticamente
  plate_name: string; // Nombre del plato
  plate_desc: string; // Descripción del plato
  price: number; // Precio del plato
  plate_img: string; // URL de la imagen del plato
  plate_cat: string; // Categoría del plato (entradas, sopas, etc.)
  ingredients: string; // Ingredientes del plato
  is_stock?: boolean; // Indica si el plato está en stock (opcional)
}