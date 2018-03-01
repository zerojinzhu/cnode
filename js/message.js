$(function(){
	$.nav();
	$.msg();
	// 获取session
	$.session.set('accesstoken','ccac53fc-49a0-4307-b8cc-b9cf4ea60bb8');
	var lgsta = $.session.get('accesstoken');
	//获取已读和未读消息
	function message(accesstoken,mdrender){
		var xhr = $.ajax({
			url: "https://cnodejs.org/api/v1/messages",
			type: "get",
			async: false,
			data:{
				accesstoken:accesstoken,
			},
		});
		var result = JSON.parse(xhr.responseText);
		return result;
	}
	var xhr = message(lgsta);
	var newhtml = '',oldhtml = '';
	var len = xhr.data.hasnot_read_messages.length;
	if(len==0) {
		newhtml = '<div class="panel panel-default"><div class="panel-heading">新消息</div><div class="panel-body"><p>无消息</p></div></div>';
	}
	else {
		newhtml = '<ul class="list-group"><li class="list-group-item reply-header">新消息</li>';
		for(var i=0;i<len;i++){
			newhtml += '<li class="list-group-item"><a href="personinfo.html?loginname=' + xhr.data.hasnot_read_messages[i].author.loginname + '">' + xhr.data.hasnot_read_messages[i].author.loginname + '</a>回复了你的话题<a href="topicdetail.html?id=' + xhr.data.hasnot_read_messages[i].topic.id + '">' + xhr.data.hasnot_read_messages[i].topic.title + '</a></li>';
		}
		newhtml += '</ul>';		
	}
	
	len = xhr.data.has_read_messages.length;
	if(len==0) {
		oldhtml = '<div class="panel panel-default"><div class="panel-heading">新消息</div><div class="panel-body"><p>无消息</p></div></div>';
	}
	else {
		oldhtml = '<ul class="list-group"><li class="list-group-item reply-header">新消息</li>';
		for(i=0;i<len;i++){
			oldhtml += '<li class="list-group-item"><a href="personinfo.html?loginname=' + xhr.data.has_read_messages[i].author.loginname + '">' + xhr.data.has_read_messages[i].author.loginname + '</a>回复了你的话题<a href="topicdetail.html?id=' + xhr.data.has_read_messages[i].topic.id + '">' + xhr.data.has_read_messages[i].topic.title + '</a></li>';

		}
		oldhtml += '</ul>';		
	}
	newhtml += oldhtml;
	$("#main-contain").append(newhtml);
	
})
