
const path = require('path');
//get os type then return path of respective platform library 
const temp_files=function(overide_path) {
    // Support override path
    if ((process.platform === 'darwin' || process.platform === 'linux' || (process.platform === 'win32' && process.arch === 'x64')) && overide_path) {
        return overide_path;
    }

    if (process.platform === 'darwin') {
        
        return path.join(__dirname, "../", "/temp/");//return osx library path

    }else if (process.platform === 'linux') {
        return path.join(__dirname, "../", "/temp/");//return linux library path
    }else if (process.platform === 'win32') {

        if (process.arch === 'x64') {
            return path.join(__dirname, "../", "\\temp\\");//return windows 64bit library path
        } else {
            console.log('Unsupported platform:', process.platform, process.arch);//show unsupported platform message
        }

    } else {
        console.log('Unsupported platform:', process.platform, process.arch);//show unsupported platform message 
    }
};
module.exports = temp_files