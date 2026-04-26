import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import axios from 'axios'
import './App.css'

// Fix icono leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const API = 'http://localhost:8080'

// Componente para actualizar el mapa
function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, 13)
  }, [center, map])
  return null
}

// Componente de formulario
function FormularioIncidente({ onSubmit, isLoading }) {
  const [form, setForm] = useState({
    ciudad: 'Bucaramanga',
    zona: 'Norte',
    categoria: 'alumbrado',
    descripcion: '',
    latitud: 7.119349,
    longitud: -73.122741,
    prioridad: 'media',
    usuario: '',
  })

  const [errors, setErrors] = useState({})

  const validarFormulario = () => {
    const newErrors = {}
    if (!form.ciudad.trim()) newErrors.ciudad = 'Ciudad requerida'
    if (!form.zona.trim()) newErrors.zona = 'Zona requerida'
    if (!form.descripcion.trim()) newErrors.descripcion = 'Descripción requerida'
    if (!form.usuario.trim()) newErrors.usuario = 'Usuario requerido'
    if (form.descripcion.length < 10) newErrors.descripcion = 'Mínimo 10 caracteres'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const buscarCoordenadas = async (ciudad) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${ciudad},Colombia&format=json&limit=1`,
        { headers: { 'Accept-Language': 'es' } }
      )
      if (res.data.length > 0) {
        const { lat, lon } = res.data[0]
        setForm(prev => ({
          ...prev,
          latitud: parseFloat(lat),
          longitud: parseFloat(lon)
        }))
      }
    } catch (e) {
      console.error('Error buscando coordenadas', e)
    }
  }

  const handleCiudadBlur = () => {
    if (form.ciudad) buscarCoordenadas(form.ciudad)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validarFormulario()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <div className="form-group">
        <label htmlFor="ciudad">Ciudad *</label>
        <input
          id="ciudad"
          type="text"
          name="ciudad"
          placeholder="Ej: Bucaramanga, Medellín..."
          value={form.ciudad}
          onChange={handleChange}
          onBlur={handleCiudadBlur}
          className={errors.ciudad ? 'input-error' : ''}
        />
        {errors.ciudad && <span className="error-text">{errors.ciudad}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="zona">Zona *</label>
        <input
          id="zona"
          type="text"
          name="zona"
          placeholder="Ej: Norte, Centro..."
          value={form.zona}
          onChange={handleChange}
          className={errors.zona ? 'input-error' : ''}
        />
        {errors.zona && <span className="error-text">{errors.zona}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="categoria">Categoría *</label>
        <select
          id="categoria"
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
        >
          <option value="alumbrado">🔦 Alumbrado público</option>
          <option value="vias">🛣️ Daños en vías</option>
          <option value="residuos">♻️ Acumulación de residuos</option>
          <option value="seguridad">🚨 Seguridad</option>
          <option value="infraestructura">🏗️ Infraestructura</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción *</label>
        <textarea
          id="descripcion"
          name="descripcion"
          placeholder="Describe el problema en detalle... (mínimo 10 caracteres)"
          value={form.descripcion}
          onChange={handleChange}
          className={errors.descripcion ? 'input-error' : ''}
        />
        {errors.descripcion && <span className="error-text">{errors.descripcion}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="prioridad">Prioridad *</label>
          <select
            id="prioridad"
            name="prioridad"
            value={form.prioridad}
            onChange={handleChange}
          >
            <option value="alta">🔴 Alta</option>
            <option value="media">🟡 Media</option>
            <option value="baja">🟢 Baja</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="usuario">Tu nombre *</label>
          <input
            id="usuario"
            type="text"
            name="usuario"
            placeholder="Nombre o usuario"
            value={form.usuario}
            onChange={handleChange}
            className={errors.usuario ? 'input-error' : ''}
          />
          {errors.usuario && <span className="error-text">{errors.usuario}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="latitud">Latitud</label>
          <input
            id="latitud"
            type="number"
            name="latitud"
            step="0.000001"
            placeholder="7.119349"
            value={form.latitud}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="longitud">Longitud</label>
          <input
            id="longitud"
            type="number"
            name="longitud"
            step="0.000001"
            placeholder="-73.122741"
            value={form.longitud}
            onChange={handleChange}
          />
        </div>
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? '⏳ Enviando...' : '📤 Reportar Incidente'}
      </button>
    </form>
  )
}

// Componente de lista de incidentes
function ListaIncidentes({ incidentes }) {
  if (incidentes.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No hay incidentes reportados aún</p>
      </div>
    )
  }

  return (
    <div className="incident-list">
      {incidentes.map((inc, i) => (
        <div key={i} className={`incident-item ${inc.prioridad}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <strong>{getCategoryEmoji(inc.categoria)} {inc.categoria}</strong>
            <span className={`badge ${inc.estado}`}>{inc.estado}</span>
          </div>
          <p>{inc.descripcion}</p>
          <small>
            📍 {inc.CiudadZona} • 👤 {inc.usuario} • 🎯 {inc.prioridad.toUpperCase()}
          </small>
        </div>
      ))}
    </div>
  )
}

// Función para obtener emoji por categoría
function getCategoryEmoji(categoria) {
  const emojis = {
    alumbrado: '🔦',
    vias: '🛣️',
    residuos: '♻️',
    seguridad: '🚨',
    infraestructura: '🏗️'
  }
  return emojis[categoria] || '📌'
}

// Componente principal
export default function App() {
  const [incidentes, setIncidentes] = useState([])
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })
  const [mapCenter, setMapCenter] = useState([7.119349, -73.122741])
  const [isLoading, setIsLoading] = useState(false)

  // Cargar incidentes al montar
  useEffect(() => {
    cargarIncidentes()
    obtenerUbicacionActual()
  }, [])

  const obtenerUbicacionActual = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setMapCenter([latitude, longitude])
          mostrarMensaje('📍 Tu ubicación detectada correctamente', 'success', 2000)
        },
        (error) => {
          console.log('Geolocalización no disponible, usando ubicación por defecto')
        }
      )
    }
  }

  const cargarIncidentes = async () => {
    try {
      const res = await axios.get(`${API}/incidents/`)
      setIncidentes(res.data)
    } catch (error) {
      console.error('Error cargando incidentes', error)
      mostrarMensaje('Error al cargar incidentes', 'error')
    }
  }

  const mostrarMensaje = (texto, tipo = 'success', duracion = 3000) => {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), duracion)
  }

  const handleSubmit = async (form) => {
    setIsLoading(true)
    try {
      await axios.post(`${API}/incidents/`, {
        ...form,
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
      })
      mostrarMensaje('✅ Incidente reportado correctamente', 'success')
      await cargarIncidentes()
    } catch (error) {
      console.error('Error reportando incidente', error)
      mostrarMensaje('❌ Error al reportar el incidente', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>🏙️ Urban Incidents</h1>
        <p>Plataforma de monitoreo y reporte de incidentes urbanos</p>
      </header>

      <div className="container">
        <div className="left-section">
          <div className="card">
            <h2>📝 Reportar Incidente</h2>
            {mensaje.texto && (
              <div className={`message ${mensaje.tipo}`}>
                {mensaje.texto}
              </div>
            )}
            <FormularioIncidente onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          <div className="card">
            <h2>📋 Incidentes Reportados ({incidentes.length})</h2>
            <ListaIncidentes incidentes={incidentes} />
          </div>
        </div>

        <div className="right-section">
          <div className="card map-card">
            <h2>🗺️ Mapa</h2>
            <div className="map-container">
              <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <MapUpdater center={mapCenter} />
                {incidentes.map((inc, i) => (
                  inc.latitud && inc.longitud && (
                    <Marker key={i} position={[parseFloat(inc.latitud), parseFloat(inc.longitud)]}>
                      <Popup>
                        <strong>{getCategoryEmoji(inc.categoria)} {inc.categoria}</strong><br />
                        {inc.descripcion}<br />
                        <small>Estado: {inc.estado}</small>
                      </Popup>
                    </Marker>
                  )
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
