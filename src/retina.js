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
			return this.each(function(){
				var img=this,
					src=img.getAttribute('src'),
					rSrc=img.getAttribute('data-retina') || src.replace(/\.(\w+)$/, "@2x.$1"),
					cache;
				if(!img.retina && src!=rSrc){
					cache=new Image();
					cache.src=rSrc;
					if(cache.complete){
						img.src=rSrc;
					}else cache.onload=cache.onreadystatechange=function(){
						if(cache&&cache.readyState&&cache.readyState!='loaded'&&cache.readyState!='complete'&&(!cache.width||cache.width*cache.height<1024)){return}
						img.src=rSrc;
						img.retina=true;
						cache=cache.onload=cache.onreadystatechange=null;
					}
				}
			});
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
		if(!isNaN(ROOT.screen.logicalXDPI) && !isNaN(ROOT.screen.systemXDPI)){
			return Math.round((ROOT.screen.deviceXDPI/ROOT.screen.logicalXDPI)*100)/100>1.5;
		}
		if(ROOT.navigator.msMaxTouchPoints){
			return Math.round((document.documentElement.offsetHeight/ROOT.innerHeight)*100)/100>1.5;
		}
		return false;
	})();

	var inited,
		myInit=function(){
			inited=inited||Struct();
		}
	
	Struct.isRetina && (ROOT.addEventListener ? (ROOT.addEventListener('DOMContentLoaded',myInit,false), ROOT.addEventListener('load',myInit,false)) : ROOT.attachEvent('onload',myInit));

	return ROOT[NS]=Struct;
	
})(window, function(name){
	return new arguments.callee.fn.init(name);
}, 'Retina');
