var Transition = {
  init: function(){
    this.canvas = document.getElementById("canvas");
    var cacheCanvas = document.createElement("canvas");
    cacheCanvas.width = canvas.width;
    cacheCanvas.height = canvas.height;

    this.cacheCanvas = cacheCanvas;
  },
  superimposed: {
    imgPathIdMaps: {},
    MaxOpacity: 1,
    times: 2000,
    requestAnimationFrameId: null,
    loadImg: function(path, resolve, reject){
      var _self = this;
      var i = 0;
      var image = new Image();
      image.src = path;
      image.onload = function(){
        resolve(image)
      }
      image.onabort = function(){
        if(i < 5){
          _self.loadImg(path, resolve, reject);
        } else {
          reject(image, i);
        }
      }
    },  
    drawAnimate: function(){ //
      var cacheCtx = Transition.cacheCanvas.getContext("2d");  
      var keys = Object.keys(this.imgPathIdMaps);
      cacheCtx.globalAlpha = this.imgPathIdMaps[keys[0]].opacity;
      cacheCtx.drawImage(this.imgPathIdMaps[keys[0]].img, 0, 0);
      cacheCtx.globalAlpha = this.imgPathIdMaps[keys[1]].opacity;
      cacheCtx.drawImage(this.imgPathIdMaps[keys[1]].img, 0, 0);

      window.cancelAnimationFrame(this.requestAnimationFrameId);
      var ctx = Transition.canvas.getContext("2d");
      ctx.clearRect(0, 0, Transition.canvas.width, Transition.canvas.height);
      ctx.drawImage(Transition.cacheCanvas, 0, 0);

      var delOpacity = this.MaxOpacity / (this.times / (1000 / 60));
      
      if(this.imgPathIdMaps[keys[0]].opacity < 0){
        this.imgPathIdMaps[keys[0]].opacity = 0;
        this.imgPathIdMaps[keys[1]].opacity = 1;

        this.imgPathIdMaps[keys[1]].direction = this.imgPathIdMaps[keys[1]].direction * -1;
        this.imgPathIdMaps[keys[0]].direction = this.imgPathIdMaps[keys[0]].direction * -1;
      } else if(this.imgPathIdMaps[keys[0]].opacity > 1){
        this.imgPathIdMaps[keys[0]].opacity = 1;
        this.imgPathIdMaps[keys[1]].opacity = 0;
        
        this.imgPathIdMaps[keys[0]].direction = this.imgPathIdMaps[keys[0]].direction * -1;
        this.imgPathIdMaps[keys[1]].direction = this.imgPathIdMaps[keys[1]].direction * -1;
      } else {
        this.imgPathIdMaps[keys[0]].opacity = this.imgPathIdMaps[keys[0]].opacity + delOpacity * this.imgPathIdMaps[keys[0]].direction;
        this.imgPathIdMaps[keys[1]].opacity = this.imgPathIdMaps[keys[1]].opacity +  delOpacity * this.imgPathIdMaps[keys[1]].direction;
      }
      this.requestAnimationFrameId =  window.requestAnimationFrame(this.drawAnimate.bind(this));
    },
    init: function(imgPaths){
      var _self = this;
      
      imgPaths.forEach((path)=>{
        _self.loadImg(path, function(loadedImg){
          _self.imgPathIdMaps[path] = path === imgPaths[0] ? {
            img: loadedImg,
            opacity: 1,
            direction: -1
          } : {
            img: loadedImg,
            opacity: 0,
            direction: 1
          };
          var keys = Object.keys(_self.imgPathIdMaps);
          if(keys.length === imgPaths.length){
            _self.drawAnimate();
          }
        });
      });
  
    }
  }
}