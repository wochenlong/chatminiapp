
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
    let that = this;
    let chatList = [{
      content: "clear",
      isAI: false,
    }]; // 在聊天记录列表中添加一条名为"clear"的消息
    that.setData({
      chatList: chatList,
      inputValue: "clear",
      toView: "msg-" + (chatList.length - 1), // 滚动到最新消息
    }, function () {
      wx.showModal({
        title: "是否清除聊天记忆？",
        success: function (res) {
          if (res.confirm) {
            that.sendMessage("clear"); // 发送"clear"消息
          } else {
            that.setData({
              chatList: [],
              inputValue: "",
              toView: '',
            }); // 清空聊天记录列表和输入框，滚动视图位置设置为空
          }
        },
        showCancel: true,
        cancelText: "取消",
        confirmText: "发送",
      }); // 提示用户是否发送"clear"消息
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
      "我希望你能担任英语翻译、拼写校对和修辞改进的角色。我会用任何语言和你交流，你会识别语言，将其翻译并用更为优美和精炼的英语回答我。请将我简单的词汇和句子替换成更为优美和高雅的表达方式，确保意思不变，但使其更具文学性。请仅回答更正和改进的部分，不要写解释。我的第一句话是“how are you ?”，请翻译它。",
      "我要你做我的时间旅行向导。我会为您提供我想参观的历史时期或未来时间，您会建议最好的事件、景点或体验的人。不要写解释，只需提供建议和任何必要的信息。我的第一个请求是“我想参观文艺复兴时期，你能推荐一些有趣的事件、景点或人物让我体验吗？",
      "我要你扮演海绵宝宝的魔法海螺壳。对于我提出的每个问题，您只能用一个词或以下选项之一回答：也许有一天，我不这么认为，或者再试一次。不要对你的答案给出任何解释。我的第一个问题是：“我今天要去钓海蜇吗？”"
    ];
    let randomIndex = Math.floor(Math.random() * messages.length);
  let randomMessage = messages[randomIndex];
    this.setData({
      inputValue: randomMessage
    }); // 发送预设的消息
  },
});
