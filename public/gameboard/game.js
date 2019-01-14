var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {

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


window.onload = function() {
chart = new CanvasJS.Chart("chartContainer", {
		title:{
			text: "My First Chart in CanvasJS"              
		},
		data: [              
		{
			type: "spline",
			dataPoints: xDatapoints,
			name: "x",
			showInLegend: true
		},
		{
			type: "spline",
			dataPoints: yDatapoints,
			name: "y",
			showInLegend: true
		},
		{
			type: "spline",
			dataPoints: zDatapoints,
			name: "z",
			showInLegend: true
		},

		]
	});
	chart.render();

	speedChart = new CanvasJS.Chart("chartContainer2", {
                title:{
                        text: "Speed calculation"
                },
                data: [
                {
                        type: "spline",
                        dataPoints: speedDatapoints,
                        name: "speed",
                        showInLegend: true
                }]
	});
	speedChart.render();
}


function preload() {
    this.load.image('paddle', 'assets/paddle.png');
}

function create() {
    leftPaddle = this.physics.add.sprite(100,300,'paddle');
    leftPaddle.setCollideWorldBounds(true);

    socket.on('controller_data', function(data) {
        message = 'y: ' + data.dm.y;

        if ( data.dm.y > 0.5 || data.dm.y < -0.5 ) {
	        paddleSpeed += data.dm.y;
	        lastPaddleSpeedChange = new Date();
        }
        message += "<br />" + lastPaddleSpeedChange.getTime();


        if (paddleSpeed < 0.25 && paddleSpeed > -0.25) {
    	    paddleSpeed = 0;
        }
        leftPaddle.setVelocityY(paddleSpeed * 100);
        leftPaddle.setRotation(data.do.beta * Math.PI / 180);

        xDatapoints.push({ x: eventCount, y: data.dm.x });
        yDatapoints.push({ x: eventCount, y: data.dm.y });
        zDatapoints.push({ x: eventCount, y: data.dm.z });
        speedDatapoints.push({ x: eventCount, y: paddleSpeed });
        if (xDatapoints.length > 200) { 
            xDatapoints.shift();
            yDatapoints.shift();
            zDatapoints.shift();
            speedDatapoints.shift();
        }
        chart.render();
    	speedChart.render();
        eventCount++;

        document.getElementById('log').innerHTML = message;

    });
}

function update() {
    var now = new Date();
    if (now.getTime() - lastPaddleSpeedChange.getTime() > 100)
    {
        paddleSpeed = 0;
    }

}

