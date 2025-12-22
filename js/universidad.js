const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("../data/universidades.json")
  .then(res => res.json())
  .then(data => {
    const uni = data.find(u => u.id === id);
    if(uni) render(uni);
  });

function render(u){
document.getElementById("nombre").textContent =
  u["Nombre del centro de trabajo"] || "No disponible";

document.getElementById("tipo").textContent =
  u["Nombre del control (Público o Privado)"] || "No disponible";

document.getElementById("direccion").textContent =
  u.Domicilio || "No disponible";

document.getElementById("telefono").textContent =
  u.Telefono || "No disponible"; // si no existe, mostrará "No disponible"

document.getElementById("descripcion").textContent =
  `${u["Tipo educativo"]} - ${u["Nivel educativo"]} (${u["Servicio educativo"]})`;

document.getElementById("coords").textContent =
  `${u.y}, ${u.x}`;


  const cont = document.getElementById("imagenes");
  u.imagenes.forEach(img => {
    const i = document.createElement("img");
    i.src = `../img/universidades/${u.id}/${img}`;
    i.style.width = "100%";
    i.style.borderRadius = "12px";
    i.style.marginBottom = "15px";
    cont.appendChild(i);
  });
}

