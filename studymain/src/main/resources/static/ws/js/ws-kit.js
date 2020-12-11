var operationValueArray = [];
for(var i=0;i<$(".operations").length;i++){
    operationValueArray.push($($(".operations")[i]).val());
}
genMsgId('immediate-msg');
genMsgId('invitation');
console.log("初始化完成");

// radio选中控制表单显隐逻辑
$(".operations").on('click', function () {
    var operation = $(".operations:checked").val();
    console.log("operation = "+operation);
    $.each(operationValueArray, function (index, item) {
        if(operation == item){
            $("#"+item).show();
        }else{
            $("#"+item).hide();
        }
    })
});

// 生成消息id
function genMsgId(id) {
    var timestamp = new Date().getTime().toString();
    timestamp = timestamp.substr(timestamp.length - 12);
    var random = parseInt(Math.random()*(99999-10000) + 10000);
    $("#"+id+"-msgId").val("02" + timestamp + random);
}

// 清空消息栏
function clearMessage() {
    $("#message").html('');
}

// 切换输出消息顺序
$("#switchOrder").html('switch('+order+')');
function switchOrder() {
    if('asc' == order){
        order = 'desc';
    }else{
        order = 'asc';
    }
    $("#switchOrder").html('switch('+order+')');
}

// 发送消息
function sendMessage(id) {
    console.log("id = "+id+" 发送消息");
    var params;
    if("heartbeat" == id){// 心跳
        params = buildHeartbeatJson(id);
    }else if("immediate-msg" == id){// 收发消息
        params = buildImmediateMsgJson(id);
    }else if("ack" == id){// 回执（已接收/已读）
        params = buildAckJson(id);
    }else if("invitation" == id){// 邀评
        params = buildInvitation(id);
    }else{
        alert("非法的业务类型");
    }

    if (websocket.readyState == websocket.OPEN) {
        var json = JSON.stringify(params);
        websocket.send(json);
        setMessageInnerHTML("<font color='red'>发送消息：" + json + "</font>");
    } else {
        alert("连接失败!");
    }
}

// 心跳
function buildHeartbeatJson(id) {
    var params = {
        "_v": $("#"+id+"-_v").val(),
        "platform": $("#"+id+"-platform").val(),
        "type": $("#"+id+"-type").val()
    };
    return params;
}

// 收发消息
function buildImmediateMsgJson(id) {
    var params = {
        "msgId": $("#"+id+"-msgId").val(),
        "_v": $("#"+id+"-_v").val(),
        "platform": $("#"+id+"-platform").val(),
        "type": $("#"+id+"-type").val(),
        "companyId": $("#"+id+"-companyId").val(),
        "dialogId": $("#"+id+"-dialogId").val(),
        "fromUserId": $("#"+id+"-fromUserId").val(),
        "fromUserName": $("#"+id+"-fromUserName").val(),
        "toUserId": $("#"+id+"-toUserId").val(),
        "toUserName": $("#"+id+"-toUserName").val(),
        "content": $("#"+id+"-content").val(),
        "contentType": $("#"+id+"-contentType option:selected").val()
    };
    return params;
}

// 回执
function buildAckJson(id) {
    var params = {
        "_v": $("#"+id+"-_v").val(),
        "platform": $("#"+id+"-platform").val(),
        "type": $("#"+id+"-type").val(),
        "msgIdList": $("#"+id+"-msgIdList").val().split(",")
    };
    return params;
}

// 邀评
function buildInvitation(id) {
    var active = $("#"+id+"-active option:selected").val();
    var content = "{'active':'" + active + "'}";
    var params = {
        "msgId": $("#"+id+"-msgId").val(),
        "_v": $("#"+id+"-_v").val(),
        "platform": $("#"+id+"-platform").val(),
        "type": $("#"+id+"-type").val(),
        "companyId": $("#"+id+"-companyId").val(),
        "dialogId": $("#"+id+"-dialogId").val(),
        "fromUserId": $("#"+id+"-fromUserId").val(),
        "fromUserName": $("#"+id+"-fromUserName").val(),
        "toUserId": $("#"+id+"-toUserId").val(),
        "toUserName": $("#"+id+"-toUserName").val(),
        "content": content
    };
    return params;
}
