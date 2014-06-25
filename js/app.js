$('body').addClass('js');
$('.nav-toggle').on('click', function(e) {
  e.preventDefault();
  $('.nav-primary').find('ul').toggleClass('open');
});


var searchBox = $("input[name='searchterm']");
var allPosts = $(".archives h4 a");

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
