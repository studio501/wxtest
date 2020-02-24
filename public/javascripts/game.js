/*
* @Author: tangwen
* @Date:   2020-02-23 22:23:40
* @Last Modified by:   tangwen
* @Last Modified time: 2020-02-24 10:29:40
*/


window.onload = function () {
	cc.game.onStart = function () {
		cc.LoaderScene.preload([],function () {
			console.log("game start,,,,")
			var MyScene = cc.Scene.extend({
				onEnter:function () {
					console.log("game onEnter,,,,")
					this._super();
					var size = cc.director.getWinSize();
					console.log("game onEnter,,,,",size)
					// var sprite = cc.Sprite.create("HelloWorld.png");
					// sprite.setPosition(size.width / 2, size.height / 2);
					// sprite.setScale(0.8);
					// this.addChild(sprite, 0);

					var label = cc.LabelTTF.create("Hello tangwen............", "Arial", 40);
					label.setColor(new cc.Color(0,0,0,255))
					label.setPosition(size.width / 2, size.height / 2);
					this.addChild(label, 1);
				}
			});

			cc.director.runScene(new MyScene());
		},this)
	};
	// cc.director.getOpenGLView().setOrientation(cc.ORIENTATION_PORTRAIT)
	cc.game.run("gameCanvas");
}