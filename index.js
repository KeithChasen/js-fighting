const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = 'grey';
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = .7;

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

function rectangularCollision({ rectangle1, rectangle2 }) {
    return rectangle1.attackBox.position.x +
        rectangle1.attackBox.offset.x +
        rectangle1.attackBox.width >= rectangle2.position.x &&

        rectangle1.position.x +
        rectangle1.attackBox.offset.x <= rectangle2.position.x + rectangle2.width &&

        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&

        rectangle1.attackBox.position.y + rectangle1.attackBox.height <= rectangle2.position.y + rectangle2.height;
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.querySelector('#displayText').innerHTML = whoWon({ player, enemy });
    document.querySelector('#displayText').style.display = 'flex';
}

function whoWon({ player, enemy }) {
    if (player.health > enemy.health) {
        return 'Player won';
    }

    if (player.health < enemy.health) {
        return 'Enemy won';
    }

    return 'Tie';
}

let timer = 90;
let timerId = null;
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerId });
    }
}

decreaseTimer();

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
    }

    if (keys.w.pressed && player.lastKey === 'w' && player.position.y + player.height >= canvas.height) {
        player.velocity.y = -20;
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
    }

    if (keys.ArrowUp.pressed && enemy.lastKey === 'ArrowUp' && enemy.position.y + enemy.height >= canvas.height) {
        enemy.velocity.y = -20;
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
