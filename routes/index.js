var express = require('express');
var router = express.Router();
const crypto = require('crypto');

const AppConfig = require('../AppConfig');
const JSSDK = require('../libs/jssdk');
const authurl = require('../libs/authurl');
const tenpay = require('../libs/node-tenpay/lib');

const request = require('request');
const xml2js = require('xml2js');

const eval_expression = require('./eval_expression');
const wechat = require('wechat');

// const base_url = 'http://47.105.182.64'
const base_url = AppConfig.base_url

var cclog = console.log;

var temp_global_id = null;

var app_config = AppConfig.app_config

var pay_config = {
	// appid: 'wxf670dc053f6a9489', //主体小程序appId
	appid: app_config.appId, 
	mchid: '1561309801', 
	partnerKey: 'Zhandihongjing112233445566778890', 
	// pfx: '2A8F85B24BA1BFC5478EBBF87AF739F0D6C82ABA', //证书文件
	notify_url: `${base_url}/wechat/notify`, 
	refund_url: `${base_url}/wechat/refund`, 
	// spbill_create_ip: 'abcd', 
	sandbox: false
}

const jssdk = new JSSDK(app_config.appId,app_config.appSecret);

const api = new tenpay(pay_config,true);

const getSignPackage = function (req, res, next) {
	jssdk.getSignPackage(`${base_url}${req.url}`,function (err,signPackage) {
		if(err){
			return next(err);
		}

		cclog('signPackage here,,,',signPackage)
		req.signPackage = signPackage;
		next();
	})
}

/* GET home page. */
router.get('/wechat/hello', getSignPackage, function(req, res, next) {
	res.render('index',{
		title: 'RedWar Pay',
		signPackage: req.signPackage,
		pretty: true
	})
});

// auth
// devrtommy.nat100.top
// wx4b871d03442ff7d4
// wx50d507b20f69d8dc tangwen
// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4b871d03442ff7d4&redirect_uri=http://devrtommy.nat100.top/wechat/auth&response_type=code&scope=snsapi_base&state=123#wechat_redirect
// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx50d507b20f69d8dc&redirect_uri=http://47.105.182.64/wechat/auth&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect
router.get('/wechat/auth', function(req, res, next) {
	const code = req.query.code;
	const get_token_url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${app_config.appId}&secret=${app_config.appSecret}&code=${code}&grant_type=authorization_code`
	request.get(get_token_url,function (err,res2,body) {
		if (err){
			return res.send(err);
		}

		body = JSON.parse(body)
		cclog('get openid ,,,',body);

		// res.send('hello');
		var openid = body.openid
		temp_global_id = openid

		jssdk.getSignPackage(`${base_url}${req.url}`,function (err,signPackage) {
			if(err){
				return next(err);
			}

			res.send(openid);
			// signPackage.openid = openid
			// Jade Template
		})
	})
});

router.get('/wechat/notify', function(req, res, next) {
	cclog('notify here',req.query);
});

router.get('/wechat/refund', function(req, res, next) {
	cclog('refund here',req,res,next);
});

router.get('/wechat/readyPay', getSignPackage, function(req, res, next) {
	cclog('readyPay here',req.body);
	// const api = new tenpay(pay_config,true);
	// api.getSignkey();

	let response = api.getPayParams({
		out_trade_no: 'redwar' + Math.round(Date.now() / 1000),
		body: '商品1',
		total_fee: 1,
		openid: 'ozlLZjhHk9PV2mYFp5QIhWyd-2Pc',
    });
    let keys = ['appId', 'timeStamp', 'nonceStr', 'package', 'signType', 'paySign', 'timestamp'];

	response.then(function (value) {
		// value.appid = "wxf670dc053f6a9489"
		cclog('readyPay value',value)
		res.render('pay',{
			title: 'RedWar Pay',
			signPackage: req.signPackage,
			payValue: value,
			pretty: true
		})
	})
});


var temp_order_id = 'redwar1582266873'
// <out_trade_no>redwar1582187669</out_trade_no>

router.get('/wechat/checkPay',getSignPackage, function(req, res, next) {
	let response = api.orderQuery({
		out_trade_no: temp_order_id
    });

    response.then(function (value) {
    	cclog('checkPay value',value)
		res.render('pay',{
			title: 'RedWar Pay',
			signPackage: req.signPackage,
			payValue: value,
			pretty: true
		})
	})
});

router.get('/wechat/cancelPay', function(req, res, next) {
	let response = api.closeOrder({
		out_trade_no: temp_order_id
    });
    response.then(function (value) {
    	cclog('cancelPay value',value)
		res.send(value);	
	})
});

router.get('/wechat/clickBtn', function(req, res, next) {
	cclog('next is ,',next)
	res.statusCode = 302;
	res.setHeader("Location", "https://www.baidu.com");
	res.send();
});
// handle route
const token = 'R0QN8bgzVsAJoO31'

// DEBUG=jswechat* node bin/www 
// http://47.105.182.64/

const handleWechatRequest = function (req,res,next) {
	const { signature, timestamp, nonce, echostr } = req.query;
  	if(!signature || !timestamp || !nonce ){
     		return res.send('invalid request');
  	}
  	if(req.method === 'POST'){
  		// cclog('handleWechatRequest post:', {body:req.body,query:req.query});
  		// cclog('handleWechatRequest post body:',req.body.xml)
  	}

  	if(req.method === 'GET'){
  		// cclog('handleWechatRequest get:', {get:req.body});
  		if(!echostr){
  			return res.send('invalid request');
  		}
  	}
	
	const params = [token,timestamp,nonce];
	params.sort();
	
	const hash = crypto.createHash('sha1');
	const sign = hash.update(params.join('')).digest('hex');

	if(signature === sign){
		// res.send(echostr);
		if(req.method === 'GET'){
			res.send(echostr ? echostr : 'welcome');
		}else{
			const tousername = req.body.xml.tousername[0].toString();
			const fromusername = req.body.xml.fromusername[0].toString();
			const createtime = Math.round(Date.now() / 1000);
			const msgtype = req.body.xml.msgtype[0].toString();
			const msgid = req.body.xml.msgid[0].toString();
			const content = req.body.xml.content[0].toString();

			var rest_str = '敬请期待'
			// if (content.indexOf('+') > -1 || content.indexOf('-') > -1 || content.indexOf('*') > -1 || content.indexOf('/') > -1){
			// 	rest_str = eval_expression.formula(content);
			// }
			
			// rest_str = 'http://47.105.182.64/wechat/hello'
			const response = `<xml>
				<ToUserName><![CDATA[${fromusername}]]></ToUserName>
				<FromUserName><![CDATA[${tousername}]]></FromUserName>
				<CreateTime>${createtime}</CreateTime>
				<MsgType><![CDATA[${msgtype}]]></MsgType>
				<Content><![CDATA[${rest_str}]]></Content>
			</xml>`;
			// res.set('Content-Type','text/xml')
			// res.send(response)
			res.send(response)
		}
	}else{
		res.send('invalid sign');
	}
}

router.get('/api/wechat',handleWechatRequest);
router.post('/api/wechat',handleWechatRequest);


module.exports = router;
