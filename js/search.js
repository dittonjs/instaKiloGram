$(document).ready(function(){
  $(".save-search-button").unbind("click").bind("click", saveSearch);
});

function saveSearch(e){
  console.log(e);
}

function search(e){
  console.log(e);
}