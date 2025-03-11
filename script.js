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
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

// Función para precargar los recursos
function preload () {
    this.load.image('sky', 'assets/Fondo.webp');
    this.load.image('ground', 'assets/tronco.png');
    this.load.image('star', 'assets/bill.png');
    this.load.image('bomb', 'assets/Hectorgon.png');
    this.load.image('vida', 'assets/vida.png');
    this.load.spritesheet('dude', 'assets/Mabelonga.png', { frameWidth: 66, frameHeight: 80 });
}

// Función para crear los elementos del juego
function create () {
    // Fondo
    var sky = this.add.image(0, 0, 'sky').setOrigin(0, 0);
    sky.setScale(2);//Se muestra el fondo de pantalla


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

// Animaciones del jugador
this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 2, end: 7 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 8 }],
    frameRate: 20
});

this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 9, end: 15 }),
    frameRate: 10,
    repeat: -1
});

// Estrellas
stars = this.physics.add.group({
    key: 'star',
    repeat: 20,
    setXY: { x: 60, y: 0, stepX: 90 }
});

stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
});


    // Bombas
    bombs = this.physics.add.group();

    // Texto de puntuación
    scoreText = this.add.text(16, 16, 'Puntuación: 0', { fontSize: '32px', fill: '#000' });

    // Colisiones
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    // Solapamiento entre el jugador y las estrellas
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // Controles del cursor
    cursors = this.input.keyboard.createCursorKeys();
}

// Función de actualización
function update () {
    if (gameOver) {
        return;
    }

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
function collectStar (player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Puntuación: ' + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
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

// Función para manejar la colisión con bombas
function hitBomb (player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}
