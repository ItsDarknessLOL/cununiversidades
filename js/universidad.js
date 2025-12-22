const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("../data/universidades.json")
  .then(res => res.json())
  .then(data => {
    // id del JSON es número, el de la URL es string
    const uni = data.find(u => String(u.id) === id);
    if (uni) {
      render(uni);
    } else {
      console.error("Universidad no encontrada con id:", id);
    }
  })
  .catch(err => console.error("Error cargando JSON:", err));

function set(id, value){
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "No disponible";
}

function render(u){
  // DATOS
  set("nombre", u["Nombre del centro de trabajo"]);
  set("tipo", u["Nombre del control (Público o Privado)"]);
  set("direccion", u.Domicilio);
  set("telefono", u.Telefono);
  set(
    "descripcion",
    `${u["Tipo educativo"]} - ${u["Nivel educativo"]} (${u["Servicio educativo"]})`
  );
  set("coords", `${u.y}, ${u.x}`);

  // IMÁGENES (opcional)
  const cont = document.getElementById("imagenes");

  if (u.imagenes && Array.isArray(u.imagenes)) {
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
