$( document ).ready(function(){
  $(".side-menu-item.route").unbind("click").bind("click", transition);
  //$(".header-icon").bind("click", toggleNav);
});

function toggleNav(){
  if($(".header-icon").attr("class").indexOf("open") > -1){
    $(".side-menu").removeClass("side-menu-open");
    $(".header-icon").removeClass("open");
    $(".screen-overlay").removeClass("screen-overlay-open");
  } else {
    $(".screen-overlay").addClass("screen-overlay-open");
    $(".side-menu").addClass("side-menu-open");
    $(".header-icon").addClass("open");
  }
}

function transition(e){
  if(e.currentTarget.textContent.toLowerCase().replace(" ", "_") == "logout"){
    window.location.href = "/";
    return;
  } else if (e.currentTarget.textContent.toLowerCase().replace(" ", "_") == "home") {
    window.location.href = "/";
    return;
  }   
  else if(e.currentTarget.textContent.toLowerCase().replace(" ", "_") == "log_in") {
    window.location.href = "dashboard";
    return;
  } else if(e.currentTarget.textContent.toLowerCase().replace(" ", "_") == "sign_up") {
    window.location.href = "dashboard";
    return;
  }
  window.location.href = e.currentTarget.textContent.toLowerCase().replace(" ", "_"); // this is a super hack, but we will do this better when we start doing node stuff
}
