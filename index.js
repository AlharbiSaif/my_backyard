


//register service worker
if ('serviceWorker' in navigator) {

  navigator.serviceWorker
      .register('/my_backyard/sw.js')
      .then(function (swReg) {
        console.log('Service Worker is registered', swReg);
      })
      .catch(function (error) {
        console.error('Service Worker Error', error);
      });
}

//it request permission in browser
if (Notification.requestPermission(result => {

})){}

$(document).ready(function(){
  $("img").click(function(){
    $(this).hide();
  });
});
