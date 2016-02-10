(function(){
	"use strict"; 
	function ImagePathToBlob(path, cb) {
  		var ip, i = 0, imagePathObj;
  
		function ImagePath(path, cb) {
		    this.encoding = 'image/jpeg';
		    this.quality = 1;
		  	this.path = path;
		    this.callback = cb;
		    this.canvas = document.createElement('canvas');
		    this.context = this.canvas.getContext('2d');
		    this.image = new Image();
		    this.image.setAttribute('crossOrigin', 'anonymous');
				this.dataFlow = ['loadImage', 'populateCanvas', 'getDataURL', 'getBlob'];
		    bindAll.call(this);
	    this.next();
	  };
	  ip = ImagePath.prototype;
		function bindAll() {
			for (var key in this) {
				this[key].bind && (this[key] = this[key].bind(this));
			}	
		};
  
	  ip.populateCanvas = function() {
	    this.canvas.setAttribute('height', this.image.height);
	    this.canvas.setAttribute('width', this.image.width);
	  	this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height);
	    this.next();
	  }
	  ip.loadImage = function() {
	  	this.image.src = this.path;
	    this.image.onload = this.next;
	    this.image.onerror = function(e) {
	    	throw new Error('Image loading error: '+ e);
	    };
	  }
  
	  ip.getBlob = function(){
	  	this.canvas.toBlob((blob) => {
	    			this.blob = blob;
	          this.next();
	    },this.encoding, this.quality);
	  };
  
	  ip.getDataURL = function() {
	  	this.dataURL = this.canvas.toDataURL(this.encoding, this.quality);
	    this.next();
	  }
  
	  ip.next = function() {
	  	var method;
  		if (typeof this[this.dataFlow[i]] === 'function') {
			console.log('running: '+ this.dataFlow[i]);
			method = this[this.dataFlow[i]];
			i++;
			method();
		} else {
	      	this.callback();
	      	imagePathObj = null;
	    }
	  }
  
	  imagePathObj = new ImagePath(path, cb);
	}
	if(typeof define !== 'undefined' && typeof define.amd !== 'undefined' ){
		define(function(){
			return ImagePathToBlob;
		});
	} else if(typeof module !== 'undefined' && typeof module.exports !== 'undefined' ){
		module.exports = ImagePathToBlob;
	} else {
		return ImagePathToBlob;	
	}
}());