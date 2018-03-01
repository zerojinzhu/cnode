//获取URL的参数和设置参数
(function($) {
	$.extend({
		Request: function(m) {
			var sValue = location.search.match(new RegExp("[\?\&]" + m + "=([^\&]*)(\&?)", "i"));
			return sValue ? sValue[1] : sValue;
		},
		UrlUpdateParams: function(url, name, value) {
			var r = url;
			if (r != null && r != 'undefined' && r != "") {
				value = encodeURIComponent(value);
				var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
				var tmp = name + "=" + value;
				if (url.match(reg) != null) {
					r = url.replace(eval(reg), tmp);
				} else {
					if (url.match("[\?]")) {
						r = url + "&" + tmp;
					} else {
						r = url + "?" + tmp;
					}
				}
			}
			return r;
		}
	});
})(jQuery);

(function($) {
	$.userDetail = function(loginname) {
			var xhr = $.ajax({
				url: "https://cnodejs.org/api/v1/user/" + loginname,
				type: "get",
				async: false,
			});
			var result = JSON.parse(xhr.responseText);
			return result;
		},
		$.msg = function() {
			// $.session.set('accesstoken', 'ccac53fc-49a0-4307-b8cc-b9cf4ea60bb8');
			var at = $.session.get('accesstoken');
			if ($.login(at) == null) return;
			var xhr = $.ajax({
				url: "https://cnodejs.org/api/v1/message/count",
				type: "get",
				async: false,
				data: {
					accesstoken: at,
				},
			});
			var count = JSON.parse(xhr.responseText).data;
			if (count != 0) {
				//未读消息数显示
				//点击未读消息标记为已读
				$(".msg").after('<li><span class="badge">' + count + '</span></li>')
					.click(function() {
						$.ajax({
							url: "https://cnodejs.org/api/v1/message/mark_all",
							type: "post",
							async: false,
							data: {
								accesstoken: at,
							},
						});
						$("span").remove(".badge");
					});
			}
		},
		$.md = function() {
			//处理markdown
			var testEditor;
			testEditor = $(function() {
				editormd("test-editormd", {
					width: "90%",
					height: 500,
					//markdown : md,
					codeFold: true,
					syncScrolling: "single",
					//你的lib目录的路径
					path: "../js/editor.md-master/lib/",
					imageUpload: false, //关闭图片上传功能
					/*  theme: "dark",//工具栏主题
					previewTheme: "dark",//预览主题
					editorTheme: "pastel-on-dark",//编辑主题 */
					emoji: false,
					taskList: true,
					tocm: true, // Using [TOCM]
					tex: true, // 开启科学公式TeX语言支持，默认关闭
					flowChart: true, // 开启流程图支持，默认关闭
					sequenceDiagram: true, // 开启时序/序列图支持，默认关闭,
					//这个配置在simple.html中并没有，但是为了能够提交表单，使用这个配置可以让构造出来的HTML代码直接在第二个隐藏的textarea域中，方便post提交表单。
					saveHTMLToTextarea: true
				});
			});
		},
		$.login = function(at) {
			var access = $.session.get('accesstoken');
			if(arguments[0]) {
				access = arguments[0];
			}
			var xhr = $.ajax({
				url: "https://cnodejs.org/api/v1/accesstoken",
				type: "post",
				dataType: "json",
				async: false,
				cache: false,
				data: {
					accesstoken: access,
				},
			});
			var result = JSON.parse(xhr.responseText);
			if (result.success != true) return null;
			return result;
		},
		$.nav = function() {
			var xhr = $.login();
			if (xhr != null) {
				$("li.li-login").remove();
				var html = '<li class="msg"><a href="message.html">未读消息</a></li><li class="signout"><a href="">退出</a></li>';
				$(".main").append(html);
				$("li.signout a").click(function() {
					$.session.clear();
					var hr = window.location.href;
					window.location.href = hr;
				})
			}
		}
})(jQuery);