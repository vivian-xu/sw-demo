
console.log('main js!!');
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js',  {scope: './'})
    .then(reg => {
      if (reg.installing) {
        console.log('SW installing');
      } else if (reg.waiting) {
        console.log('SW waiting');
      } else if (reg.active) {
        console.log('SW active!', reg);
      }

      // forced update
      // if (localStorage.getItem('sw_version') !== version) {
      //     reg.update().then(function () {
      //         localStorage.setItem('sw_version', version)
      //     });
      // }
    })
    .catch(err => console.log('NO!! Error!!!', err));
}
window.addEventListener('DOMContentLoaded', function() {
  const wrapDom = document.querySelector('#imgsWrap');

  function addImg(src) {
    const img = new Image();
    img.src = src;
    wrapDom.appendChild(img);
  }

  const imgList = ['./pics/cat.jpg', './pics/dog.jpg'];
  imgList.forEach((item) => {
    addImg(item);
  });
});
