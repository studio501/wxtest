/*
* @Author: tangwen
* @Date:   2020-02-23 22:23:40
* @Last Modified by:   tangwen
* @Last Modified time: 2020-02-25 01:25:12
*/

window.onload = function () {
	var targetWidth = 720;
	var targetHeight = 1136;
	cc.game.onStart = function () {
		cc.view.adjustViewPort(false);
		cc.view.setDesignResolutionSize(targetWidth, targetHeight, cc.ResolutionPolicy.NO_BORDER);
		cc.view.resizeWithBrowserSize(true);

		cc.LoaderScene.preload(ResCfg.all_res,function () {
			cc.director.runScene(GameLayer.scene());
		},this)
	};
	cc.game.run("gameCanvas");
}