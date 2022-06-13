class webSocket {
  lockReconnect = false
  heartCheck = null
  websocket = null
  destory = false
  reconnectCount = 0
  constructor(url, callBack) {
    //判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
      this.url = url
      this.callBack = callBack
      this.initHeartCheck()
      this.connectSocket()
    } else {
      alert('Not support websocket')
    }
    
  }
  connectSocket() {
    try {
      this.websocket = new WebSocket(this.url)
      this.initEvent();
    } catch(e) {
      this.reconnect();
    }
  }
  initEvent(){
    const _this = this
    //连接发生错误的回调方法
    _this.websocket.onerror = function(e) {
      _this.reconnect();
      console.log("llws连接错误!");
    };

    //连接成功建立的回调方法
    _this.websocket.onopen = function(event) {
      // _this.heartCheck.reset().start();      
      _this.send("allUavInfo");
      console.log(_this.websocket)
      console.log("llws连接成功!"+new Date().toLocaleString());
    }
    
    //接收到消息的回调方法
    _this.websocket.onmessage = function(event) {
      //心跳检测(不需要可注释)
      _this.heartCheck.reset().start();
      // console.log("llws收到消息啦:" + event.data);
      _this.callBack(JSON.parse(event.data).data)
    }

    //连接关闭的回调方法
    _this.websocket.onclose = function(e) {
      _this.reconnect();
      console.log("llws连接关闭!"+new Date().toLocaleString());
    }
  }
  // 关闭连接
  closeWebSocket() {
    this.websocket.close()
  }
  // 给后台发送消息
  send(message) {
    if(!message || this.websocket.readyState !== 1 ) return
    this.websocket.send(message);
  }
   //重连
  reconnect() {
    if(this.lockReconnect || this.destory || this.reconnectCount > 30) return;
    this.reconnectCount++
    this.lockReconnect = true;
    setTimeout(() => {     // 没连接上会一直重连，设置延迟避免请求过多
      this.connectSocket();
      this.lockReconnect = false;
    }, 2000);
  }
  initHeartCheck() {
    const _this = this
    //心跳检测
    this.heartCheck = {
      timeout: 5000,        //1分钟发一次心跳
      timeoutObj: null,
      serverTimeoutObj: null,
      reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
      },
      start: function(){
          var self = this;
          this.timeoutObj = setTimeout(function(){
              //这里发送一个心跳，后端收到后，返回一个心跳消息，
              //onmessage拿到返回的心跳就说明连接正常
              _this.send("allUavInfo");
              self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                _this.websocket.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
              }, self.timeout)
          }, this.timeout)
      }
    }
  }
}
export default webSocket