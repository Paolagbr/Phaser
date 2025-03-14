document.addEventListener("DOMContentLoaded", () => {
    const imagenes = document.querySelectorAll(".contenedor-imagen img"); // Todas las imágenes
    const zonaSoltar = document.getElementById("divDestino");
    const statusText = document.getElementById("status");

    // Agregar eventos a todas las imágenes
    imagenes.forEach(img => {
        img.addEventListener("dragstart", drag);
        img.addEventListener("dragend", dragEnd);
    });

    // Eventos para la zona de soltar
    zonaSoltar.addEventListener("dragover", allowDrop);
    zonaSoltar.addEventListener("drop", drop);
    zonaSoltar.addEventListener("dragenter", dragEnter);
    zonaSoltar.addEventListener("dragleave", dragLeave);

    function allowDrop(event) {
        event.preventDefault();
    }

    function drag(event) {
        event.dataTransfer.setData("text", event.target.id);
        statusText.textContent = "Arrastrando la imagen...";
    }

    function drop(event) {
        event.preventDefault();

        const data = event.dataTransfer.getData("text");
        const img = document.getElementById(data);

        // Mover imagen a la zona de soltar
        zonaSoltar.innerHTML = ""; // Limpiar el cuadro antes de agregar la nueva imagen
        zonaSoltar.appendChild(img);

        //Corregir el id del localStorage
        let personaje;
        if (data === "drag1"){
            personaje="MabelSF";
        }else if(data === "drag2") {
            personaje = "DipperSF";

        }

        // Guardar en localStorage
        localStorage.setItem("personajeSeleccionado", data);

        statusText.textContent = `Has seleccionado el personaje con ID: ${data}`;
    }

    function dragEnter(event) {
        event.preventDefault();
        zonaSoltar.classList.add("over");
    }

    function dragLeave(event) {
        zonaSoltar.classList.remove("over");
    }

    function dragEnd(event) {
        statusText.textContent = "Dejó de arrastrar la imagen.";
    }
});

const personajeSeleccionado = localStorage.getItem("personajeSeleccionado");

if (personajeSeleccionado) {
    console.log("Personaje seleccionado:", personajeSeleccionado);
    document.body.innerHTML += `<img src="/img/${personajeSeleccionado}.png" width="150">`;
} else {
    console.log("No se ha seleccionado ningún personaje.");
}
