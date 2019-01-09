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

function preload() {
    this.load.image('paddle', 'assets/paddle.png');
}

function create() {
    var leftPaddle = this.physics.add.sprite(100,100,'paddle');

}

function update() {

}

