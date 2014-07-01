
$(function(){
  function set_left_nav() {
    var left_height = $('.left-nav').css('height')
    var right_height = $('.main-content').css('height');
    if (parseInt(left_height) < parseInt(right_height)) {
      $('.left-nav').css('height', right_height);
    };
  }

  set_left_nav();

  // async code for BaiDu Analytics
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?6a07065c341124e299ee12703d1c6ed0";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  })();
  
  // Woopra Code
  (function(){
      var t,i,e,n=window,o=document,a=arguments,s="script",r=["config","track","identify","visit","push","call"],c=function(){var t,i=this;for(i._e=[],t=0;r.length>t;t++)(function(t){i[t]=function(){return i._e.push([t].concat(Array.prototype.slice.call(arguments,0))),i}})(r[t])};for(n._w=n._w||{},t=0;a.length>t;t++)n._w[a[t]]=n[a[t]]=n[a[t]]||new c;i=o.createElement(s),i.async=1,i.src="//static.woopra.com/js/w.js",e=o.getElementsByTagName(s)[0],e.parentNode.insertBefore(i,e)
  })("woopra");
  
  woopra.config({
      domain: 'agilejzl.github.io'
  });
  woopra.track();
  
  // async code for Google Analytics
  (function(i,s,o,g,r,a,m){
    i['GoogleAnalyticsObject']=r;
    i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();
      a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];
      a.async=1;
      a.src=g;
      m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-51010960-1', 'agilejzl.github.io');
  ga('send', 'pageview');
});
