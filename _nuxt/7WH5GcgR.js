const e=`// middleware.ts - 放在项目根目录或 src/ 下
import { NextResponse, type NextRequest } from 'next/server'

// 基础中间件 - 每个请求都会执行
export function middleware(request: NextRequest) {
  // 可以修改请求、重定向、重写、改响应头等
  console.log('请求路径:', request.nextUrl.pathname)

  // 继续执行
  return NextResponse.next()
}

// ============================================

// 认证重定向
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 获取 session cookie
  const session = request.cookies.get('session')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')

  // 未登录且访问需要认证的页面 → 重定向到登录页
  if (!session && !isAuthPage && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 已登录但访问登录页 → 重定向到仪表盘
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// ============================================

// A/B 测试 - 重写路径
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 只对首页做 A/B 测试
  if (request.nextUrl.pathname !== '/') {
    return NextResponse.next()
  }

  // 从 cookie 读取已分配的版本
  const variant = request.cookies.get('ab-variant')?.value

  // 新用户随机分配
  let newVariant = variant
  if (!newVariant) {
    newVariant = Math.random() < 0.5 ? 'a' : 'b'
  }

  // 重写到对应版本的页面
  const response = NextResponse.rewrite(
    new URL(\`/variant/\${newVariant}\`, request.url)
  )

  // 新用户设置 cookie
  if (!variant) {
    response.cookies.set('ab-variant', newVariant)
  }

  return response
}

// ============================================

// i18n 语言检测
import { NextResponse, type NextRequest } from 'next/server'

const locales = ['zh', 'en', 'ja']
const defaultLocale = 'zh'

function getLocale(request: NextRequest): string {
  // 优先从 cookie 读取
  const cookieLocale = request.cookies.get('locale')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // 其次从 Accept-Language 头检测
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',')[0].toLowerCase()
    if (locales.includes(preferred)) {
      return preferred
    }
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 检查路径是否已经包含 locale
  const pathnameIsMissingLocale = locales.every(
    locale => !pathname.startsWith(\`/\${locale}\`) && pathname !== \`/\${locale}\`
  )

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    return NextResponse.redirect(
      new URL(\`/\${locale}\${pathname === '/' ? '' : pathname}\`, request.url)
    )
  }

  return NextResponse.next()
}

// ============================================

// 设置请求头（供下游 Server Component 读取）
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 克隆请求头
  const requestHeaders = new Headers(request.headers)

  // 添加自定义头
  requestHeaders.set('x-custom-path', request.nextUrl.pathname)

  // 传递给下游
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Server Component 中读取
// import { headers } from 'next/headers'
// const customPath = headers().get('x-custom-path')

// ============================================

// matcher 配置 - 限定中间件执行路径
export const config = {
  // 只匹配这些路径
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
  ],
  // 或者排除静态资源
  // matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}`;export{e as default};
