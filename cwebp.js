
//get os type then return path of respective platform library 
var knowos=function()
{
if (process.platform === 'darwin') {

    return 'libs/libwebp_osx/bin/cwebp';//return osx library path

}else if (process.platform === 'linux') {

   return 'libs/libwebp_linux/bin/cwebp';//return linux library path

}else if (process.platform === 'win32') {

    if (process.arch === 'x64') {
       return 'libs/libwebp_win64/bin/cwebp.exe';//return windows 64bit library path
    } else {
        return 'libs/libwebp_win32/bin/cwebp.exe';//return windows 32(X86)bit library path
    }

} else {
    console.log('Unsupported platform:', process.platform, process.arch);//show unsupported platform message 
}
};

module.exports = knowos;