const Buffer = require('buffer').Buffer;
const fs = require('fs');
const uuid = require('uuid').v4;
const temp_path = require('./temp_path.js');
const webp=require('./webpconverter.js');

/**
 * @param  {string} filepath
 * @param  {string} type
 */
function encode_image(filepath,type) {
    let data = fs.readFileSync(filepath);
    let buf = Buffer.from(data);
    if(type == "base64"){
        let base64 = buf.toString('base64');
        // console.log('Base64 ' + filepath + ': ' + base64);
        return base64;
    }else{
        return buf
    }
  }

/**
 * @param  {string} base64str
 * @param  {string} path
 */
const base64_to_image = (base64str,path) =>{
    let buf = Buffer.from(base64str, 'base64');

    fs.writeFileSync(path, buf, function(error) {
        if (error) {
          throw error;
        } else {
          console.log('File created from base64 string!');
        }
      });
    return true;
}

/**
 * @param  {string} base64str
 * @param  {string} image_type
* @param  {string} option
 */
// convert base64 image to webpbase64 image
module.exports.base64str2webp = (base64str,image_type,option,extra_path) => {

    // let filename = String(Math.floor(Math.random() * 10000000000) + 1)
    let filename = uuid();

    let input_file_path = `${temp_path(extra_path)}${filename}.${image_type}`;

    let webp_image_path  = `${temp_path(extra_path)}${filename}.webp`;

    let status = base64_to_image(base64str,input_file_path)

    if(status){
      const result = webp.cwebp(input_file_path,webp_image_path,option);
      return result.then((response) => {
          let webp_base64str = encode_image(webp_image_path,"base64")

          fs.unlinkSync(input_file_path);
          fs.unlinkSync(webp_image_path);
  
          return webp_base64str
      });
      }else{
        console.log("Failed")
      }
}
/**
 * @param  {buffer} buffer
 * @param  {string} image_type
* @param  {string} option
 */
// convert image buffer  to webp buffer
module.exports.buffer2webp = (buffer,image_type,option,extra_path) => {

    let buf = Buffer.from(buffer);
    let base64str = buf.toString('base64');

    // let filename = String(Math.floor(Math.random() * 10000000000) + 1)
    let filename = uuid();

    let input_file_path = `${temp_path(extra_path)}${filename}.${image_type}`;

    let webp_image_path  = `${temp_path(extra_path)}${filename}.webp`;

    let status = base64_to_image(base64str,input_file_path)

    if(status){
    const result = webp.cwebp(input_file_path,webp_image_path,option);
    return result.then((response) => {
        let webp_buffer = encode_image(webp_image_path,"buffer")

        fs.unlinkSync(input_file_path);
        fs.unlinkSync(webp_image_path);

        return webp_buffer
    });
    }else{
      console.log("Failed")
    }
    
}