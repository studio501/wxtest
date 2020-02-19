var express = require('express');
var router = express.Router();
const crypto = require('crypto');

// const AppConfig = require('../AppConfig');
const jssdk = require('../libs/jssdk');
const tenpay = require('../libs/node-tenpay/lib');

const request = require('request');

const eval_expression = require('./eval_expression');

// const base_url = 'http://47.105.182.64'
const base_url = 'http://devrtommy.nat100.top'

var cclog = console.log;

var temp_global_id = null;

var app_config = {
	appId: 'wx50d507b20f69d8dc',
	appSecret: '9b0213a84d14c0d00bfcc3bb385c5ec8'
}

var pay_config = {
	appid: 'wxf670dc053f6a9489', 
	mchid: '1561309801', 
	partnerKey: 'Zhandihongjing112233445566778890', 
	pfx: '2A8F85B24BA1BFC5478EBBF87AF739F0D6C82ABA', 
	notify_url: `${base_url}/wechat/notify`, 
	refund_url: `${base_url}/wechat/refund`, 
	// spbill_create_ip: 'abcd', 
	sandbox: false
}


/* GET home page. */
router.get('/wechat/hello', function(req, res, next) {
	// cclog('req.url is',req.url)
	// '47.105.182.64/wechat/hello'
	// cclog('AppConfig',AppConfig);
	jssdk.getSignPackage(`${base_url}${req.url}`,function (err,signPackage) {
		if(err){
			return next(err);
		}
		// Jade Template
		res.render('index',{
			title: 'Hello Wechate from tangwen Express',
			signPackage: signPackage,
			pretty: true
		})
	})
 	// res.render('index', { title: 'welcom to tangwen website' });
});

// auth
// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx50d507b20f69d8dc&redirect_uri=http://47.105.182.64/wechat/auth&response_type=code&scope=snsapi_base&state=123#wechat_redirect
// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx50d507b20f69d8dc&redirect_uri=http://47.105.182.64/wechat/auth&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect
router.get('/wechat/auth', function(req, res, next) {
	cclog('/wechat/auth',req.body);
	const code = req.query.code;
	cclog('code here,,,',code);
	cclog('req.url is ',req.url);
	const get_token_url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${app_config.appId}&secret=${app_config.appSecret}&code=${code}&grant_type=authorization_code`
	request.get(get_token_url,function (err,res2,body) {
		if (err){
			return res.send(err);
		}

		body = JSON.parse(body)
		cclog('get_token_url,,,',body);

		// res.send('hello');
		var openid = body.openid
		temp_global_id = openid

		jssdk.getSignPackage(`${base_url}${req.url}`,function (err,signPackage) {
			if(err){
				return next(err);
			}

			signPackage.openid = openid
			// Jade Template
			res.render('index',{
				title: 'Hello Wechate from tangwen Express',
				signPackage: signPackage,
				pretty: true
			})
		})
	})
});

router.get('/wechat/notify', function(req, res, next) {
	cclog('notify here',req.query);
});

router.get('/wechat/refund', function(req, res, next) {
	cclog('refund here',req,res,next);
});

router.get('/wechat/readyPay', function(req, res, next) {
	cclog('readyPay here',req.body);
	const api = new tenpay(pay_config,true);
	// api.getSignkey();

	let response = api.getPayParams({
		out_trade_no: '202002190001',
		body: '商品1',
		total_fee: 1,
		openid: temp_global_id
    });
    let keys = ['appId', 'timeStamp', 'nonceStr', 'package', 'signType', 'paySign', 'timestamp'];
    cclog("readyPay response",response);
});

router.get('/wechat/clickBtn', function(req, res, next) {
	cclog('you click a btn');
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
  		cclog('handleWechatRequest post body:',req.body.xml)
  	}

  	if(req.method === 'GET'){
  		cclog('handleWechatRequest get:', {get:req.body});
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

			var rest_str = content
			if (content.indexOf('+') > -1 || content.indexOf('-') > -1 || content.indexOf('*') > -1 || content.indexOf('/') > -1){
				rest_str = eval_expression.formula(content);
			}
			
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
