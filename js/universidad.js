const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("../data/universidades.json")
  .then(res => res.json())
  .then(data => {
    const uni = data.find(u => u.id === id);
    if(uni) render(uni);
  });

function render(u){
  document.getElementById("nombre").textContent = u.nombre;
  document.getElementById("descripcion").textContent = u.descripcion;
  document.getElementById("direccion").textContent = u.direccion;
  document.getElementById("telefono").textContent = u.telefono;

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
