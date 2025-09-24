export interface Table {
  table_id?: string; // UUID opcional, generado automáticamente
  table_size: number; // Tamaño de la mesa (número de asientos)
  table_disp: boolean; // Disponibilidad de la mesa (true = disponible, false = ocupada)
}