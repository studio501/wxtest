/*
* @Author: tangwen
* @Date:   2020-02-19 21:38:02
* @Last Modified by:   tangwen
* @Last Modified time: 2020-02-19 21:41:07
*/
const debug = require('debug')('jswechat:jssdk');
const request = require('request');

function Authurl() {
}

Authurl.prototype = {
	request: function (url,au_type,next) {
		
	}
}

const authurl = new Authurl();
module.exports = authurl;