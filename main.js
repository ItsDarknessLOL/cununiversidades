const map = L.map('map').setView([21.1619, -86.8515], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Universidades
const universidades = [
    {
        nombre: "Universidad La Salle Cancún",
        coords: [21.147, -86.823]
    },
    {
        nombre: "Universidad Anáhuac Cancún",
        coords: [21.060, -86.846]
    },
    {
        nombre: "TecNM Campus Cancún",
        coords: [21.148, -86.854]
    }
];

universidades.forEach(u => {
    L.marker(u.coords)
        .addTo(map)
        .bindPopup(`<b>${u.nombre}</b>`);
});

console.log("Mapa cargado correctamente");
