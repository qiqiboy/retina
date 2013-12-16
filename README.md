retina
======

retina屏幕高清图片解决方案

## 如何使用
```javascript
// 在页面中引入retina.js
// 如果页面上的img存在高清版本（对应的高清版地址为同目录下 xxx@2x.[jpg|png|gif]；例如：images/test.jpg 会被转为 images/test@2x.jpg）
// 如果需要自行定义高清图片地址，可以在img标签上添加属性 data-retina="retina.png" ，则程序会用data-retina中的地址替换原来的。

// 如果页面上存在动态插入的图片，则可以单独对该图片调用Retina方法
// <img id="imageID" src="1.png" />
Retina('imageID'); //Retina(document.getElementById('imageID'));

// 或者直接对该组新图片的父级结点使用Retina方法
// <div id="parentID"><img src="1.png" /><img src="2.png" /><img src="3.png" /><img src="4.png" /></div>
Retina('parentID'); //Retina(document.getElementById('parentID'));


````
