
// code for BaiDu Analytics
var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + 
  "hm.baidu.com/h.js%3F6a07065c341124e299ee12703d1c6ed0' type='text/javascript'%3E%3C/script%3E")
);

$(function(){
  function set_left_nav() {
    var left_height = $('.left-nav').css('height')
    var right_height = $('.main-content').css('height');
    if (parseInt(left_height) < parseInt(right_height)) {
      $('.left-nav').css('height', right_height);
    };
  }

  set_left_nav();
  
  // code for Google Analytics
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
