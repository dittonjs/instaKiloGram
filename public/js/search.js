// $(document).ready(function(){
//   $(".save-search-button").unbind("click").bind("click", saveSearch);
//   $(".search-field").unbind("keypress").bind("keypress", search);
// });

function saveSearch(e){
  var text = $(".search-field").val();
  if(text.length == 0) return;
  $(".saved-searches").append("<div class='saved-search-label saved-search'>You saved a search named "+text+"</div>");
  $(".saved-search").unbind("click").bind("click", openSavedSearch)
}

function search(e){
  var text = $(".search-field").val();
  if(text && text.length){
    window.location.href = "search?content=" + text;
  }
}

function openSavedSearch(node){
  var text = node.textContent;
  if(text && text.length){
    window.location.href = "search?content=" + text;
  }
}