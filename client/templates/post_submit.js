(function(){
  var editor;

Template.post_submit.events = {
  'click input[type=submit]': function(e){
    e.preventDefault();
    if(!Meteor.user()){
      throwError('You must be logged in.');
      return false;
    }

    var title= $('#title').val();
    var url = $('#url').val();
    var body = $('#body').val();

    var postId = Posts.insert({
        headline: title
      , url: url
      , body: editor.exportFile()
      , user_id: Meteor.user()._id
      , author: Meteor.user().username
      , submitted: new Date().getTime()
      , votes: 0
      , comments: 0
      , score: 0
    });
    var post = Posts.findOne(postId);

    Meteor.call('upvotePost', postId);

    Session.set('selected_post', post);

    trackEvent("new post", {'post ID': postId});

    // Session.set('state', 'view_post');
    Router.navigate('posts/'+postId, {trigger: true});
  }

  ,'click .get-title-link': function(e){
    e.preventDefault();
    var url=$("#url").val();
    $(".get-title-link").addClass("loading");
    if(url){
      $.get(url, function(response){
          if ((suggestedTitle=((/<title>(.*?)<\/title>/m).exec(response.responseText))) != null){
              $("#title").val(suggestedTitle[1]);
          }else{
              alert("Sorry, couldn't find a title...");
          } 
          $(".get-title-link").removeClass("loading");
       });  
    }else{
      alert("Please fill in an URL first!");
    }
  }
};

Template.post_submit.rendered = function(){
  editor= new EpicEditor(EpicEditorOptions).load();
}
})();