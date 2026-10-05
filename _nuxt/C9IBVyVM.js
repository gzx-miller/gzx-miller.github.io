const t=`// jwt-auth.guard.ts —— 守卫在管道之前执行，决定请求是否放行
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractToken(request)   // 从 Authorization: Bearer 头取 token

    if (!token) throw new UnauthorizedException('缺少访问凭证')

    try {
      // 验签 + 解析 payload（过期会抛出 TokenExpiredError）
      const payload = await this.jwtService.verifyAsync(token)
      request.user = payload                 // 挂到请求对象，供处理器使用
      return true
    } catch {
      throw new UnauthorizedException('凭证无效或已过期')
    }
  }
}

// 控制器上按需启用守卫
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Req() req) {
  return req.user
}`;export{t as default};
