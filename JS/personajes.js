document.addEventListener("DOMContentLoaded", () => {
    const img1 = document.getElementById("drag1");
    const img2 = document.getElementById("drag2");
    const dropZone = document.getElementById("div3");
    const statusText = document.querySelector(".texto-superpuesto");

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
        
        // Verifica si el elemento donde se suelta es la zona de soltar
        if (event.target.id === "div3") {
            event.target.appendChild(img);
            statusText.textContent = "Imagen soltada en el cuadro punteado.";
        }
    }

    function dragEnter(event) {
        event.preventDefault();
        if (event.target.id === "div3") {
            event.target.classList.add("over");
            statusText.textContent = "Imagen dentro del área de soltar.";
        }
    }

    function dragLeave(event) {
        if (event.target.id === "div3") {
            event.target.classList.remove("over");
            statusText.textContent = "Imagen fuera del área de soltar.";
        }
    }

    function dragEnd(event) {
        statusText.textContent = "Dejó de arrastrar la imagen.";
    }

    // Asignar eventos a la zona de soltar
    dropZone.addEventListener("dragover", allowDrop);
    dropZone.addEventListener("drop", drop);
    dropZone.addEventListener("dragenter", dragEnter);
    dropZone.addEventListener("dragleave", dragLeave);

    // Asignar eventos a las imágenes
    img1.addEventListener("dragstart", drag);
    img1.addEventListener("dragend", dragEnd);
    
    img2.addEventListener("dragstart", drag);
    img2.addEventListener("dragend", dragEnd);
});