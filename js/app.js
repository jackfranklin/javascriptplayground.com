document.body.classList.add('js');

var navToggle = document.querySelector('.nav-toggle');

navToggle.addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('.nav-primary ul').classList.toggle('open');
});

var searchForm = document.querySelector('.search-form');

// code below is for the archives page only
// so we won't execute it if we can't find the search form
if (searchForm) {

  searchForm.addEventListener('submit', function(e) {
    // we don't want the form to actually submit
    e.preventDefault();
  });

  var searchBox = document.querySelector('.search-form input');

  var allPosts = document.querySelectorAll('.archives h4 a');

  searchBox.addEventListener('keyup', function(e) {
    var searchValue = searchBox.value.toLowerCase();
    Array.prototype.forEach.call(allPosts, function(post) {
      if (post.text.toLowerCase().indexOf(searchValue) > -1) {
        post.parentElement.parentElement.style.display = 'block';
      } else {
        post.parentElement.parentElement.style.display = 'none';
      }
    });
  });
}
