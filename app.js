
//get module
const webp=require('./src/webpconverter.js');
const Buffer = require('buffer').Buffer;
const fs = require('fs');
/******************************************************* cwebp *****************************************************/
webp.grant_permission();
//pass input_image(.jpeg,.pnp .....) path ,output_image(give path where to save and image file name with .webp file type extension)
// const result = webp.cwebp("./nodejs_logo1.jpg","./nodejs_logo.webp","-q 80",logging="-v");
// result.then((response) => {
// 	console.log(response);
//   });

/******************************************************* dwebp *****************************************************/

//pass input_image(.webp image) path ,output_image(.jpeg,.pnp .....)
// const result = webp.dwebp("nodejs_logo.webp","nodejs_logo.jpg","-o");
// result.then((response) => {
// 	console.log(response);
//   });
/******************************************************* gif2webp *****************************************************/

//pass input_image(.gif) path ,output_image(give path where to save and image file name with .webp file type extension)
// const result = webp.gwebp("linux_logo.gif","linux_logo.webp","-q 80");
// result.then((response) => {
// 	console.log(response);
//   });
/******************************************************* webpmux *****************************************************/

//%%%%%%%%%%%%%%%%%%%%% Add ICC profile,XMP metadata and EXIF metadata

//pass input_image(.webp image) path ,output_image,set options(icc image profile,XMP metadata or EXIF metadata) and file.
//for options use keywords as below
//for ICC: icc
//for XMP metadata: xmp
//for EXIF metadata: exif

// const result = webp.webpmux_add("in.webp","icc_container.webp","image_profile.icc","icc");
// result.then((response) => {
// 	console.log(response);
//   });
//%%%%%%%%%%%%%%%%%% Extract ICC profile,XMP metadata and EXIF metadata

//pass input_image(.webp image) path ,output_image,set options(icc image profile,XMP metadata or EXIF metadata) and file.
//for options use keywords as below
//for ICC: icc
//for XMP metadata: xmp
//for EXIF metadata: exif

// const result = webp.webpmux_extract("anim_container.webp","image_profile.icc","icc");
// result.then((response) => {
// 	console.log(response);
//   });
//%%%%%%%%%%%%%%%%%%% Strip ICC profile,XMP metadata and EXIF metadata 

//pass input_image(.webp image) path ,output_image,set options(icc image profile,XMP metadata or EXIF metadata) and file.
//for options use keywords as below
//for ICC: icc
//for XMP metadata: xmp
//for EXIF metadata: exif

// const result = webp.webpmux_strip("icc_container.webp","without_icc.webp","icc");
// result.then((response) => {
// 	console.log(response);
//   });
//%%%%%%%%%%%%%%%%%%% Create an animated WebP file from Webp images 

//pass input_images(.webp image) path with FRAME_OPTIONS, as array,ouput image will be animated .webp image 


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

// let input=[{"path":"./frames/tmp-0.webp","offset":"+100"},{"path":"./frames/tmp-1.webp", "offset":"+100"},{"path":"./frames/tmp-2.webp","offset":"+100"}];
// const result = webp.webpmux_animate(input,"anim_container.webp","10","255,255,255,255");
// result.then((response) => {
// 	console.log(response);
//   });
//%%%%%%%%%%%%%%% Get the a frame from an animated WebP file

//pass input_image(.webp image) path ,output_image and frame number
// const result = webp.webpmux_getframe("anim_container.webp","frame_2.webp","2");
// result.then((response) => {
// 	console.log(response);
//   });

/******************************************************* buffer utils *****************************************************/

// function get_webpbuffer(path,temp_path) {
//   fs.readFile(path, function (error, data) {
//     if (error) {
//       throw error;
//     } else {
//       const result = webp.buffer2webpbuffer(data,"jpeg","-q 80",temp_path);
//       result.then(function(result) {
//         // you access the value from the promise here
//         console.log(result)
//       });
//     }
//   });
// }
// get_webpbuffer("./nodejs_logo.jpg","/home/sky/Desktop/test")

// function get_webpbase64(path,temp_path) {
//   fs.readFile(path, function (error, data) {
//     if (error) {
//       throw error;
//     } else {
//       let buf = Buffer.from(data);
//       let dataBase64 = Buffer.from(buf).toString('base64');
//       const result = webp.str2webpstr(dataBase64,"jpeg","-q 80",temp_path);
//       result.then(function(result) {
//         // you access the value from the promise here
//         console.log(result)
//       });
//     }
//   });
// }
// get_webpbase64("./nodejs_logo.jpg","/home/user/Desktop/test/")