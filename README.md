
##vRender.js是什么?
一个前端渲染库，帮助前端人员轻松将JSON数据渲染至html

兼容jquery ,zepto

##例子1

```code
<div id="div1">
    {{value}}
    <br>
    {{made||无}}
</div>
<script>
    $.vRender("div1",{value:"hello"})
</script>
```
###渲染结果
```code
hello
无
```
##建立虚拟view,id前边加“vDis"

```code
<div id="div1"></div>
<div id="vDisdiv1" style="display:none">
    {{value}}
    <br>
    {{made||无}}
</div>
<script>
    $.vRender("div1",{value:"hello"})
</script>
```
###渲染结果
```code
hello
无
```

##时间

```code
<div id="view">
	{{value(time)}}
    <br>
    {{value(shortTime)}}
</div>
<script>
    var model={value:"2015/12/24 11:22:56"}

    $.vRender("view", model);
</script>
```
###渲染结果
```code
2015/12/24 11:22:56 
2015/12/24
```

##状态

```code
<div id="view">
    {{value{0:未支付,1:已支付,2:已退款,:暂无内容}}}<br>
</div>
<script>
    var model=[{value:0},{value:1},{value:2}];

    $.vRander("view", model);
</script>
```
###渲染结果
```code
未支付
已支付
已退款
```
##调用已经写好的function

```code
<div id="view">
    {{value(func1)}}
    <br>
    {{text.value(func2)}}
    <br>
    {{text.obj.p(obj_func3)}}        
</div>
<script>
    function func1(e){
        return e+":func1";
    }
    
    function func2(e){
        return e+":func2";
    }
    
    function func3(e){
        return e.value+":func3";
    }

    var model={value:'hellow',text:{value:"word",obj:{p:"abcdeft"}}};

    $.vRender("view", model);
</script>
```
###渲染结果
```code
hellow:func1 
word:func2 
hellow:func3
```

##字符串截取

```code
<div id="view">
	{{value(5)}}
    <br>
    {{value(-5)}}
</div>
<script>
    $.vRender("view",{value:"1234567890"})
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

##数组

```code
<div id="view">
	{{value.0}}
   <br>
    {{value.1}}
</div>
<script>
    var model={value:["A","B"]}

    $.vRender("view", model);
</script>
```
###渲染结果
```code
A
B
```
##object数组

```code
<div id="view">
    {{name}}
    <br>
<br>
</div>
<script>
   var model=[{name:"小明"},{name:"小白"}];

    $.vRander("view", model);
</script>
```
###渲染结果
```code
小明
小白
```

##子级object数组

```code
<div id="view">
    角色：{{name}}<br>
    朋友：
        {{friend[list]}}<!--循环渲染 开始标记-->
            {{name[child]}}
        {{friend[end]}}<!--循环渲染 结束标记-->
<br>
</div>
<script>
    var model={name:"小红",friend:[{name:"小明"},{name:"小白"}]};
    
    $.vRender("view", model);
</script>
```
###渲染结果
```code
角色：小红
朋友： 小明 小白 
```
##更多级别的子级object数组

```code
<div id="view">
    角色：{{name}}<br>
    朋友：
    <ul>
        <li>
            {{friend[list]}}<!--循环渲染 开始标记-->
            朋友名字： {{name[child]}}<br>
            读书：
            <ul>
                {{book[list2]}}
                <li>
                    {{name[child2]}}
                </li>
                {{book[end2]}}
            </ul>
        </li>
        {{friend[end]}}<!--循环渲染 结束标记-->
    </ul>
    <br>
</div>

<script>

var model=[{name:"小红",
    friend:[
        {
            name:"小明",
                book:[
                    {name:'node.js'},
                    {name:'c#'}
                ]
            },
            {
                name:"小白",
                book:[
                    {name:'java'},
                    {name:'ruby'}
                ]
            }
        ]
    },
        {
            name:"小黑",
            friend:[
                {
                    name:"黑小明",
                    book:[
                        {name:'黑node.js'},
                        {name:'黑c#'}
                    ]
                },
                {
                    name:"黑小白",
                    book:[
                        {name:'黑java'},
                        {name:'黑ruby'}
                    ]
                }
            ]
        }
    ];

	$.vRender("view", model);
```
###渲染结果
```code
角色：小红
朋友：
    朋友名字： 小明
    读书：
        node.js        
        c#            
    朋友名字： 小白
    读书：
        java            
        ruby            

角色：小黑
朋友：
    朋友名字： 黑小明
    读书：
        黑node.js            
        黑c#
    朋友名字： 黑小白
    读书：
        黑java
        黑ruby            

```


##有问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* 邮件(888dazhuang@163.com)
* QQ: 360883898





