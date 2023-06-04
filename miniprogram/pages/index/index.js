Page({
  data: {
    power: 0,
    buttonStyle: "font-size: 20px; transform: scale(1);",
    buttonClicked: false,
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



  vibrateDevice() {
    wx.vibrateShort();
  },

  onReady() {
    // 显示分享按钮
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  }
});
