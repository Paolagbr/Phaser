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