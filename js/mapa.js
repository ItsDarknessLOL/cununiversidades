// 1️⃣ Crear mapa centrado en Cancún
const map = L.map("map").setView([21.1619, -86.8515], 12);

// 2️⃣ Capa base (OBLIGATORIA)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// 3️⃣ Cargar datos
fetch("data/universidades.json")
  .then(res => res.json())
  .then(data => initMap(data))
  .catch(err => console.error("Error cargando universidades:", err));

let markers = [];

// 4️⃣ Crear marcadores
function initMap(universidades){
  universidades.forEach(u => {
    if(!u.coords) return;

    const marker = L.marker(u.coords)
      .addTo(map)
      .bindPopup(`
       <b>${u.nombre}</b><br>
       <a href="universidades/universidad.html?id=${u.id}">
       Ver información
       </a>
    `);

    markers.push({
     marker,
     nombre: u.nombre.toLowerCase(),
     nombreOriginal: u.nombre,
     tipo: u.tipo.toLowerCase()
    });

  });
}

// 5️⃣ Buscador (seguro)
const search = document.getElementById("search");
const suggestions = document.getElementById("suggestions");

if (search) {
  search.addEventListener("input", e => {
    const val = e.target.value.toLowerCase().trim();
    suggestions.innerHTML = "";

    if (!val) {
      markers.forEach(m => map.addLayer(m.marker));
      return;
    }

    const matches = markers.filter(m =>
      m.nombre.includes(val)
    );

    // Mostrar solo coincidencias en el mapa
    markers.forEach(m => {
      matches.includes(m)
        ? map.addLayer(m.marker)
        : map.removeLayer(m.marker);
    });

    // Crear sugerencias
    matches.slice(0, 5).forEach(m => {
      const div = document.createElement("div");
      div.className = "suggestion";
      div.textContent = m.nombre;

      div.addEventListener("click", () => {
        map.setView(m.marker.getLatLng(), 16);
        m.marker.openPopup();
        search.value = m.nombre;
        suggestions.innerHTML = "";
      });

      suggestions.appendChild(div);
    });
  });
}

// Cerrar sugerencias al hacer click fuera
document.addEventListener("click", e => {
  if (!e.target.closest("#search")) {
    suggestions.innerHTML = "";
  }
});

// 6️⃣ Filtro por tipo
const tipo = document.getElementById("tipo");
if(tipo){
  tipo.addEventListener("change", () => {
    const t = tipo.value;

    markers.forEach(m => {
      (!t || m.tipo === t)
        ? map.addLayer(m.marker)
        : map.removeLayer(m.marker);
    });
  });
}
