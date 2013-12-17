/**
 * Retina v1.1
 * By qiqiboy, http://www.qiqiboy.com, http://weibo.com/qiqiboy, 2013/12/16
 */
;
(function(ROOT, Struct, NS, undefined){
	"use strict";

	Struct.fn=Struct.prototype={
		version:'1.1',
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
					rSrc=img.getAttribute('data-retina') || src.replace(/(\.)(\w+)$|()(\b)$/, "@2x$1$2");
				if(!img.retina && src!=rSrc){
					Struct.imageReady(rSrc, function(){
						var style=img.style,
							dp=style.display;
						img.src=rSrc;
						style.display='none';//在图片未onload前，浏览器不会更新图片显示。这里手动引起浏览器repaint，以更新图片显示。只对webkit内核浏览器有效
						setTimeout(function(){
							style.display='block';
							style.display=dp;
						},0);
						img.retina=true;
					});
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
	
	/**
	 * imageReady v1.0.1
	 * By qiqiboy, http://www.qiqiboy.com, http://weibo.com/qiqiboy, 2013/03/29
	 */
	Struct.imageReady=(function(){
		var list=[],
			timer=null,
			prop=[['width','height'],['naturalWidth','naturalHeight']],
			natural=Number(typeof (new Image()).naturalWidth=='number'),//是否支持HTML5新增的 naturalHeight
			tick=function(){
				var i=0;
				while(i<list.length){
					list[i].end?list.splice(i--,1):check.call(list[i]);
					i++;
				}
				list.length && (timer=setTimeout(tick,50)) || (timer=null);
			},
			/** overflow: 检测图片尺寸的改变
			  *  img.__width,img.__height: 初载入时的尺寸
			  */
			check=function(){
				if(this[prop[natural][0]]!==this.__width || this[prop[natural][1]]!==this.__height || this[prop[natural][0]]*this[prop[natural][1]]>1024){
					this.onready(this);
					this.end=true;
				}
			};
			
		return function(_img, onready, onload, onerror){
			onready=onready || new Function();
			onload=onload || new Function();
			onerror=onerror || new Function();
			var img=typeof _img=='string'?new Image():_img;
			img.onerror=function(){// ie && ie<=8 的浏览器必须在src赋予前定义onerror
				onerror.call(img,img);
				img.end=true;
				img=img.onload=img.onerror=img.onreadystatechange=null;
			}
			if(typeof _img=='string') img.src=_img;
			if(!img)return; //为了防止onerror触发后img=null
			if(img.complete){
				onready.call(img,img);
				onload.call(img,img);
				return;
			}
			img.__width=img[prop[natural][0]];
			img.__height=img[prop[natural][1]];
			img.onready=onready;
			check.call(img);
			img.onload=img.onreadystatechange=function(){
				if(img&&img.readyState&&img.readyState!='loaded'&&img.readyState!='complete'){return;}
				!img.end && check.call(img);
				onload.call(img,img);
				img=img.onload=img.onerror=img.onreadystatechange=null;
			}
			if(!img.end){
				list.push(img);
				!timer && (timer=setTimeout(tick,50));
			}
		}
	})();

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
			return Math.round((ROOT.screen.deviceXDPI/ROOT.screen.logicalXDPI)*100)/100>=1.5;
		}
		if(ROOT.navigator.msMaxTouchPoints){
			return Math.round((document.documentElement.offsetHeight/ROOT.innerHeight)*100)/100>=1.5;
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
