# 游戏引擎分析课程作业
------
## 15081103 侯毅

### 游戏介绍
这是一个飞机大战的游戏，鼠标移动控制飞机，左键开火停火，Z键切换开火模式。
游戏设计了四种敌机，两种开火模式。

### 编写记录
>* 2018/3/08 21:30 创建项目
>* 2018/3/09 11:25 鼠标点击事件测试
>* 2018/3/09 23:37 鼠标移动事件测试
>* 2018/3/10 14:06 玩家控制飞机和开火测试
>* 2018/3/10 19:52 暂时处理开火问题 测试敌人刷新和击毁
>* 2018/3/11 19:50 修正之前类内部方法调用的bug
>* 2018/3/12 15:12 添加多种敌军 各种敌人定时刷新 尝试开始菜单但是失败了
>* 2018/3/12 16:49 添加碰撞检测 史诗级bug
>* 2018/3/12 23:15 史诗级bug经过修改变成传说级bug
>* 2018/3/13 09:42 传说级bug变成稀有级bug
>* 2018/3/13 11:44 有效代码700行 凑了300多行 尴尬
>* 2018/3/14 10:17 微小修改 加了计分和bgm
-----
>* 2018/3/15 ??:?? 根据周三的课 完成结构重构 没有添加细节功能 结构测试通过
>* 2018/3/17 16:29 根据周四的课 对结构再次进行重构 分两个文件编写 尚未测试
>* 2018/3/17 17:40 小问题修改 测试成功
>* 2018/3/17 21:20 修改 hitTest 的bug
>* 2018/3/18 17:12 给Container类添加全局点坐标转局部点坐标功能 调整了好多 初步实现功能重建 子弹位置有玄学bug 尚未加碰撞
>* 2018/3/19 14:09 经过反复尝试子弹和敌人的碰撞得到初步解决，但是碰撞方面仍存在bug，子弹位置的玄学bug还没有解决
>* 2018/3/20 18:15 有时候还就得推翻重来，单独做了一张子弹的图片，用图片类派生子弹，同时解决的 子弹位置神奇2倍 和 子弹碰撞回调神奇触发 的bug
>* 2018/3/20 19:29 调换代码到1.ts，还剩一个大bug，敌人和子弹，只要有一个被销毁，它后面生成的对象也会一同销毁

### 效果展示
#### v1.0
![img](http://xxhouyi.cn/Engine/img/img2.png)
![img](http://xxhouyi.cn/Engine/img/img3.png)