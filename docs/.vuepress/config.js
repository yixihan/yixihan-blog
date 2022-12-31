const nav = require("./config/nav");

module.exports = {
  title: "易曦翰",
  description: "花开亦花散",
  // "dest": "public",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  theme: "reco",
  themeConfig: {
    // 导航栏配置
    nav: nav,
    // 导航栏 logo
    logo: "./pubilc/yixihan.png",
    type: "blog",
    blogConfig: {
      category: {
        location: 2,
        text: "Category",
      },
      tag: {
        location: 3,
        text: "Tag",
      },
    },
    // 友链配置
    friendLink: [],
    // 自定义配置侧边栏
    sidebar: {},
    subSidebar: "auto", //在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容,

    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "最后更新时间",
    author: "易曦翰",
    authorAvatar: "./pubilc/yixihan.png",
    // 备案
    record: "ICP 备案文案",
    recordLink: "ICP 备案指向链接",
    cyberSecurityRecord: "公安部备案文案",
    cyberSecurityLink: "公安部备案指向链接",
    // 项目开始时间，只填写年份
    startYear: "2023",
  },
  // markdown 配置
  markdown: {
    lineNumbers: true,
  },
  // 多语言配置
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
};
