import 'phaser';
import {IntroScene} from "./scenes/IntroScene";

const config: GameConfig = {
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
    scene: [
        IntroScene
    ]
};

const game = new Phaser.Game(config);
