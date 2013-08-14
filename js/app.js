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

var searchBox = $("input[name='searchterm']");
var allPosts = $(".archives h4 a");
console.log(allPosts);

searchBox.on("keyup", function(e) {
  var searchValue = this.value.toLowerCase();
  console.log(searchValue);
  allPosts.each(function() {
    var self = $(this);
    if(self.text().toLowerCase().indexOf(searchValue) > -1) {
      self.parents("li").show();
    } else {
      self.parents("li").hide();
    }
  });
});
