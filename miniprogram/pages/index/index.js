Page({
  data: {
    hello: "Hi~",
    power: 0,
  },

  change: function () {
    this.setData({
      hello: this.data.hello + "~~",
    });
  },

  onTapButton() {
    this.setData({
      power: this.data.power + 1,
    });
  },

  gotoChat() {
    wx.navigateTo({
      url: '/pages/form/index',
    });
  },

  changeColor() {
    // 生成随机颜色
    const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  
    // 检查按钮是否已经被点击过
    if (this.data.buttonClicked) {
      this.setData({
        buttonStyle: 'font-size: 20px; transform: scale(1);',
        buttonClicked: false,
      });
    } else {
      this.setData({
        buttonStyle: `font-size: 20px; transform: scale(1.2); background-color: ${randomColor};`,
        buttonClicked: true,
      });
    }
  },
  vibrateDevice() {
    wx.vibrateShort();
  }
});