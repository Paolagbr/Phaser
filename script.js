// Recuperar el personaje seleccionado desde localStorage
var personajeSeleccionado = localStorage.getItem("personajeSeleccionado") || "drag1";

// Configuración del juego
var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Inicializa el juego
var game = new Phaser.Game(config);

// Variables globales
var player;
var stars;
var vidas = 3;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var vidas = 3;
var vidasI = []; //Almacena las imagenes de las vidas
const fecha = new Date();
const dia = fecha.getDate();
const mes = fecha.getMonth() + 1;
const year = fecha.getFullYear();
const fechaC = `${dia}/${mes}/${year}`;

//Recuperar el nombre del jugador
var alias = localStorage.getItem("alias");
// Función para precargar los recursos
function preload() {
    this.load.image('sky', 'assets/Fondo.webp');
    this.load.image('ground', 'assets/tronco.png');
    this.load.image('star', 'assets/bill.png');
    this.load.image('bomb', 'assets/Hectorgon.png');
    this.load.image('vida', 'assets/vida.png');
    this.load.image('pause', 'assets/pausa.png');

    // Cargar el sprite del personaje seleccionado usando los ids "drag1" y "drag2"
    if (personajeSeleccionado === "drag1") {
        this.load.spritesheet('dude', 'assets/Mabelonga.png', { frameWidth: 66, frameHeight: 80 });
    } else if (personajeSeleccionado === "drag2") {
        this.load.spritesheet('dude', 'img/Adobe.png', { frameWidth: 43, frameHeight: 80 });
    }

    console.log("Personaje cargado en el juego: ", personajeSeleccionado);
}

// Función para crear los elementos del juego
function create() {
    // Fondo
    var sky = this.add.image(0, 0, 'sky').setOrigin(0, 0);
    sky.setScale(2); //Se muestra el fondo de pantalla


    // Plataformas
    platforms = this.physics.add.staticGroup();
    //Creacion de las plataformas
    platforms.create(240, 1000, 'ground').setScale(2).refreshBody();
    platforms.create(800, 1000, 'ground').setScale(2).setFlipX(true).refreshBody();;
    platforms.create(1400, 1000, 'ground').setScale(2).setFlipX(true).refreshBody();; /*Troncos gdes de abajo*/
    platforms.create(2000, 1000, 'ground').setScale(2).setFlipX(true).refreshBody();;
    platforms.create(100, 600, 'ground').setScale(1).setFlipX(true).refreshBody();;; /*Lo ando moviendo yo */
    platforms.create(600, 700, 'ground').setScale(0.5).setFlipX(true).refreshBody();
    platforms.create(900, 800, 'ground').setScale(0.75).setFlipX(true).refreshBody();
    platforms.create(600, 450, 'ground').setScale(0.75).setFlipX(true).refreshBody();
    platforms.create(1200, 600, 'ground').setScale(1).setFlipX(true).refreshBody();
    platforms.create(1000, 300, 'ground').setScale(1).setFlipX(true).refreshBody();
    platforms.create(1500, 450, 'ground').setScale(0.5).setFlipX(true).refreshBody();
    platforms.create(1750, 700, 'ground').setScale(0.5).setFlipX(true).refreshBody();
    platforms.create(1500, 750, 'ground').setScale(0.75).setFlipX(true).refreshBody();

    // Jugador
    player = this.physics.add.sprite(100, 750, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    configurarAnimaciones(this, personajeSeleccionado);

    // Animaciones del jugador
    //Estrellas
    stars = this.physics.add.group({
        key: 'star',
        repeat: 1,
        setXY: { x: 60, y: 0, stepX: 90 }
    });

    stars.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    stars.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Bombas
    bombs = this.physics.add.group();

    // Datos a pantalla
    Nivel = this.add.text(10, 150, 'NIVEL 1', { fontSize: '32px', fill: '#ffffff', fontWeight: 'bold' });
    scoreText = this.add.text(10, 190, 'score: 0', { fontSize: '32px', fill: '#ffffff' });
    Nom = this.add.text(10, 230, 'Jugador:' + alias, { fontSize: '32px', fill: '#ffffff' });
    Date = this.add.text(10, 265, 'Fecha:' + fechaC, { fontSize: '32px', fill: '#ffffff' });

    // Colisiones
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.overlap(player, bombs, hitBomb, null, this);

    // Solapamiento entre el jugador y las estrellas
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // Controles del cursor
    cursors = this.input.keyboard.createCursorKeys();

    //Se muestran las vidas del jugador

    for (var i = 0; i < vidas; i++) {
        var vidaImagen = this.add.image(30 + (i * 30), 120, 'vida').setScale(1);
        vidasI.push(vidaImagen);
    }

    configurarAnimaciones(this, personajeSeleccionado)
    cursors = this.input.keyboard.createCursorKeys();
    var scene = this;

    // Pausa del juego
    this.pauseImage = this.add.image(1750, 150, 'pause').setInteractive();
    this.pauseImage.setScale(1);

    // Cada que se da clic se pone pausa
    this.pauseImage.on('pointerdown', function() {
        if (scene.physics.world.isPaused) {
            scene.physics.world.resume();
            scene.pauseImage.setScale(1);
        } else {
            scene.physics.world.pause();
            scene.pauseImage.setScale(3);
            scene.pauseImage.setVisible(true);
        }
    });
}
//Configurar animaciones según el personaje
function configurarAnimaciones(scene, personaje) {
    if (personaje === "drag1") {
        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('dude', { start: 2, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 8 }],
            frameRate: 20,
        });

        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('dude', { start: 9, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
    } else if (personaje === "drag2") {
        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('dude', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 8 }],
            frameRate: 20
        });

        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('dude', { start: 9, end: 12 }),
            frameRate: 10,
            repeat: -1
        });
    }


}

// Función de actualización
function update() {
    if (gameOver) return;

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

// Función para recolectar estrellas
function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Puntuación: ' + score);

    if (score >= 400) {
        /*console.log("Cambiando de nivel en 1 segundo...");
        setTimeout(() => {*/
        /*window.location.href = 'Juego2.html?nocache=' + new Date().getTime();*/
        window.location.href = 'Juego2.html';

        /*}, 1000);*/
    }

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setScale(0.1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

function collectSpecialItem(player, specialItem) {
    specialItem.destroy();
    score += 100;
    scoreText.setText('Score: ' + score);

    if (score >= 50) {
        pasarANivelSiguiente.call(this);
    }
}

// Función para manejar la colisión con bombas y vidas
function hitBomb(player, bomb) {
    var playerX = player.x; //El jugador se mantega en su posicion 
    var playerY = player.y;

    player.setTint(0xff0000);
    player.anims.play('turn');
    //perderVida.call(this, playerX, playerY);
    //bomb.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));

    // Aplica una fuerza a la bomba para que se aleje
    var forceX = (bomb.x > player.x) ? 400 : -400; // Fuerza horizontal
    var forceY = -400; // Fuerza vertical
    bomb.setVelocity(forceX, forceY);
    perderVida.call(this, playerX, playerY);
}

function perderVida(playerX, playerY) {
    vidas--;
    if (vidas >= 0) {
        this.time.delayedCall(500, () => {
            player.clearTint();
            player.setPosition(playerX, playerY);
            player.setVelocity(0, 0);
            this.physics.resume();

            if (vidasI.length > 0) {
                let vidaPerdida = vidasI.pop();
                vidaPerdida.destroy();
            }
        });
    }

    if (vidas == 0) {
        gameOver = true;
        player.anims.play('turn');
        this.physics.pause();
        guardarDatosJuego(alias, score, fechaC);

        // Guardar el puntaje y alias en localStorage
        localStorage.setItem("ultimoScore", score);
        localStorage.setItem("ultimoAlias", alias);

        // Redirigir a la pantalla de Game Over después de 2 segundos
      /*  setTimeout(() => {
            window.location.href = "GameOver.html";
        }, 1000);*/
        window.location.href = 'GameOver.html';
    }
}

// Función para guardar datos del juego en localStorage
function guardarDatosJuego(alias, score, fecha) {
    let gameScores = JSON.parse(localStorage.getItem('gameScores')) || [];
    let aliasExistente = gameScores.find(item => item.alias === alias);

    if (aliasExistente) {
        // Comparar puntajes y actualizar si es mayor
        if (score > aliasExistente.score) {
            aliasExistente.score = score;
            aliasExistente.date = fecha;
        }
    } else {
        // Si el alias no existe, agregar nuevo registro
        let gameData = {
            alias: alias,
            score: score,
            date: fecha
        };
        gameScores.push(gameData);
    }

    // Guardar el array actualizado en localStorage
    localStorage.setItem('gameScores', JSON.stringify(gameScores));
}