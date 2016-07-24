(function() {
  'use strict';
  // const lwip = require('lwip');
  const packageJSON = require('./package.json');
  const program = require('commander');
  // const image = require('get-image-data');
  const R = require('ramda');
  const request = require('request');
  const getPixels = require("get-pixels")

  program
    .version(packageJSON.version)
    .option('-i, --image <image>', 'Add an image')
    .parse(process.argv);

  console.log(program.image);
  if (!program.image) {
    throw new Error("No Image Provided");
    process.exit(1);
  }

  getPixels(program.image, function(err, pixels) {
    if(err) {
      console.log("Bad image path");
      return;
    }

    // const pixelString = R.compose(R.flatten,R.map(function(pixel){
    //   return R.map(String.fromCharCode)(R.take(3)(pixel));
    // }),R.splitEvery(3))(pixels.data);
    const p = new Uint8ClampedArray(pixels.data);
    const pa = Array.prototype.slice.call(p);

    const pixelString = R.compose(R.join(''),R.flatten,R.map((a)=>{
      return R.compose(R.map(String.fromCharCode),R.take(3))(a);
    }),R.splitEvery(4))(pa);

    console.log(pixelString);

    request.post({
      url: "http://localhost:3000",
      body: pixelString,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  });

  function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }
    return ab;
  }

  // image(program.image, function(error, info) {
  //   var height = info.height;
  //   var width = info.width;
  //   var data = info.data;
  // });

  // lwip.open('image.jpg', function(err, image) {
  //   image.batch()
  //     .crop(25, 20)
  //     .writeFile('output.jpg', function(err) {
  //       // check err...
  //       // done.
  //     });
  // });

})();
