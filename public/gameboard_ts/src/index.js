"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("phaser");
var IntroScene_1 = require("./scenes/IntroScene");
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
    scene: [
        IntroScene_1.IntroScene
    ]
};
var game = new Phaser.Game(config);
//# sourceMappingURL=index.js.map