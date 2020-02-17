var express = require('express');
var router = express.Router();
const crypto = require('crypto');

const jssdk = require('../libs/jssdk');

const eval_expression = require('./eval_expression')

var cclog = console.log;

/* GET home page. */
router.get('/wechat/hello', function(req, res, next) {
	// cclog('req.url is',req.url)
	// '47.105.182.64/wechat/hello'
	jssdk.getSignPackage('http://47.105.182.64/wechat/hello',function (err,signPackage) {
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

// handle route
const token = 'asldf8&*^&*xaSz'

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
			if (content.indexOf('+') > 0 || content.indexOf('-') > 0 || content.indexOf('*') > 0 || content.indexOf('/') > 0){
				rest_str = eval_expression.formula(content);
			}
			
			const response = `<xml>
				<ToUserName><![CDATA[${fromusername}]]></ToUserName>
				<FromUserName><![CDATA[${tousername}]]></FromUserName>
				<CreateTime>${createtime}</CreateTime>
				<MsgType><![CDATA[${msgtype}]]></MsgType>
				<Content><![CDATA[${rest_str}]]></Content>
			</xml>`;
			// res.set('Content-Type','text/xml')
			res.send(response)
		}
	}else{
		res.send('invalid sign');
	}
}

router.get('/api/wechat',handleWechatRequest);
router.post('/api/wechat',handleWechatRequest);


module.exports = router;
