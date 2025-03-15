// Recuperar datos del juego de localStorage
let gameData = JSON.parse(localStorage.getItem('gameScores')) || [];

// Función para representar los datos del juego en la tabla
function renderGameData() {
    const bookTableBody = document.querySelector('#bookTable tbody');
    bookTableBody.innerHTML = '';
    gameData.sort((a, b) => b.score - a.score);

    gameData.forEach(data => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.alias}</td>
            <td>${data.score}</td>
            <td>${data.date}</td>
        `;
        bookTableBody.appendChild(row);
    });
}

renderGameData();

document.addEventListener("click", function() {
    var audio = document.getElementById("audioFondo");
    audio.play().catch(error => console.error("Error al reproducir audio:", error));
    document.removeEventListener("click", arguments.callee);
});