# MENU — 现代几何动态饮品单

六页独立视觉风格，32 款正式饮品。仅中英文饮品文字，无饮品图片、无价格。

## 在线访问

[打开 Menu 饮品单](https://oscarcarrotluo.github.io/Homebar/)

网站由 GitHub Pages 从 `main` 分支的根目录发布。将菜单修改提交并推送到 `main` 后，GitHub 会自动更新网站。

## 直接打开

双击 `index.html` 即可使用。HTML、样式、交互、三维库与字体全部保存在本地；无构建步骤、无 npm 依赖、无 CDN 请求。

保留目录结构，不要只移动 HTML 而遗漏旁边的资源。

## 六页设计

| 页面 | 饮品 | 几何与运动 |
| --- | --- | --- |
| Sweet 01 | 5 款奶盖茶饮 | 柠檬黄网格球、漂浮薄片与轻盈卫星 |
| Sweet 02 | 6 款果香椰饮 | 薄荷绿分层圆片、珊瑚橙球与错位波动 |
| Coffee 01 | 5 款浓郁咖啡 | 深咖底色、奶油色连续环结与慢速旋转 |
| Coffee 02 | 5 款椰香果萃咖啡 | 琥珀色渐变方片、扭转堆叠与下落微粒 |
| Cocktail 01 | 5 款高杯鸡尾酒 | 钴蓝与青柠撞色、上升气泡和立体线框 |
| Cocktail 02 | 6 款经典短饮 | 酒红底色、铜色放射薄片与环绕运动 |

三维构成由代码实时生成，没有照片、外部模型或贴图。甜饮与咖啡名称及鸡尾酒列表按项目「生成饮品照片素材」对话最终要求核对；英文为菜单用译名。

## 使用方式

- 点击顶部分类、底部页码或上一页 / 下一页。
- 键盘左右方向键翻页，手机左右滑动翻页。
- 鼠标移动会产生轻微三维视差；悬停饮品名会略微提升对应几何运动速度。
- 顶部按钮可以暂停动效；系统“减少动态效果”偏好会默认关闭动效。
- 六页支持独立链接，例如 `index.html#coffee-2`；浏览器前进 / 后退可恢复页面。
- 手机采用纵向排版；iPad 横竖屏采用对应的双栏比例。
- WebGL 不可用时自动显示轻量 CSS 几何动效。
- 浏览器打印会输出全部六页文字菜单。

## 上传 GitHub Pages

1. 将本目录的**内容**上传至你的 GitHub 仓库根目录，保留 `fonts/` 与 `vendor/` 两个子目录。
2. 打开仓库 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**，选择 `main` 分支及 `/ (root)`，保存。
4. 等待 GitHub Pages 发布后，通过该页面提供的网址访问。

所有资源均使用相对路径，适合 `用户名.github.io/仓库名/` 形式的项目地址。

参考：[GitHub Pages 官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。

## 修改菜单

编辑 `menu-data.js` 的 `drinks` 数组即可。例如：

```js
['柠檬冰奶', 'Lemon Iced Milk']
```

每页的 `colors` 依次为背景、文字、强调色和分隔线颜色。页面布局和手机 / iPad 断点位于 `styles.css`；三维场景位于 `geometry.js`。

## 文件结构

```text
index.html              网页入口
menu-data.js            32 款饮品与页面配色
menu.js                 六页渲染、导航和动效开关
geometry.js             六套程序化三维几何场景
styles.css              独立主题、响应式和 CSS 降级动效
fonts/                  本地 Manrope 字体和 OFL 许可
vendor/three.min.js      本地 Three.js 0.160.0
vendor/THREE-LICENSE.txt Three.js MIT 许可
.nojekyll               GitHub Pages 静态资源配置
README.md               本说明
```

## 第三方许可

- Three.js 0.160.0：MIT，许可随 `vendor/THREE-LICENSE.txt` 提供。
- Manrope：SIL Open Font License 1.1，许可随 `fonts/OFL.txt` 提供。

采用经典脚本形式以兼容直接双击本地 HTML，不需要启用开发服务器。首次加载时 Three.js 可能输出其经典脚本版本的弃用提示，不影响本地功能。
