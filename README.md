# MENU — 现代几何动态饮品单

六页独立视觉风格，32 款正式饮品。菜单仅展示中英文饮品名称，不设价格；点击任一饮品可进入简洁的动态详情页。

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

## 饮品详情

每款详情仅展示程序绘制的动态杯身、中英文名称和主要用料。沿用所属菜单的配色；手机和 iPad 竖屏均采用居中布局。仅保留一个返回箭头与暂停动效图标，没有用量、制作步骤或额外说明。

- 32 个独立地址，例如 `index.html#drink/moscow`，可刷新、分享与浏览器前进 / 后退。
- 侧视图由本地 SVG 代码绘制，呈现对应杯型、奶盖、液体层次、冰块与气泡；液面连续流动，分层饮品会自动舒展并合拢，不依赖照片或外部素材。
- 返回时恢复原菜单页与饮品焦点；详情页左右滑动或使用方向键切换饮品，Esc 返回菜单。
- `drink-data.js` 的 `essentials` 保存页面显示的核心用料（数量按实际组成，不限制为两三项），`ingredients` 保留核对资料，其他字段为视觉设置，顺序对应 `menu-data.js` 的 32 款饮品。其中 layer 的 weight 只是绘图比例，不是调制用量。
- 甜饮与咖啡以项目内已确认的用料和杯型为基础；未确认部分是用料参考，不视为店内最终配方。Moscow 保持咖啡、牛奶、奶油、巧克力粉的版本，中文为「莫斯科」。

配方资料仅用于核对原料，不在页面增加说明文字。经典鸡尾酒参考 [IBA](https://iba-world.com/cocktails/)、[Tanqueray](https://www.tanqueray.com/en-gb/cocktails/gin-and-tonic-tanqueray-london-dry)、[Disaronno](https://disaronno.com/zh-hans/drinks/godfather/) 与 [Difford’s Guide](https://www.diffordsguide.com/cocktails/recipe/2887/sweet-martini)，每款来源保存在 `drink-data.js`。小红书搜索需要登录，未能核实其浏览 / 点赞排名，未声称采用高赞笔记。

## 使用方式

- 点击顶部分类或底部六个页码；主界面已移除重复分类说明、装饰编号、动效文字与上一页 / 下一页按钮。
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
menu.js                 菜单与详情渲染、哈希路由、导航和动效开关
drink-data.js           32 款饮品用料、杯型、颜色与配方参考
drink-art.js            程序绘制的 SVG 饮品侧视图
drink-motion.js         自动液面波动，随暂停和页面切换启停
drink-details.css       极简详情页、手机和 iPad 响应式样式
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
