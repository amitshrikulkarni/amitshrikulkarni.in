$(function() {
  
  var postURLs,
      isFetchingPosts = false,
      shouldFetchPosts = true,
      postsToLoad = $(".blog-posts").children().length,
      loadNewPostsThreshold = 3000;
  
  // Load the JSON file containing all URLs
  $.getJSON('/all-posts.json', function(data) {
    postURLs = data["posts"];
    
    // If there aren't any more posts available to load than already visible, disable fetching
    if (postURLs.length <= postsToLoad)
      disableFetching();
  });

  // If there's no spinner, it's not a page where posts should be fetched
  if ($(".infinite-spinner").length < 1)
    shouldFetchPosts = false;

  // Are we close to the end of the page? If we are, load more posts
  $('#load-more-posts').on('click', function(e){
    if (!shouldFetchPosts || isFetchingPosts) return;
      fetchPosts();
    });
  
  // Fetch a chunk of posts
  function fetchPosts() {
    // Exit if postURLs haven't been loaded
    if (!postURLs) return;
    
    isFetchingPosts = true;
    
    // Load as many posts as there were present on the page when it loaded
    // After successfully loading a post, load the next one
    var loadedPosts = 0,
        postCount = $(".blog-posts").children().length,
        callback = function() {
          loadedPosts++;
          var postIndex = postCount + loadedPosts;
          
          if (postIndex > postURLs.length-1) {
            disableFetching();
            return;
          }
          
          if (loadedPosts < postsToLoad) {
            fetchPostWithIndex(postIndex, callback);
          } else {
            isFetchingPosts = false;
          }
        };

    fetchPostWithIndex(postCount + loadedPosts, callback);
  }

  function fetchPostWithIndex(index, callback) {
    var postURL = postURLs[index];

    $.get(postURL, function(data) {
      $(data).find(".post").appendTo(".blog-posts");
      callback();
    });
  }
  
  function disableFetching() {
    shouldFetchPosts = false;
    isFetchingPosts = false;
    $(".infinite-spinner").fadeOut();
  }

});