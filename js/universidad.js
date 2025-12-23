const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

fetch("../data/universidades.json")
  .then(res => res.json())
  .then(data => {
    const uni = data.find(u => Number(u.id) === id);
    if (uni) render(uni);
    else console.error("Universidad no encontrada");
  });

function render(u) {

  const lat = u.coords ? u.coords[0] : u.y;
  const lng = u.coords ? u.coords[1] : u.x;

  document.getElementById("titulo-universidad").textContent = u.nombre || "No disponible";
  document.getElementById("nombre").textContent = u.nombre || "No disponible";
  document.getElementById("cct").textContent = u.cct || "No disponible";
  document.getElementById("turno").textContent = u.turno || "No disponible";
  document.getElementById("tipo").textContent = u.tipo || "No disponible";
  document.getElementById("nivel").textContent = u["nivel educativo"] || "No disponible";
  document.getElementById("servicio").textContent = u["servicio educativo"] || "No disponible";
  document.getElementById("sostenimiento").textContent = u.sostenimiento || "No disponible";
  document.getElementById("entidad").textContent = u["Nombre de la entidad"] || "No disponible";
  document.getElementById("municipio").textContent = u["Nombre del municipio o delegación"] || "No disponible";
  document.getElementById("localidad").textContent = u["Nombre de localidad"] || "No disponible";
  document.getElementById("direccion").textContent = u.direccion || "No disponible";
  document.getElementById("telefono").textContent = u.telefono || "No disponible";

  document.getElementById("descripcion").textContent =
    `${u["tipo educativo"]} - ${u["nivel educativo"]} (${u["servicio educativo"]})`;

  document.getElementById("coords").textContent =
    lat && lng ? `${lat}, ${lng}` : "No disponible";

  // IMÁGENES
  const cont = document.getElementById("imagenes");
  cont.innerHTML = "";

  if (Array.isArray(u.imagenes)) {
    u.imagenes.forEach(img => {
      const i = document.createElement("img");
      i.src = `../img/universidades/${u.id}/${img}`;
      i.style.width = "100%";
      i.style.borderRadius = "12px";
      i.style.marginBottom = "15px";
      cont.appendChild(i);
    });
  }
}
