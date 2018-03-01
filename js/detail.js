$(function() {
	$.nav();
	$.msg();
	//获得URL的ID参数
	var id = $.Request("id");
	var user = $.login(lgsta);
	//用ajax获取文章内容和标题等等，同步就OK了
	function getDetail(id, mdrender, accesstoken) {
		var xhr = $.ajax({
			url: "https://cnodejs.org/api/v1/topic/" + id,
			type: "GET",
			async: false,
			data: {
				mdrender: mdrender,
				accesstoken: accesstoken
			},
		});
		var result = JSON.parse(xhr.responseText);
		return result;
	}
	var lgsta = $.session.get('accesstoken');
	var topic = getDetail(id, true, lgsta);

	//获取后将内容放到页面上
	function addDetail() {
		var good = topic.data.top ? '<span class="label  label-primary">置顶</span>' : ''; //获得置顶标签
		var tab = {
			dev: '<span class="label label-default">客户端测试</span>',
			share: '<span class="label label-default">分享</span>',
			ask: '<span class="label label-default">问答</span>',
			job: '<span class="label label-default">招聘</span>'
		};

		//添加文章标题内容
		var tphtml = '<div class="panel panel-default"><div class="panel-heading"><div class="topic-header"><h3>' + topic.data.title + '</h3>' + good + tab[topic.data.tab] + '<span class="publishtime"> 发布于' + topic.data.create_at + '</span><span class="visit">' + topic.data.visit_count + '次浏览</span></div></div><div class="panel-body">' + topic.data.content + '</div></div>';

		//添加回复，先判断是否有回复		
		var rphtml = '';
		var n = topic.data.replies.length;
		if (n != 0) {
			// 
			rphtml = '<ul class="list-group"><li class="list-group-item reply-header">' + n + '个回复</li>';
		var thumb = '';
		var up ='';
			if (user != null) {
				for (var i = 0; i < n; i++) {
					thumb = (topic.data.replies[i].is_uped)?'up':'';
					up = topic.data.replies[i].ups.length||'';
					rphtml += '<li class="list-group-item"><div class="media"><a class="pull-left" href="#"><img class="media-object" src="' + topic.data.replies[i].author.avatar_url + '" alt="..."></a><div class="media-body"><h6 class="media-heading" reply_id="' + topic.data.replies[i].id + '">' + topic.data.replies[i].author.loginname + '<a class="replysb glyphicon glyphicon-share-alt"></a><a class="th glyphicon glyphicon-thumbs-up ' + thumb + '">' + up + '</a></h6>' + topic.data.replies[i].content + '</div></div></li>';
				}
			} else {
				for (var i = 0; i < n; i++) {
					rphtml += '<li class="list-group-item replyinfo"><div class="media"><a class="pull-left" href="#"><img class="media-object" src="' + topic.data.replies[i].author.avatar_url + '" alt="..."></a><div class="media-body"><h6 class="media-heading" reply_id="' + topic.data.replies[i].id + '">' + topic.data.replies[i].author.loginname + '</h6>' + topic.data.replies[i].content + '</div></div></li>';
				}
			}

			rphtml += '</ul>';
		}
		var allhtml = tphtml + rphtml;
		$("#main-contain").append(allhtml);
		$("#main-contain table").addClass("table table-bordered");
		$("#main-contain img").addClass("img-responsive");

		//添加作者信息
		var html = '<div class="panel panel-default"><div class="panel-heading">作者信息</div><div class="panel-body"><p><a class="user_avatar" href="personinfo.html?loginname=' + topic.data.author.loginname + '"><img src="' + topic.data.author.avatar_url + '"></a><a href="personinfo.html?loginname=' + topic.data.author.loginname + '">' + topic.data.author.loginname + '</a></p></div></div>';
		$(".sidebar").html("").append(html);
	}
	addDetail();
	//判断是否登录，添加用户的功能，收藏,点赞,评论
	if (user != null) {
		usercoop();
	}

	function usercoop() {
		$("a.th").click(function() {
			var num ;
			var h ;
			var action = reply(lgsta, $(this).parent().attr("reply_id"));
			if (action.action == "up") {
				$(this).addClass("up");
				num = $(this).html();
				h = (num=='')?1:parseInt(num)+1;
				$(this).html(h);
			}else if(action.action == "down"){
				$(this).removeClass("up");
				num = $(this).html();
				h = (num==1)?'':parseInt(num)-1;
				$(this).html(h);
			}else{
				alert("不能给自己点赞哦");
			}
		})

	//为评论点赞 {"success": true, "action": "down"}
	function reply(accesstoken, reply_id) {
		var xhr = $.ajax({
			url: "https://cnodejs.org/api/v1/reply/" + reply_id + "/ups",
			type: "POST",
			async: false,
			data: {
				accesstoken: accesstoken,
			},
		});
		var result = JSON.parse(xhr.responseText);
		return result;
	}


		//回复作者和编辑主题的按钮
		$(".replysb").click(function() {
			window.location.href = 'reply.html?id=' + id + '&replyid=' + $(this).parent().attr("reply_id");
		});
		var btnhtml = '<div class="panel panel-default"><div class="panel-body"><a class="btn btn-primary" id="btn-reply" href="reply.html?id=' + id + '">回复作者</a></div></div>';

		if (user.loginname == topic.data.author.loginname) {
			btnhtml += '<div class="panel panel-default"><div class="panel-body"><a class="btn btn-primary" id="btn-reply" href="updatatopic.html?id=' + id + '">编辑主题</a></div></div>';
		}
		$(".sidebar").append(btnhtml);

		//收藏按钮显示
		var bl = topic.data.is_collect;

		function displayCollect() {
			var clhtml = bl ? '<button class="btn btn-collect" type="button">取消收藏</button>' : '<button class="btn btn-info btn-collect" type="button">收藏</button>';
			$(".topic-header h3").append(clhtml);
			$(".btn-collect").click(function() {
				collect(lgsta, id, bl);
				if (bl) {
					$(this).addClass("btn-info").html("收藏");
				} else {
					$(this).removeClass("btn-info").html("取消收藏");
				}
				bl = !bl;
			});
		}
		displayCollect();
	}
	//收藏主题&取消主题  {"success": true}
	function collect(accesstoken, topic_id, boo) {
		var url = boo ? "https://cnodejs.org/api/v1/topic_collect/de_collect" : "https://cnodejs.org/api/v1/topic_collect/collect";
		//boo为false时收藏主题，为true时取消主题
		var xhr = $.ajax({
			url: url,
			type: "POST",
			async: false,
			data: {
				accesstoken: accesstoken,
				topic_id: topic_id,
			},
		});
	}


})