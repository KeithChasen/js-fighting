
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