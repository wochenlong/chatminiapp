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
  onSignIn() {
    if (this.data.isSignedIn) {
      wx.showToast({
        title: '当前已经签过到了',
        icon: 'none',
      });
    } else {
      this.setData({
        isSignedIn: true,
      });
      wx.showToast({
        title: '签到成功',
        icon: 'success',
      });
    }
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
