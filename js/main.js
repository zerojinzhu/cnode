$(function() {
	$.nav();
	$.msg();
	//定义一个函数，获取每个标题
	var $refresh = function(page, tab, limit, mdrender) {
		var result = $.ajax({
			url: "https://cnodejs.org/api/v1/topics",
			type: "GET",
			dataType: "json",
			async: false,
			data: {
				page: page,
				tab: tab,
				limit: limit,
				mdrender: mdrender,
			},
		});
		var xhr = JSON.parse(result.responseText);
		if ($("#content tbody").html() != '') {
			$("#content tbody").html("");
		}
		var html = '';
		var tab = '',
			cl = '';
		var ar = {
			"share": "分享",
			"ask": "问答",
			"job": "招聘",
			"dev": ""
		}
		for (var i = 0; i < 45; i++) {
			if (xhr.data[i].top) {
				tab = "置顶";
				cl = "label-primary"
			} else if (xhr.data[i].good) {
				tab = "精华";
				cl = "label-primary"
			} else {
				tab = ar[xhr.data[i].tab];
				cl = "label-default"
			}
			html += "<tr><td><span class='reply'>" + xhr.data[i].reply_count + "</span><span class='label " + cl + "'>" + tab + "</span><a href='topicdetail.html?id=" + xhr.data[i].id + "' class='title'>" + xhr.data[i].title + "</a><span class='time'>" + xhr.data[i].last_reply_at + "</span></td></tr>";
		}
		$("#content tbody").append(html);
	};

	//添加翻页按钮
	function $judgepage(page, tab) {
		var pg = parseInt(page);
		//三木判断是不是第一页，是的话就上一页的按钮不能用
		var pghtml = (pg == 1) ? '<ul class="pagination" id="page"><li><a disabled="disabled">&laquo;</a></li>' : '<ul class="pagination" id="page"><li><a href="node.html?tab=' + tab + '&page=' + (pg - 1) + '">&laquo;</a></li>';
		// 写页数的页按钮5个，判断是不是第一二个，是的话排序是12345
		//不是的话，排序是n-2,n-1,n,n+1,n+2
		var n = (pg == 1 || pg == 2) ? 6 : pg + 3;
		var j = (pg == 1 || pg == 2) ? 1 : pg - 2;
		var cl = '';
		for (; j < n; j++) {
			cl = (j == pg) ? 'active' : '';
			pghtml += '<li class = "' + cl + '"><a href="node.html?tab=' + tab + '&page=' + j + '">' + j + '</a></li>';
		}
		pghtml += '<li><a href="node.html?tab=' + tab + '&page=' + (pg + 1) + '">&raquo;</a></li></ul>';
		$("#main-contain").append(pghtml);
	}

	//判断tab
	function $judgetab(tab) {
		var ul = $("#tab");
		ul.children("li[id=" + tab + "]").addClass("active");
	}

	//调用函数将首页渲染,（加title和page）
	function main() {
		//得到页数和tab
		var $tab = $.Request("tab");
		$tab = ($tab == null) ? 'all' : $tab;
		var $page = $.Request("page");
		$page = ($page == null) ? 1 : $page;
		$refresh($page, $tab, 45, true);
		$judgepage($page, $tab);
		$judgetab($tab);
	}
	main();

	//登录验证5ea05118-1397-4b87-96b0-4c13902691eb
	var xhr = $.login();
	if (xhr != null) {
		loginSuc(xhr);
	} else {
		$(".btn-login").click(function() {
			at = $(".password").val();
			xhr = $.login(at);
			if (xhr != null) {
				$.session.set('accesstoken', at);
				loginSuc(xhr);
			} else if (boo) {
				$(".password").after('<span class="help-block">你输入的信息是错误的</span>');
				boo = false;
			}
		})
	}

	function loginSuc(user) {
		var html = '<div class="panel panel-default"><div class="panel-heading">个人信息</div><div class="panel-body"><p><a class="user_avatar" href="personinfo.html?loginname=' + user.loginname + '"><img src="' + user.avatar_url + '"></a><a href="personinfo.html?loginname=' + user.loginname + '">' + user.loginname + '</a></p></div></div><div class="panel panel-default"><div class="panel-body"><a class="btn btn-primary" id="btn-reply" href="createtopic.html">创建主题</a></div></div>';
		$(".sidebar").html("").append(html);
	}

});


// 添加数据 $.session.set('key', 'value')
// 删除数据 $.session.remove('key');
// 获取数据 $.session.get('key');
// 清除数据 $.session.clear();