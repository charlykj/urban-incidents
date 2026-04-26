import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import axios from 'axios'
import './index.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const API = 'http://localhost:8080'

function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, 13)
  }, [center])
  return null
}

export default function App() {
  const [incidentes, setIncidentes] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [mapCenter, setMapCenter] = useState([7.119349, -73.122741])
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

  useEffect(() => {
    cargarIncidentes()
  }, [])

  const cargarIncidentes = async () => {
    try {
      const res = await axios.get(`${API}/incidents/`)
      setIncidentes(res.data)
    } catch (e) {
      console.error('Error cargando incidentes', e)
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
        setMapCenter([parseFloat(lat), parseFloat(lon)])
        setForm(prev => ({ ...prev, latitud: parseFloat(lat), longitud: parseFloat(lon) }))
      }
    } catch (e) {
      console.error('Error buscando coordenadas', e)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCiudadBlur = () => {
    if (form.ciudad) buscarCoordenadas(form.ciudad)
  }

  const handleSubmit = async () => {
    try {
      await axios.post(`${API}/incidents/`, {
        ...form,
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
      })
      setMensaje('✅ Incidente reportado correctamente')
      cargarIncidentes()
      setTimeout(() => setMensaje(''), 3000)
    } catch (e) {
      setMensaje('❌ Error al reportar el incidente')
    }
  }

  return (
    <div className="app">
      <header>
        <h1>🏙️ Urban Incidents</h1>
        <p>Plataforma de monitoreo y reporte de incidentes urbanos</p>
      </header>

      <div className="content">
        <div className="card">
          <h2>📝 Reportar Incidente</h2>
          {mensaje && <div className="mensaje-exito">{mensaje}</div>}

          <input
            name="ciudad"
            placeholder="Ciudad"
            value={form.ciudad}
            onChange={handleChange}
            onBlur={handleCiudadBlur}
          />
          <input name="zona" placeholder="Zona" value={form.zona} onChange={handleChange} />

          <select name="categoria" value={form.categoria} onChange={handleChange}>
            <option value="alumbrado">Alumbrado público</option>
            <option value="vias">Daños en vías</option>
            <option value="residuos">Acumulación de residuos</option>
            <option value="seguridad">Seguridad</option>
            <option value="infraestructura">Infraestructura</option>
          </select>

          <textarea name="descripcion" placeholder="Descripción del incidente" value={form.descripcion} onChange={handleChange} rows={3} />

          <select name="prioridad" value={form.prioridad} onChange={handleChange}>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>

          <input name="latitud" placeholder="Latitud" value={form.latitud} onChange={handleChange} />
          <input name="longitud" placeholder="Longitud" value={form.longitud} onChange={handleChange} />
          <input name="usuario" placeholder="Tu nombre o usuario" value={form.usuario} onChange={handleChange} />

          <button onClick={handleSubmit}>Reportar Incidente</button>
        </div>

        <div className="card">
          <h2>📋 Incidentes Reportados ({incidentes.length})</h2>
          <div className="incident-list">
            {incidentes.length === 0 && <p>No hay incidentes aún.</p>}
            {incidentes.map((inc, i) => (
              <div key={i} className={`incident-item ${inc.prioridad}`}>
                <strong>{inc.categoria}</strong>
                <span className={`badge ${inc.estado}`}>{inc.estado}</span>
                <p>{inc.descripcion}</p>
                <small>📍 {inc.CiudadZona} · 👤 {inc.usuario}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h2>🗺️ Mapa de Incidentes</h2>
        <div className="map-container">
          <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater center={mapCenter} />
            {incidentes.map((inc, i) => (
              inc.latitud && inc.longitud && (
                <Marker key={i} position={[parseFloat(inc.latitud), parseFloat(inc.longitud)]}>
                  <Popup>
                    <strong>{inc.categoria}</strong><br />
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
  )
}