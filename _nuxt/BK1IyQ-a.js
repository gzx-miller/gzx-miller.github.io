const n=`// 拦截路由目录结构：
// app/
//   photo/
//     [id]/
//       page.tsx    - 真实页面（直接访问时显示）
//   @modal/
//     (.)photo/
//       [id]/
//         page.tsx  - 拦截版本（客户端导航时显示）
//     default.tsx
//   layout.tsx

// app/layout.tsx - 布局包含 modal 插槽
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  )
}

// ============================================

// app/photo/[id]/page.tsx - 真实页面（全屏）
// 直接访问 /photo/123 时显示这个
export default function PhotoPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="photo-fullscreen">
      <h1>照片 #{params.id}</h1>
      <img src={\`/photos/\${params.id}.jpg\`} alt="" />
      <p>这是全屏页面，直接访问 URL 时看到</p>
    </div>
  )
}

// ============================================

// app/@modal/(.)photo/[id]/page.tsx - 拦截版本（弹窗）
// 客户端导航到 /photo/123 时显示这个（弹窗形式）
'use client'

import { useRouter } from 'next/navigation'

export default function PhotoModal({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()

  function close() {
    router.back() // 后退，URL 恢复
  }

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>照片 #{params.id}</h2>
        <img src={\`/photos/\${params.id}.jpg\`} alt="" />
        <button onClick={close}>关闭</button>
      </div>
    </div>
  )
}

// ============================================

// app/@modal/default.tsx - 默认不显示弹窗
export default function Default() {
  return null
}

// ============================================

// 拦截符号说明：
// (.)     - 同级拦截（同一目录下的路由）
// (..)    - 上级目录拦截
// (..)(..) - 上两级目录拦截
// (...)   - 根目录拦截

// 目录示例：
// app/
//   shop/
//     [id]/page.tsx          - /shop/123
//   @modal/
//     (.)shop/
//       [id]/page.tsx        - 拦截 /shop/123（同级）
//     (..)products/
//       [id]/page.tsx        - 拦截 /products/456（上级）

// ============================================

// 列表页 - 点击图片触发客户端导航
// app/photos/page.tsx
import Link from 'next/link'

async function getPhotos() {
  return [
    { id: '1', title: '风景' },
    { id: '2', title: '人物' },
    { id: '3', title: '建筑' },
  ]
}

export default async function PhotosPage() {
  const photos = await getPhotos()

  return (
    <div className="photo-grid">
      {photos.map(photo => (
        <Link key={photo.id} href={\`/photo/\${photo.id}\`}>
          <img src={\`/photos/\${photo.id}.jpg\`} alt={photo.title} />
          <p>{photo.title}</p>
        </Link>
      ))}
    </div>
  )
}`;export{n as default};
