$('body').addClass('js');
$('.nav-toggle').on('click', function(e) {
  e.preventDefault();
  $('.nav-primary').find('ul').toggleClass('open');
});

var menu = $(".menu-icon");

menu.on("click", function(e) {
  e.preventDefault();
  var header = $(".site-header");
  if(header.css("margin-left") != "0px") {
    header.add(".main-wrapper").animate({
      "margin-left": 0
    }, 200);
  } else {
    header.add(".main-wrapper").animate({
      "margin-left": "13.125em"
    }, 200);
  }

});
