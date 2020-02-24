/*
* @Author: tangwen
* @Date:   2020-02-24 14:59:04
* @Last Modified by:   tangwen
* @Last Modified time: 2020-02-25 01:41:30
*/

var TopComponent = cc.Node.extend({
	ctor:function () {
		this._super()

		this.m_clickEvent = new cus_event();

		var size = utils.getWindowSize();

		this.setAnchorPoint(cc.p(0.5,1));

		// top bg
		let top_bg = utils.makeSprite("images/uis/tittle02_half.png",cc.p(0,0),cc.size(size.width,0))
		top_bg.setAnchorPoint(cc.p(0.5,1))
		this.addChild(top_bg);

		// utils.makeSpriteClickable(top_bg,null,true)

		let same_y = -31
		let same_y_txt = same_y - 2
		// sel bg
		let self_bg = utils.makeSprite("images/uis/menu_back.png",cc.p(0,0),cc.size(193,0))
		self_bg.setPosition(cc.p(-217,same_y))
		this.addChild(self_bg);

		let self = this
		utils.makeSpriteClickable(self_bg,function () {
			self.m_clickEvent.emit()
		})

		// sel triangle
		let sel_tri = utils.makeSprite("images/uis/triangle.png",cc.p(0,0))
		sel_tri.setPosition(cc.p(-140,-25))
		this.addChild(sel_tri);

		// info bg
		let info_bg = utils.makeSprite("images/uis/menu_back.png",cc.p(0,0),cc.size(375,0))
		info_bg.setPosition(cc.p(93,same_y))
		this.addChild(info_bg);

		// server txt
		let sever_txt = utils.makeLabel("S12",cc.p(-311,same_y_txt),ResCfg.fontColor.TopText,20);
		sever_txt.setAnchorPoint(cc.p(0,0.5))
		this.addChild(sever_txt);

		this.m_id = '';
		this.m_level = '';
		// info txt
		let info_txt = utils.makeLabel(`${utils.getLang('5')} ${this.m_id}    ${utils.getLang('2')} ${this.m_level}`,
			cc.p(-81,same_y_txt),ResCfg.fontColor.TopText,20);
		info_txt.setAnchorPoint(cc.p(0,0.5))
		this.addChild(info_txt);
	},
	getClickEvent:function () {
		return this.m_clickEvent;
	}
})

var GameLayer = cc.Layer.extend({
	ctor:function () {
		this._super();
		this.init();
	},
	init:function () {
		var size = utils.getWindowSize();

		this.addChild(utils.makeSprite("images/uis/shop_back.jpg",cc.p(size.width / 2, size.height / 2)));
		
		let top_cp = new TopComponent()
		this.addChild(top_cp)
		top_cp.setPosition(cc.p(size.width/2,size.height));
		top_cp.getClickEvent().add(function () {
			console.log('on click,,,,')
		})

		
		// let test_sp = utils.makeSprite("images/uis/wx_eff02.png",cc.p(size.width/2,size.height))
		// test_sp.setOpacity(0.2*255)
		// test_sp.setAnchorPoint(cc.p(0.5,1))
		// this.addChild(test_sp);

		// this.scale = 0.5
		
	},
	onEnter:function () {
		this._super();

		var size = utils.getWindowSize();
		let size1 = cc.director.getVisibleSize();
		let size2 = cc.view.getDesignResolutionSize();
		let size3 = cc.view.getCanvasSize();

		console.log("onEnter,,,")
	}
});

GameLayer.scene = function () {
	var scene = new cc.Scene();
	var layer = new GameLayer();
	scene.addChild(layer);
	return scene;
}
