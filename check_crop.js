const Jimp = require("jimp");
Jimp.read("frontend-web/public/logo.png").then(image => {
  let minX = image.bitmap.width, minY = image.bitmap.height, maxX = 0, maxY = 0;
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    if (r < 240 || g < 240 || b < 240) { // strictly non-white
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  });
  console.log(JSON.stringify({minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY}));
});
