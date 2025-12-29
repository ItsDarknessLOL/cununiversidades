const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form.addEventListener("submit", e => {
  e.preventDefault();

  status.textContent = "Enviando mensaje...";
  status.style.color = "#333";

  emailjs.sendForm(
    "service_hycb5qh",
    "template_vtre6ro",
    form
  )
  .then(() => {
    status.textContent = "✅ Mensaje enviado correctamente";
    status.style.color = "green";
    form.reset();
  })
  .catch(() => {
    status.textContent = "❌ Error al enviar el mensaje";
    status.style.color = "red";
  });
});
