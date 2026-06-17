const Jimp = require("jimp");

Jimp.read("logo.png")
  .then(image => {
    return image.autocrop().write("frontend-web/public/logo.png");
  })
  .then(() => {
    console.log("Cropped successfully to frontend-web/public/logo.png");
  })
  .catch(err => {
    console.error("Error cropping image:", err);
  });
