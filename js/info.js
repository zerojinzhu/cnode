$(function(){
	// 获取session
	$.nav();
	$.msg();	
	$.session.set('accesstoken','ccac53fc-49a0-4307-b8cc-b9cf4ea60bb8');
	var lgsta = $.session.get('accesstoken');

	var lgname = $.Request("loginname");
	var user = $.userDetail(lgname);
	var ifhtml = '';
	ifhtml=  '<div class="panel panel-default info"><div class="panel-heading">个人信息</div><div class="panel-body"><p><img style="width: 40px;height: 40px;margin-right: 10px;" src="' + user.data.avatar_url +'">' + user.data.loginname + '</p><p><a href="collect.html?loginname=' + lgname + '">收藏</a></p><p>积分：' + user.data.score + '</p><p>创建时间：' + user.data.create_at + '</p></div></div>';

	
	var tphtml = '',rphtml = '';
	var n;
	var len = user.data.recent_topics.length;

	if( len==0){
		tphtml += '<div class="panel panel-default"><div class="panel-heading">最近创建的话题</div><div class="panel-body"><p>无话题</p></div></div>';
	}
	else{
		n = (len>4)?3:len;
		tphtml = '<ul class="list-group"><li class="list-group-item reply-header">最近创建的话题</li>';
		for(var i=0;i<n;i++){
			tphtml += '<li class="list-group-item"><a href="topicdetail.html?id=' + user.data.recent_topics[i].id + '" class="title">' + user.data.recent_topics[i].title + '</a><span class="time">' + user.data.recent_topics[i].last_reply_at + '</span></li>'
		}
		tphtml += '<li class="list-group-item"><a class="btn btn-link" href = "recent_topics.html?loginname=' + lgname + '">查看更多</a></li></ul>';
	}
	

	var len = user.data.recent_replies.length;
	if( len==0){
		rphtml += '<div class="panel panel-default"><div class="panel-heading">最近创建的话题</div><div class="panel-body"><p>无话题</p></div></div>';
	}
	else{
		n = (len>4)?3:len;
		rphtml = '<ul class="list-group"><li class="list-group-item reply-header">最近参与的话题</li>';
		for(var i=0;i<n;i++){
			rphtml += '<li class="list-group-item"><a href="topicdetail.html?id=' + user.data.recent_replies[i].id + '" class="title">' + user.data.recent_replies[i].title + '</a><span class="time">' + user.data.recent_replies[i].last_reply_at + '</span></li>'
		}
		var href = 'topic_replies.html?loginname='+lgname ;
		rphtml += '<li class="list-group-item"><a class="btn btn-link" href="' + href + '">查看更多</a></li></ul>';
	}
	ifhtml += tphtml + rphtml;
	$("#main-contain").append(ifhtml); 
})
