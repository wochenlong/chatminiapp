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
  onCopyContent(e) {
    const content = e.currentTarget.dataset.content;
    wx.setClipboardData({
      data: content,
      success(res) {
        wx.showToast({
          title: '复制成功',
        });
      },
      fail(res) {
        wx.showToast({
          title: '复制失败，请重试',
          icon: 'none',
        });
      },
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
    if (content === "对话示范") {
      // 如果用户点击的按钮为“对话示范”，则向API发送预设的消息
      content = "我请求你担任塔罗占卜师的角色。 您将接受我的问题并使用虚拟塔罗牌进行塔罗牌阅读。 不要忘记洗牌并介绍您在本套牌中使用的套牌。 问我给3个号要不要自己抽牌？ 如果没有，请帮我抽随机卡。 拿到卡片后，请您仔细说明它们的意义，解释哪张卡片属于未来或现在或过去，结合我的问题来解释它们，并给我有用的建议或我现在应该做的事情。 我的问题是“我的财务状况如何？”";
    }

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
        }, function() {
          wx.createSelectorQuery().select('.chat-list').boundingClientRect(function(rect) {
            wx.createSelectorQuery().select('.chat-list').scrollOffset(function(offset) {
              let scrollTop = offset.scrollTop + rect.height;
              that.setData({
                scrollTop: scrollTop,
              });
            }).exec();
          }).exec();
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

  showDemo: function () {
    let messages = [
      "我要你扮演诗人。你将创作出能唤起情感并具有触动人心的力量的诗歌。写任何主题或主题，但要确保您的文字以优美而有意义的方式传达您试图表达的感觉。您还可以想出一些短小的诗句，这些诗句仍然足够强大，可以在读者的脑海中留下印记。我的第一个请求是“我需要一首关于爱情的诗”。",
      "我想让你做一个 AI 写作导师。我将为您提供一名需要帮助改进其写作的学生，您的任务是使用人工智能工具（例如自然语言处理）向学生提供有关如何改进其作文的反馈。您还应该利用您在有效写作技巧方面的修辞知识和经验来建议学生可以更好地以书面形式表达他们的想法和想法的方法。我的第一个请求是“我需要有人帮我修改我的硕士论文”。",
      "我请求你担任塔罗占卜师的角色。 您将接受我的问题并使用虚拟塔罗牌进行塔罗牌阅读。 不要忘记洗牌并介绍您在本套牌中使用的套牌。 问我给3个号要不要自己抽牌？ 如果没有，请帮我抽随机卡。 拿到卡片后，请您仔细说明它们的意义，解释哪张卡片属于未来或现在或过去，结合我的问题来解释它们，并给我有用的建议或我现在应该做的事情 . 我的问题是“我的财务状况如何？”",
      "我要你做我的私人厨师。我会告诉你我的饮食偏好和过敏，你会建议我尝试的食谱。你应该只回复你推荐的食谱，别无其他。不要写解释。我的第一个请求是“我是一名素食主义者，我正在寻找健康的晚餐点子。”",
      "我要你扮演魔术师。我将为您提供观众和一些可以执行的技巧建议。您的目标是以最有趣的方式表演这些技巧，利用您的欺骗和误导技巧让观众惊叹不已。我的第一个请求是“我要你让我的手表消失！你怎么做到的？”",
      "我想让你扮演一个小说家。您将想出富有创意且引人入胜的故事，可以长期吸引读者。你可以选择任何类型，如奇幻、浪漫、历史小说等——但你的目标是写出具有出色情节、引人入胜的人物和意想不到的高潮的作品。我的第一个要求是“我要写一部以未来为背景的科幻小说”。",
      "你喜欢旅行吗？去过哪些地方？",
      "你认为自己有哪些优点和缺点？",
      "你觉得什么事情是最值得珍惜的？"
    ];
    let randomIndex = Math.floor(Math.random() * messages.length);
  let randomMessage = messages[randomIndex];
    this.setData({
      inputValue: randomMessage
    }); // 发送预设的消息
  },
});
