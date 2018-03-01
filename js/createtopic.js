$(function() {
	$.nav();
	$.msg();
	$.md();
	//新建主题的ajax函数
	function creareTopic(accesstoken, title, tab, content) {
		var xhr = $.ajax({
			url: "https://cnodejs.org/api/v1/topics",
			type: "post",
			async: false,
			data: {
				accesstoken: accesstoken,
				title: title,
				tab: tab,
				content: content,
			},
			cache: false,
		});
		var result = JSON.parse(xhr.responseText);
		return result;
	}
	//点击切换下拉菜单
	var tab = '';
	$("#tab li").click(function() {
		tab = $(this).attr("class");
		var tabhtml = $(this).children("a").html() + '<span class="caret"></span>';
		$(".tab").html(tabhtml);
	});

	$("#btn-reply").click(function() {
			if (tab == '') {
				alert("请选择版块");
				return;
			}
			var title = $("input.form-control").val();
			if (title.length <= 10) {
				alert("标题字数不足");
				return;
			}
			var at = $.session.get('accesstoken');
			// alert(at);
			var ct = $("#editormd").val();
			if (ct == '') {
				alert("内容不能为空");
				return;
			}
			var xhr = creareTopic(at, title, tab, ct);
			if (xhr.success) {
				this.disable = 'disable';
				window.location.href = 'topicdetail.html?id=' + xhr.topic_id;
			} else {
				alert("该动作每天仅限7次");
				window.location.href = 'topicdetail.html?id=' + xhr.topic_id;
			}
		})
});