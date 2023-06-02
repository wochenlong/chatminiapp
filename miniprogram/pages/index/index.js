Page({
  data: {
    chatList: [], // 聊天记录列表
    inputValue: "", // 输入框的值
    toView: "", // 滚动到的位置
    usrid: "", // 用户ID
  },
  onLoad: function () {
    // 生成8位随机数字作为usrid
    let usrid = "";
    for (let i = 0; i < 8; i++) {
      usrid += Math.floor(Math.random() * 10);
    }
    this.setData({
      usrid: usrid,
    });
  },
  // 发送消息
  sendMessage: function () {
    let content = this.data.inputValue.trim(); // 获取输入框的值并去除首尾空格
    if (!content) {
      // 判断输入框的值是否为空
      wx.showToast({
        title: "输入不能为空",
        icon: "none",
      });
      return;
    }
    let chatList = this.data.chatList;
    chatList.push({
      content: content,
      isAI: false,
    }); // 将用户发送的消息添加到聊天记录列表中
    this.setData({
      chatList: chatList,
      inputValue: "",
      toView: "msg-" + (chatList.length - 1), // 滚动到最新消息
    });
    // 发送请求到API
    let that = this;
    let typingTimer = setTimeout(function () {
      chatList.push({
        content: "对方正在输入...",
        isAI: true,
      }); // 添加“对方正在输入”的提示
      that.setData({
        chatList: chatList,
        toView: "msg-" + (chatList.length - 1), // 滚动到最新消息
      });
    }, 500); // 设置定时器，每隔500ms发送一次请求
    wx.request({
      url:
        "https://api.chat.t4wefan.pub/chatglm?usrid=" +
        that.data.usrid +
        "&source=glmmini&msg=" +
        content,
      method: "GET",
      success: function (response) {
        clearTimeout(typingTimer); // 清除定时器
        let chatList = that.data.chatList;
        chatList.pop(); // 移除“对方正在输入”的提示
        chatList.push({
          content: response.data,
          isAI: true,
        }); // 将API返回的消息添加到聊天记录列表中
        that.setData({
          chatList: chatList,
          toView: "msg-" + (chatList.length - 1), // 滚动到最新消息
        });
      },
    });
  },

  // 绑定输入框输入事件，实时获取输入框的值
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },
  clearChatList: function () {
    this.setData({
      chatList: [],
      usrid: "",
    });
    // 重新生成8位随机数字作为usrid
    let usrid = "";
    for (let i = 0; i < 8; i++) {
      usrid += Math.floor(Math.random() * 10);
    }
    this.setData({
      usrid: usrid,
    });
  },
});
