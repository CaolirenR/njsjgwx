export default defineAppConfig({
  pages: [
    //   修改这里改变启动页面
    'pages/home/index',
    'pages/index/index',
    //   取消这个首页了
    'pages/subjects/index',
    'pages/user/index',
    "pages/course/index",
  ],
  subpackages: [{
    'root': 'pages/exam_pages/',
    'pages': [
      'classification/index',
      'exam/index',
      'exam_detail/index',
      'all_subject/index',
      'course/index',
      'course_detail/index',
      'course_section/index',
      'answer/index',
      'favorite/index',
      'record/index',
      'Speciality/index',
    ]
  }, {
    'root': 'pages/user_pages/',
    'pages': [
      'user_info/index',
      'messages/index',
      'message_detail/index',
      'webview/index',
      'about/index',
      'share/index',
      'phone_info/index',
      'certificate/index',
      'certificate_detail/index',
      'certificate_webView/index',
      'contact_clients/index',
      'privacy_policy/index',
      'user_services_agreement/index',
    ]
  }],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: "#505050",
    selectedColor: "#3c4a54",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    position: "bottom",
    list: [
      {
        "pagePath": "pages/home/index",
        "text": "首页",
        "iconPath": "assert/home.png",
        "selectedIconPath": "assert/home_selected.png"
      },
      {
        "pagePath": "pages/subjects/index",
        "text": "考试",
        "iconPath": "assert/subjects.png",
        "selectedIconPath": "assert/subjects_selected.png"
      },
      {
        "pagePath": "pages/course/index",
        "text": "课程",
        "iconPath": "assert/course.png",
        "selectedIconPath": "assert/course_selected.png"
      },
      {
        "pagePath": "pages/user/index",
        "text": "我的",
        "iconPath": "assert/user.png",
        "selectedIconPath": "assert/user_selected.png"
      },
    ]
  },
  usingComponents: {

  }
})
