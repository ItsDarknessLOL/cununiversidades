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
  document.getElementById("servicioeducativo").textContent = u.servicioeducativo || "No disponible";
  document.getElementById("sostenimiento").textContent = u.sostenimiento || "No disponible";
  document.getElementById("Nombredelaentidad").textContent = u.Nombredelaentidad || "No disponible";
  document.getElementById("Nombredelmunicipio").textContent = u.Nombredelmunicipio || "No disponible";
  document.getElementById("Nombredelocalidad").textContent = u.Nombredelocalidad || "No disponible";
  document.getElementById("direccion").textContent = u.direccion || "No disponible";
  

  document.getElementById("descripcion").textContent =
    `${u["tipoeducativo"]} - ${u["niveleducativo"]} (${u["servicioeducativo"]})`;

  document.getElementById("coords").textContent =
    lat && lng ? `${lat}, ${lng}` : "No disponible";

  // IMÁGENES
  const cont = document.getElementById("imagenes");
  cont.innerHTML = ""; // Limpiamos el contenedor

  if (Array.isArray(u.imagenes) && u.imagenes.length > 0) {
    u.imagenes.forEach(img => {
      const i = document.createElement("img");
      
      // ✅ CORRECCIÓN DE RUTA: 
      // Si todas las imágenes están en img/catalogo/, eliminamos la subcarpeta del ID.
      i.src = `../img/catalogo/${img}`; 
      
      i.style.width = "100%";
      i.style.maxHeight = "400px"; // Opcional: para que no sean gigantes
      i.style.objectFit = "cover";   // Opcional: para que mantengan proporción
      i.style.borderRadius = "12px";
      i.style.marginBottom = "15px";
      i.style.display = "block";

      // Manejo de error por si la imagen no existe
      i.onerror = function() {
        this.src = '../img/catalogo/placeholder.jpg'; 
      };

      cont.appendChild(i);
    });
  } else {
    // Si no hay imágenes en el JSON, mostrar un placeholder
    cont.innerHTML = `<img src="../img/catalogo/placeholder.jpg" style="width:100%; border-radius:12px;">`;
  }

  const btnMapa = document.getElementById("ver-mapa");

  if (btnMapa && u.coords) {
    btnMapa.href =
     `../mapa.html?lat=${u.coords[0]}&lng=${u.coords[1]}&id=${u.id}`;
  }

}
