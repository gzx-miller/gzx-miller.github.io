const n=`// 静态 metadata - 导出 metadata 对象
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '我的网站',
  description: '这是一个用 Next.js 构建的网站',
  keywords: ['Next.js', 'React', 'TypeScript'],
  authors: [{ name: '作者名' }],
  openGraph: {
    title: '我的网站',
    description: '欢迎访问我的网站',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '我的网站',
    description: '欢迎访问我的网站',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}

// ============================================

// 标题模板 - 子页面自动拼接父模板
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: '我的网站',
    template: '%s | 我的网站', // %s 被子页面标题替换
  },
  description: '默认描述',
}

// app/about/page.tsx
export const metadata: Metadata = {
  title: '关于我们', // 最终显示：关于我们 | 我的网站
  description: '了解我们的团队和使命',
}

// ============================================

// 动态 generateMetadata
// app/posts/[slug]/page.tsx
import type { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

// 动态生成 metadata
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const post = await fetch(\`https://api.example.com/posts/\${params.slug}\`)
    .then(res => res.json())

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const post = await fetch(\`https://api.example.com/posts/\${params.slug}\`)
    .then(res => res.json())

  return <article>{post.content}</article>
}

// ============================================

// 文件约定的元数据
// 在 app/ 目录下放置特定文件自动生成 metadata：
// - favicon.ico / favicon.png / favicon.svg
// - icon.png / icon.jpg / icon.svg (应用图标)
// - apple-icon.png / apple-icon.jpg (iOS 图标)
// - opengraph-image.png / og-image.png (OG 图)
// - twitter-image.png (Twitter 卡片图)
// - robots.txt (爬虫规则)
// - sitemap.xml (站点地图)

// ============================================

// 动态生成 sitemap
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://example.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://example.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]
}

// ============================================

// 动态生成 robots.txt
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://example.com/sitemap.xml',
  }
}

// ============================================

// 动态 OG 图片生成
// app/posts/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export async function generateImageMetadata({
  params,
}: {
  params: { slug: string }
}) {
  return [
    {
      contentType: 'image/png',
      size: { width: 1200, height: 630 },
      id: params.slug,
    },
  ]
}

export default async function Image({
  params,
}: {
  params: { slug: string }
}) {
  return new ImageResponse(
    (
      <div style={{ fontSize: 60, color: 'white', background: 'black', padding: '50px' }}>
        <h1>{params.slug}</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}`;export{n as default};
