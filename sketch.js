// Estados
var PLAY = 1;
var END = 0;
var gameState = PLAY;

// Mario
var mario, mario_running, mario_collided;

// Suelos
var ground, invisibleGround, groundImage;

// Nubes
var cloudsGroup, cloudImage;

// Obstáculos
var obstaclesGroup, obstacle2, obstacle3, obstacle4;

// Puntuación
var score = 0;

// Game Over y Restart
var gameOver, restart;
var gameOverImg, restartImg;

// Crear Fondo
var backgroundImg;

// Sonidos
var jumpSound, checkPointSound, dieSound;

function preload() {
    // Cargar Mario
    mario_running = loadAnimation("Mario1.png", "Mario_Running.png");
    mario_collided = loadAnimation("Mario_Collided.png");

    // Suelo
    groundImage = loadImage("ground.png");
    invisibleGround = loadImage("ground2.png");

    // Nubes
    cloudImage = loadImage("cloud.png");

    // Obstáculos
    obstacle2 = loadImage("Obstacle2.png");
    obstacle3 = loadImage("Obstacle3.png");
    obstacle4 = loadImage("Obstacle4.png");

    // Game Over y restart
    restartImg = loadImage("restart.png");
    gameOverImg = loadImage("gameOver.png");

    // Sonidos
    jumpSound = loadSound("jump.mp3");
    dieSound = loadSound("died.mp3");
    checkPointSound = loadSound("checkPoint.mp3");

    // Fondo
    backgroundImg = loadImage("backgroundImg.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Crear el suelo
    ground = createSprite(300, windowHeight - 20, 600, 10);
    ground.addImage("ground", groundImage);
    ground.x = ground.width / 2;

    // Crear Mario
    mario = createSprite(50, windowHeight - 250, 20, 50);
    mario.addAnimation("running", mario_running);
    mario.addAnimation("collided", mario_collided);
    mario.scale = 1.5;

    // Crear grupos
    cloudsGroup = new Group();
    obstaclesGroup = new Group();

    // Invisible ground
    invisibleGround = createSprite(width / 2, height - 120, width, 10);
    invisibleGround.visible = false;

    // Game Over y Restart
    gameOver = createSprite(width / 2, height / 2 - 50);
    gameOver.addImage(gameOverImg);
    restart = createSprite(width / 2, height / 1.5);
    restart.addImage(restartImg);

    gameOver.scale = 0.5;
    restart.scale = 1;

    gameOver.visible = false;
    restart.visible = false;
// colisionador del Mario
mario.setCollider("circle",0,0,25);
mario.debug =false;
}

function draw() {
    background(backgroundImg);

    //mostrar puntuación
    text("Puntuación: " + score, 1100, 50);
    console.log("esto es ", gameState);

    if (gameState === PLAY) {
        //mover el suelo
        ground.velocityX = -(4 + 3 * score / 300);
        //puntuación
        score = score + Math.round(getFrameRate() / 60);
        //CheckPoint
        if (score > 0 && score % 300 === 0) {
            checkPointSound.play();
        }
        if (ground.x < 0) {
            ground.x = ground.width / 2;
        }
        if (keyDown("space") && mario.y >= 100 && mario.collide(invisibleGround)) {
            mario.velocityY = -20;
            //Agregar sonido
            jumpSound.play();
        }
        mario.velocityY = mario.velocityY + 0.8
        mario.collide(invisibleGround);
        //Aparecer nubes
        spawnClouds();
        //Apareces obstaculos
        spawnObstacles();

        if (obstaclesGroup.isTouching(mario)) {
            gameState = END;
            dieSound.play();
        }
    } else if (gameState === END) {
        //cambiar la animación del Mario
        mario.changeAnimation("collided",mario_collided);
        gameOver.visible = true;
        restart.visible = true;

        ground.velocityX = 0;
        mario.velocityY = 0;

        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);

        mario.changeAnimation("collided", mario_collided);

        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);

        
    }
    if (mousePressedOver(restart)) {
        reset();
    }
    mario.collide(invisibleGround);
    drawSprites();
}

function spawnClouds() {
    // Código para crear nubes
    if (frameCount % 60 === 0) {
        cloud = createSprite(600, -10, 40, 10);
        cloud.addImage(cloudImage)
        cloud.y = Math.round(random(10, 60))
        cloud.scale = 2;
        cloud.velocityX = -3;
    
        //asignar lifetime a la variable
        cloud.lifetime = 210
    
        //ajustar la profundidad
        cloud.depth = mario.depth
        mario.depth = mario.depth + 1;
    
        //agregar cada nube al grupo
        cloudsGroup.add(cloud);
    
      }
}
function spawnObstacles() {
    // Código para crear obstáculos
    
     if (frameCount % 60 === 0) {
        obstacle = createSprite(400,windowHeight - 200, 10, 40);
        obstacle.velocityX = -(6+ score/300);
    
        //generar obstáculos al azar
        var rand = Math.round(random(2, 4));
        switch (rand) {
          case 2: obstacle.addImage(obstacle2);
            break;
          case 3: obstacle.addImage(obstacle3);
            break;
          case 4: obstacle.addImage(obstacle4);
            break;
          default: break;
        }
        //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;


    //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
}
}

function reset() {
    // Restablecer el juego
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    mario.changeAnimation("running", mario_running);
    score = 0;
}
