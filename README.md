[![webp-converter Logo](images/nlogo.gif)](https://www.npmjs.com/package/webp-converter)

[webp-converter v2.1.0](https://www.npmjs.com/package/webp-converter)

A small [node.js](http://nodejs.org) library for converting any image to webp file format or converting webp image to any image file format.


This module uses cwebp and dwebp precompiled executables of WebP Libraries for more info visit [WebP](https://developers.google.com/speed/webp)

For converting other images format to webp please read this documention [cwebp Encoder](https://developers.google.com/speed/webp/docs/cwebp)

For converting webp image to other image format please read this documention [dwebp Encoder](https://developers.google.com/speed/webp/docs/dwebp)

For converting gif image to webp please read this documention [gif2webp Converter](https://developers.google.com/speed/webp/docs/gif2webp)


## How to use

  ```js

//get module
var webp=require('webp-converter');

//pass input_image(.jpeg,.pnp .....) path ,output_image(give path where to save and image file name with .webp extension)
webp.cwebp("nodejs_logo.jpg","nodejs_logo.webp","-q 80",function(status)
	{
		//if conversion successfull status will be 'converted successfully'
		console.log(status);
	});

//pass input_image(.webp image) path ,output_image(.jpeg,.pnp .....)
webp.dwebp("nodejs_logo.webp","nodejs_logo.jpg",function(status)
	{
		//if conversion successfull status will be 'converted successfully'
		console.log(status);
	});

//pass input_image(.gif) path ,output_image(give path where to save and image file name with .webp extension)
webp.gwebp("nodejs_logo.gif","nodejs_logo.webp","-q 80",function(status)
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
