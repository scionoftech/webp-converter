var exec = require('child_process').execFile;//get child_process module
var enwebp=require('./cwebp.js');//get cwebp module(converts other image format to webp)
var dewebp=require('./dwebp.js');//get dwebp module(converts webp format to other image)

//now convert image to .webp format 
module.exports.cwebp =function(input_image,output_image,quality,callback)
{

var sou=input_image;//input image(.jpeg, .pnp ....)
var des=output_image;//output image .webp 
var qu=quality;//quality, it should be given between 0 to 100

var query='-q '+ qu +' '+ input_image +' -o '+ output_image;//command to convert image 

//enwebp() return which platform webp library should be used for conversion
 exec(enwebp(),query.split(/\s+/), function (error, stdout, stderr) //execute command 
 	{ 
 		if(error){
 			
 			callback(error);//return error
 		}
 		
 		callback('converted successfully');//return success message
 });
};

//now convert .webp to other image format 
module.exports.dwebp =function(input_image,output_image,callback)
{

var sou=input_image;//input image .webp 
var des=output_image;//output image(.jpeg, .pnp ....)

var query=input_image +' -o '+ output_image;//command to convert image 

//dewebp() return which platform webp library should be used for conversion
 exec(dewebp(),query.split(/\s+/), function (error, stdout, stderr) //execute command 
 	{ 
 		if(error){
 			
 			callback(error);//return error
 		}
 		
 		callback('converted successfully');//return success message
 });
};