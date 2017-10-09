var headbar_ad_load = headbar_ad_load || function(){

  // jsを追加
  var appendScript = function(url){
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = url;
    script.charset = 'utf-8';
    var target = arguments.length >= 2 ? arguments[1] : document.body;
    target.appendChild(script);
  };

  return {
    // 広告情報読み込み
    loadAds: function(){
      if (headbar_ad_load.ads) {
        return ;
      }
      var genre = 0;       // ジャンル
      var scripts = document.getElementsByTagName('script');
      for (var i = 0;i < scripts.length;i++) {
        if (!scripts[i].src || !scripts[i].src.match(/headbar_ad_load.js/)) {
          continue ;
        }
        var matches = scripts[i].src.match(/genre=(\d+)(&|$)/);
        if (matches && matches.length == 3) {
          genre = matches[1];
          break;
        }
      }
      var time = Math.round((new Date().getTime()/1000)/(60*60*24));  // 24時間毎のタイムスタンプ
      appendScript('//blog-imgs-1.fc2.com/js/blog/headbar_ad/' + genre + '.js?t=' + time);
    },
    // ローテーション用JSの読み込み
    loadRotateScript: function(ads){
      headbar_ad_load.ads = ads;
      appendScript('//static.fc2.com/js/blog/headbar_ad_rotate.js?20140612');
    },
    // 取得した広告情報
    ads: null
  };
}();

// 広告をロード
headbar_ad_load.loadAds();

