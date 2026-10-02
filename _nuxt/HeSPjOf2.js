const n=`// 1. Vercel 部署（推荐）
// 零配置，支持所有 Next.js 特性
// 步骤：
// 1. 连接 Git 仓库（GitHub/GitLab/Bitbucket）
// 2. 配置环境变量
// 3. 自动部署，每次 push 自动更新

// vercel.json - 可选配置
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}

// ============================================

// 2. Node.js 自托管（output: 'standalone'）
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // 生成独立部署包
}

module.exports = nextConfig

// 构建命令：
// pnpm next build
// 生成的 .next/standalone/ 目录可独立运行
// 需要复制 public/ 和 .next/static/ 到对应位置

// 启动命令：
// node server.js
// 或
// node .next/standalone/server.js

// ============================================

// 3. Docker 部署
// Dockerfile
FROM node:20-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

# 构建
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm next build

# 运行
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制 standalone 输出
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]

// .dockerignore
node_modules
.next
.git
.env.local
.env*.local

// ============================================

// 4. 静态导出（output: 'export'）
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 纯静态导出
  images: {
    unoptimized: true, // 静态导出需要关闭图片优化
  },
}

module.exports = nextConfig

// 构建命令：
// pnpm next build
// 生成 out/ 目录，包含所有静态文件

// 部署：
// 把 out/ 目录上传到任何静态托管服务
// Vercel / Netlify / GitHub Pages / Cloudflare Pages / Nginx

// 静态导出限制：
// - 不支持 Server Components 的动态特性
// - 不支持 Server Actions
// - 不支持 Middleware
// - 不支持 Image Optimization（需 unoptimized: true）
// - 不支持 Route Handlers（API Routes）
// - 不支持 Incremental Static Regeneration

// ============================================

// 环境变量配置
// .env.production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:pass@db:5432/mydb
SECRET_KEY=your-production-secret-key

// Vercel 上在 Settings → Environment Variables 配置
// 其他平台在对应的环境变量管理界面配置

// ============================================

// Nginx 反向代理配置（Node.js 自托管）
// server {
//   listen 80;
//   server_name yourdomain.com;
//
//   location / {
//     proxy_pass http://localhost:3000;
//     proxy_http_version 1.1;
//     proxy_set_header Upgrade $http_upgrade;
//     proxy_set_header Connection 'upgrade';
//     proxy_set_header Host $host;
//     proxy_set_header X-Real-IP $remote_addr;
//     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
//     proxy_set_header X-Forwarded-Proto $scheme;
//     proxy_cache_bypass $http_upgrade;
//   }
// }

// ============================================

// 部署检查清单：
// 1. 设置正确的环境变量（生产环境值）
// 2. 配置自定义域名和 HTTPS
// 3. 设置 CDN 缓存静态资源
// 4. 配置监控和错误追踪（Sentry / LogRocket）
// 5. 设置自动回滚和健康检查
// 6. 优化图片和静态资源
// 7. 配置 robots.txt 和 sitemap.xml`;export{n as default};
