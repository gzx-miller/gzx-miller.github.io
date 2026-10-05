const n=`{
  "pages": [
    {
      "path": "pages/home/home",
      "style": { "navigationBarTitleText": "松果学习" }
    },
    {
      "path": "pages/course/course",
      "style": { "navigationBarTitleText": "课程详情" }
    },
    {
      "path": "pages/mine/mine",
      "style": { "navigationBarTitleText": "我的" }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "小松鼠举栗子",
    "navigationBarBackgroundColor": "#fff5e6",
    "backgroundColor": "#fff5e6"
  },
  "tabBar": {
    "color": "#7c563f",
    "selectedColor": "#b7431f",
    "list": [
      { "pagePath": "pages/home/home", "text": "首页" },
      { "pagePath": "pages/mine/mine", "text": "我的" }
    ]
  }
}`;export{n as default};
