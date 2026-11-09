# Yanfeng Wang | 王彦峰

Academic homepage: https://lukjucy.github.io/Yanfeng-Wang.github.io/

Content editor: https://lukjucy.github.io/Yanfeng-Wang.github.io/admin/

## 编辑主页

1. 打开后台，使用有该站点权限的 Decap Turbo 账号登录。
2. 点击「学术主页」→「主页内容」。
3. 在表单中修改个人资料、简介、社交链接、论文、教育经历和兴趣；兴趣列表可以增加、删除和拖动排序，头像可以上传。
4. 右侧查看内容预览，点击发布保存到 GitHub 的 `main` 分支。
5. 等待 GitHub Actions 的 **Build and publish academic homepage** 成功，刷新主页即可看到修改。发布失败时，线上仍保留上一个成功版本。

## 首次登录授权（站点所有者）

后台代码与内容管理已接入；首次使用前需要连接 Decap Turbo：

1. 在 https://turbo.decapcms.org/ 注册账号并选择 Free（1 site / 1 seat，无需信用卡；以官方当前说明为准）。不需要开启 Pro 试用。
2. 添加仓库 `LukJucy/Yanfeng-Wang.github.io`。安装 GitHub App 时只选择此仓库。
3. Branch 设为 `main`，Config path 设为 `admin/config.yml`。
4. Admin interface URL 填入 `https://lukjucy.github.io/Yanfeng-Wang.github.io/admin/`。
5. 复制 Overview 中的 Site ID，填写到 `admin/config.yml` 的 `backend.turbo_site_id`。Site ID 是公开标识符，**不要把密码、GitHub Token 或 OAuth secret 写入仓库**。
6. 等待自动发布，再打开后台完成登录。

官方接入说明：https://decapcms.org/docs/turbo-connecting-a-site/

## 内容与发布

- `content/homepage.json`：唯一的主页内容源，Decap 修改此文件。
- `templates/homepage.html`：网页结构。
- `static/css/main.css`：原有主页样式。
- `admin/config.yml`：Decap 表单与授权配置（JSON 语法是合法 YAML）。
- `admin/preview.js`：后台内容预览；实际页面支持完整的双栏及手机布局。
- `scripts/build.mjs`：将内容生成完整静态 HTML，访客无需运行脚本或请求内容文件。
- `.github/workflows/pages.yml`：检查、生成、发布；Pages 来源必须设为 **GitHub Actions**。

`index.html` 是生成结果，请勿直接编辑。历史 `contents/` 文件保留为参考，不会同步到主页。

## 本地验证

需要 Node.js 24，无需安装依赖：

```text
node --test scripts/build.test.mjs
node scripts/build.mjs
```

构建结果位于 `_site/`，可用静态服务器预览。CMS 编辑器使用固定版本 Decap CMS 3.17.3；后台需要联网加载编辑器和登录服务。

## License

MIT — see LICENSE.
