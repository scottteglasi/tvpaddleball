"use strict";
/// <reference path="../../node_modules/phaser3-docs/typescript/phaser.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var IntroScene = /** @class */ (function (_super) {
    __extends(IntroScene, _super);
    function IntroScene() {
        return _super.call(this, { key: "IntroScene" }) || this;
    }
    IntroScene.prototype.preload = function () {
    };
    IntroScene.prototype.create = function () {
        this.add.text(100, 100, "Welcome");
    };
    IntroScene.prototype.update = function () {
    };
    return IntroScene;
}(Phaser.Scene));
exports.IntroScene = IntroScene;
//# sourceMappingURL=IntroScene.js.map