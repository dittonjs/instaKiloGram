$(document).ready(function(){
  $(".save-search-button").unbind("click").bind("click", saveSearch);
  $(".search-field").unbind("keypress").bind("keypress", search);
});

function saveSearch(e){
  e.preventDefault();
  var text = $(".search-field").val();
  if(text.length == 0) return;
  $(".saved-searches").append("<div class='saved-search-label saved-search'>You saved a search named "+text+"</div>")
  console.log(e);
}

function search(e){
  if(e.keyCode == 13){  
    var text = $(".search-field").val();
    $(".results-panel").append("<div class='results-label search-result'>This is what would show up if you searched for "+text+"</div>")
  } 
}