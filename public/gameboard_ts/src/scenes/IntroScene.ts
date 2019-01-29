/// <reference path="../../node_modules/phaser3-docs/typescript/phaser.d.ts" />

export class IntroScene extends Phaser.Scene
{
    constructor() {
        super({ key: "IntroScene" });

    }

    preload() {

    }

    create() {
        this.add.text(100,100,"Welcome");
    }

    update() {

    }

}
