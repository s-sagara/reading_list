(function(){
	try {
		var adList = headbar_ad_load.ads;
		adList.sort(function(a, b){
			if(a["rate"] < b["rate"]) return 1;
			if(a["rate"] > b["rate"]) return -1;
			return 0;
		});
		var TIME = 30000; // 広告が切り替わるまでの時間
		var fc2AdRotate = null;
		var headerLink = document.getElementById("sh_fc2blogheadbar_link_box");
		headerLink.style.overflow = "hidden";
		var ul = document.createElement("ul");
		var FC2AdRotate = function() {
			if (0 < headerLink.childNodes.length) {
				for (var i in headerLink.childNodes) {
					// 描画が詰まったときに2回来ることがあるので、ul要素があれば終了させる
					if ("UL" == headerLink.childNodes[i].tagName) return;
				}
			};
			var self = this;
			this.ad = {w:0,h:0,c:0,right:0,bottom:0,state:0};
			this.ad.mode = (!location.search)? "bottom": (function(l){
				var q = l.replace("?","").split("&");
				for (var i in q) {
					if (q[i].match(/ef\=horizontal/i)) return "right";
				}
				return "bottom";
			})(location.search);
			this.ad.active    = false;
			this.ad.maxWidth  = 0;
			this.ad.maxHeight = 0;
			this.ad.frameRate = ("right" == this.ad.mode)? 100: 60;
			this.ad.duration  = 500;
			this.ad.rotateTime= TIME + this.ad.duration;
			this.ad.frameSec = Math.ceil(1000 / this.ad.frameRate);
			var maxRate = 0;
			for (var i = adList.length - 1; i >= 0; i--) {
				var li = document.createElement("li");

				var src = adList[i]['content'].match(/<script src=['"]([^'"]*?)['"]><\/script>/);
				if (src) {
					// スクリプトタグのみの場合 scriptタグとしてDOM追加
					var script = document.createElement('script');
					script.type = "text/javascript";
					script.src = src[1];
					script.charset = 'utf-8';
					li.appendChild(script);
				} else {
					// 通常はinnerHTMLとして追加
					li.innerHTML = adList[i]["content"];
				}
				var css = "";
				if ("right" == this.ad.mode) css = "float:right;";
				li.style.cssText = css;
				ul.appendChild(li);
				if (i == 0) {
					var li = document.createElement("li");
					li.innerHTML = adList[adList.length - 1]["content"];
					li.style.cssText = css;
					ul.appendChild(li);
				};
				adList[i]["rate"] = (isNaN(adList[i]["rate"] - 0)) ? 0 : adList[i]["rate"] - 0;
				maxRate += adList[i]["rate"];
			};
			headerLink.appendChild(ul);
			var randNum = (function(min, max){
				return Math.floor( Math.random() * (max - min + 1) ) + min;
			})(0, maxRate);
			for (var i = 0; i < adList.length; i++) {
				if (randNum - adList[i]["rate"] < 0) {
					this.ad.start = i;
					break;
				};
				randNum -= adList[i]["rate"];
			};
			var t = setTimeout(function(){
				clearTimeout(t);
				self.setStyleRule();
				adList = ul.children;
				var size = self.getBoxSize(adList);
				self.ad.w = size.w;
				self.ad.h = size.h;
				for (var i in adList) {
					if ("undefined" == typeof adList[i].offsetWidth) continue;
					adList[i].style.width = self.ad.w + "px";
					adList[i].style.height = self.ad.h + "px";
					self.ad.maxWidth += self.ad.w;
					self.ad.maxHeight += self.ad.h;
				};
				headerLink.style.width = self.ad.w + "px";
				headerLink.style.height = self.ad.h + "px";
				if ("right" == self.ad.mode) {
					ul.style.width = self.ad.maxWidth + "px";
				} else {
					ul.style.height = self.ad.maxHeight + "px";
				};
				self.setDefault(
					(("right" == self.ad.mode)? self.ad.w: self.ad.h),
					self.ad.start + 1
				);
				self.startAnimation();
			}, 50);
		};
		FC2AdRotate.prototype = {
			getBoxSize: function(obj) {
				var size = {w: 0, h: 0};
				for (var i in obj) {
					if ("undefined" == typeof obj[i].offsetWidth) continue;
					if (obj[i].offsetWidth > size.w) size.w = obj[i].offsetWidth;
					if (obj[i].offsetHeight > size.h) size.h = obj[i].offsetHeight;
				};
				return size;
			},
			setStyleRule: function(obj) {
				var ulStyle = "margin:0;padding:0;list-style:none;overflow:hidden;position:absolute;bottom:0;right:0;";
				var liStyle = "white-space:nowrap;text-align:right;border:0 none;margin:0;padding:0;";
				var style  = document.createElement("style");
				style.setAttribute("name", "FC2AdRotate");
				style.setAttribute("type", "text\/css");
				var head = document.getElementsByTagName('head')[0];
				for (var i = 0; i < head.children.length; i++) {
					if ("undefined" != typeof head.children[i].tagName) {
						if ("LINK" == head.children[i].tagName || "STYLE" == head.children[i].tagName) {
							head.insertBefore(style, head.children[i]);
							break;
						}
					};
					if (i == head.children.length - 1) {
						head.appendChild(style);
					}
				};
				ulStyle = ulStyle.split(";");
				var t = setTimeout(function(){
					var s = document.styleSheets[0];
					if (s.addRule) {
						// IE
						for (var i in ulStyle) {
							if (!ulStyle[i]) continue;
							s.addRule("div#sh_fc2blogheadbar_link_box ul", ulStyle[i]);
						};
						s.addRule("div#sh_fc2blogheadbar_link_box li", liStyle);
					} else {
						var css = "";
						for (var i in ulStyle) {
							if (!ulStyle[i]) continue;
							css += ulStyle[i] + ";";
						};
						s.insertRule("#sh_fc2blogheadbar_link_box ul{" + css + "}", s.cssRules.length);
						s.insertRule("#sh_fc2blogheadbar_link_box li{" + liStyle + "}", s.cssRules.length);
					};
					headerLink.style.visibility = "visible";
					clearTimeout(t);
				}, 40);
			},
			setDefault: function(cssVal, num) {
				this.setStyle(cssVal * num);
			},
			startAnimation: function() {
				var self = this;
				this.ad.c = this.ad.start + 1;
				var t = setInterval(function(){
					if (adList.length - 1 <= self.ad.c) self.ad.c = 0;
					self.draw();
				}, this.ad.rotateTime);
			},
			draw: function() {
				var self = this;
				var cssVal = ("right" == this.ad.mode)? self.ad.w: self.ad.h;
				this.ad.start = +new Date();
				var t = setInterval(function(){
					self.ad.active = true;
					var now = +new Date();
					var prg = (now - self.ad.start) / self.ad.duration;
					
					if (prg >= 1) {
						self.ad.active = false;
						self.ad.state = 1;
						clearInterval(t);
						self.setStyle(cssVal * (self.ad.c + 1));
					} else {
						self.ad.state = prg; 
						self.setStyle(self.easing((now - self.ad.start) / 1000, cssVal * self.ad.c, cssVal * self.ad.state, self.ad.duration / 1000));
					};
					
					if (!self.ad.active) self.ad.c++;
				}, this.ad.frameSec);
			},
			setStyle: function(val) {
				ul.style[this.ad.mode] = -val + "px";
			},
			easing: function(t, b, c, d) {
				return -c/2 *(Math.cos(Math.PI*t/d) - 1) + b;
			}
		};
		fc2AdRotate = new FC2AdRotate();
	} catch(ex) {
	}
})();

