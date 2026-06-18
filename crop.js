const Jimp = require("jimp");

Jimp.read("logo.png")
  .then(image => {
    // Autocrop with a tolerance of 5% (0.05) to catch JPEG compression artifacts in white padding
    return image.autocrop(0.05, false).writeAsync("frontend-web/public/logo-v4.png");
  })
  .then(() => {
    console.log("Cropped successfully to frontend-web/public/logo-v4.png");
  })
  .catch(err => {
    console.error("Error cropping image:", err);
  });
