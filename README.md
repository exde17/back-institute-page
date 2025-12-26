# Instituto Colombia Mía - API Backend

Sistema de gestión académica y de pagos para el Instituto Colombia Mía, desarrollado con NestJS y PostgreSQL.

## 📋 Descripción General

API REST que gestiona el proceso completo de inscripción, matriculación y pagos de estudiantes.

## 🔄 Flujo de Inscripción y Pagos

### 1. **Usuario (User)**
- Registro e información personal del estudiante
- Datos de contacto, acudiente, nivel educativo, etc.

### 2. **Plan de Pago (plan_pago)**
- Define los planes de pago disponibles
- Especifica un **porcentaje de pago inicial** (ej: 30% inicial)
- El saldo restante se distribuye en cuotas posteriores
- Configuración de términos y condiciones de pago
- Ejemplo: "Plan Básico: 30% inicial, 3 cuotas mensuales"

### 3. **Prematrícula (matricula)**
- Es la solicitud inicial de inscripción del estudiante
- El estudiante **selecciona su plan de pago** preferido
- Se suben documentos requeridos:
  - Cédula/Documento de identidad
  - Diploma o certificado de grado 10
  - Documento del acudiente
  - Formulario de matrícula
- Estado: Aspirante → Inscrito → Matriculado
- Archivos guardados en: `/uploads/matriculas/{tipo}/`

### 4. **Matrícula Principal (matricula_main)**
- Es la matrícula oficial y definitiva del estudiante
- Se genera después de la aprobación de la prematrícula
- Registra la información académica final y confirmada

### 5. **Factura (factura)**
- Recoge el **ID de la prematrícula (matricula)**
- Vinculada al **plan de pago** seleccionado
- Genera el documento fiscal del pago
- Referencia para auditoría y control

### 6. **Pago (pago)**
- Registros individuales de cada cuota de pago
- Se generan **automáticamente** cuando el usuario elige un plan
- Cada pago incluye:
  - **Monto de la cuota** (calculado según el plan)
  - **Fecha de vencimiento**
  - **Bandera de pago** (true = pagado, false = pendiente)
  - **Método de pago** (efectivo, transferencia, etc.)
  - **Fecha de pago efectivo** (cuando se pague)
  - **Referencia a la matrícula**

**Ejemplo de generación de pagos:**
- Plan: 30% inicial + 3 cuotas
- Total: $1,000
- Pago 1: $300 (inicial) - Vence: hoy
- Pago 2: $233.33 - Vence: mes 1
- Pago 3: $233.33 - Vence: mes 2
- Pago 4: $233.34 - Vence: mes 3

## 📦 Entidades Principales

| Entidad | Descripción |
|---------|-------------|
| User | Estudiante con información personal y académica |
| Matricula | Prematrícula - solicitud inicial con plan de pago y documentos |
| MatriculaMain | Matrícula oficial y definitiva del estudiante |
| PlanPago | Definición de planes con porcentaje inicial y cuotas |
| Factura | Documento fiscal vinculado a prematrícula |
| Pago | Cuotas de pago individuales con estado de pago |
| TipoDocumento | Tipos de documentos (CC, T.I, etc.) |
| Departamento | Departamentos/regiones |
| Municipio | Municipios dentro de departamentos |

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/exde17/back-institute-page.git
cd back-institute-page

# Instalar dependencias
npm install

# Configurar .env
cp .env.example .env

# Iniciar servidor
npm start
```

## 📝 Endpoints Principales

Ver `postman_collection.json` para la colección completa de endpoints.

### Autenticación
- `POST /api/auth/register` - Registro de nuevo estudiante
- `POST /api/auth/login` - Login
- `GET /api/auth` - Obtener usuario actual

### Prematrícula
- `POST /api/matricula` - Crear prematrícula con documentos
- `GET /api/matricula` - Listar todas las prematrículas
- `GET /api/matricula/:estudianteId` - Obtener prematrícula de estudiante
- `PATCH /api/matricula/:estudianteId` - Actualizar prematrícula
- `DELETE /api/matricula/:estudianteId` - Eliminar prematrícula

### Plan de Pago
- `POST /api/plan-pago` - Crear nuevo plan
- `GET /api/plan-pago` - Listar planes disponibles

### Pagos
- `POST /api/pago` - Registrar cuota de pago
- `GET /api/pago` - Listar todos los pagos
- `GET /api/pago/:id` - Obtener pago específico
- `PATCH /api/pago/:id` - Actualizar estado de pago

### Facturas
- `POST /api/factura` - Crear factura
- `GET /api/factura` - Listar facturas

## 📂 Estructura de Carpetas

```
src/
├── auth/                    # Autenticación y autorización
├── user/                    # Gestión de usuarios/estudiantes
├── matricula/              # Prematrículas y documentos
├── matricula-main/         # Matrículas principales
├── plan-pago/              # Planes de pago
├── pago/                   # Registro de pagos
├── factura/                # Facturas
├── utils/                  # Servicios compartidos
└── main.ts                 # Punto de entrada
```

## 📤 Carga de Archivos

Los documentos de matrícula se guardan en:
```
/uploads/matriculas/
├── documentoEstudiante/
├── diplomaCertificadoGrado10/
├── documentoAcudiente/
└── formularioMatricula/
```

**Límite de tamaño:** 50MB por archivo

**Acceso público (HTTPS):**
```
https://apifcm.bg3sas.com/uploads/matriculas/{tipo}/{archivo}
```

## 🗄️ Base de Datos

- **Motor**: PostgreSQL 12+
- **ORM**: TypeORM
- **IDs**: UUID v4 auto-generados

## 🌍 Deployment

- **URL**: https://apifcm.bg3sas.com
- **Servidor**: Contabo VPS
- **Proxy**: Nginx con SSL (Let's Encrypt)
