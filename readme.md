### ImagePathToBlob
Module for creating Blob objects and DataURL's from remote Image paths.

```
ImagePathToBlob(path, (im2blob) => {
	im2blob.getBlob((blob) => {
		//blob data
	})
	var dataurl = im2blob.getDataURL();
})

im2blob.image; //Image object
im2blob.blob; //Blob, when ready
im2blob.dataURL; //dataURL, when ready


im2blob.destroy(); //tear down object after use
```