const path = require('path');
//get os type then return path of respective platform library
const webpmux = function () {
  if (process.platform === 'darwin') {
    return path.join(__dirname, '../', '/bin/libwebp_osx/bin/webpmux'); //return osx library path
  } else if (process.platform === 'linux') {
    return path.join(__dirname, '../', '/bin/libwebp_linux/bin/webpmux'); //return linux library path
  } else if (process.platform === 'win32') {
    if (process.arch === 'x64') {
      return path.join(
        __dirname,
        '../',
        '\\bin\\libwebp_win64\\bin\\webpmux.exe'
      ); //return windows 64bit library path
    } else {
      console.log('Unsupported platform:', process.platform, process.arch); //show unsupported platform message
    }
  } else {
    console.log('Unsupported platform:', process.platform, process.arch); //show unsupported platform message
  }
};
module.exports = webpmux;
