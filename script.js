document.addEventListener('DOMContentLoaded', () => {
    const gameArena = document.getElementById("game-arena");
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0;
    let gameStarted = false;
    let food = {x : 300, y : 200};
    let snake = [{x:160, y:200},{x:140, y:200},{x:120, y:200}];

    let dx = cellSize;
    let dy = 0;
    let gameSpeed = 350;
    let IntervalId;

    function drawDiv(x, y, className) {
        const div = document.createElement('div');
        div.classList.add(className);
        div.style.top = `${y}px`;
        div.style.left = `${x}px`;
        return div;
    }



    function drawScoreBoard() {
        const scoreBoard = document.getElementById('score-board');
        scoreBoard.textContent = `Score : ${score}`;
    }


    function drawFoodAndSnake() {
        gameArena.innerHTML = ' ';

        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);

        snake.forEach((snakeCell) => {
            const snakeElement = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(snakeElement);
        })
        
    }

    function moveFood() {
        let newX, newY;
        do {
            newX = Math.floor(Math.random()*((arenaSize - cellSize)/cellSize))*cellSize;
            newY = Math.floor(Math.random()*((arenaSize - cellSize)/cellSize))*cellSize;
        }while(snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY));
        food = {x:newX, y:newY};
    }


    function updateSnake() {
        const newHead = {x: snake[0].x + dx, y:snake[0].y + dy}
        snake.unshift(newHead);
        if(newHead.x === food.x && newHead.y === food.y) {
            score += 1;
            if(gameSpeed > 50) {
                clearInterval(IntervalId);
                gameSpeed -= 30;
                gameLoop();
            }
            
            moveFood();
        }
        else {
            snake.pop(); 
        }
    }

    function isGameOver() {
        for(i = 1; i < snake.length; i++) {
            if(snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                return true;
            }
        }
        const isHittingLeftWall = snake[0].x < 0;
        const isHittingTopWall = snake[0].y < 0;
        const isHittingRightWall = snake[0].x >= arenaSize;
        const isHittingBottomWall = snake[0].y >= arenaSize;

        return isHittingBottomWall || isHittingLeftWall || isHittingRightWall || isHittingTopWall;
    }

    function gameLoop() {
        IntervalId = setInterval(() => {
            if(isGameOver()) {
                if(!gameStarted) {
                    return;
                }
                alert(`Game Over, Score = ${score}`)
                window.location.reload();
                gameStarted = false;
                return;
            }
            updateSnake();
            drawScoreBoard();
            drawFoodAndSnake();
            
        }, gameSpeed);
    }

    function changeDirection(e) {
        const left_key = 37;
        const up_key = 38;
        const down_key = 40;
        const right_key = 39;

        const keyPressed = e.keyCode;

        if(keyPressed == left_key && dx != cellSize) {
            dy = 0;
            dx = -cellSize;
        }
        if(keyPressed == right_key && dx != -cellSize) {
            dy = 0;
            dx = cellSize;
        }
        if(keyPressed == down_key && dy != -cellSize ) {
            dy = cellSize;
            dx = 0;
        }
        if(keyPressed == up_key && dy != cellSize ) {
            dy = -cellSize;
            dx = 0;
        }
    }

    function runGame() {
        if(!gameStarted) {
            gameStarted = true;
            gameLoop();
            document.addEventListener('keydown', changeDirection);
        }
        
    }

    function initiateGame() {
        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'score-board';
        // scoreBoard.textContent = '10';
        document.body.insertBefore(scoreBoard, gameArena);
        

        const startButton = document.createElement('button');
        startButton.textContent= 'Start Game';
        startButton.classList.add('start-button');
        document.body.appendChild(startButton);


        startButton.addEventListener('click', () => {
            startButton.style.display = 'none';
            runGame();
        })
    }

    initiateGame();



});