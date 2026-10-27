# 内容发布说明

> 一句话结论：**在 `/admin` 里点「保存」，只改了你这台电脑的浏览器。**
> 线上要变，必须把内容写成仓库文件再推送。

---

## 为什么改了看不到

内容其实有两份，位置完全不同：

| | 存在哪 | 谁能看到 | 是否进构建 |
|---|---|---|---|
| 控制台「保存」 | 本机 `localStorage` | 只有你这台设备 | ❌ |
| `src/config/site.content.ts` | 仓库（进 git） | 所有人 | ✅ |

构建时 Vite 读的是 **`src/config/site.content.ts`**。
这个文件一直是空的 `{}`，线上就永远是 `DEFAULT_*` 那套默认文案 ——
不管你在 `/admin` 里改了多少、本地预览多正常，也不管你重新部署多少次。

这就是「改了、预览也对、部署了、线上还是旧的」的完整原因。

---

## 正确的发布流程（两步）

### 第 1 步 · 把内容写进仓库文件

```bash
npm run dev
```

打开 <http://localhost:5173/admin> → 进入 **「数据」** 标签 →
点 **「写入仓库文件」**。

它会 POST 到本地 Vite 开的 `/__publish` 接口，直接覆写
`src/config/site.content.ts`。写成功后按钮会显示「已写入（N 个字段）」。

> 提示：这个接口**只存在于 `npm run dev` / `npm run preview`**。
> 线上静态站点里没有这段代码，所以在线上页面里按钮是禁用状态 —— 这是设计如此。

不想用网页？也可以用文件流转：

```bash
# 控制台「数据」→ 导出为文件，把 site-config.json 放到项目根目录
npm run config:apply
```

### 第 2 步 · 提交推送

```bash
git add src/config/site.content.ts
git commit -m "chore: 更新站点内容"
git push
```

推上去之后，`.github/workflows/deploy.yml` 会在 GitHub 的机器上执行
`npm run build`，把 `dist/` 发布到 Pages。大概 1 分钟生效。

---

## GitHub 那边的一次性设置

代码推上去只会触发工作流，不会自动开启 Pages，需要手动点一次：

1. 仓库 → **Settings** → **Pages**
2. **Source** 选 **GitHub Actions**（不要选 `Deploy from a branch`）

> 如果之前选的是「从分支部署」，而分支指的是 `main` 的根目录，
> 那 Pages 发布的是**仓库源码**，不是构建结果 —— 同样会看到旧页面。
> 这一点也请一并检查。

工作流里已经处理了两件容易白屏的事：

- **子路径前缀**：项目页地址是 `/仓库名/`，`VITE_BASE` 会自动注入，
  不用手改 `vite.config.ts`。
- **`/admin` 直达**：构建后复制一份 `404.html`，让 Pages 把请求交回 `index.html`。

---

## 你自己刷新还是旧的？清一次缓存

部署成功后，`SITE_CONTENT` 的内容指纹变了，应用会自动丢弃本机残留的
旧草稿并提示「线上内容已更新」。如果还是旧的，硬刷新一次：

- Windows / Linux：`Ctrl + Shift + R`
- macOS：`⌘ + Shift + R`

---

## 常见坑速查

| 现象 | 原因 |
|---|---|
| 线上永远是默认文案 | `site.content.ts` 是 `{}` —— 没走第 1 步 |
| 点了「写入」没反应 | 开的是线上页面，没有 `/__publish` 接口 |
| 推送了但线上没变 | Pages 的 Source 不是 GitHub Actions |
| 页面白屏、资源 404 | `VITE_BASE` 前缀不对，或手动构建没设 |
| 只有我这里是新的 | 内容只在本机 localStorage，别人读仓库文件 |

---

## 如果以前提交过 `dist/`

`.gitignore` 里已经加了 `dist`，但**对已经提交过的文件无效**。
如果仓库里还留着旧的 `dist/`，需要先从 git 里移除：

```bash
git rm -r --cached dist
git commit -m "chore: 不再提交构建产物"
git push
```

这并不是可选项 —— 旧 `dist/` 留在仓库里，容易让人误以为
「改了源码但页面没变」，其实是 Pages 读到了一份过期的构建结果。

---

## 按地区分流（品牌介绍页）

访客打开页面时先静默做几道检查，全过才看到正常落地页：

| 检查 | 规则 |
|---|---|
| 国家 | 多源 IP 库同时竞速（Cloudflare / ipapi.co / ipwho.is 一起发，取最快成功的），命中 `countries` 列表才过 |
| 设备 | `mobileOnly` 开启后，电脑访客直接拦住（APK 电脑上也装不了） |
| 语言 | 浏览器界面语言命中 `blockLanguages`（如 `zh` 拦下所有中文界面）就拦住 |

任一不过 → 只看到「品牌介绍页」：真实品牌名 / 标语 / 图标 + 邮箱订阅表单，
没有下载按钮、没有埋点。控制台 `/admin` 永远不受影响。

### 怎么开

改 `src/config/defaults.ts` 里的 `DEFAULT_GEO`：

```ts
export const DEFAULT_GEO: GeoConfig = {
  enabled: true,                  // 总开关
  countries: ['SA', 'AE', 'KW'],  // 目标国家，两位大写代码
  onError: 'allow',               // 国家检测失败时：allow=放行 / deny=拦截
  mobileOnly: true,               // true = 只给手机看落地页
  blockLanguages: ['zh'],         // 中文界面访客看品牌页
  page: { ... },                  // 品牌介绍页的文案，全部可改
}
```

品牌名、标语、图标、联系邮箱**不用在这里填** —— 介绍页直接读控制台「品牌」
区块的内容。记得把「联系邮箱」改成你真实在用的邮箱，访客留的邮箱会发到那里。

保存 → `git add .` → `commit` → `push`，部署生效。

### 预览各版本（不用换 IP、不用换设备）

网址后加参数即可强制指定访客身份，三个参数可叠加：

- `?geo=US` → 非目标国家（安全起见也可以填目标国验证放行）
- `?device=desktop` → 电脑访客；`?device=mobile` → 手机访客
- `?lang=zh` → 中文界面访客；`?lang=ar` → 阿语界面访客

例如 `你的网址/?device=desktop&lang=zh` = 模拟"用中文界面的电脑访客"。

### 常见问题

| 现象 | 原因 |
|---|---|
| 所有人都看到介绍页 | `enabled` 开了但 `countries` 忘了填目标国家 |
| 所有人都看到正常页面 | `enabled` 还是 `false`，或访客三样检查都过了 |
| 检测失败时想看介绍页 | 把 `onError` 改成 `'deny'` |
| 点了发送没反应 | 浏览器拦截了邮件客户端，按介绍页上的提示手动发邮件即可 |
