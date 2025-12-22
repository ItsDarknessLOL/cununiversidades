const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id")); // 🔥 convertir a number

fetch("../data/universidades.json")
  .then(res => res.json())
  .then(data => {
    const uni = data.find(u => u.id === id);
    if (uni) render(uni);
    else console.error("Universidad no encontrada");
  });

function render(u) {

  const nombre =
    u.nombre ||
    u["Nombre del centro de trabajo"] ||
    "No disponible";

  const tipo =
    u.tipo ||
    u["Nombre del control (Público o Privado)"] ||
    "No disponible";

  const direccion =
    u.direccion ||
    u.Domicilio ||
    "No disponible";

  const telefono =
    u.telefono ||
    u.Telefono ||
    "No disponible";

  const descripcion =
    u.descripcion ||
    (u["Tipo educativo"]
      ? `${u["Tipo educativo"]} - ${u["Nivel educativo"]} (${u["Servicio educativo"]})`
      : "Información pendiente");

  const lat = u.coords ? u.coords[0] : u.y;
  const lng = u.coords ? u.coords[1] : u.x;

  document.getElementById("titulo-universidad").textContent = nombre;
  document.getElementById("nombre").textContent = nombre;
  document.getElementById("tipo").textContent = tipo;
  document.getElementById("direccion").textContent = direccion;
  document.getElementById("telefono").textContent = telefono;
  document.getElementById("descripcion").textContent = descripcion;
  document.getElementById("coords").textContent =
    lat && lng ? `${lat}, ${lng}` : "No disponible";

  // IMÁGENES (solo si existen)
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
