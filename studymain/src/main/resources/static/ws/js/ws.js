// 仅用于测试

　  function getUrlParam(paraName) {
　　　　var url = document.location.toString();
　　　　var arrObj = url.split("?");
　　　　if (arrObj.length > 1) {
　　　　　　var arrPara = arrObj[1].split("&");
　　　　　　var arr;
　　　　　　for (var i = 0; i < arrPara.length; i++) {
　　　　　　　　arr = arrPara[i].split("=");
　　　　　　　　if (arr != null && arr[0] == paraName) {
　　　　　　　　　　return arr[1];
　　　　　　　　}
　　　　　　}
　　　　}
       return "";
　　}

    let domain = window.location.host.split(":")[0];
    let port = getUrlParam("port");
    domain += port;

    $.cookie("clientType", getUrlParam("clientType"), {
        expires:1,
        path:'/'
    })
    $.cookie("SESSION", getUrlParam("SESSION"), {
        expires:1,
        path:'/'
    })

    $.cookie("user", getUrlParam("user"), {
        expires:1,
        path:'/'
    })

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let protocol = "ws://";
    let wss = getUrlParam("wss");
    if (wss) {
        protocol = "wss://";
    }
    var uri = protocol + domain + "/im/websocket";

    var websocket = null;
    //判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
        websocket = new WebSocket(uri);
    } else if ('MozWebSocket' in window) {
        websocket = new MozWebSocket(uri);
    } else {
        alert('当前浏览器 Not support websocket')
        websocket = new SockJS(uri);
    }

    //连接发生错误的回调方法
    websocket.onerror = function () {
        setMessageInnerHTML("<font color='red'>WebSocket连接发生错误</font>");
    };

    //连接成功建立的回调方法
    var timerId;
    websocket.onopen = function () {
        setMessageInnerHTML("<font color='red'>WebSocket连接成功 ["+new Date()+"]</font>");
        timerId = setInterval(function () {
            manHeartbeat()
        }, 25000);
        $("#head").css('backgroundColor', null);
    }

    //接收到消息的回调方法
    websocket.onmessage = function (event) {
        setMessageInnerHTML("收到消息：<font color='blue'>" + event.data + "</font>");
    }

    //连接关闭的回调方法
    websocket.onclose = function () {
        setMessageInnerHTML("<font color='red'>WebSocket连接关闭 ["+new Date()+"]</font>");
        window.clearInterval(timerId);
        $("#head").css('backgroundColor', '#FA8072');
        console.log("停止心跳定时任务成功...");
    }

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
        closeWebSocket();
    }

    //将消息显示在网页上
    var order = 'asc';
    function setMessageInnerHTML(innerHTML) {
        var message = document.getElementById('message');
        if('asc' == order){// 按照时间顺序
            message.innerHTML += innerHTML + '<br/>';
        }else{// 按照时间倒序
            message.innerHTML = innerHTML + '<br/>' +  message.innerHTML;
        }
    }

    //关闭WebSocket连接
    function closeWebSocket() {
        websocket.close();
    }

    //发送消息
    function sendMsg() {
        var message = document.getElementById('text').value;
        if (websocket.readyState == websocket.OPEN) {
            websocket.send(message);
            document.getElementById('text').value = "";
            setMessageInnerHTML("<font color='red'>发送消息：" + message + "</font>");
        } else {
                alert("连接失败!");
        }
    }

    // 手动触发心跳
    function manHeartbeat() {
        var time = new Date().toLocaleString();
        if (websocket.readyState == websocket.OPEN) {
            var params = {
                "_v":"1.1",
                "platform":"GOLD_SHOP",
                "msgType":"HEART_BEAT"
            };
            var message = JSON.stringify(params);
            websocket.send(message);
            setMessageInnerHTML("<font color='green'>心跳 [" + time + "]</font>");
        } else {
            console.log("-- 连接已断开 ["+time+"] --")
        }
    }