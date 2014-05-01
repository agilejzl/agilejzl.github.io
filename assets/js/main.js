
$(function(){
  function set_left_nav() {
    var left_height = $('.left-nav').css('height')
    var right_height = $('.main-content').css('height');
    if (parseInt(left_height) < parseInt(right_height)) {
      $('.left-nav').css('height', right_height);
    };
  }

  set_left_nav();
});