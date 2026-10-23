const e=`{
  "pages": [
    { "path": "pages/home/home", "style": { "navigationBarTitleText": "首页" } },
    { "path": "pages/course/course", "style": { "navigationBarTitleText": "课程详情" } }
  ],
  "subPackages": [
    {
      "root": "pages-mine",
      "pages": [
        { "path": "mine", "style": { "navigationBarTitleText": "我的" } }
      ]
    },
    {
      "root": "pages-order",
      "pages": [
        { "path": "order-list", "style": { "navigationBarTitleText": "订单列表" } },
        { "path": "order-detail", "style": { "navigationBarTitleText": "订单详情" } }
      ]
    }
  ],
  "preloadRule": {
    "pages/home/home": {
      "network": "all",
      "packages": ["pages-mine"]
    }
  }
}`;export{e as default};
