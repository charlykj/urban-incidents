# 🏙️ Urban Incidents - Plataforma de Monitoreo y Reporte de Incidentes Urbanos

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Características Principales](#características-principales)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Requisitos Previos](#requisitos-previos)
5. [Instalación](#instalación)
6. [Configuración](#configuración)
7. [Uso](#uso)
8. [Estructura del Proyecto](#estructura-del-proyecto)
9. [API Documentation](#api-documentation)
10. [Base de Datos](#base-de-datos)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)
13. [Contribuciones](#contribuciones)

---

## Descripción General

**Urban Incidents** es una plataforma web moderna diseñada para facilitar el monitoreo, reporte y gestión de incidentes urbanos en ciudades colombianas. Permite a los ciudadanos reportar problemas infraestructurales como daños en vías, problemas de alumbrado, acumulación de residuos, entre otros, con geolocalización en tiempo real.

### Propósito del Proyecto

Este proyecto surge como respuesta a la necesidad de las administraciones municipales de tener un sistema centralizado y accesible para:
- **Reportar incidentes** de manera rápida y sencilla
- **Geolocalizar problemas** usando coordenadas GPS
- **Clasificar incidentes** por categoría y prioridad
- **Monitorear el estado** de resolución de reportes
- **Asignar responsabilidades** a entidades correspondientes

---

## Características Principales

### ✨ Frontend (React + Vite)

- **Interfaz Responsiva**: Diseño adaptable a dispositivos móviles y de escritorio
- **Mapa Interactivo**: Integración con Leaflet para visualizar incidentes geográficamente
- **Formulario Dinámico**: Captura de datos detallados del incidente
- **Visualización de Listado**: Tabla con todos los incidentes reportados
- **Estados y Prioridades**: Código de colores para identificar urgencias
- **Notificaciones**: Mensajes de confirmación y error en tiempo real

### 🔧 Backend (FastAPI + Python)

- **API RESTful**: Endpoints bien documentados y escalables
- **Validación de Datos**: Modelos Pydantic para garantizar integridad
- **CORS Habilitado**: Permite comunicación desde cualquier dominio
- **Documentación Automática**: Swagger UI para explorar endpoints
- **Manejo de Errores**: Respuestas HTTP estructuradas

### 💾 Base de Datos (AWS DynamoDB)

- **NoSQL Escalable**: Base de datos serverless con capacidad auto-escalable
- **Índices Secundarios Globales**: Búsquedas rápidas por categoría y estado
- **Modelo de Datos Flexible**: Adaptable a futuras necesidades

---

## Arquitectura del Proyecto

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────┐
│                   NAVEGADOR WEB                      │
│  (React + Vite Frontend - http://localhost:5173)    │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │         COMPONENTES REACT                    │   │
│  │  • App.jsx (Principal)                       │   │
│  │  • Formulario de Reporte                     │   │
│  │  • Mapa Interactivo (Leaflet)               │   │
│  │  • Lista de Incidentes                       │   │
│  └─────────────────────────────────────────────┘   │
│                        ↓ (Axios HTTP)               │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              FASTAPI BACKEND                         │
│  (http://localhost:8080)                            │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │         RUTAS Y CONTROLADORES               │   │
│  │  • POST /incidents/          (Crear)       │   │
│  │  • GET /incidents/           (Listar)      │   │
│  │  • GET /incidents/{id}       (Obtener)     │   │
│  │  • PUT /incidents/{id}       (Actualizar)  │   │
│  │  • DELETE /incidents/{id}    (Eliminar)    │   │
│  │  • GET /incidents/categoria/ (Filtrar)     │   │
│  │  • GET /incidents/estado/    (Filtrar)     │   │
│  └─────────────────────────────────────────────┘   │
│                        ↓                             │
│  ┌─────────────────────────────────────────────┐   │
│  │    MODELOS DE DATOS (Pydantic)              │   │
│  │  • IncidenteCreate                          │   │
│  │  • IncidenteUpdate                          │   │
│  │  • IncidenteResponse                        │   │
│  └─────────────────────────────────────────────┘   │
│                        ↓                             │
│  ┌─────────────────────────────────────────────┐   │
│  │    CAPA DE DATOS (DynamoDB)                 │   │
│  │  • get_table()                              │   │
│  │  • get_dynamodb()                           │   │
│  │  • create_table_if_not_exists()            │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              AWS DYNAMODB (Local/Cloud)              │
│  • Tabla: "Incidentes"                              │
│  • GSI: categoria, estado                           │
│  • Modo: PAY_PER_REQUEST (Sin provisión)           │
└─────────────────────────────────────────────────────┘
```

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### Software Requerido

- **Python 3.10+**: Lenguaje para el backend
  - Descarga desde: https://www.python.org/downloads/
  - Verifica: `python --version`

- **Node.js 18+**: Runtime para JavaScript y npm
  - Descarga desde: https://nodejs.org/
  - Verifica: `node --version` y `npm --version`

- **Git**: Control de versiones
  - Descarga desde: https://git-scm.com/
  - Verifica: `git --version`

### Servicios Externos

- **AWS DynamoDB Local** (Opcional, para desarrollo local)
  - Descarga desde: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html
  - O configura credenciales AWS para usar DynamoDB en la nube

### Cuenta AWS (Opcional pero Recomendado)

Para usar DynamoDB en producción:
1. Crea una cuenta en https://aws.amazon.com/
2. Genera credenciales de acceso (Access Key ID y Secret Access Key)
3. Configura variables de entorno con tus credenciales

---

## Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/urban-incidents.git
cd urban-incidents
```

### 2. Configurar Backend

#### 2.1 Crear Entorno Virtual

```bash
# En Windows (PowerShell)
python -m venv venv
venv\Scripts\Activate

# En macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 2.2 Instalar Dependencias Python

```bash
cd backend
pip install -r requirements.txt
```

**Dependencias principales:**

| Paquete | Versión | Propósito |
|---------|---------|----------|
| fastapi | 0.111.0 | Framework web asincrónico |
| uvicorn | 0.29.0 | Servidor ASGI |
| boto3 | 1.34.84 | Cliente AWS SDK |
| pydantic | 2.7.1 | Validación de datos |
| httpx | 0.27.0 | Cliente HTTP asincrónico |
| pytest | 8.2.0 | Framework de pruebas |

#### 2.3 Crear Archivo .env

En la carpeta `backend/`, crea un archivo `.env`:

```env
# DynamoDB Configuration
DYNAMODB_ENDPOINT=http://localhost:8000
AWS_DEFAULT_REGION=us-east-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local

# FastAPI Configuration
DEBUG=True
```

**Notas sobre variables:**
- `DYNAMODB_ENDPOINT`: Local para desarrollo, omitir para AWS Cloud
- `AWS_ACCESS_KEY_ID/SECRET`: Solo necesarios para AWS Cloud
- Valores "local" son válidos solo para DynamoDB Local

### 3. Configurar Frontend

#### 3.1 Instalar Dependencias Node.js

```bash
cd frontend
npm install
```

**Dependencias principales:**

| Paquete | Versión | Propósito |
|---------|---------|----------|
| react | 19.2.5 | Librería UI |
| vite | 8.0.10 | Build tool |
| axios | 1.15.2 | Cliente HTTP |
| leaflet | 1.9.4 | Librería de mapas |
| react-leaflet | 5.0.0 | Componente React para mapas |

#### 3.2 Crear Archivo de Configuración

El archivo `vite.config.js` ya está configurado. Verifica que el servidor de desarrollo esté correcto.

---

## Configuración

### Backend - Variables de Entorno

#### Desarrollo Local (DynamoDB Local)

```env
DYNAMODB_ENDPOINT=http://localhost:8000
AWS_DEFAULT_REGION=us-east-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
DEBUG=True
```

#### Producción (AWS Cloud)

```env
# No incluir DYNAMODB_ENDPOINT
AWS_DEFAULT_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key_id
AWS_SECRET_ACCESS_KEY=tu_secret_access_key
DEBUG=False
```

### Frontend - Configuración de API

En `frontend/src/App.jsx`, la URL de la API está configurada como:

```javascript
const API = 'http://localhost:8080'
```

**Para producción**, cambiar a tu dominio:

```javascript
const API = 'https://api.urban-incidents.com'
```

### Docker Compose (Opcional)

El proyecto incluye `docker-compose.yml` para orquestar contenedores:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - DYNAMODB_ENDPOINT=dynamodb:8000
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
```

---

## Uso

### Inicio Rápido

#### Terminal 1: Inicia DynamoDB Local (Opcional pero Recomendado)

```bash
cd Downloads/dynamodb_local_latest
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

**Verificación**: http://localhost:8000/

#### Terminal 2: Inicia Backend FastAPI

```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

**Esperado:**
```
INFO:     Will watch for changes in these directories: [...]
INFO:     Uvicorn running on http://0.0.0.0:8080
INFO:     Application startup complete.
```

**Accede a:**
- API Docs: http://localhost:8080/docs
- API Root: http://localhost:8080/

#### Terminal 3: Inicia Frontend React

```bash
cd frontend
npm run dev
```

**Esperado:**
```
  VITE v8.0.10  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Accede a:** http://localhost:5173/

---

## Estructura del Proyecto

### Árbol de Directorios

```
urban-incidents/
├── README.md                          # Este archivo
├── docker-compose.yml                 # Orquestación de contenedores
│
├── backend/                           # API FastAPI
│   ├── main.py                        # Punto de entrada
│   ├── requirements.txt                # Dependencias Python
│   ├── .env.example                   # Plantilla de variables
│   │
│   ├── db/
│   │   ├── __init__.py
│   │   └── dynamo.py                  # Conexión y operaciones DynamoDB
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   └── incident.py                # Modelos Pydantic
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   └── incidents.py               # Endpoints de incidentes
│   │
│   ├── tests/
│   │   └── test_incidents.py          # Tests unitarios
│   │
│   └── Dockerfile                     # Imagen Docker
│
├── frontend/                          # React + Vite
│   ├── package.json                   # Dependencias Node.js
│   ├── vite.config.js                 # Configuración de Vite
│   ├── eslint.config.js               # Configuración de ESLint
│   ├── index.html                     # HTML principal
│   ├── nginx.conf                     # Configuración Nginx (producción)
│   │
│   ├── src/
│   │   ├── main.jsx                   # Punto de entrada React
│   │   ├── App.jsx                    # Componente principal
│   │   ├── App.css                    # Estilos de App
│   │   ├── index.css                  # Estilos globales
│   │   │
│   │   └── assets/                    # Imágenes y recursos
│   │
│   ├── public/                        # Archivos estáticos
│   ├── Dockerfile                     # Imagen Docker
│   └── README.md                      # Documentación frontend
│
└── .github/
    └── workflows/                     # CI/CD (opcional)
```

### Descripción de Archivos Clave

#### Backend

| Archivo | Descripción |
|---------|------------|
| `main.py` | Instancia de FastAPI, rutas globales, configuración de CORS |
| `db/dynamo.py` | Conexión a DynamoDB, operaciones CRUD |
| `models/incident.py` | Esquemas Pydantic para validación |
| `routes/incidents.py` | Endpoints: GET, POST, PUT, DELETE |
| `tests/test_incidents.py` | Tests de integración y unitarios |

#### Frontend

| Archivo | Descripción |
|---------|------------|
| `src/App.jsx` | Componente raíz con lógica y estado |
| `src/App.css` | Estilos del formulario y lista |
| `src/index.css` | Estilos globales |
| `vite.config.js` | Configuración del servidor de desarrollo |

---

## API Documentation

### Base URL

```
http://localhost:8080/api
```

### Autenticación

Actualmente, **no se requiere autenticación**. Para producción, implementar JWT.

### Endpoints

#### 1. Crear Incidente

```http
POST /incidents/
Content-Type: application/json

{
  "ciudad": "Bucaramanga",
  "zona": "Norte",
  "categoria": "alumbrado",
  "descripcion": "Farola sin luz en la esquina de la carrera 5",
  "latitud": 7.119349,
  "longitud": -73.122741,
  "prioridad": "media",
  "usuario": "Juan Pérez",
  "url_evidencia": "https://example.com/foto.jpg",
  "entidad_asignada": "EMAB"
}
```

**Respuesta (201 Created):**
```json
{
  "mensaje": "Incidente creado",
  "id": "c1234567-89ab-cdef-0123-456789abcdef",
  "CiudadZona": "Bucaramanga#Norte",
  "FechaID": "2024-04-25#123456789"
}
```

#### 2. Listar Todos los Incidentes

```http
GET /incidents/
```

**Respuesta (200 OK):**
```json
[
  {
    "CiudadZona": "Bucaramanga#Norte",
    "FechaID": "2024-04-25#123456789",
    "incidente_id": "c1234567-89ab-cdef-0123-456789abcdef",
    "categoria": "alumbrado",
    "descripcion": "Farola sin luz...",
    "latitud": "7.119349",
    "longitud": "-73.122741",
    "prioridad": "media",
    "estado": "pendiente",
    "fecha_creacion": "2024-04-25T14:30:00.000000",
    "usuario": "Juan Pérez",
    "url_evidencia": "https://example.com/foto.jpg",
    "entidad_asignada": "EMAB"
  }
]
```

#### 3. Filtrar por Categoría

```http
GET /incidents/categoria/alumbrado
```

**Categorías válidas:**
- `alumbrado` - Problemas de alumbrado público
- `vias` - Daños en vías
- `residuos` - Acumulación de residuos
- `seguridad` - Incidentes de seguridad
- `infraestructura` - Problemas de infraestructura

#### 4. Filtrar por Estado

```http
GET /incidents/estado/pendiente
```

**Estados válidos:**
- `pendiente` - Reportado, sin asignar
- `asignado` - Asignado a entidad
- `en_proceso` - En resolución
- `resuelto` - Completado

#### 5. Obtener Incidente por ID

```http
GET /incidents/{incidente_id}
```

#### 6. Actualizar Incidente

```http
PUT /incidents/{incidente_id}
Content-Type: application/json

{
  "estado": "en_proceso",
  "prioridad": "alta",
  "entidad_asignada": "Secretaría de Infraestructura"
}
```

#### 7. Eliminar Incidente

```http
DELETE /incidents/{incidente_id}
```

### Códigos de Respuesta

| Código | Significado |
|--------|-----------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

### Documentación Interactiva

Accede a la documentación automática en **Swagger UI**:

```
http://localhost:8080/docs
```

También disponible en **ReDoc**:

```
http://localhost:8080/redoc
```

---

## Base de Datos

### Modelo de Datos DynamoDB

#### Tabla: "Incidentes"

| Atributo | Tipo | Clave | Descripción |
|----------|------|-------|------------|
| `CiudadZona` | String | HASH | Identificador compuesto: `Ciudad#Zona` |
| `FechaID` | String | RANGE | Composición: `Fecha#Timestamp` |
| `incidente_id` | String | - | UUID único del incidente |
| `categoria` | String | GSI | Tipo de incidente |
| `estado` | String | GSI | Estado actual |
| `descripcion` | String | - | Detalles del incidente |
| `latitud` | String | - | Coordenada GPS |
| `longitud` | String | - | Coordenada GPS |
| `prioridad` | String | - | Nivel de urgencia |
| `usuario` | String | - | Quien reportó |
| `fecha_creacion` | String | - | Timestamp ISO |
| `url_evidencia` | String | - | Enlace a foto/evidencia |
| `entidad_asignada` | String | - | Responsable de resolver |

### Índices Secundarios Globales (GSI)

#### GSI-categoria
- **Clave de Partición**: `categoria`
- **Uso**: Búsquedas rápidas por tipo de incidente
- **Ejemplo**: Obtener todos los incidentes de alumbrado

#### GSI-estado
- **Clave de Partición**: `estado`
- **Uso**: Filtrar incidentes por etapa de resolución
- **Ejemplo**: Ver incidentes pendientes

### Modo de Facturación

```
Modo: PAY_PER_REQUEST
```

**Ventajas:**
- Sin costo por capacidad provisionada
- Escalado automático
- Ideal para cargas impredecibles

**Desventajas:**
- Costo por solicitud es más alto
- Para alto volumen, considerar capacidad provisionada

### Estrategia de Particionamiento

La clave de partición `CiudadZona` distribuye datos geográficamente:

```
Bucaramanga#Norte
Bucaramanga#Sur
Medellín#Centro
Cali#Este
...
```

Esto permite:
1. Consultas geográficas eficientes
2. Distribución equitativa de carga
3. Escalado automático por región

---

## Deployment

### Opción 1: Deployment Local (Desarrollo)

**Ya configurado en las instrucciones de Uso.**

### Opción 2: Deployment con Docker

#### Requisito: Docker Desktop

Instala desde: https://www.docker.com/products/docker-desktop

#### Construcción y Ejecución

```bash
# Construir imágenes
docker build -t urban-incidents-backend ./backend
docker build -t urban-incidents-frontend ./frontend

# Ejecutar con Docker Compose
docker-compose up --build

# Accede a:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8080
```

### Opción 3: Deployment en AWS (Producción)

#### Arquitectura Recomendada

```
CloudFront (CDN)
    ↓
S3 + Route53 (Frontend estático)
    ↓
Application Load Balancer (ALB)
    ↓
ECS Fargate (Backend containerizado)
    ↓
DynamoDB (Base de datos serverless)
```

#### Pasos Generales

1. **Frontend:**
   - Build: `npm run build`
   - Upload a S3: `aws s3 sync dist/ s3://tu-bucket/`
   - CDN: CloudFront

2. **Backend:**
   - Push a ECR: `aws ecr push-image ...`
   - Deploy a ECS Fargate
   - Configurar variables de entorno con credenciales AWS

3. **Base de Datos:**
   - Tabla DynamoDB en AWS
   - IAM roles y políticas

#### Ejemplo de Configuración ECS

```json
{
  "containerDefinitions": [
    {
      "name": "urban-incidents-backend",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/urban-incidents:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "hostPort": 8080
        }
      ],
      "environment": [
        {
          "name": "AWS_DEFAULT_REGION",
          "value": "us-east-1"
        }
      ]
    }
  ]
}
```

---

## Troubleshooting

### Problemas Comunes

#### 1. Backend no inicia - Error de DynamoDB

**Error:**
```
botocore.exceptions.ParamValidationError: Parameter validation failed
```

**Solución:**
1. Verifica que DynamoDB Local esté corriendo
2. Revisa las variables de entorno en `.env`
3. Asegúrate de que el `DYNAMODB_ENDPOINT` es correcto

```bash
# Verificar DynamoDB Local
curl http://localhost:8000/

# Debería responder con metadatos
```

#### 2. Frontend no conecta con Backend - CORS Error

**Error:**
```
Access to XMLHttpRequest at 'http://localhost:8080/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solución:**
1. Backend tiene CORS habilitado en `main.py`:
   ```python
   CORSMiddleware permite todos los orígenes
   ```
2. Verifica URL en `App.jsx`:
   ```javascript
   const API = 'http://localhost:8080'
   ```

#### 3. Puerto 8080 ya está en uso

**Error:**
```
Address already in use
```

**Solución:**
```bash
# Encontrar proceso usando puerto 8080
netstat -ano | findstr :8080

# Matar proceso (Windows)
taskkill /PID <PID> /F

# O cambiar puerto en uvicorn
uvicorn main:app --port 8081
```

#### 4. Modelos Pydantic - Errores de Validación

**Error:**
```
validation error for IncidenteCreate
```

**Solución:**
1. Verifica tipos de datos en la solicitud
2. `latitud` y `longitud` deben ser `float`, no string
3. Todos los campos obligatorios deben estar presentes

**Ejemplo correcto:**
```json
{
  "ciudad": "Bucaramanga",
  "zona": "Norte",
  "categoria": "alumbrado",
  "descripcion": "Descripción",
  "latitud": 7.119349,
  "longitud": -73.122741,
  "prioridad": "media",
  "usuario": "Nombre"
}
```

#### 5. Tabla DynamoDB no se crea

**Diagnóstico:**
```bash
# Verificar conexión a DynamoDB
python -c "from db.dynamo import get_dynamodb; print(get_dynamodb().tables.all())"
```

**Solución:**
1. Reinicia DynamoDB Local
2. Verifica credenciales de AWS
3. Revisa permisos IAM (si usas AWS)

---

## Testing

### Ejecutar Tests

```bash
cd backend
pytest tests/ -v

# Con cobertura
pytest tests/ --cov=. -v
```

### Tests Disponibles

```
tests/test_incidents.py
├── test_crear_incidente()         # POST /incidents/
├── test_listar_incidentes()       # GET /incidents/
├── test_listar_por_categoria()    # GET /incidents/categoria/
├── test_listar_por_estado()       # GET /incidents/estado/
├── test_actualizar_incidente()    # PUT /incidents/{id}
└── test_eliminar_incidente()      # DELETE /incidents/{id}
```

### Herramientas de Testing

- **pytest**: Framework principal
- **pytest-asyncio**: Para funciones async
- **httpx**: Cliente HTTP para tests

---

## Contribuciones

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crea rama** para tu feature:
   ```bash
   git checkout -b feature/nueva-caracteristica
   ```
3. **Commit** tus cambios:
   ```bash
   git commit -m "Add: descripción clara de cambios"
   ```
4. **Push** a la rama:
   ```bash
   git push origin feature/nueva-caracteristica
   ```
5. **Pull Request** con descripción detallada

### Estándares de Código

#### Python (Backend)
- Seguir PEP 8
- Type hints en funciones
- Docstrings en todas las funciones
- Test coverage > 80%

```python
def crear_incidente(data: IncidenteCreate) -> dict:
    """
    Crea un nuevo incidente en la base de datos.
    
    Args:
        data: Modelo Pydantic con datos del incidente
    
    Returns:
        dict: Mensaje de confirmación y ID del incidente
    """
    ...
```

#### JavaScript (Frontend)
- Usar ESLint (ya configurado)
- Componentes funcionales con hooks
- Props bien documentados

```javascript
/**
 * Componente para mostrar lista de incidentes
 * @param {Array} incidentes - Lista de incidentes a mostrar
 * @param {Function} onDelete - Callback para eliminar
 */
export default function IncidenteList({ incidentes, onDelete }) {
  ...
}
```

---

## Roadmap Futuro

### v1.1 (Próximas Mejoras)

- [ ] Autenticación con OAuth2 / JWT
- [ ] Notifications en tiempo real (WebSockets)
- [ ] Exportar reportes a PDF
- [ ] Integración con Google Maps
- [ ] Dashboard de estadísticas

### v2.0 (Largo Plazo)

- [ ] App mobile (React Native)
- [ ] Machine Learning para predicción
- [ ] Sistema de notificaciones push
- [ ] Integración con redes sociales
- [ ] Gamificación (puntos, badges)

---

## Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Ver archivo `LICENSE` para más detalles.

---

## Contacto y Soporte

### Información de Contacto

- **Email**: soporte@urban-incidents.com
- **Issues**: GitHub Issues
- **Documentación**: Este README

### Preguntas Frecuentes (FAQ)

**¿Qué ciudades están soportadas?**
- Cualquier ciudad. El sistema permite ingresar cualquier valor en el campo "ciudad".

**¿Hay límite de incidentes?**
- No. DynamoDB escala automáticamente.

**¿Puedo usar mi propia base de datos?**
- Sí. Modifica `db/dynamo.py` para conectar a tu propia base de datos.

**¿Es código de producción?**
- Este es un proyecto universitario demostrative. Para producción:
  - Agregar autenticación
  - Validaciones adicionales
  - Rate limiting
  - Logging más detallado
  - Tests más exhaustivos

---

## Cambios Recientes

### v1.0.0 (2024-04-25)

✅ Inicialización del proyecto
✅ Backend con FastAPI
✅ Frontend con React + Leaflet
✅ Integración con DynamoDB
✅ Documentación completa
✅ Tests básicos

---

## Agradecimientos

- **FastAPI**: Por excelente documentación y performance
- **React**: Por componentes reutilizables
- **DynamoDB**: Por escalabilidad sin servidor
- **Leaflet**: Por mapas interactivos gratuitos
- **OpenStreetMap**: Por datos cartográficos

---

**Última actualización**: Abril 25, 2024
**Versión**: 1.0.0
**Autor**: Equipo Urban Incidents

