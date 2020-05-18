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
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/my_backyard/sw.js');
  });
}
