const path = require('path');
//get os type then return path of respective platform library
const temp_files = function (override_temp_path = null) {
  if (process.platform === 'darwin') {
    if (override_temp_path !== null) {
      return override_temp_path;
    }
    return path.join(__dirname, '../', '/temp/'); //return osx library path
  } else if (process.platform === 'linux') {
    if (override_temp_path !== null) {
      return override_temp_path;
    }
    return path.join(__dirname, '../', '/temp/'); //return linux library path
  } else if (process.platform === 'win32') {
    if (process.arch === 'x64') {
      if (override_temp_path !== null) {
        return override_temp_path;
      }
      return path.join(__dirname, '../', '\\temp\\'); //return windows 64bit library path
    } else {
      console.log('Unsupported platform:', process.platform, process.arch); //show unsupported platform message
    }
  } else {
    console.log('Unsupported platform:', process.platform, process.arch); //show unsupported platform message
  }
};
module.exports = temp_files;
