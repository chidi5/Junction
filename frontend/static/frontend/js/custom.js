$("#searchinput").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#searchbtn").click();
    }
});

$(document).ready(function() {
  $('#dropdownList li').find("a").click(function(){
    
    $('#dropdown-button').html($(this).html()).append("<span class='caret'></span>");
  });
});

//scroll horizontal
var box = $(".box-inner"), x;
$(".scroll").click(function() {
  if ($(this).hasClass("scroll-forward")) {
    //x = ((box.width() / 1)) + box.scrollLeft();
    x = '+=156px';
    box.animate({
      scrollLeft: x,
    })
  } else {
    //x = ((box.width() / 1)) - box.scrollLeft();
    x = '-=156px';
    box.animate({
      scrollLeft: -x,
    })
  }
});

//play video on hover
$('.imgBx video').on('mouseover', function(event) {
  this.play();
  this.muted = true;
}).on('mouseout', function(event) {
  //this.currentTime = 0;
  this.pause();
});