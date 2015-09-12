
//get module
var webp=require('./webpconverter.js');

//pass input_image(.jpeg,.pnp .....) path ,output_image(give path where to save and image file name with .webp file type extension)
webp.cwebp("nodejs_logo.jpg","output.webp","80",function(status)
	{
		//if conversion successfull status will be 'converted successfully'
		console.log(status);
	});

/*//pass input_image(.webp image) path ,output_image(.jpeg,.pnp .....)
webp.dwebp("nodejs_logo.webp","output.jpg",function(status)
	{
		//if conversion successfull status will be 'converted successfully'
		console.log(status);
	});*/