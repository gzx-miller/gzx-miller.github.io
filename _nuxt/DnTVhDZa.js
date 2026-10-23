const n=`// ========== 1. electron-builder package.json 配置 ==========
// 安装: npm install electron-builder --save-dev
//
// package.json:
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build:mac": "electron-builder --mac",
    "build:win": "electron-builder --win",
    "build:linux": "electron-builder --linux",
    "build:all": "electron-builder -mw"
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.0.0"
  },
  "build": {
    "appId": "com.company.myapp",
    "productName": "My App",
    "directories": {
      "output": "dist"
    },
    "files": [
      "main.js",
      "preload.js",
      "index.html",
      "renderer.js",
      "assets/**"
    ],
    "extraResources": [
      {
        "from": "extra/",
        "to": "extra/"
      }
    ],
    "asar": true,
    "asarUnpack": [
      "assets/icons/*"
    ]
  }
}

// ========== 2. macOS 打包配置 ==========
// build.mac:
// {
//   "target": [
//     {
//       "target": "dmg",
//       "arch": ["x64", "arm64"]
//     },
//     {
//       "target": "zip",
//       "arch": ["x64", "arm64"]
//     }
//   ],
//   "category": "public.app-category.productivity",
//   "icon": "build/icon.icns",
//   "hardenedRuntime": true,
//   "gatekeeperAssess": false,
//   "entitlements": "build/entitlements.mac.plist",
//   "entitlementsInherit": "build/entitlements.mac.plist"
// }
//
// entitlements.mac.plist 内容:
// <?xml version="1.0" encoding="UTF-8"?>
// <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
//   "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
// <plist version="1.0">
// <dict>
//   <key>com.apple.security.app-sandbox</key>
//   <false/>
//   <key>com.apple.security.network.client</key>
//   <true/>
// </dict>
// </plist>

// ========== 3. Windows 打包配置 ==========
// build.win:
// {
//   "target": [
//     {
//       "target": "nsis",
//       "arch": ["x64"]
//     },
//     {
//       "target": "portable",
//       "arch": ["x64"]
//     }
//   ],
//   "icon": "build/icon.ico",
//   "artifactName": "\${productName}-\${version}-setup.\${ext}"
// }
//
// build.nsis:
// {
//   "oneClick": false,
//   "allowToChangeInstallationDirectory": true,
//   "installerIcon": "build/icon.ico",
//   "uninstallerIcon": "build/icon.ico",
//   "installerHeaderIcon": "build/icon.ico",
//   "createDesktopShortcut": true,
//   "createStartMenuShortcut": true,
//   "shortcutName": "My App"
// }

// ========== 4. Linux 打包配置 ==========
// build.linux:
// {
//   "target": [
//     { "target": "AppImage", "arch": ["x64"] },
//     { "target": "deb", "arch": ["x64"] },
//     { "target": "rpm", "arch": ["x64"] }
//   ],
//   "icon": "build/icons",
//   "category": "Utility",
//   "maintainer": "dev@company.com"
// }
//
// build.deb:
// {
//   "depends": ["libgtk-3-0", "libnotify4", "libnss3"]
// }

// ========== 5. 代码签名配置 ==========
// macOS 签名 (需要 Apple Developer 账号):
//
// 环境变量:
//   CSC_LINK=证书文件路径或名称
//   CSC_KEY_PASSWORD=证书密码
//   APPLE_ID=Apple ID 邮箱
//   APPLE_APP_SPECIFIC_PASSWORD=应用专用密码
//   APPLE_TEAM_ID=Team ID
//
// build.mac 中:
// {
//   "identity": "Developer ID Application: Your Name (TEAMID)",
//   "notarize": true
// }

// Windows 签名:
//
// 环境变量:
//   CSC_LINK=pfx 证书路径
//   CSC_KEY_PASSWORD=证书密码
//
// build.win 中:
// {
//   "certificateFile": "certificate.pfx",
//   "certificatePassword": "password"
// }

// ========== 6. 自动更新发布配置 ==========
// build.publish:
// {
//   "provider": "generic",
//   "url": "https://your-server.com/updates",
//   "channel": "latest"
// }
//
// 或发布到 GitHub:
// {
//   "provider": "github",
//   "owner": "username",
//   "repo": "repo-name",
//   "private": false
// }
//
// 环境变量 GH_TOKEN=你的 GitHub token

// ========== 7. 应用图标 ==========
// 需要准备不同尺寸的图标:
//
// macOS:
//   icon.icns (包含 16x16 到 512x512@2x)
//
// Windows:
//   icon.ico (包含 16x16 到 256x256)
//
// Linux:
//   icons/ (目录，各尺寸 png)
//
// 推荐使用 electron-icon-builder 生成:
//   npx electron-icon-builder --input=./icon.png --output=./build/icons

// ========== 8. 环境变量配置 ==========
// .env 文件示例:
//
// # 通用
// ELECTRON_CACHE=~/.cache/electron
// ELECTRON_BUILDER_CACHE=~/.cache/electron-builder
//
// # macOS 签名
// CSC_LINK=cert.p12
// CSC_KEY_PASSWORD=your-password
// APPLE_ID=your@apple.com
// APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
// APPLE_TEAM_ID=TEAMID12345
//
// # Windows 签名
// CSC_LINK=certificate.pfx
// CSC_KEY_PASSWORD=your-password
//
// # GitHub 发布
// GH_TOKEN=ghp_xxxxxxxxxxxxxxxxx

// ========== 9. CI/CD 配置 (GitHub Actions 示例) ==========
// .github/workflows/build.yml:
//
// name: Build Electron App
//
// on:
//   push:
//     tags:
//       - 'v*'
//
// jobs:
//   build:
//     runs-on: \${{ matrix.os }}
//     strategy:
//       matrix:
//         os: [macos-latest, windows-latest, ubuntu-latest]
//
//     steps:
//       - uses: actions/checkout@v4
//
//       - uses: actions/setup-node@v4
//         with:
//           node-version: '20'
//
//       - name: Install dependencies
//         run: npm ci
//
//       - name: Build
//         env:
//           GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
//           CSC_LINK: \${{ secrets.CSC_LINK }}
//           CSC_KEY_PASSWORD: \${{ secrets.CSC_KEY_PASSWORD }}
//         run: npm run build
//
//       - name: Upload artifacts
//         uses: actions/upload-artifact@v4
//         with:
//           name: \${{ runner.os }}-build
//           path: dist/

// ========== 10. 打包前检查清单 ==========
// [ ] 更新版本号 (package.json)
// [ ] 准备好应用图标 (icns, ico, png)
// [ ] 配置代码签名证书
// [ ] 测试应用在各平台运行正常
// [ ] 配置自动更新服务器 (如果需要)
// [ ] 检查 package.json 中 files 字段是否包含所有必要文件
// [ ] 确认 asar 打包不会导致问题（原生模块可能需要 asarUnpack）
// [ ] 编写更新日志 (CHANGELOG.md)

// ========== 11. 常见打包问题 ==========
// 1. 原生模块需要重新编译:
//    npm install electron-rebuild --save-dev
//    npx electron-rebuild
//
// 2. 路径问题:
//    使用 __dirname 相对于当前文件
//    使用 app.getAppPath() 获取应用根目录
//    生产环境路径可能在 asar 包内
//
// 3. 读写文件:
//    不要写入应用安装目录（可能只读）
//    使用 app.getPath('userData') 存储用户数据
//
// 4. 白屏问题:
//    检查路径是否正确
//    打开开发者工具调试
//    用 win.webContents.openDevTools()

// ========== 12. electron-forge 简介 (替代方案) ==========
// electron-forge 是另一个打包工具，封装了 electron-packager
//
// 初始化:
//   npm create electron-app@latest my-app -- --template=vite
//
// 配置在 forge.config.js 中:
// module.exports = {
//   packagerConfig: {},
//   makers: [
//     { name: '@electron-forge/maker-squirrel', config: {} },
//     { name: '@electron-forge/maker-zip', platforms: ['darwin'] },
//     { name: '@electron-forge/maker-deb', config: {} },
//     { name: '@electron-forge/maker-rpm', config: {} }
//   ]
// }`;export{n as default};
