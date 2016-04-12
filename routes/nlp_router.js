'use strict';

var router = require('express').Router();
var nlp_api = require('../lib/nlp_api');
var fs = require('fs');

//ubuntu
var articleDir = '/home/workspace/news/';

//mac
//var articleDir = '/Users/ancheng/PycharmProjects/LSI-for-ChineseDocument/news/';

//windows
//var articleDir = 'C:\\Users\\wuanc\\PycharmProjects\\filetools\\news';

// ccnlp page
router.get('/', function (req, res) {
	res.render('home');
});

// ccnlp-api page
router.get('/api', function (req, res) {
	res.render('api');
});

// ccnlp-demo page
router.get('/demo/:text?', function (req, res) {
	var text = req.params.text || '3月15日，谷歌阿尔法围棋与李世石的人机大战五番棋第5局在韩国四季酒店战罢，李世石执黑中盘落败，双方比分最终定格为阿尔法4比1取胜。李世石虽然总比分失利，但最后两局的出色发挥还是为人类棋手赢回了尊严。围棋人机对话才刚刚开始，随着人工智能的不断发展，人类棋手的借鉴研究，横纵十九路之上还会演绎出更多让我们心旷神怡的传世棋谱。这场比赛也标志着一个全新时代的到来。';
	res.render('demo', { text: text });
});

// ccnlp-vv-demo page
router.get('/demovv', function (req, res) {
	res.render('vv');
});

router.get('/product', function (req, res) {
	res.render('product');
});

router.get('/about', function (req, res) {
	res.render('about');
});
// ACNLP处理
//router.get('/atc/:no', function(req, res) {
//    var iconv = new Iconv('GBK', 'UTF-8');
//    fs.readFile('/home/workspace/dict/' + req.params.no, function(err, data){
//        if (err) {
//            console.error('error');
//            res.send({data: err});
//        } else {
//            var str = iconv.convert(data).toString();
//            res.send({data: str});
//        }
//    });
//});

// 查看文章处理
router.get('/atc/:no', function (req, res) {
	fs.readdir(articleDir, function (err, files) {
		fs.readFile(articleDir + "/"+req.params.no, function (err, data) {
		//fs.readFile(articleDir + files[req.params.no], function (err, data) {
			if (err) {
				console.error('error');
				res.send({ data: err });
			} else {
				var str = data.toString();
				res.send({ data: str });
			}
		});
	});
});

//取文件id函数
router.get('/filerealid/:no', function (req, res) {
	fs.readdir(articleDir, function (err, files) {
		if (err) {
			console.error('error');
			res.send({ data: err });
		} else {
			var str = files[req.params.no];
			str = str.split('_');
			res.send({ fileid: str[0] });
		}
	});
});

// action过滤器
router.use('/:action/:nl', function (req, res, next) {
	var action = req.params.action;
	var actions = ['exactCut', 'searchCut', 'kwAnalyse', 'wordFlag', 'sentiments', 'similar','abstract','classification'];
	if (actions.indexOf(action) == - 1) res.send('不支持的行为');
	else next();
});

// 自然语义分析路由
// 参数action是行为，nl是用户输入的自然语言
//router.get('/:action/:nl', function (req, res) {
//	console.log(req.params.action);
//	var nl = req.params.nl.replace(/\s/g, '');
//	nlp_api[req.params.action](nl, function (result) {
//		res.send(result);
//	});
//});

// post
router.post('/:action/', function (req, res) {
	console.log(req.params.action);
	//var nl = req.body.nl.replace(/\s/g, '');
	var nl = req.body.nl;
	nlp_api[req.params.action](nl, function (result) {
		res.send(result);
	});
});


module.exports = router;
