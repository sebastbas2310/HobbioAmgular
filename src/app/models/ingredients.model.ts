export interface Ingredient {
  ingredient_id?: string; // UUID opcional, generado automáticamente
    ingredient_name: string, // Nombre del ingrediente
    ingredient_type: string, // Tipo de ingrediente (por ejemplo, vegetal, proteína, etc.)
    ingredient_cant: number // Cantidad del ingrediente (en unidades o peso)
    amountToAdd: number; // Cantidad a añadir (opcional, para la interfaz de usuario)
}