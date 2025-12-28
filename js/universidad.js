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
  document.getElementById("tipoeducativo").textContent = u.tipoeducativo || "No disponible";
  document.getElementById("niveleducativo").textContent = u.niveleducativo || "No disponible";
  document.getElementById("servicioeducativo").textContent = u.servicioeducativo["servicio educativo"] || "No disponible";
  document.getElementById("sostenimiento").textContent = u.sostenimiento || "No disponible";
  document.getElementById("Nombredelaentidad").textContent = u.Nombredelaentidad["Nombre de la entidad"] || "No disponible";
  document.getElementById("Nombredelmunicipio").textContent = u.Nombredelmunicipio["Nombre del municipio o delegación"] || "No disponible";
  document.getElementById("Nombredelocalidad").textContent = u.Nombredelocalidad["Nombre de localidad"] || "No disponible";
  document.getElementById("direccion").textContent = u.direccion || "No disponible";
  

  document.getElementById("descripcion").textContent =
    `${u["tipoeducativo"]} - ${u["niveleducativo"]} (${u["servicioeducativo"]})`;

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


