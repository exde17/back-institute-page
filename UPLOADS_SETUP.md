# 📋 Guía de Configuración de Uploads en Contabo

## Estructura de Carpetas

Los archivos se guardarán en la siguiente estructura:

```
proyecto/
└── uploads/
    └── matriculas/
        ├── documentos-estudiantes/
        ├── diplomas-certificados/
        ├── documentos-acudientes/
        └── formularios/
```

## En tu VPS Contabo

### 1. Conectarse al servidor
```bash
ssh usuario@tu-ip-contabo
```

### 2. Crear la estructura de carpetas
```bash
cd /ruta/a/tu/proyecto
mkdir -p uploads/matriculas/{documentos-estudiantes,diplomas-certificados,documentos-acudientes,formularios}
```

### 3. Dar permisos apropiados
```bash
# Permitir que el usuario de Node.js escriba en las carpetas
chmod -R 755 uploads
chmod -R 775 uploads/matriculas

# Si usas un usuario específico para Node.js
chown -R node:node uploads
```

### 4. Configurar en Nginx (si usas Nginx)

Agregar esta sección al archivo de configuración de Nginx para servir los archivos estáticos:

```nginx
location /uploads/ {
    alias /ruta/a/tu/proyecto/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

Luego recargar Nginx:
```bash
sudo systemctl reload nginx
```

### 5. Configurar en el .env de tu aplicación

Tu `.env` ya tiene la configuración correcta. Los uploads se guardarán automáticamente en la carpeta `uploads/matriculas/`.

## Rutas de Archivos en la BD

Los archivos se guardan con rutas como:
- `uploads/matriculas/documentos-estudiantes/archivo-1234567-abc123.pdf`
- `uploads/matriculas/diplomas-certificados/diploma-1234567-abc123.jpg`
- `uploads/matriculas/documentos-acudientes/documento-1234567-abc123.pdf`
- `uploads/matriculas/formularios/formulario-1234567-abc123.pdf`

## API Endpoints

### Subir una matrícula con archivos
```
POST /matricula
Content-Type: multipart/form-data

Fields:
- estudianteId: "uuid-del-estudiante"
- documentoEstudiante: archivo.pdf
- diplomaCertificadoGrado10: diploma.jpg
- documentoAcudiente: acudiente.pdf (opcional)
- formularioMatricula: formulario.pdf
```

### Descargar un archivo
```
GET /matricula/archivo/uploads/matriculas/documentos-estudiantes/archivo-1234567-abc123.pdf
```

### Obtener todas las matrículas
```
GET /matricula
```

### Obtener una matrícula específica
```
GET /matricula/uuid-matricula
```

### Actualizar una matrícula
```
PATCH /matricula/uuid-matricula
Content-Type: multipart/form-data

(Puedes actualizar solo los archivos que cambien)
```

### Eliminar una matrícula (también elimina archivos)
```
DELETE /matricula/uuid-matricula
```

## Monitoreo de Espacio en Disco

Para verificar cuánto espacio ocupan los uploads:

```bash
du -sh uploads/
```

Para ver el espacio disponible en el servidor:
```bash
df -h
```

## Backup de Archivos

Importante: realiza backups periódicos de la carpeta `uploads/`:

```bash
tar -czf backup-uploads-$(date +%Y%m%d).tar.gz uploads/
```

## Seguridad

1. Los archivos solo aceptan: **PDF, JPG, PNG, GIF, WEBP**
2. Tamaño máximo por archivo: **10MB**
3. Los nombres de archivo se generan aleatoriamente para evitar sobrescrituras
4. Los archivos se organizan por tipo para mejor mantenimiento

## Solución de Problemas

### "Permiso denegado al escribir archivos"
```bash
chmod -R 775 uploads/matriculas
```

### "Carpeta no existe"
```bash
mkdir -p uploads/matriculas/{documentos-estudiantes,diplomas-certificados,documentos-acudientes,formularios}
```

### "No puedo descargar los archivos"
- Verifica que Nginx/Apache tenga permiso de lectura en los archivos
- Verifica que la ruta en la BD sea correcta
- Usa: `GET /matricula/archivo/{ruta-completa-guardada}`
