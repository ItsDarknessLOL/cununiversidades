/*************************
 * 🔍 Parámetros URL
 *************************/
const params = new URLSearchParams(window.location.search);
const focusId = params.get("id");

/*************************
 * 🗺️ Mapa base
 *************************/
const map = L.map("map").setView([21.1619, -86.8515], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

/*************************
 * 📍 Geolocalización
 *************************/
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const userCoords = [pos.coords.latitude, pos.coords.longitude];
      L.marker(userCoords).addTo(map).bindPopup("Tu ubicación");
    },
    () => console.warn("Geolocalización denegada")
  );
}

/*************************
 * 📦 Variables globales
 *************************/
let universidades = [];
let markersData = [];        // para buscador y filtros
let individualMarkers = [];  // solo Leaflet markers

const cluster = L.markerClusterGroup({
  disableClusteringAtZoom: 14,
  maxClusterRadius: 50,
  showCoverageOnHover: false,
  spiderfyOnMaxZoom: false
});

const catalogo = document.getElementById("catalogo");

/*************************
 * 📥 Cargar datos
 *************************/
fetch("data/universidades.json")
  .then(r => r.json())
  .then(initMap)
  .catch(err => console.error("Error cargando universidades:", err));

/*************************
 * 🚀 Inicializar sistema
 *************************/
function initMap(data) {
  universidades = data;
  crearMarcadores();
  actualizarMarcadoresVisibles();
}

/*************************
 * 📍 Crear marcadores
 *************************/
function crearMarcadores() {
  universidades.forEach(u => {
    if (!u.coords || !Array.isArray(u.coords)) return;

    const marker = L.marker(u.coords).bindPopup(`
      <b>${u.nombre}</b><br>
      <a href="universidades/universidad.html?id=${u.id}">
        Ver información
      </a><br>
      <a target="_blank"
         href="https://www.google.com/maps/dir/?api=1&destination=${u.coords[0]},${u.coords[1]}">
        Cómo llegar
      </a>
    `);

    marker._id = u.id;

    individualMarkers.push(marker);
    cluster.addLayer(marker);

    markersData.push({
      id: u.id,
      marker,
      nombre: u.nombre.toLowerCase(),
      nombreOriginal: u.nombre,
      tipo: (u.tipo || "").toLowerCase(),
      coords: u.coords
    });

    // 🎯 Enfoque desde catálogo
    if (focusId && Number(focusId) === u.id) {
      map.setView(u.coords, 17);
      setTimeout(() => marker.openPopup(), 400);
    }

    // 📚 Catálogo
    if (catalogo) crearCard(u);
  });

  map.addLayer(cluster);
}

/*************************
 * 👁️ Mostrar solo visibles
 *************************/
function actualizarMarcadoresVisibles() {
  const bounds = map.getBounds();
  const zoom = map.getZoom();

  individualMarkers.forEach(marker => {
    const visible = bounds.contains(marker.getLatLng());

    if (zoom >= 14) {
      if (visible && !map.hasLayer(marker)) map.addLayer(marker);
      if (!visible && map.hasLayer(marker)) map.removeLayer(marker);
    } else {
      if (!cluster.hasLayer(marker)) cluster.addLayer(marker);
      if (map.hasLayer(marker)) map.removeLayer(marker);
    }
  });
}

map.on("moveend zoomend", actualizarMarcadoresVisibles);

/*************************
 * 🔎 Buscador con sugerencias
 *************************/
const search = document.getElementById("search");
const suggestions = document.getElementById("suggestions");

if (search) {
  search.addEventListener("input", e => {
    const val = e.target.value.toLowerCase().trim();
    suggestions.innerHTML = "";

    if (!val) {
      actualizarMarcadoresVisibles();
      return;
    }

    const matches = markersData.filter(m =>
      m.nombre.includes(val)
    );

    individualMarkers.forEach(m => map.removeLayer(m));
    matches.forEach(m => map.addLayer(m.marker));

    matches.slice(0, 5).forEach(m => {
      const div = document.createElement("div");
      div.className = "suggestion";
      div.textContent = m.nombreOriginal;

      div.onclick = () => {
        map.setView(m.coords, 16);
        m.marker.openPopup();
        search.value = m.nombreOriginal;
        suggestions.innerHTML = "";
      };

      suggestions.appendChild(div);
    });
  });
}

document.addEventListener("click", e => {
  if (!e.target.closest("#search")) suggestions.innerHTML = "";
});

/*************************
 * 🏷️ Filtro por tipo
 *************************/
const tipoSelect = document.getElementById("tipo");

if (tipoSelect) {
  tipoSelect.addEventListener("change", () => {
    const t = tipoSelect.value;

    markersData.forEach(m => {
      (!t || m.tipo === t)
        ? map.addLayer(m.marker)
        : map.removeLayer(m.marker);
    });
  });
}

/*************************
 * 📚 Tarjetas catálogo
 *************************/
function crearCard(u) {
  const card = document.createElement("div");
  card.className = "uni-card";

  card.innerHTML = `
    <img src="img/universidades/${u.id}/1.jpg"
         onerror="this.src='img/placeholder.jpg'">

    <div class="uni-card-content">
      <h4>${u.nombre}</h4>
      <p>${u.direccion || "Cancún, Q. Roo"}</p>

      <div class="actions">
        <a class="mapa"
           href="mapa.html?id=${u.id}">
          Ver mapa
        </a>

        <a class="llegar"
           target="_blank"
           href="https://www.google.com/maps/dir/?api=1&destination=${u.coords[0]},${u.coords[1]}">
          Cómo llegar
        </a>
      </div>
    </div>
  `;

  catalogo.appendChild(card);
}
