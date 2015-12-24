
##vRender.js是什么?
一个前端渲染库，帮助前端人员轻松将JSON数据渲染至html

兼容jquery ,zepto

##例子1

```code
    <div id="div1">{{value}}</div>
    <script>
        $.vRender("div1",{value:"hello"})
    </script>
```
###渲染结果
```code
    hello  
```

##字符串截取

```code
     <div id="view">
		{{value(5)}}
        <br>
        {{value(-5)}}
	</div>
    <script>
        $.vRender("div1",{value:"hello"})
    </script>
```
###渲染结果
```code
   12345... 
   *67890   
```

##object

```code
    <div id="view">		 
    
        {{text.value}}  <br>
        
        {{text.obj.p}}  <br>
        
        {{made||无}}
        
	</div>
    
    <script>
    
    var model={value:'hellow',text:{value:"word",obj:{p:"abcdeft"}}};

    $.vRander("view", model);
    
    </script>
```
###渲染结果
```code
    word 
    abcdeft 
    无 
```

##有问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* 邮件(888dazhuang@163.com)
* QQ: 360883898



