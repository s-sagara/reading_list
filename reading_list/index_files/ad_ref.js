(function(){
	var ADHB = function() {
		this.prefix = "adhb_";
		this.c_id   = "id";
		this.c_rf   = "rf";
		this.c_st   = "step";
		this.host   = "admin.blog.fc2.com";
		this.url    = "https://" + this.host + "/ad_click_recieve.php";
		this.values = [];
		if ("object" != typeof console) {
			console = {
				log: function(){ return; }
			};
		};
		this.ie = (function(){
			var undef, v = 3, div = document.createElement('div');
			while (
				div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
				div.getElementsByTagName('i')[0]
			);
			return v > 4 ? v : undef;
		}());
	};
	ADHB.prototype = {
		click: function(e) {
			if (!e) return;
			var elm = (e.target || e.srcElement);
			while (elm) {
				if (elm.tagName == "DIV") {
					if ("sh_fc2blogheadbar_link_box" == elm.getAttribute("id")) {
						try {
							var tgt = document.getElementsByName("adhb")[0];
							var val = escape(tgt.getAttribute("value"));
							var url = escape(location.href);
							_adhb.sendJsonp({method: "click", adhb_id: val, adhb_rf: url});
							break;
						} catch (ex) {
						
						}
					};
				};
				elm = elm.parentNode;
			};
			return false;
		},
		search: function() {
			var reg = [this.prefix + this.c_id + "=", this.prefix + this.c_rf + "=", this.prefix + this.c_st + "="];
			var cookie = (document.cookie).replace(/ /g, "");
			cookie = cookie.split(";");
			if (cookie.length < 1) return false;
			var paramStr = new Object();
			for (var i = 0; i < cookie.length; i++) {
				for (var m = 0; m < reg.length; m ++) {
					var regObj = new RegExp(reg[m]);
					if (0 > cookie[i].search(regObj)) continue;
					var hash = cookie[i].split("=");
					var key = hash[0];
					var val = hash[1];
					paramStr[key] = val;
					break;
				};
			};
			return (paramStr)? paramStr: false;
		},
		send: function(val) {
			var xhr = this.createXHR();
			xhr.onreadystatechange = function() {
				 if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						// success
					} else {
						// error
					};
				};
			};
			var param = "";
			if ("object" == typeof val) {
				for (var i in val) {
					param += i + "=" + val[i] + "&";
				};
			};
			param += "callback=_adhb.cbh";
			var url = this.url + "?" + param;
			
			xhr.open("get", url, true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send();
		},
		sendJsonp: function(val) {
			var param = "";
			if ("object" == typeof val) {
				for (var i in val) {
					param += i + "=" + val[i] + "&";
				};
			};
			param += "callback=_adhb.cbh";
			var url = this.url + "?" + param;
			var elm = document.createElement("script");
			elm.setAttribute("name", "adhb");
			elm.setAttribute("src", url);
			var body = document.getElementsByTagName("body")[0];
			body.appendChild(elm);
			var time = setTimeout(function(){
				body.removeChild(elm);
			}, 50);
		},
		cbh: function(data) {
			console.log(data);
		},
		createXHR: function() {
			if(XMLHttpRequest){return new XMLHttpRequest()}
			if(ActiveXObject){
				var a = "Msxml2.XMLHTTP.", b = [a + "6.0", a + "3.0", "Microsoft.XMLHTTP"];
				for (var i = 0; i < b.length; i++) {
					try {
						return new ActiveXObject(b[i])
					} catch (ex) {}
				};
			};
			return false;
		}
	};
	var time = setTimeout(function(){
		_adhb = new ADHB();
		var param = _adhb.search();
		if (param) {
			if (param.adhb_id && param.adhb_rf && _adhb.host == location.host) {
				_adhb.send({'method': "add"});
			}
		};
		try{
			document.addEventListener("mousedown", _adhb.click, false);
		} catch (e) {
			document.attachEvent("onmousedown", _adhb.click);
		};
		clearTimeout(time);
	}, 100);
})();
