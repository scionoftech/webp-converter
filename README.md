[![webp-converter Logo](images/nlogo.gif)](https://www.npmjs.com/package/webp-converter)

[webp-converter v2.3.3](https://www.npmjs.com/package/webp-converter)

A small [node.js](http://nodejs.org) library for converting any image to webp file format or converting webp image to any image file format.


This library uses precompiled executables of WebP(v1.1.0) for more info visit [WebP](https://developers.google.com/speed/webp)

For converting other image formats to webp, please read this documentation  [cwebp Encoder](https://developers.google.com/speed/webp/docs/cwebp)

For converting webp image to other image format, please read this documentation  [dwebp Encoder](https://developers.google.com/speed/webp/docs/dwebp)

For converting gif image to webp, please read this documentation [gif2webp Converter](https://developers.google.com/speed/webp/docs/gif2webp)

For creating animated webp image using webp images, please read this documentation [webpmux Muxer](https://developers.google.com/speed/webp/docs/webpmux)


## What's New 
* logging options added

# How to use

## Fix Permission Issue

  ```js

const webp=require('webp-converter');

// this will grant 755 permission to webp executables
webp.grant_permission();

```

# cwebp

## Convert other image format to webp

  ```js

const webp=require('webp-converter');

//pass input image(.jpeg,.pnp .....) path ,output image(give path where to save and image file name with .webp extension)
//pass option(read  documentation for options)

//cwebp(input,output,option)

const result = webp.cwebp("nodejs_logo.jpg","nodejs_logo.webp","-q 80",logging="-v");
result.then((response) => {
	console.log(response);
  });


```

## Convert base64 image to webpbase64 image

  ```js

const webp=require('webp-converter');

function get_webpbase64(path) {
  fs.readFile(path, function (error, data) {
    if (error) {
      throw error;
    } else {
      let buf = Buffer.from(data);
      let dataBase64 = Buffer.from(buf).toString('base64');
        // base64str of image
      // base64str image type jpg,png ...
      //option: options and quality,it should be given between 0 to 100
      let result = webp.str2webpstr(dataBase64,"jpg","-q 80");
      result.then(function(result) {
        // you access the value from the promise here
        console.log(result)
      });
    }
  });
}
// use the default temp path for conversion
get_webpbase64("./nodejs_logo.jpg")
// use the custom temp path for conversion
get_webpbase64("./nodejs_logo.jpg","/home/user/Desktop/webp/temp")

```

## Convert buffer to webp buffer

  ```js

const webp=require('webp-converter');

function get_webpbuffer(path) {
  fs.readFile(path, function (error, data) {
    if (error) {
      throw error;
    } else {
      // buffer of image
    // buffer image type jpg,png ...
    //option: options and quality,it should be given between 0 to 100
      let result = webp.buffer2webpbuffer(data,"jpg","-q 80");
      result.then(function(result) {
        // you access the value from the promise here
        console.log(result)
      });
    }
  });
}
// use the default temp path for conversion
get_webpbuffer("./nodejs_logo.jpg")
// use the custom temp path for conversion
get_webpbuffer("./nodejs_logo.jpg","/home/user/Desktop/webp/temp")

```

# dwebp

## Convert webp image to other image format

  ```js

const webp=require('webp-converter');

//pass input image(.webp image) path ,output image(.jpeg,.pnp .....)

//dwebp(input,output,option)

const result = webp.dwebp("nodejs_logo.webp","nodejs_logo.jpg","-o",logging="-v");
result.then((response) => {
	console.log(response);
  });

```

# gif2webp

## Convert gif image to webp

  ```js

const webp=require('webp-converter');

//pass input image(.gif) path ,output image(give path where to save and image file name with .webp extension)
//pass option(read  documentation for options)

//gwebp(input,output,option)

const result = webp.gwebp("linux_logo.gif","linux_logo.webp","-q 80",logging="-v");
result.then((response) => {
	console.log(response);
  });


```

# webpmux

## Add ICC profile,XMP metadata and EXIF metadata

  ```js

const webp=require('webp-converter');

//pass input image(.webp image) path ,output image,option profile,set options(icc image profile,XMP metadata or EXIF metadata) and file.
//for options use keywords as below
//for ICC: icc
//for XMP metadata: xmp
//for EXIF metadata: exif

//webpmux_add(input,output,option_profile,set_option)

const result = webp.webpmux_add("in.webp","icc_container.webp","image_profile.icc","icc",logging="-v");
result.then((response) => {
	console.log(response);
  });


```

## Extract ICC profile,XMP metadata and EXIF metadata

  ```js

const webp=require('webp-converter');

//pass input image(.webp image) path ,output format(.icc,.xmp and .exif),get options(icc image profile,XMP metadata or EXIF metadata) and file.
//for options use keywords as below
//for ICC: icc
//for XMP metadata: xmp
//for EXIF metadata: exif

//webpmux_extract(input,output,option)

const result = webp.webpmux_extract("anim_container.webp","image_profile.icc","icc",logging="-v");
result.then((response) => {
	console.log(response);
  });


```

## Strip ICC profile,XMP metadata and EXIF metadata

  ```js

const webp=require('webp-converter');

//pass input image(.webp image) path ,output image(without icc),options(icc image profile,XMP metadata or EXIF metadata) and file.
//for options use keywords as below
//for ICC: icc
//for XMP metadata: xmp
//for EXIF metadata: exif

//webpmux_strip(input,output,option)

const result = webp.webpmux_strip("icc_container.webp","without_icc.webp","icc",logging="-v");
result.then((response) => {
	console.log(response);
  });


```

## Create an animated WebP file from Webp images

  ```js

//pass input images(.webp image) path with FRAME_OPTIONS, as array,ouput image will be animated .webp image 


/*FRAME_OPTIONS

-file_i +di[+xi+yi[+mi[bi]]]

e.g -frame one.webp +100 -frame two.webp +100+50+50 -frame three.webp +100+50+50+1+b 

Where: file_i is the i'th frame (WebP format), xi,yi specify the image offset for this frame, 
di is the pause duration before next frame, mi is the dispose method for this frame (0 for NONE or 1 for BACKGROUND) and bi is the blending method for this frame (+b for BLEND or -b for NO_BLEND). 
Argument bi can be omitted and will default to +b (BLEND). Also, mi can be omitted if bi is omitted and will default to 0 (NONE). Finally, 
if mi and bi are omitted then xi and yi can be omitted and will default to +0+0.

-loop n

e.g 10

Loop the frames n number of times. 0 indicates the frames should loop forever. Valid range is 0 to 65535 [Default: 0 (infinite)].

-bgcolor A,R,G,B 

e.g 255,255,255,255

Background color of the canvas. Where: A, R, G and B are integers in the range 0 to 255 specifying the Alpha, Red, Green and Blue component values respectively [Default: 255,255,255,255].
*/

//webpmux_animate(input_images_array,output,bgcolor)

const webp=require('webp-converter');

let input=[{"path":"./frames/tmp-0.webp","offset":"+100"},{"path":"./frames/tmp-1.webp", "offset":"+100"},{"path":"./frames/tmp-2.webp","offset":"+100"}];
const result = webp.webpmux_animate(input,"anim_container.webp","10","255,255,255,255",logging="-v");
result.then((response) => {
	console.log(response);
  });


```

## Get a frame from an animated WebP file

  ```js

const webp=require('webp-converter');

//pass input image(.webp image) path ,output image and frame number

//webpmux_getframe(input,ouput,frame number)

const result = webp.webpmux_getframe("anim_container.webp","frame_2.webp","2",logging="-v");
result.then((response) => {
	console.log(response);
  });


```

## Installation

```bash
$ npm install webp-converter
```

## License

  [MIT](LICENSE)
