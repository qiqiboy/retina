/**
 * Retina v1.0
 * By qiqiboy, http://www.qiqiboy.com, http://weibo.com/qiqiboy, 2013/12/16
 */
;
(function(ROOT, Struct, NS, undefined){
	"use strict";

	Struct.fn=Struct.prototype={
		version:'1.0',
		constructor:Struct,
		init:function(node){
			var images;
			if(node===null){
				return this;
			}else if(typeof node=='string'){//如果是字符串，则认为是节点ID
				return new Struct(document.getElementById(node));
			}else if(!node || node.nodeType==9){//为document根节点
				images=document.images;
			}else if(node.nodeType==1){
				if(node.nodeName.toLowerCase()=='img'){
					images=[node];
				}else{
					images=node.getElementsByTagName('img');
				}
			}
			this.images=images||[];
			return this.applyRetina();
		},
		applyRetina:function(){
			var self=this;
			this.each(function(){
				var img=this,
					src=img.getAttribute('src'),
					rSrc=img.getAttribute('data-retina') || src.replace(/\.(\w+)$/, "@2x.$1"),
					cache;
				if(src!=rSrc){
					cache=new Image();
					cache.src=rSrc;
					if(cache.complete){
						img.src=rSrc;
					}else cache.onload=cache.onreadystatechange=function(){
						if(cache&&cache.readyState&&cache.readyState!='loaded'&&cache.readyState!='complete'&&(!cache.width||cache.width*cache.height<1024)){return}
						img.src=rSrc;
						cache=cache.onload=cache.onreadystatechange=null;
					}
				}
			});
			return this;
		},
		each:function(func){
			var images=this.images,
				i=0,j=images.length;
			for(;i<j;i++){
				if(func.call(images[i],i)===false){
					break;	
				}
			}
			return this;
		}
	}
	
	//修正原型链指向
	Struct.fn.init.prototype=Struct.fn;
	
	//将原型上的方法属性再绑定到构造函数上，以实现直接调用
	var prop,
		fn=Struct.fn;
	for(prop in fn){
		Struct[prop]=fn[prop];
	}
	
	Struct.isRetina=(function(){
		var mediaQuery="(-webkit-min-device-pixel-ratio: 1.5),\
                      (min--moz-device-pixel-ratio: 1.5),\
                      (-o-min-device-pixel-ratio: 3/2),\
					  (min-device-pixel-ratio: 1.5),\
                      (min-resolution: 1.5dppx)";

		if(ROOT.devicePixelRatio>1){
		  return true;
		}
		if(ROOT.matchMedia && ROOT.matchMedia(mediaQuery).matches){
		  return true;
		}
		if(!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)){
			return Math.round((screen.deviceXDPI/screen.logicalXDPI)*100)/100>1.5;
		}
		if(ROOT.navigator.msMaxTouchPoints){
			return Math.round((document.documentElement.offsetHeight/window.innerHeight)*100)/100>1.5;
		}
		return false;
	})();

	var inited,
		myInit=function(){
			inited=inited||Struct.init();
		}
	
	Struct.isRetina && (ROOT.addEventListener ? (ROOT.addEventListener('DOMContentLoaded',myInit,false), ROOT.addEventListener('load',myInit,false)) : ROOT.attachEvent('onload',myInit));

	return ROOT[NS]=Struct;
	
})(window, function(name){
	return new arguments.callee.fn.init(name);
}, 'Retina');