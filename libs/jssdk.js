/*
* @Author: tangwen
* @Date:   2020-02-15 22:50:25
* @Last Modified by:   tangwen
* @Last Modified time: 2020-02-20 14:42:44
*/


const crypto = require('crypto');
const debug = require('debug')('jswechat:jssdk');
const fs = require('fs');
const request = require('request');

function JSSDK(appId, appSecrete) {
	this.appId = appId;
	this.appSecrete = appSecrete;
}

var cclog = console.log;

JSSDK.prototype = {
	getSignPackage: function (url,next) {
		var self = this;
		const timestamp = Math.round(Date.now() / 1000);
		this.getJsApiTicket(function (err,jsapiTicket) {
			const nonceStr = self.createNonceStr();

			const arr = [
				`jsapi_ticket=${jsapiTicket}`,
				`noncestr=${nonceStr}`,
				`timestamp=${timestamp}`,
				`url=${url}`,
			];
			const rawString = arr.sort().join('&');
			//生成签名
			const hash = crypto.createHash('sha1');
			const signature = hash.update(rawString).digest('hex');

			next(null, {
				timestamp: timestamp,
				url: url,
				signature: signature,
				rawString: rawString,
				appId: self.appId,
				nonceStr: nonceStr
			});
		});
		
	},
	getJsApiTicket: function (done) {
		const cacheFile = '.jsapiTicket.json'
		const data = this.readCacheFile(cacheFile);
		const time = this.timeNow();
		const self = this;

		if(data.expireTime < time){
			this.getAccessToken(function (error, accessToken) {
				const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=${accessToken}`
				request.get(url,function (err,res,body) {
					if(err){
						debug('getJsApiTicket.request.error',err,url);
						return done(err,'invalid ticket');
					}

					debug('getJsApiTicket.request.body',body);

					try{
						const data = JSON.parse(body);
						self.writeCachFile(cacheFile,{
							expireTime: self.timeNow() + 7200,
							ticket: data.ticket
						});

						return done(null,data.ticket);
					}
					catch(e){
						debug('getJsApiTicket.JSON.parse',e);
						return done(e,'invalid ticket');
					}
				});
			});
		}else{
			return done(null,data.ticket);
		}
	},

	timeNow: function () {
		return Math.round(Date.now() / 1000);
	},

	getAccessToken: function (done) {
		const cacheFile = '.jsapiAccessToken.json'
		const data = this.readCacheFile(cacheFile);
		const time = this.timeNow();
		const self = this;

		cclog("getAccessToken here,,,,");

		if(data.expireTime < time){
			cclog("gen new one");
			cclog('this.appId',this.appId)
			cclog('this.appSecrete',this.appSecrete)
			const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecrete}`
			request.get(url,function (err,res,body) {
				if(err){
					cclog('getAccessToken.request.error',err,url);
					return done(err,null);
				}

				cclog('getAccessToken.request.body',body);

				try{
					const data = JSON.parse(body);
					self.writeCachFile(cacheFile,{
						expireTime: self.timeNow() + 7200,
						access_token: data.access_token
					});
					done(null,data.access_token);
				}
				catch(e){
					cclog('getAccessToken.JSON.parse',e);
					done(e,'invalid token')
				}
			});
		}else{
			cclog("use old one");
			done(null,data.access_token)
		}
	},

	createNonceStr: function () {
		const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	    const length = chars.length;
	    let str = "";
	    for (let i = 0; i < length; i++) {
      		str += chars.substr(Math.round(Math.random() * length ), 1);
	    }
	    return str;
	},

	readCacheFile: function (filename) {
		try {
			if (!fs.existsSync(filename)) {
				return {expireTime:0};
			}
		} catch(err) {
			return {expireTime:0};
		}

		try{
			return JSON.parse(fs.readFileSync(filename));
		}catch(e){
			debug('read file %s failed: %s',filename,e);
			return {expireTime:0};
		}

		return {expireTime:0};
	},

	writeCachFile: function (filename, data) {
		return fs.writeFileSync(filename,JSON.stringify(data));
	},

	test: function () {
		cclog('test here,,,')
	}
};

// tangwen
// const jssdk = new JSSDK('wx50d507b20f69d8dc','9b0213a84d14c0d00bfcc3bb385c5ec8');
// redwar
// const jssdk = new JSSDK('wx4b871d03442ff7d4','17aede67e3a9f164717760bcefa77924');

// module.exports = jssdk;
module.exports = JSSDK;