/*
* @Author: tangwen
* @Date:   2020-02-24 18:22:44
* @Last Modified by:   tangwen
* @Last Modified time: 2020-02-24 22:39:42
*/
var ClickSprite = cc.Sprite.extend({
	ctor:function (file_name,call_func) {
		this.m_call_func = call_func;
		this._super(file_name);
		let self = this;
		var listener1 = cc.EventListener.create({
		    event: cc.EventListener.TOUCH_ONE_BY_ONE,
			// When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
		    swallowTouches: true,
			//onTouchBegan event callback function						
		    onTouchBegan: function (touch, event) {	
				// event.getCurrentTarget() returns the *listener's* sceneGraphPriority node.	
			    var target = event.getCurrentTarget();	
			    
				//Get the position of the current point relative to the button
			    var locationInNode = target.convertToNodeSpace(touch.getLocation());	
			    var s = target.getContentSize();
			    var rect = cc.rect(0, 0, s.width, s.height);
			    
				//Check the click area
			    if (cc.rectContainsPoint(rect, locationInNode)) {		
				    target.opacity = 180;
				    return true;
			    }
			    return false;
		    },
			//Trigger when moving touch
		    onTouchMoved: function (touch, event) {			
			    //Move the position of current button sprite
				// var target = event.getCurrentTarget();
			 //    var delta = touch.getDelta();
			 //    target.x += delta.x;
			 //    target.y += delta.y;
		    },
			//Process the touch end event
		    onTouchEnded: function (touch, event) {			
			    var target = event.getCurrentTarget();
			    target.setOpacity(255);
			    if(self.m_call_func){
			    	self.m_call_func()
			    }
		    }
	    });

	    cc.eventManager.addListener(listener1, self);
	},
})