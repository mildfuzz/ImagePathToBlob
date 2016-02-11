/**
 * Canvas toBlob shim, adapted with thanks from https://code.google.com/u/105701149099589407503/, 
 * from this chrome bug thread: https://code.google.com/p/chromium/issues/detail?id=67587
 */
(function(){
    /**
     * Convert a base64 image dataURL from a canvas element, to a blob.
     * @param {function} callback
     * @param {string} type
     * @param {number} quality
     * @param {base64=} dataURL The dataURL to use, rather than fetch from the canvas.
     */
    function dataURLToBlob(callback, type, quality, dataURL){
        dataURL = dataURL || this.toDataURL(type, quality);
        var bin = atob(dataURL.split(',')[1]),
            len = bin.length,
            len32 = len >> 2,
            a8 = new Uint8Array(len),
            a32 = new Uint32Array(a8.buffer, 0, len32),
            tailLength = len & 3;

        for(var i=0, j=0; i < len32; i++)
        {
            a32[i] = bin.charCodeAt(j++) |
                bin.charCodeAt(j++) << 8 |
                bin.charCodeAt(j++) << 16 |
                bin.charCodeAt(j++) << 24;
        }

        while(tailLength--)
        {
            a8[j] = bin.charCodeAt(j++);
        }

        callback(new Blob([a8], {'type': type || 'image/png'}));
    }

    if(HTMLCanvasElement && Object.defineProperty && !HTMLCanvasElement.prototype.toBlob)
    {
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob',
        {
            value:dataURLToBlob
        });
    }
})();
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