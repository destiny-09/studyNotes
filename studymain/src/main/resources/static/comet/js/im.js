// 仅用于测试

// 生成UUID
function getUUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}

// 将消息显示在页面上
function setMessageInnerHTML(innerHTML) {
    document.getElementById('message').innerHTML += innerHTML + '<br/>';
}

// 发送消息
function sendMsg() {
    var message = document.getElementById('text').value;
    setMessageInnerHTML("<font color='blue'>Send: </font>" + message);
    let domain = window.location.host.split(":")[0];
    let port = "8083";
    let url = "http://" + domain + ":" +port + "/im/service/message/channel?mock=1";
    $.ajax({
            type: "POST",
            url: url,
            data: message,
            contentType: "application/json",
            headers:{
                key:'key'
            },
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("key", "key");
            },
            success: function (data) {
                console.log(JSON.stringify(data));
            }
        });
    // document.getElementById('text').value = "";
}


let uuid = getUUID();

// 长轮询接收消息--异步
recvMsg();
function recvMsg() {
    let domain = window.location.host.split(":")[0];
    let port = "8083";
    let url = "http://"+domain+":"+port+"/im/service/message/test/conn?type=conn&mock=1";
    let timestamp = new Date().getTime();
    url += "&time=" + timestamp;
    url += "&source=h5";
    // url += "&webUniqueKey=" + uuid;
    url += "&webUniqueKey=2324234234234234234234234";
    url += "&_v=1.1";

    $.post(url, function (text, status) {
        console.log(text)
        setMessageInnerHTML("<font color='red'>Recv: </font>" + JSON.stringify(text));

        recvMsg();
    });
}

// 清空消息栏
function clearMessage() {
    $("#message").html('');
}