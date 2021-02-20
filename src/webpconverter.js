const exec = require('child_process').execFile;//get child_process module
const fs = require('fs');
const enwebp=require('./cwebp.js');//get cwebp module(converts other image format to webp)
const dewebp=require('./dwebp.js');//get dwebp module(converts webp format to other image)
const gifwebp=require('./gwebp.js');//get gif2webp module(convert git image to webp)
const webpmux=require('./webpmux.js');//get webpmux module(convert non animated webp images to animated webp)
const buffer_utils = require('./buffer_utils.js');//get buffer utilities 

//permission issue in Linux and macOS
module.exports.grant_permission = () => {

const arr = [enwebp(), dewebp(), gifwebp(),webpmux()];

arr.forEach(exe_path => { 
  fs.chmodSync(exe_path, 0o755); 
});

};

//convert base64 to webp base64
module.exports.str2webpstr = (base64str,image_type,option,extra_path) => {
  // base64str of image
  // base64str image type jpg,png ...
  //option: options and quality,it should be given between 0 to 100
  return buffer_utils.base64str2webp(base64str,image_type,option,extra_path).then(function(val) {
    return val
  });
};

//convert buffer to webp buffer
module.exports.buffer2webpbuffer = (buffer,image_type,option,extra_path) => {
  // buffer of image
  // buffer image type jpg,png ...
  //option: options and quality,it should be given between 0 to 100
  return buffer_utils.buffer2webp(buffer,image_type,option,extra_path).then(function(val) {
    return val
  });
};

//now convert image to .webp format 
module.exports.cwebp = (input_image,output_image,option,logging='-quiet') => {

// input_image: input image(.jpeg, .pnp ....)
//output_image: output image .webp 
//option: options and quality,it should be given between 0 to 100

const query = `${option} "${input_image}" -o "${output_image}" "${logging}"`; //command to convert image 

//enwebp() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
  exec(`"${enwebp()}"`,query.split(/\s+/),{ shell: true }, (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};

/******************************************************* dwebp *****************************************************/

//now convert .webp to other image format 
module.exports.dwebp = (input_image,output_image,option,logging='-quiet') => {

// input_image: input image .webp
//output_image: output image(.jpeg, .pnp ....)
//option: options and quality,it should be given between 0 to 100

const query = `"${input_image}" ${option} "${output_image}" "${logging}"`;//command to convert image  


//dewebp() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
  exec(`"${dewebp()}"`,query.split(/\s+/),{ shell: true }, (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});

};

/******************************************************* gif2webp *****************************************************/

//now convert .gif image to .webp format 
module.exports.gwebp = (input_image,output_image,option,logging='-quiet') => {

// input_image: input image(.jpeg, .pnp ....)
//output_image: /output image .webp 
//option: options and quality,it should be given between 0 to 100


const query = `${option} "${input_image}" -o "${output_image}" "${logging}"`;//command to convert image

//gifwebp() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
  exec(`"${gifwebp()}"`,query.split(/\s+/),{ shell: true }, (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};

/******************************************************* webpmux *****************************************************/

//%%%%%%%%%%% Add ICC profile,XMP metadata and EXIF metadata

module.exports.webpmux_add = (input_image,output_image,icc_profile,option,logging='-quiet') => {

// input_image: input image(.webp)
//output_image: output image .webp  
//icc_profile: icc profile
//option: get or set option (icc,xmp,exif)

const query = `-set ${option} ${icc_profile} "${input_image}" -o "${output_image}" "${logging}"`;

//webpmux() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
  exec(`"${webpmux()}"`,query.split(/\s+/),{ shell: true }, (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};

//%%%%%%%%%%%%% Extract ICC profile,XMP metadata and EXIF metadata

module.exports.webpmux_extract = (input_image,icc_profile,option,logging='-quiet') => {

// input_image: input image(.webp) 
//icc_profile: icc profile

const query = `-get ${option} "${input_image}" -o ${icc_profile} "${logging}"`;

//webpmux() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
  exec(`"${webpmux()}"`,query.split(/\s+/),{ shell: true }, (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};

//%%%%%%%% Strip ICC profile,XMP metadata and EXIF metadata 

module.exports.webpmux_strip = (input_image,output_image,option,logging='-quiet') => {

// input_image: input image(.webp) 
//output_image: output image .webp

const query = `-strip ${option} "${input_image}" -o "${output_image}" "${logging}"`;

//webpmux() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
  exec(`"${webpmux()}"`,query.split(/\s+/),{ shell: true }, (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};

//%%%%%%%%%%% Create an animated WebP file from Webp images 

module.exports.webpmux_animate = (input_images,output_image,loop,bgcolor,logging='-quiet') => {

// input_images: array of image(.webp) 
//output_image: animatedimage .webp
//loop:Loop the frames n number of times
//bgcolor: Background color of the canvas

let files=`-frame ${input_images[0]["path"]} ${input_images[0]["offset"]}`;

let j=input_images.length;

for (i = 1; i < j; i++) { 
    files=`${files} -frame "${input_images[i]["path"]}" ${input_images[i]["offset"]}`;
}

const query = `${files} -loop ${loop} -bgcolor ${bgcolor} -o "${output_image}" "${logging}"`;

//webpmux() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
  exec(`"${webpmux()}"`,query.split(/\s+/),{ shell: true }, (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};

//%%%%%%%%%%%% Get the a frame from an animated WebP file

module.exports.webpmux_getframe = (input_image,output_image,frame_number,logging='-quiet') => {

// input_image: input image(.webp) 
//output_image: output image .webp
//frame_number: frame number

const query = `-get frame ${frame_number} "${input_image}" -o "${output_image}" "${logging}"`;

//webpmux() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
exec(`"${webpmux()}"`,query.split(/\s+/),{ shell: true }, (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};