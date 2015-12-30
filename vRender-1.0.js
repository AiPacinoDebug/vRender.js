 (function (e) {
        e.$ || (e.$ = {});

        function _createpType(value, dataType, msg) {
            dataType && (dataType = dataType[0])
            if (dataType == "(time)") {
            	if(_num.test(value)){
                    value=value*1;
                }
                var _tm = new Date(value);
                if (_tm != "Invalid Date") {
                    value = _tm.getFullYear() + "/" + (_tm.getMonth() + 1) + "/" + _tm.getDate() + " " + _tm.getHours() + ":" + _tm.getMinutes() + ":" + _tm.getSeconds()
                }
            } else if (dataType == "(shortTime)") {
            	if(_num.test(value)){
                    value=value*1;
                }
                var _tm2 = new Date(value);
                if (_tm2 != "Invalid Date") {
                    value = _tm2.getFullYear() + "/" + (_tm2.getMonth() + 1) + "/" + _tm2.getDate();
                }
            } else if (dataType == "(image)") {
                value = toImgUrl(value);
            }
            else if (dataType == "(litImage)") {
                value = toImgUrl(value, 1);
            }
            else {
                if (dataType) {
                    dataType = dataType.replace(_rdkh, "");
                    //小括号中的如果是数字类型，就执行截取字符串操作。
                    if (_num.test(dataType) === true) {
                        if (1 * dataType > 0) {
                            value = value.substring(0, 1 * dataType) + "...";
                        }
                        else {
                            value = "*" + value.substring(-1 * dataType, value.length);
                        }
                    } else {
                    	//小括号中的内容，判断是否含有此全局函数，有就调用
                        if (typeof (window[dataType]) == "function") {
                        	//value是JSON中的结果
                            return window[dataType](value);
                        }
                        else if (typeof (window[dataType.replace("obj_", "")]) == "function") {
                        	//msg是value的父级
                            return window[dataType.replace("obj_", "")](msg);
                        }
                        if (/(y+)/.test(dataType)){
                            value = format(dataType, value);
                        }
                        else {
                            return window[dataType];
                        }
                    }
                }
            }
            return value;
        }
        var _rdkh = new RegExp("^[{(]|[)}]$", "g");
        function format(fmt,value){
            if(_num.test(value)){
                value=value*1;
            }
            var time = new Date(value);
            if (time != "Invalid Date") {
            var o = {
                "M+": time.getMonth() + 1,                 //月份
                "d+": time.getDate(),                    //日
                "h+": time.getHours(),                   //小时
                "m+": time.getMinutes(),                 //分
                "s+": time.getSeconds(),                 //秒
                "q+": Math.floor((time.getMonth() + 3) / 3), //季度
                "S": time.getMilliseconds()             //毫秒
            };

                fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }else{
                return time+"";
            }
        }
        function _createValue(columnValue, data, status) {
            var nodata = "";
            var value = data[columnValue]|| (typeof(data[columnValue])=="number"?data[columnValue]:"");
	    /////根据obj.x.x.x.x.x.x.读取相应JSON中的数据
            if (columnValue.indexOf("||") > -1) {
                nodata = columnValue.split("||")[1];
                value = data[columnValue.split("||")[0]]
            }

            if (columnValue.indexOf(".") > -1) {
                var columnAr = columnValue.split('.');
                var l=columnAr.length;
                if (data[columnAr[0]] && data[columnAr[0]][columnAr[1]]) {
                    value = data[columnAr[0]][columnAr[1]];
                } else {
                    value = nodata;
                }
                for(var i=2;i<=l;i++){
                    value[columnAr[i]]&&(value=value[columnAr[i]]);
                }
            }

            if (status) {
                status = status[0];
                var p = status.replace(_rdkh, "").split(",");
                var l = p.length;
                for (var i = 0; i < l; i++) {
                    var _pNm = p[i].split(":");
                    if (_pNm[0] == value) {
                        value = _pNm[1];
                    }
                }
            }

            return value||nodata;
        }
        var _getText = "[^\\s(}})({{)]+";//读取{{text}}中的text
        var _getChild = "\\[child[0-9]{0,1}\\]";//读取{{text[child]}}中的child
        var _getList = "\\[list[0-9]{0,1}\\]";//读取{{text[list]}}中的list
        var _getType = "\(\\([^\\s]+\\)\){0,1}";//读取{{text(time)}}中的time
        var _getTypeV = "\(\\([^\\s]+\\)\)";//读取{{text(time)}}中的time,同上，应用在一定含有(time)的场景
        
        var _getStatus = "\({[^\\s]+}\){0,1}";//读取{{text{0:123}}}中的{0:123}
        var _getStatusV = "\({[^\\s{}]+[:,]+[^\\s{}]+}\){1}";//读取{{text{0:123}}}中的{0:123}，应用在一定含有(time)的场景
        
        
        var _reText = new RegExp(_getStatusV + "|\([{]{2}|[}]{2}\)|" + _getChild + "|" + _getList + "|" + _getType, "g");//获取所有{{xx[xx](xxx){x:xxx}}}
        var _canRe = new RegExp("[{]{2}|[}]{2}|" + _getChild + "|\\([^\\s]+\\)}}", "g");
        var _getAllChild = new RegExp("{{" + _getText + _getChild + _getType + _getStatus + "}}", "g");
        var _getAllList = new RegExp("{{" + _getText + _getList + _getType + _getStatus + "}}", "g");
        var _getAll = new RegExp("{{" + _getText + _getType + _getStatus + "}}", "g");
        var _anNum2 = new RegExp("[^\\(\\)]+"), _num = new RegExp("^-{0,1}[0-9]+$");

        function vCreateChild(data,_attr,str,level){//参数data:json数据，参数_attr,当前属性的名字，参数str:html字符串
            var msg=data[_attr]||[];
            
            //截取[list] [end]之间的内容
            var childName = "{{" + _attr + "[list" + level + "]}}", childEnd = "{{" + _attr + "[end" + level + "]}}";
            var childStart = str.indexOf(childName);
            var childend = str.indexOf(childEnd);
            
            
            if (childStart > -1) {
                var regstr = str.substring(childStart + childName.length, str.indexOf(childEnd));
                var l = msg.length;
                var restultStr = "";
                var _getNowChild = new RegExp("{{" + _getText + "\\[child" + level + "\\]" + _getType + _getStatus + "}}", "g");
                for (var i = 0; i < l; i++) {
                    var tmp = regstr;
                    //循环至{{xxx[](){}}}格式内容全部被渲染完成
                    while (tmp.match(_getNowChild)) {
                        var pstr = tmp.match(_getNowChild);
                        var text = pstr[0].replace(_reText, "");//获取去{{text[](){}}}中的text
                        var pType = pstr[0].match(_getTypeV);//获取去{{text[](){}}}中的()
                        var status = pstr[0].match(_getStatusV);//获取去{{text[](){}}}中的{}
                        if (msg[i].constructor != Array){
                           tmp = tmp.replace(pstr[0],msg[i], pType, msg[i])
                        }
                        else{
                           tmp = tmp.replace(pstr[0], _createpType(_createValue(text, msg[i], status), pType, msg[i]))
                        }
                    }
                    tmp=createByLevel(msg[i],tmp,level?level*1+1:level+2);
                    restultStr += tmp;
                }
                return str.substring(0, childStart) + restultStr + str.substring(childend + childEnd.length, str.length - 1);
            }else{
                return str;
            }
        }

        function createByLevel(data,tempStr,level){//参数data：json数据，参数tempStr:html内容（字符串）,参数level:渲染级别
            var _getNowList = new RegExp("{{" + _getText + "\\[list" + level + "\\]" + _getType + _getStatus + "}}", "g");

            var lkey = tempStr.match(_getNowList);
            if (lkey) {
                var _attr = lkey[0].replace(_reText, "");
                return vCreateChild(data,_attr,tempStr,level);
            }else{
                return tempStr;
            }
        }
        function _BaseRanderAppend(data, _tempStr,dl) {//参数data：json数据，参数_tempStr:html内容（字符串）
		dl =dl?dl:data.length;
            var str = "";
            for (var j = 0; j < dl; j++) {

               var tempStr = _tempStr;
               tempStr=createByLevel(data[j],tempStr,"");


                str +=_angular(tempStr, data[j]);
            }
            return str;
        }

        function _angular(str, msg) {//这个函数是最后执行的，渲染非[list]的内容，且清除所有多余{{}}
            while (str.match(_getAll)) {
                var pstr = str.match(_getAll);
                var text = pstr[0].replace(_reText, "");
                var status = pstr[0].match(_getStatusV);
                var pType = pstr[0].match(_getTypeV);
                str = str.replace(pstr[0], _createpType(_createValue(text, msg, status), pType, msg));
            }
            return str;
        }

        function _createThisEle(element) {
            if (!window["v" + element]) {
                window["v" + element] = document.getElementById("vDis"+element)?document.getElementById("vDis"+element).innerHTML:document.getElementById(element).innerHTML;
            }
            return window["v" + element];
        }
        e.$.vRender = function (element, date, config) {
            if (date.constructor != Array) {
                date = [date];
            }
            config || (config = {});//将来扩展配置用，暂时没用
            var strt = _createThisEle(element);//将html保存到全局变量，下次调用直接从全局变量获取
            document.getElementById(element).innerHTML =_BaseRanderAppend(date, strt);

        }
    })(window)
