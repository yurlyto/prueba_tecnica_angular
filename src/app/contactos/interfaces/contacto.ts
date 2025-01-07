export interface Contacto {
    id:         number;
    nombre:     string;
    email:      string;
    telefono:   string;
    direccion:  string;
    notas:      string;
    entidad_id: number;
    fecha_nacimiento: Date;
    updated_at?: Date;
    created_at?: Date;
}
