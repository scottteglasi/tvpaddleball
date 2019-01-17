var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

var game = new Phaser.Game(config);

var socket = io('http://' + window.location.hostname + ':3000');

var chart;
var speedChart;
var xDatapoints = [];
var yDatapoints = [];
var zDatapoints = [];
var speedDatapoints = [{ y: 0 }];
var eventCount = 0;
var paddleSpeed = 0;
var lastPaddleSpeedChange = new Date();
var message = '';
var leftPaddle;
var rightPaddle;
var paddleYmin = 0;
var paddleYmax = 600;

var ball;

var topWall;
var bottomWall;


// window.onload = function() {
// chart = new CanvasJS.Chart("chartContainer", {
// 		title:{
// 			text: "My First Chart in CanvasJS"
// 		},
// 		data: [
// 		{
// 			type: "spline",
// 			dataPoints: xDatapoints,
// 			name: "alpha",
// 			showInLegend: true
// 		},
// 		{
// 			type: "spline",
// 			dataPoints: yDatapoints,
// 			name: "beta",
// 			showInLegend: true
// 		},
// 		{
// 			type: "spline",
// 			dataPoints: zDatapoints,
// 			name: "gamma",
// 			showInLegend: true
// 		},
//
// 		]
// 	});
// 	chart.render();
//
// 	speedChart = new CanvasJS.Chart("chartContainer2", {
//                 title:{
//                         text: "Speed calculation"
//                 },
//                 data: [
//                 {
//                         type: "spline",
//                         dataPoints: speedDatapoints,
//                         name: "speed",
//                         showInLegend: true
//                 }]
// 	});
// 	speedChart.render();
// }


function preload() {
    this.load.image('paddle', 'assets/paddle.png');
    this.load.image('ball', 'assets/ball.png');
    this.load.image('wall', 'assets/wall.png');

}

function create() {
    this.matter.world.setBounds(-20, -20, game.config.width+50, game.config.height+20);
    this.matter.world.setGravity(0,0);

    // // Build the top and bottom walls
    // topWall = this.matter.add.sprite(game.config.width / 2, 0, 'wall');
    // topWall.setStatic(true);
    //
    // bottomWall = this.matter.add.sprite(game.config.width / 2, game.config.height, 'wall');

    leftPaddle = this.matter.add.sprite(100,300,'paddle');
    leftPaddle.setStatic(true);

    // leftPaddle.setCollideWorldBounds(true);

    rightPaddle = this.matter.add.sprite(700, 300, 'paddle');
    rightPaddle.setStatic(true);
    // rightPaddle.setCollideWorldBounds(true);

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
    ball = this.matter.add.sprite(400, 300, 'ball');
    ball.setVelocity(5, 0);
    ball.setFriction(0, 0);
    ball.setBounce(2);

}

function update() {
    if (ball.body.velocity.x > 10)
    {
        ball.setVelocityX(10);
    }
    if (ball.body.velocity.y > 10)
    {
        ball.setVelocityY(10);
    }

    if (ball.x >= game.config.width) {
        // player 1 scores
        console.log('Player 1 scores');
        ball.setX(400);
        ball.setY(300);
        ball.setVelocity(-5,0);
        ball.setAngularVelocity(0);
    } else if (ball.x <= 0) {
        // player 2 scores
        console.log('Player 2 scores');
        ball.setX(400);
        ball.setY(300);
        ball.setVelocity(5,0);
        ball.setAngularVelocity(0);
    }

}

