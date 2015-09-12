[![webp-converter Logo](https://github.com/scionoftech/webp-converter/blob/Development/images/nlogo.gif)](https://www.npmjs.com/package/webp-converter)

[webp-converter v1.1.7](https://www.npmjs.com/package/webp-converter)

A small [node.js](http://nodejs.org) library for converting any image to webp file format or converting webp image to any image file format.


This module uses cwebp and dwebp precompiled executables of WebP Libraries for more info visit [WebP](https://developers.google.com/speed/webp/)

## How to use

  ```js

//get module
var webp=require('webp-converter');

//pass input_image(.jpeg,.pnp .....) path ,output_image(give path where to save and image file name with .webp file type extension)
webp.cwebp("nodejs_logo.jpg","output.webp","80",function(status)
	{
		//if conversion successfull status will be 'converted successfully'
		console.log(status);
	});

//pass input_image(.webp image) path ,output_image(.jpeg,.pnp .....)
webp.dwebp("nodejs_logo.webp","output.jpg",function(status)
	{
		//if conversion successfull status will be 'converted successfully'
		console.log(status);
	});

//or

//pass input_image(.jpeg,.pnp .....) path ,output_image(give path where to save and image file name with .webp file type extension)
webp.cwebp("/old/nodejs_logo.jpg","/new/output.webp","80",function(status)
	{
		//if conversion successfull status will be 'converted successfully'
		console.log(status);
	});

//pass input_image(.webp image) path ,output_image(.jpeg,.pnp .....)
webp.dwebp("/old/nodejs_logo.webp","/new/output.jpg",function(status)
	{
		//if conversion successfull status will be 'converted successfully'
		console.log(status);
	});

```

## Installation

```bash
$ npm install webp-converter
```

## License

  [MIT](LICENSE)
