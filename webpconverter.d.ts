type Callback = (status: string, error: any) => void;

export const cwebp: (input_image: string, output_image: string, option: string, callback: Callback) => void;

export const dwebp: (input_image: string, output_image: string, option: string, callback: Callback) => void;

//now convert .gif image to .webp format
export const gwebp: (input_image: string, output_image: string, option: string, callback: Callback) => void;

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Add ICC profile,XMP metadata and EXIF metadata
export const webpmux_add: (input_image: string, output_image: string, icc_profile: any, option: string, callback: Callback) => void;

export const webpmux_extract: (input_image: string, icc_profile: any, option: string, callback: Callback) => void;

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Strip ICC profile,XMP metadata and EXIF metadata

export const webpmux_strip: (input_image: string, output_image: string, option: string, callback: Callback) => void;

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Create an animated WebP file from Webp images

export const webpmux_animate: (input_images: string[], output_image: string, loop: number, bgcolor: string, callback: Callback) => void;

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Get the a frame from an animated WebP file

export const webpmux_getframe: (input_image: string, output_image: string, frame_number: number, callback: Callback) => void;
