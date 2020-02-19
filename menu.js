/*
* @Author: tangwen
* @Date:   2020-02-19 15:25:43
* @Last Modified by:   tangwen
* @Last Modified time: 2020-02-19 20:00:44
*/

const request = require('request');
const jssdk = require('./libs/jssdk');

// const base_url = 'http://47.105.182.64'
const base_url = 'http://devrtommy.nat100.top'

const menuItems = {
    "button": [
        {
            "type": "view", 
            "name": "支付", 
            "url": "http://devrtommy.nat100.top/wechat/hello/"
        }, 
        {
            "name": "菜单", 
            "sub_button": [
                {
                    "type": "view", 
                    "name": "搜索一下", 
                    "url": "http://www.soso.com/"
                },
                {
                    "type": "view", 
                    "name": "支付一下", 
                    "url": "http://devrtommy.nat100.top/wechat/hello/"
                }
            ]
        }
    ]
}

/*
{
    "button": [
        {
            "name": "扫码", 
            "sub_button": [
                {
                    "type": "click", 
                    "name": "支付", 
                    "url": "http://47.105.182.64/wechat/hello"
                }, 
                {
                    "type": "scancode_push", 
                    "name": "yy", 
                    "key": "rselfmenu_0_1"
                }
            ]
        }, 
        {
            "name": "发图", 
            "sub_button": [
                {
                    "type": "pic_sysphoto", 
                    "name": "xx", 
                    "key": "rselfmenu_1_0"
                }, 
                {
                    "type": "pic_photo_or_album", 
                    "name": "aa", 
                    "key": "rselfmenu_1_1"
                }
            ]
        }, 
        {
            "name": "发送位置", 
            "type": "location_select", 
            "key": "rselfmenu_2_0"
        }
    ]
}
*/

jssdk.getAccessToken(function (err,token) {
	if(err || !token){
		return console.error('获取 access_token 失败');
	}
	// https://api.weixin.qq.com/cgi-bin/menu/create?access_token=30_PSAMXPENPWUG8uhgRansoBv5Jfa_nn6FuS732ASu14rpWsX--JMyvnInPHB0XkDwjU6pRb42NDfIDpkVRXE4ppmOHG64KxmYXrUPGMtd9aPku2oZk5D-5oG0KY5AfOfykKZI7OV4mI7wNsZWMBBfADATII
	request.get(`https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${token}`,function (e,res,body) {
		if(e){
			return console.error('菜单删除失败',e);
		}

		console.log('菜单删除成功');
		request.post({url: `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`,json: menuItems},function (_e,_res,_body) {
			if(_e){
				return console.error('菜单创建失败',_e);
			}
			if(_body.errcode !== 0){
				return console.error('菜单创建失败',_body);
			}
			console.log('菜单创建成功');
		} );
	})
})