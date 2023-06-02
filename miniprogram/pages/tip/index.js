Page({
  data: {
    chatList: [], // 聊天记录列表
    inputValue: '', // 输入框的值
    toView: '', // 滚动到的位置
    usrid: '', // 用户ID
  },
  onLoad: function() {
    // 生成8位随机数字作为usrid
    let usrid = '';
    for (let i = 0; i < 8; i++) {
      usrid += Math.floor(Math.random() * 10);
    }
    this.setData({
      usrid: usrid
    });
  },
  // 发送消息
  sendMessage: function() {
    let content = this.data.inputValue; // 获取输入框的值
    let chatList = this.data.chatList;
    chatList.push({
      content: content,
      isAI: false
    }); // 将用户发送的消息添加到聊天记录列表中
    this.setData({
      chatList: chatList,
      inputValue: '',
      toView: 'msg-' + (chatList.length - 1) // 滚动到最新消息
    });
    // 发送请求到API
    let that = this;
    wx.request({
      url: 'https://api.chat.t4wefan.pub/chatglm?usrid=' + that.data.usrid + '&source=glmmini&msg=' + content,
      method: 'GET',
      success(res) { let chatList = that.data.chatList; chatList.push({ content: res.data.text, isAI: true }); // 将AI返回的消息添加到聊天记录列表中 that.setData({ chatList: chatList, toView: 'msg-' + (chatList.length -1) // 滚动到最新消息 }); console.log(res.data); // 打印API返回的数据到控制台上 wx.showToast({ title: res.data.text, // 将API返回的数据展示在页面上 icon: 'none’, duration: 2000 }); }
      }
    });
    
  },
  // 绑定输入框输入事件，实时获取输入框的值
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
});