(function(){
    "use strict"; 
    function ImagePathToBlob(path, mainthread) {
        var ip, i = 0, imagePathObj;
  
        function ImagePathToBlobClass(path) {
            this.encoding = 'image/jpeg';
            this.quality = 1;
            this.path = path;
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
            this.image = new Image();
            this.image.setAttribute('crossOrigin', 'anonymous');
            this.dataFlow = ['loadImage', 'populateCanvas'];
            bindAll.call(this);
            this.next();
            
      };
      ip = ImagePathToBlobClass.prototype;
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
        
      ip.getBlob = function(cb){
        this.canvas.toBlob(function(blob) {

                this.blob = blob;
                cb.call(this, this.blob);
        }.bind(this), this.encoding, this.quality);

        return this;
      };
      ip.destroy = function() {
        this.image = null;
        this.canvas = null;
        imagePathObj = null;
      };
      ip.getDataURL = function(cb) {
        this.dataURL = this.canvas.toDataURL(this.encoding, this.quality);
        return this.dataURL;
      }
  
      ip.next = function() {
        var method;
        if (typeof this[this.dataFlow[i]] === 'function') {
            console.log('running: '+ this.dataFlow[i]);
            method = this[this.dataFlow[i]];
            i++;
            method();
        } else {
        	mainthread.call(this, this);
        }
      }
  
      imagePathObj = new ImagePathToBlobClass(path);
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