const exec = require('child_process').execFile;//get child_process module
const enwebp=require('./cwebp.js');//get cwebp module(converts other image format to webp)
const dewebp=require('./dwebp.js');//get dwebp module(converts webp format to other image)
const gifwebp=require('./gwebp.js');//get gif2webp module(convert git image to webp)
const webpmux=require('./webpmux.js');//get webpmux module(convert non animated webp images to animated webp)


//now convert image to .webp format 
module.exports.cwebp =function(input_image,output_image,option,callback)
{

// input_image: input image(.jpeg, .pnp ....)
//output_image: output image .webp 
//option: options and quality,it should be given between 0 to 100

const query = `${option} ${input_image} -o ${output_image}`; //command to convert image 

console.log(query);

//enwebp() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
 exec(enwebp(),query.split(/\s+/), (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};

/******************************************************* dwebp *****************************************************/

//now convert .webp to other image format 
module.exports.dwebp =function(input_image,output_image,option,callback)
{

// input_image: input image .webp
//output_image: output image(.jpeg, .pnp ....)
//option: options and quality,it should be given between 0 to 100

const query = `${input_image} ${option} ${output_image}`;//command to convert image  

console.log(query);

//dewebp() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
 exec(dewebp(),query.split(/\s+/), (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};

/******************************************************* gif2webp *****************************************************/

//now convert .gif image to .webp format 
module.exports.gwebp =function(input_image,output_image,option,callback)
{

// input_image: input image(.jpeg, .pnp ....)
//output_image: /output image .webp 
//option: options and quality,it should be given between 0 to 100


const query = `${option} ${input_image} -o ${output_image}`;//command to convert image

//gifwebp() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
 exec(gifwebp(),query.split(/\s+/), (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};

/******************************************************* webpmux *****************************************************/

//%%%%%%%%%%% Add ICC profile,XMP metadata and EXIF metadata

module.exports.webpmux_add =function(input_image,output_image,icc_profile,option,callback)
{

// input_image: input image(.webp)
//output_image: output image .webp  
//icc_profile: icc profile
//option: get or set option (icc,xmp,exif)

const query = `-set ${option} ${icc_profile} ${input_image} -o ${output_image}`;

//webpmux() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
 exec(webpmux(),query.split(/\s+/), (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};

//%%%%%%%%%%%%% Extract ICC profile,XMP metadata and EXIF metadata

module.exports.webpmux_extract =function(input_image,icc_profile,option,callback)
{

// input_image: input image(.webp) 
//icc_profile: icc profile

const query = `-get ${option} ${input_image} -o ${icc_profile}`;

//webpmux() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
 exec(webpmux(),query.split(/\s+/), (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};

//%%%%%%%% Strip ICC profile,XMP metadata and EXIF metadata 

module.exports.webpmux_strip =function(input_image,output_image,option,callback)
{

// input_image: input image(.webp) 
//output_image: output image .webp

const query = `-strip ${option} ${input_image} -o ${output_image}`;

//webpmux() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
 exec(webpmux(),query.split(/\s+/), (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};

//%%%%%%%%%%% Create an animated WebP file from Webp images 

module.exports.webpmux_animate =function(input_images,output_image,loop,bgcolor,callback)
{

// input_images: array of image(.webp) 
//output_image: animatedimage .webp
//loop:Loop the frames n number of times
//bgcolor: Background color of the canvas

let files=`-frame ${input_images[0]}`;

let j=input_images.length;

for (i = 1; i < j; i++) { 
    files=`${files} -frame ${input_images[i]}`;
  console.log(files);
}

const query = `${files} -loop ${loop} -bgcolor ${bgcolor} -o ${output_image}`;

//webpmux() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
 exec(webpmux(),query.split(/\s+/), (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};

//%%%%%%%%%%%% Get the a frame from an animated WebP file

module.exports.webpmux_getframe =function(input_image,output_image,frame_number,callback)
{

// input_image: input image(.webp) 
//output_image: output image .webp
//frame_number: frame number

const query = `-get frame ${frame_number} ${input_image} -o ${output_image}`;

//webpmux() return which platform webp library should be used for conversion
return new Promise((resolve, reject) => {
  //execute command 
 exec(webpmux(),query.split(/\s+/), (error, stdout, stderr) => {
  if (error) {
   console.warn(error);
  }
  resolve(stdout? stdout : stderr);
 });
});
};