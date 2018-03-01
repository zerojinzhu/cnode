$(function() {
	$.nav();
	$.msg();
	$.md();
	//编辑主题
	// $.session.set('accesstoken', 'ccac53fc-49a0-4307-b8cc-b9cf4ea60bb8');
	var at = $.session.get('accesstoken');
	var topic_id = $.Request("id");
	function getDetail(id,mdrender,accesstoken){
		var xhr = $.ajax({
			url: "https://cnodejs.org/api/v1/topic/" + id,
			type: "GET",
			async: false,
			data:{
				mdrender:mdrender,
				accesstoken:accesstoken
			},
		});
		var result = JSON.parse(xhr.responseText);
		return result;
	}
	var topic = getDetail(topic_id,false,at);
	
	//点击切换下拉菜单

	var tab = topic.data.tab;
	var tabhtml = $("#tab li."+ tab).children("a").html() + '<span class="caret"></span>';
	$("button.tab").html(tabhtml);

	$("#tab li").click(function() {
		tab = $(this).attr("class");
		tabhtml = $(this).children("a").html() + '<span class="caret"></span>';
		$(".tab").html(tabhtml);
	});

	$("input.form-control").val(topic.data.title);
	$("#editormd").val(topic.data.content);
	$("#btn-reply").click(function() {
			var title = $("input.form-control").val();
			var ct = $("#editormd").val();
			var xhr = updateTopic(at, topic_id, title, tab, ct);
			if (xhr.success) {
				window.location.href = '../html/topicdetail.html?id=' + xhr.topic_id;
			}
		})
	function updateTopic(accesstoken, topic_id, title, tab, content) {
		var xhr = $.ajax({
			url: "https://cnodejs.org/api/v1/topics/update",
			type: "POST",
			async: false,
			data: {
				accesstoken: accesstoken,
				topic_id: topic_id,
				title: title,
				tab: tab,
				content: content,
			},
		});
		var result = JSON.parse(xhr.responseText);
		return result;
	}	
});