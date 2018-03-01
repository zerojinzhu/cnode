$(function() {
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
})