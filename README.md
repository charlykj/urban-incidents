# 🏙️ Urban Incidents
> Plataforma de monitoreo y reporte de incidentes urbanos con geolocalización en tiempo real.

![CI](https://github.com/charlykj/urban-incidents/actions/workflows/ci.yml/badge.svg)

---

## 📌 Descripción

**Urban Incidents** permite a ciudadanos reportar problemas urbanos (alumbrado, vías, residuos, seguridad) con ubicación GPS, y visualizarlos en un mapa interactivo en tiempo real. Los datos se almacenan en **Amazon DynamoDB** en la nube.

---

## 🧱 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite + Leaflet.js |
| Backend | FastAPI + Python 3.14 |
| Base de Datos | Amazon DynamoDB (AWS) |
| Despliegue | Docker + docker-compose |
| CI/CD | GitHub Actions |

---

## 🚀 Inicio Rápido

### Opción 1 – Docker (recomendado)

```bash
git clone https://github.com/charlykj/urban-incidents.git
cd urban-incidents
docker-compose up
```

- Frontend: http://localhost:3000
- API: http://localhost:8080
- Docs: http://localhost:8080/docs

### Opción 2 – Manual (desarrollo)

**Terminal 1 – DynamoDB Local:**
```bash
cd dynamodb_local_latest
java "-Djava.library.path=.\DynamoDBLocal_lib" -jar DynamoDBLocal.jar -sharedDb
```

**Terminal 2 – Backend:**
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

**Terminal 3 – Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Accede a: http://localhost:5173

---

## ⚙️ Variables de Entorno

Crea `backend/.env`:

```env
# Desarrollo local (DynamoDB Local)
DYNAMODB_ENDPOINT=http://localhost:8000
AWS_DEFAULT_REGION=us-east-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local

# Producción (AWS real) — eliminar DYNAMODB_ENDPOINT
# AWS_ACCESS_KEY_ID=tu_key
# AWS_SECRET_ACCESS_KEY=tu_secret
```

---

## 🔌 Endpoints de la API

**Base URL:** `http://localhost:8080`  
**Docs interactivas:** http://localhost:8080/docs

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/incidents/` | Crear incidente |
| GET | `/incidents/` | Listar todos |
| GET | `/incidents/{ciudad}/{zona}` | Filtrar por zona |
| GET | `/incidents/categoria/{cat}` | Filtrar por categoría |
| GET | `/incidents/estado/{estado}` | Filtrar por estado |
| PUT | `/incidents/{ciudad_zona}/{fecha_id}` | Actualizar incidente |
| DELETE | `/incidents/{ciudad_zona}/{fecha_id}` | Eliminar incidente |

### Ejemplo de solicitud

```json
POST /incidents/
{
  "ciudad": "Bucaramanga",
  "zona": "Norte",
  "categoria": "alumbrado",
  "descripcion": "Farola sin luz en la carrera 5",
  "latitud": 7.119349,
  "longitud": -73.122741,
  "prioridad": "media",
  "usuario": "Carlos Camargo"
}
```

---

## 💾 Modelo de Datos en DynamoDB

**Tabla:** `Incidentes`

| Campo | Tipo | Rol |
|-------|------|-----|
| `CiudadZona` | String | Partition Key (`Ciudad#Zona`) |
| `FechaID` | String | Sort Key (`Fecha#UUID`) |
| `categoria` | String | GSI-categoria |
| `estado` | String | GSI-estado |
| `descripcion` | String | Atributo |
| `latitud / longitud` | String | Coordenadas GPS |
| `prioridad` | String | alta / media / baja |
| `usuario` | String | Quien reportó |

**Modo:** PAY_PER_REQUEST (escalado automático, sin costo fijo)

---

## 🧪 Tests

```bash
cd backend
pytest tests/ -v
```

**Cobertura:**
- ✅ POST /incidents/
- ✅ GET /incidents/
- ✅ PUT /incidents/
- ✅ DELETE /incidents/
- ✅ GET / (health check)

---

## 🐳 CI/CD con GitHub Actions

Cada push a `main` ejecuta automáticamente:

1. 🧪 Tests con pytest
2. 🐳 Build de imágenes Docker
3. 🔗 Test de integración con DynamoDB Local

---

## 📁 Estructura del Proyecto

```
urban-incidents/
├── .github/workflows/ci.yml    # Pipeline CI/CD
├── backend/
│   ├── main.py                 # App FastAPI
│   ├── db/dynamo.py            # Conexión DynamoDB
│   ├── models/incident.py      # Modelos Pydantic
│   ├── routes/incidents.py     # Endpoints CRUD
│   ├── tests/                  # Pruebas pytest
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/App.jsx             # React + Leaflet
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

---

## 👥 Equipo – Grupo 4

| Integrante | Rol |
|-----------|-----|
| Jhayder Flórez | |
| Carlos Camargo | |
| Camilo Torres | |
| Jhoana Zambrano | |

**Universidad de Pamplona** – Ingeniería de Sistemas 2025-2  
Materia: Bases de Datos II – Prof. Juan Alejandro Carrillo Jaimes
