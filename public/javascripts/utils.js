/*
* @Author: tangwen
* @Date:   2020-02-24 15:21:25
* @Last Modified by:   tangwen
* @Last Modified time: 2020-02-25 01:31:27
*/
var utils = {
	getWindowSize:function () {
		return cc.director.getWinSize();
	},

	makeSprite:function (filename,pos,adaptSize) {
		let spr = cc.Sprite.create(filename);
		spr.setPosition(pos);

		if (adaptSize){
			let ts = spr.getContentSize()
			if (adaptSize.width > 0){
				spr.setScaleX(adaptSize.width / ts.width)
			}

			if (adaptSize.height > 0){
				spr.setScaleY(adaptSize.height / ts.height)
			}
		}

		return spr;
	},

	makeSpriteClickable(spr,call_func,can_move){
		let spr_listener__ = spr.m_spr_listener__
		if(spr_listener__){
			return;
		}
		spr.m_call_func = call_func
		spr.m_can_move = can_move
		let s = cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {	
				// event.getCurrentTarget() returns the *listener's* sceneGraphPriority node.	
			    var target = event.getCurrentTarget();	
			    
				//Get the position of the current point relative to the button
			    var locationInNode = target.convertToNodeSpace(touch.getLocation());	
			    var s = target.getContentSize();
			    var rect = cc.rect(0, 0, s.width, s.height);
			    
				//Check the click area
			    if (cc.rectContainsPoint(rect, locationInNode)) {		
				    // target.opacity = 180;
				    return true;
			    }
			    return false;
		    },
			//Trigger when moving touch
		    onTouchMoved: function (touch, event) {			
			    //Move the position of current button sprite
			    if(spr.m_can_move){
					var target = event.getCurrentTarget();
				    var delta = touch.getDelta();
				    target.x += delta.x;
				    target.y += delta.y;
				    console.log("after move",target.x,target.y)
			    }
		    },
			//Process the touch end event
		    onTouchEnded: function (touch, event) {			
			    var target = event.getCurrentTarget();
			    // console.log("sprite onTouchesEnded.. ");
			    // target.setOpacity(255);
			    if(spr.m_call_func){
			    	spr.m_call_func()
			    }
		    }
        }, spr);

        spr.m_spr_listener__ = s
	},

	makeLabel:function (text, pos, col, fsize) {
		var label = new cc.LabelTTF(text, ResCfg.fontName, fsize);
		label.setPosition(pos.x, pos.y);
		label.color = col;
		return label; 
	},

	getLang:function (dialogId) {
		let txt_map = ResCfg.textMap_zh;
		return txt_map[dialogId] ? txt_map[dialogId] : txt_map["default"];
	}
}
