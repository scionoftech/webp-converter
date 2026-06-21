const exec = require('child_process').execFile;//get child_process module
const fs = require('fs');
const enwebp=require('./cwebp.js');//get cwebp module(converts other image format to webp)
const dewebp=require('./dwebp.js');//get dwebp module(converts webp format to other image)
const gifwebp=require('./gwebp.js');//get gif2webp module(convert git image to webp)
const webpmux=require('./webpmux.js');//get webpmux module(convert non animated webp images to animated webp)
const buffer_utils = require('./buffer_utils.js');//get buffer utilities

// Split a free-form options string (e.g. "-q 80") into separate argv tokens. Value
// arguments (filenames, numbers) are passed as single argv elements and are NEVER
// concatenated into a shell command line, so shell metacharacters in them are inert.
const optionTokens = (opt) => String(opt == null ? '' : opt).trim().split(/\s+/).filter(Boolean);

// Run a webp binary with a real argv array and NO shell. execFile passes each element
// to the binary verbatim (spaces and metacharacters are literal), so a malicious file
// name / option cannot inject commands. Replaces the previous
// `execFile(bin, query.split(/\s+/), { shell: true })` which ran `sh -c "<bin> <args>"`
// and was vulnerable to command injection (CWE-78).
const runWebp = (binPath, args) =>
  new Promise((resolve) => {
    exec(binPath, args, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });

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

const args = [...optionTokens(option), String(input_image), '-o', String(output_image), String(logging)];

//enwebp() return which platform webp library should be used for conversion
return runWebp(enwebp(), args);
};

/******************************************************* dwebp *****************************************************/

//now convert .webp to other image format
module.exports.dwebp = (input_image,output_image,option,logging='-quiet') => {

// input_image: input image .webp
//output_image: output image(.jpeg, .pnp ....)
//option: options and quality,it should be given between 0 to 100

const args = [String(input_image), ...optionTokens(option), String(output_image), String(logging)];

//dewebp() return which platform webp library should be used for conversion
return runWebp(dewebp(), args);

};

/******************************************************* gif2webp *****************************************************/

//now convert .gif image to .webp format
module.exports.gwebp = (input_image,output_image,option,logging='-quiet') => {

// input_image: input image(.jpeg, .pnp ....)
//output_image: /output image .webp
//option: options and quality,it should be given between 0 to 100

const args = [...optionTokens(option), String(input_image), '-o', String(output_image), String(logging)];

//gifwebp() return which platform webp library should be used for conversion
return runWebp(gifwebp(), args);
};

/******************************************************* webpmux *****************************************************/

//%%%%%%%%%%% Add ICC profile,XMP metadata and EXIF metadata

module.exports.webpmux_add = (input_image,output_image,icc_profile,option,logging='-quiet') => {

// input_image: input image(.webp)
//output_image: output image .webp
//icc_profile: icc profile
//option: get or set option (icc,xmp,exif)

const args = ['-set', ...optionTokens(option), String(icc_profile), String(input_image), '-o', String(output_image), String(logging)];

//webpmux() return which platform webp library should be used for conversion
return runWebp(webpmux(), args);
};

//%%%%%%%%%%%%% Extract ICC profile,XMP metadata and EXIF metadata

module.exports.webpmux_extract = (input_image,icc_profile,option,logging='-quiet') => {

// input_image: input image(.webp)
//icc_profile: icc profile

const args = ['-get', ...optionTokens(option), String(input_image), '-o', String(icc_profile), String(logging)];

//webpmux() return which platform webp library should be used for conversion
return runWebp(webpmux(), args);
};

//%%%%%%%% Strip ICC profile,XMP metadata and EXIF metadata

module.exports.webpmux_strip = (input_image,output_image,option,logging='-quiet') => {

// input_image: input image(.webp)
//output_image: output image .webp

const args = ['-strip', ...optionTokens(option), String(input_image), '-o', String(output_image), String(logging)];

//webpmux() return which platform webp library should be used for conversion
return runWebp(webpmux(), args);
};

//%%%%%%%%%%% Create an animated WebP file from Webp images

module.exports.webpmux_animate = (input_images,output_image,loop,bgcolor,logging='-quiet') => {

// input_images: array of image(.webp)
//output_image: animatedimage .webp
//loop:Loop the frames n number of times
//bgcolor: Background color of the canvas

const args = [];
for (let i = 0; i < input_images.length; i++) {
    args.push('-frame', String(input_images[i]["path"]), String(input_images[i]["offset"]));
}
args.push('-loop', String(loop), '-bgcolor', String(bgcolor), '-o', String(output_image), String(logging));

//webpmux() return which platform webp library should be used for conversion
return runWebp(webpmux(), args);
};

//%%%%%%%%%%%% Get the a frame from an animated WebP file

module.exports.webpmux_getframe = (input_image,output_image,frame_number,logging='-quiet') => {

// input_image: input image(.webp)
//output_image: output image .webp
//frame_number: frame number

const args = ['-get', 'frame', String(frame_number), String(input_image), '-o', String(output_image), String(logging)];

//webpmux() return which platform webp library should be used for conversion
return runWebp(webpmux(), args);
};
