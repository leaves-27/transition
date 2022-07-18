var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");

// 先将图片1画在画布上，然后依次降低透明度到0进行绘画；再在透明度为0时，依次将透明度到1进行绘制图片2。
var Transition = {
  canvasWidth: canvas.width,
  canvasHeight: canvas.height,
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
    drawImage: function(){ //  
      window.cancelAnimationFrame(this.requestAnimationFrameId);
      ctx.clearRect(0, 0, Transition.canvasWidth + 1, Transition.canvasHeight + 1);

      var keys = Object.keys(this.imgPathIdMaps);
      
      ctx.globalAlpha = this.imgPathIdMaps[keys[0]].opacity;
      ctx.drawImage(this.imgPathIdMaps[keys[0]].img, 0, 0);
      ctx.globalAlpha = this.imgPathIdMaps[keys[1]].opacity;
      ctx.drawImage(this.imgPathIdMaps[keys[1]].img, 0, 0);
      

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
      this.requestAnimationFrameId =  window.requestAnimationFrame(this.drawImage.bind(this));
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
            _self.drawImage();
          }
        });
      });
  
    }
  }
}

Transition.superimposed.init(['./public/imgs/img01.jpeg', './public/imgs/img02.jpeg']);

