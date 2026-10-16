const n=`// app/products/[id]/page.tsx - 单段动态路由
// 访问 /products/123，params.id = '123'
export default function ProductPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const productId = params.id
  const utmSource = searchParams.utm_source as string | undefined

  return (
    <div>
      <h1>商品 ID: {productId}</h1>
      {utmSource && <p>来源: {utmSource}</p>}
    </div>
  )
}

// ============================================

// app/categories/[...slug]/page.tsx - Catch-all 多段
// 访问 /categories/electronics/phones，params.slug = ['electronics', 'phones']
export default function CategoryPage({
  params,
}: {
  params: { slug: string[] }
}) {
  return (
    <div>
      <h1>分类路径</h1>
      <ol>
        {params.slug.map((seg, i) => (
          <li key={i}>{seg}</li>
        ))}
      </ol>
    </div>
  )
}

// ============================================

// app/search/[[...query]]/page.tsx - 可选 Catch-all
// 匹配 /search、/search/react、/search/react/hooks
export default function SearchPage({
  params,
}: {
  params: { query?: string[] }
}) {
  const query = params.query?.join(' ') || ''

  return (
    <div>
      <h1>搜索结果</h1>
      <p>关键词: {query || '（空）'}</p>
    </div>
  )
}

// ============================================

// app/products/[id]/generateStaticParams - 预生成静态页
// 构建时预先生成已知商品的静态页面
export async function generateStaticParams() {
  const products = await fetch('https://api.example.com/products').then(res => res.json())

  return products.map((product: { id: string }) => ({
    id: product.id,
  }))
}

// ============================================

// Next.js 15+ 中 params 和 searchParams 是 Promise
// 需要使用 async/await
// app/posts/[id]/page.tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <h1>文章 {id}</h1>
}`;export{n as default};
