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
    })
    .catch(err => console.log('NO!! Error!!!', err));
}
function addImg(src) {
  const img = new Image();
  img.src = src;
  document.body.appendChild(img);
}

const imgList = ['./pics/cat.jpg', './pics/dog.jpg'];

setTimeout(() => {
  imgList.forEach((item) => {
    addImg(item);
  });
}, 0);