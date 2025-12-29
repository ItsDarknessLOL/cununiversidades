// 1️⃣ Crear mapa centrado en Cancún
const map = L.map("map").setView([21.1619, -86.8515], 12);

// 2️⃣ Capa base (OBLIGATORIA)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// 📍 Geolocalización del usuario
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const userCoords = [
        pos.coords.latitude,
        pos.coords.longitude
      ];

      L.marker(userCoords, {
        icon: L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
      })
        .addTo(map)
        .bindPopup("Tu ubicación")
        .openPopup();

      map.setView(userCoords, 13);
    },
    () => {
      console.warn("Geolocalización denegada");
    }
  );
}


// 3️⃣ Cargar datos
fetch("data/universidades.json")
  .then(res => res.json())
  .then(data => initMap(data))
  .catch(err => console.error("Error cargando universidades:", err));

let markers = [];

const catalogo = document.getElementById("catalogo");


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
       </a><br>
       <a 
         href="https://www.google.com/maps/dir/?api=1&destination=${u.coords[0]},${u.coords[1]}"
         target="_blank"
       >  
         Cómo llegar
        </a>
      `)


    markers.push({
      id: u.id,
      marker,
      nombre: u.nombre.toLowerCase(),
      tipo: u.tipo.toLowerCase()
    });

    // 🔥 Si viene desde "Ver en mapa"
    if (focusId && Number(focusId) === u.id) {
      map.setView(u.coords, 17);
      setTimeout(() => marker.openPopup(), 400);
    }
  });
  if (catalogo) {
    const card = document.createElement("div");
   card.className = "uni-card";

    card.innerHTML = `
      <img src="img/universidades/${u.id}/1.jpg" onerror="this.src='img/placeholder.jpg'">

     <div class="uni-card-content">
        <h4>${u.nombre}</h4>
        <p>${u.direccion || "Cancún, Q. Roo"}</p>

        <div class="actions">
         <a 
          class="mapa"
          href="mapa.html?lat=${u.coords[0]}&lng=${u.coords[1]}&id=${u.id}"
        >
          Ver mapa
        </a>

        <a
          class="llegar"
          target="_blank"
          href="https://www.google.com/maps/dir/?api=1&destination=${u.coords[0]},${u.coords[1]}"
        >
          Cómo llegar
        </a>
      </div>
    </div>
  `;

  catalogo.appendChild(card);
}

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

const params = new URLSearchParams(window.location.search);
const focusLat = params.get("lat");
const focusLng = params.get("lng");
const focusId = params.get("id");

