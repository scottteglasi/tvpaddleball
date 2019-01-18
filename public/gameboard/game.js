var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'matter',
        matter: {
            gravityX: 0,
            gravityY: 0
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game;
var socket;

var leftPaddle;
var rightPaddle;
var paddleYmin = 0;
var paddleYmax = 720;

var ball;

var playerScores = { "1": 0, "2": 0 };
var scoreText;

var lastAngularVelocity;
var niceSpinText;

var bounceCount = 0;
var highestBounceCount = 0;
var bounceCountText;
var highestBounceCountText;

var lastBallVelocity = 0;

window.onload = function() {
    game = new Phaser.Game(config);
    resize();
    window.addEventListener("resize", resize, false);

    socket = io('http://' + window.location.hostname + ':3000')
};

function preload() {
    this.load.image('paddle', 'assets/paddle.png');
    this.load.image('ball', 'assets/ball.png');
    this.load.image('wall', 'assets/wall.png');

}

function create() {
    this.matter.world.setBounds(-20, -20, game.config.width+50, game.config.height+20);
    this.matter.world.setGravity(0,0);
    scoreText = this.add.text(600,20, '0 : 0', { fontSize: '32px', fill: '#FFF' });
    scoreText.align = 'center';

    niceSpinText = this.add.text(510,160,'NICE SPIN', { fontSize: '50px', fill: '#FF0' });
    niceSpinText.align = 'center';
    niceSpinText.setVisible(false);

    bounceCountText = this.add.text(620, 320, '0', { fontSize: '96px', fill: '#555' });
    bounceCountText.align = 'center';
    highestBounceCountText = this.add.text(1180, 640, '0', { fontSize: '72px', fill: '#444' });

    leftPaddle = this.matter.add.sprite(100, 360, 'paddle');
    leftPaddle.setStatic(true);

    rightPaddle = this.matter.add.sprite(1180, 360, 'paddle');
    rightPaddle.setStatic(true);

    socket.on('controller_data_1', function(data) {
        // Translate gyro position to a Y position - using 0-90 as the valid space
        let leftPaddlePosition = data.do.beta * paddleYmax / 90;
        if (data.do.beta > 90) {
            leftPaddlePosition = paddleYmax;
        } else if (data.do.beta <= 0) {
            leftPaddlePosition = paddleYmin;
        }
        leftPaddle.setY(leftPaddlePosition);
        leftPaddle.setRotation(data.do.gamma * Math.PI / 180);
    });

    socket.on('controller_data_2', function(data) {
        // Translate gyro position to a Y position - using 0-90 as the valid space
        let rightPaddlePosition = data.do.beta * paddleYmax / 90;
        if (data.do.beta > 90) {
            rightPaddlePosition = paddleYmax;
        } else if (data.do.beta <= 0) {
            rightPaddlePosition = paddleYmin;
        }
        rightPaddle.setY(rightPaddlePosition);
        rightPaddle.setRotation(data.do.gamma * Math.PI / 180);
    });
    ball = this.matter.add.sprite(640, 360, 'ball');
    ball.setVelocity(5, 0);
    ball.setFriction(0, 0);
    ball.setBounce(2);

}

function update() {
    if (lastBallVelocity === 0)
    {
        lastBallVelocity = ball.body.velocity.x;
    }

    if (lastBallVelocity !== ball.body.velocity.x)
    {
        if ( (lastBallVelocity > 0 && ball.body.velocity.x < 0) || (lastBallVelocity < 0 && ball.body.velocity.x > 0))
        {
            incrementBounceCount();
            lastBallVelocity = ball.body.velocity.x;
        }
    }

    if (ball.body.velocity.x > 10)
    {
        ball.setVelocityX(10);
    }
    if (ball.body.velocity.y > 10)
    {
        ball.setVelocityY(10);
    }

    if (ball.body.velocity.x < 3 && ball.body.velocity.x > 0)
    {
        ball.setVelocityX(3);
    }

    if (ball.body.velocity.x > -3 && ball.body.velocity.x < 0)
    {
        ball.setVelocityX(-3);
    }

    if (ball.x >= game.config.width) {
        // player 1 scores
        playerScored(1);

    } else if (ball.x <= 0) {
        playerScored(2);
    }

    if (lastAngularVelocity !== ball.body.angularVelocity)
    {
        console.log(ball.body.angularVelocity);

        if (ball.body.angularVelocity > 0.5 || ball.body.angularVelocity < -0.5)
        {
            niceSpinText.setVisible(true);
        } else {
            niceSpinText.setVisible(false);
        }
    }

    lastAngularVelocity = ball.body.angularVelocity;

    // Assemble an object to emit to any gameboard view-only shemozzles
    // var gameboardDataPack = {
    //     ball: {
    //         x: ball.x,
    //         y: ball.y,
    //         angularVelocity: ball.body.angularVelocity,
    //         velocity: ball.body.velocity
    //     }
    // };
}

function incrementBounceCount()
{
    bounceCount++;
    bounceCountText.setText(bounceCount);
    if (bounceCount > highestBounceCount)
    {
        highestBounceCount++;
        highestBounceCountText.setText(highestBounceCount);
    }
}

function resetBounceCount()
{
    bounceCount = 0;
    bounceCountText.setText(bounceCount);
    lastBallVelocity = 0;
}

function playerScored(scoringPlayerNumber)
{
    playerScores[scoringPlayerNumber]++;
    renderScores();

    var ballVelocityX = scoringPlayerNumber === 1 ? -5 : 5;

    ball.setX(640);
    ball.setY(360);
    ball.setVelocity(ballVelocityX,0);
    ball.setAngularVelocity(0);
    resetBounceCount();
}

function renderScores()
{
    scoreText.setText(playerScores[1] + ' : ' + playerScores[2]);
}


function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
