var exec = require('child_process').execFile;//get child_process module
var enwebp=require('./cwebp_test.js');//get cwebp module(converts other image format to webp)
var dewebp=require('./dwebp_test.js');//get dwebp module(converts webp format to other image)
var gifwebp=require('./gwebp_test.js');//get gif2webp module(convert git image to webp) 

//now convert image to .webp format 
module.exports.cwebp =function(input_image,output_image,option,callback)
{

var sou=input_image;//input image(.jpeg, .pnp ....)
var des=output_image;//output image .webp 
var op=option;//options and quality,it should be given between 0 to 100

var query = op +' '+ input_image +' -o '+ output_image;//command to convert image 

console.log(query);

//enwebp() return which platform webp library should be used for conversion
 exec(enwebp(),query.split(/\s+/), function (error, stdout, stderr) //execute command 
 	{ 
 		if(error){
 			callback("101");//return error code
			callback(error);
 		}else {
  			callback("100");//return success code
			callback("Converted Successfully");
 	      }
 });
};

//now convert .webp to other image format 
module.exports.dwebp =function(input_image,output_image,option,callback)
{

var sou=input_image;//input image .webp 
var des=output_image;//output image(.jpeg, .pnp ....)
var op=option;//options

var query = input_image + ' ' + op + ' ' + output_image;//command to convert image 


console.log(query);

//dewebp() return which platform webp library should be used for conversion
 exec(dewebp(),query.split(/\s+/), function (error, stdout, stderr) //execute command 
 	{ 
 		if(error){
 			callback("101");//return error code
			callback(error);
 		}else {
  			callback("100");//return success code
			callback("Converted Successfully");
 	      }
 });
};

//now convert .gif image to .webp format 
module.exports.gwebp =function(input_image,output_image,option,callback)
{

var sou=input_image;//input image(.jpeg, .pnp ....)
var des=output_image;//output image .webp 
var op=option;//options and quality,it should be given between 0 to 100

var query = op +' '+ input_image +' -o '+ output_image;//command to convert image 

//gifwebp() return which platform webp library should be used for conversion
 exec(gifwebp(),query.split(/\s+/), function (error, stdout, stderr) //execute command 
 	{ 
 		if(error){
 			callback("101");//return error code
			callback(error);
 		}else {
  			callback("100");//return success code
			callback("Converted Successfully");
 	      }
 });
};
