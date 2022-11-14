const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = 'grey';
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = .7;

const background = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './img/background.png'
});

const shop = new Sprite({
    position: { x: 620, y: 135 },
    imageSrc: './img/shop.png',
    scale: 2.7,
    framesMax: 6
});

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samurai/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 155
    },
    framesSpeed: 7,
    sprites: {
        idle: {
            imageSrc: './img/samurai/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './img/samurai/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/samurai/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/samurai/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/samurai/Attack1.png',
            framesMax: 6,
        },
    }
});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/ninja/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 170
    },
    framesSpeed: 8,
    sprites: {
        idle: {
            imageSrc: './img/ninja/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/ninja/Run.png',
            framesMax: 8,
        },
    }
});

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },

    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
};

decreaseTimer();

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    if (
        keys.w.pressed && player.lastKey === 'w'
    ) {
        player.velocity.y = -15;
        keys.w.pressed = false;
        player.lastKey = '';
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    }

    if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // enemy movement
    enemy.velocity.x = 0;
    enemy.image = enemy.sprites.idle.image;

    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.image = enemy.sprites.run.image;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.image = enemy.sprites.run.image;
        enemy.velocity.x = 5;
    }

    if (
        keys.ArrowUp.pressed && enemy.lastKey === 'ArrowUp'
    ) {
        enemy.velocity.y = -15;
    }

    // detect for collision
    // player attacks
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
    ) {
        console.log('player hit!')
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = `${enemy.health}%`;
    }

    // enemy attacks
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    ) {
        console.log('enemy hit!')
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#playerHealth').style.width =  `${player.health}%`;
    }

    // end game if some player ran out of health
    if (player.health <= 0 || enemy.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

animate();

addEventListener('keydown', e => {
    switch (e.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            keys.w.pressed = true;
            player.lastKey = 'w';
            break;
        case ' ':
            player.attack();
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = true;
            enemy.lastKey = 'ArrowUp';
            break;
        case '.':
            enemy.attack();
            break;
    }
});

addEventListener('keyup', e => {
    switch (e.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
    }
});
