const nav = require("./config/nav");
const friendLink = require("./config/friendLink");
const head = require("./config/head");
const sidebar = require("./config/sidebar");

module.exports = {
  // 标签
  title: "摸鱼小屋",
  // 描述
  description: "花开亦花散",
  // head
  head: head,
  // 博客主题
  theme: "reco",
  // 主题配置
  themeConfig: {
    // 导航栏配置
    nav: nav,
    // 导航栏 logo
    logo: "/yixihan.png",
    type: "blog",
    blogConfig: {
      category: {
        location: 2,
        text: "分类",
      },
      tag: {
        location: 3,
        text: "标签",
      },
    },
    // 友链配置
    friendLink: friendLink,
    // 自定义配置侧边栏
    sidebar: sidebar,
    // 在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容
    subSidebar: "auto",
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "最后更新时间",
    // 作者信息
    author: "易曦翰",
    authorAvatar: "/yixihan.png",
    // 备案
    record: "蜀ICP备2021030835号",
    // 项目开始时间，只填写年份
    startYear: "2022",
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
