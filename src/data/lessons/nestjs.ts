import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到案例组件：${name}`)
  return defineAsyncComponent(async () => {
    if (name.startsWith('E')) await import('../../element-plus/styles')
    return loader()
  })
}

const N01ModulesDi = createDemo('N01ModulesDi')
const N02ControllersRoutes = createDemo('N02ControllersRoutes')
const N03PipesValidation = createDemo('N03PipesValidation')
const N04GuardsJwt = createDemo('N04GuardsJwt')
const N05Interceptors = createDemo('N05Interceptors')
const N06Middleware = createDemo('N06Middleware')
const N07ExceptionFilter = createDemo('N07ExceptionFilter')
const N08TypeOrmDb = createDemo('N08TypeOrmDb')
const N09WebSocketGateway = createDemo('N09WebSocketGateway')
const N10ScheduleTask = createDemo('N10ScheduleTask')
const N11ConfigEnv = createDemo('N11ConfigEnv')
const N12Microservices = createDemo('N12Microservices')

export const lessons: Lesson[] = [
  {
    id: 'NE_01',
    title: '模块与依赖注入：NestJS 的模块化架构',
    navTitle: '模块与依赖注入',
    category: '模块化架构',
    path: '/nestjs/n-1/modules-di',
    summary: '用课程管理模块展示 @Module 声明式组装：Controllers、Providers、Imports、Exports 与构造器注入。',
    demo: N01ModulesDi,
    code: () => Promise.resolve(`// course.module.ts —— 模块是 NestJS 组织代码的基本单元
@Module({
  imports: [DatabaseModule],        // 引入其它模块，获得其导出的 Provider
  controllers: [CourseController],  // 路由处理器，接收请求并返回响应
  providers: [CourseService],       // 业务逻辑与数据访问，可被注入
  exports: [CourseService],         // 导出 Provider，供其它模块使用
})
export class CourseModule {}

// app.module.ts —— 根模块负责装配整个应用
@Module({
  imports: [CourseModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// course.service.ts —— Provider 通过构造器注入
@Injectable()
export class CourseService {
  // Nest 会解析 CourseRepository 的实例并注入进来（DI 容器）
  constructor(private readonly courseRepo: CourseRepository) {}

  findAll() {
    return this.courseRepo.find()
  }
}`),
    principle: 'NestJS 用模块（Module）把相关的控制器、服务、管道等聚合为内聚单元。@Module 装饰器的四个数组各司其职：controllers 负责 HTTP 路由、providers 注册可注入依赖、imports 引入其它模块、exports 决定哪些 Provider 对模块外部可见。依赖注入（DI）容器在启动时解析构造器参数，自动完成实例化与作用域管理，开发者无需手动 new。',
    flow: [
      '根模块 AppModule imports 业务模块（如 CourseModule）',
      '业务模块 controllers 注册路由，providers 注册服务',
      '服务通过构造器声明依赖，DI 容器按类型解析并注入',
      '模块 exports 的服务可被 imports 该模块的其它模块复用',
    ],
    notes: [
      '一个 Provider 只需注册一次即可被同一模块内任意位置注入',
      '模块默认是单例作用域（Singleton），共享实例提升性能',
      '循环依赖（A 模块依赖 B，B 又依赖 A）需用 forwardRef 显式处理',
      '全局模块用 @Global() 声明，其 exports 自动对所有模块可见',
    ],
    problem: '若忘记在 providers 中注册 CourseService 却在控制器里注入它，应用启动时会抛出 Nest can not resolve dependencies 错误——DI 容器无法解析未登记的依赖。',
    officialUrl: 'https://docs.nestjs.com/modules',
  },
  {
    id: 'NE_02',
    title: '控制器与路由：声明式 REST API',
    navTitle: '控制器与路由',
    category: '模块化架构',
    path: '/nestjs/n-2/controllers-routing',
    summary: '用课程 API 展示 @Controller、HTTP 方法装饰器、路径参数、查询参数与请求体 DTO 的绑定规则。',
    demo: N02ControllersRoutes,
    code: () => Promise.resolve(`// course.controller.ts
@Controller('courses')            // 路由前缀：/courses
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()                          // GET /courses
  findAll(@Query('tag') tag?: string) {
    return this.courseService.findAll(tag)
  }

  @Get(':id')                     // GET /courses/:id
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne(id)
  }

  @Post()                         // POST /courses
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto)
  }

  @Patch(':id')                   // PATCH /courses/:id
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(id, dto)
  }

  @Delete(':id')                  // DELETE /courses/:id
  remove(@Param('id') id: string) {
    return this.courseService.remove(id)
  }
}`),
    principle: '控制器是请求的入口：@Controller 定义路由前缀，方法装饰器（@Get/@Post/@Patch/@Delete）绑定 HTTP 方法与路径。参数装饰器把请求数据映射到方法参数：@Param 取路径参数、@Query 取查询字符串、@Body 取请求体、@Req/@Res 直接访问原始请求对象。配合 ParseIntPipe 等管道可以就地转换与校验参数。',
    flow: [
      '客户端请求 GET /courses/42',
      '路由匹配 CourseController 的 @Get(\':id\') 处理器',
      'ParseIntPipe 把字符串 \'42\' 转换为数字 42',
      '控制器调用 service，返回数据由框架序列化为 JSON',
    ],
    notes: [
      '路由按声明顺序匹配，通配路由（如 *）应放在具体路由之后',
      '@Res() 注入原始响应对象后需手动 res.json()，框架不再自动处理',
      '控制器只负责参数绑定与响应，业务逻辑应下沉到 Service',
      '路由前缀避免与其它模块的控制器路径冲突',
    ],
    problem: '若控制器方法同时注入 @Res() 又 return 数据，Nest 不会自动发送返回值——两种模式只能选其一，混用会导致响应被发送两次或丢失。',
    officialUrl: 'https://docs.nestjs.com/controllers',
  },
  {
    id: 'NE_03',
    title: '管道与数据校验：ValidationPipe 与 DTO',
    navTitle: '管道与数据校验',
    category: '请求处理',
    path: '/nestjs/n-3/pipes-validation',
    summary: '用课程报名表单展示 DTO + class-validator 装饰器 + ValidationPipe 的声明式校验，以及错误响应结构。',
    demo: N03PipesValidation,
    code: () => Promise.resolve(`// create-enrollment.dto.ts —— 数据传输对象，用装饰器声明规则
export class CreateEnrollmentDto {
  @IsNotEmpty({ message: '姓名不能为空' })
  @MaxLength(20, { message: '姓名最长 20 个字符' })
  name: string

  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string

  @IsInt({ message: '年龄必须是整数' })
  @Min(18, { message: '年龄不能小于 18' })
  @Max(99, { message: '年龄不能大于 99' })
  age: number

  @IsUUID('4', { message: '课程 ID 必须是 UUID' })
  courseId: string
}

// main.ts —— 全局启用校验管道
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // whitelist 自动剔除 DTO 之外的属性，forbidNonWhitelisted 则直接报错
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.listen(3000)
}`),
    principle: '管道（Pipe）在数据进入处理器之前执行，负责转换与校验。ValidationPipe 基于 class-transformer + class-validator：先把请求体实例化为 DTO 类，再按装饰器规则逐字段校验，任一规则失败就抛出 400 错误，响应中包含 message 数组列出每个字段的失败原因。whitelist 模式自动剥离 DTO 未声明的多余字段，防止参数污染。',
    flow: [
      '请求体 JSON 到达 POST /enrollments',
      'ValidationPipe 将普通对象转换为 CreateEnrollmentDto 实例',
      'class-validator 按 @IsEmail/@Min/@IsUUID 等规则逐字段校验',
      '校验失败 → 400 响应，message 数组给出全部错误；成功 → 进入控制器',
    ],
    notes: [
      '校验规则写在 DTO 上，与控制器解耦，可被多个接口复用',
      '全局 ValidationPipe 在 main.ts 注册一次即可覆盖所有接口',
      'transform: true 会把数字字符串自动转为 number 等目标类型',
      '自定义校验规则用 @Validate(ConstraintClass) 或自定义装饰器实现',
    ],
    problem: '未启用 whitelist 时，请求体里多余的字段（如 role: \'admin\'）会被原样透传到业务代码，形成隐式的越权风险——这就是 DTO 校验必须配合白名单的原因。',
    officialUrl: 'https://docs.nestjs.com/pipes',
  },
  {
    id: 'NE_04',
    title: '守卫与 JWT 认证：登录鉴权链路',
    navTitle: '守卫与 JWT 认证',
    category: '请求处理',
    path: '/nestjs/n-4/guards-jwt-auth',
    summary: '用学员登录场景展示 AuthGuard 校验 JWT 的完整链路：登录发 token、守卫解析验证、无凭证返回 401。',
    demo: N04GuardsJwt,
    code: () => Promise.resolve(`// jwt-auth.guard.ts —— 守卫在管道之前执行，决定请求是否放行
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
}`),
    principle: '守卫（Guard）实现 CanActivate 接口，在请求进入路由处理器之前决定是否放行，是鉴权与授权的首选位置。JWT 流程：登录成功用 JwtService.sign 签发签名 token；之后每个受保护请求携带 Authorization: Bearer <token>，JwtAuthGuard 验签并解析 payload，无效或过期抛 401，有效则把用户信息挂到 request 上。守卫返回 false 时框架自动返回 403，抛 UnauthorizedException 则返回 401。',
    flow: [
      'POST /auth/login 校验用户名密码，签发 JWT',
      '客户端后续请求携带 Authorization: Bearer <token>',
      'JwtAuthGuard 提取 token 并验签解析 payload',
      '验签失败 → 401；成功 → request.user 注入，请求进入处理器',
    ],
    notes: [
      '守卫在中间件之后、管道之前执行，可访问 ExecutionContext 拿到请求元数据',
      '@Roles() 自定义装饰器 + 守卫可组合实现基于角色的授权',
      'JWT 是无状态的：服务端不存会话，密钥泄漏等于全部失效',
      '敏感接口建议配合 ThrottlerGuard 做限流，防止暴力破解',
    ],
    problem: '把 token 放在 localStorage 并自动附加到每次请求虽然方便，但 XSS 一旦得手即可盗取 token——生产环境优先使用 HttpOnly Cookie 承载 JWT，并校验 CSRF 风险。',
    officialUrl: 'https://docs.nestjs.com/guards',
  },
  {
    id: 'NE_05',
    title: '拦截器：统一响应与请求计时',
    navTitle: '拦截器',
    category: '请求处理',
    path: '/nestjs/n-5/interceptors',
    summary: '用请求耗时面板展示拦截器的执行顺序：在处理器前后织入逻辑，统一包装响应结构。',
    demo: N05Interceptors,
    code: () => Promise.resolve(`// transform.interceptor.ts —— 统一响应包装
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const started = Date.now()

    return next.handle().pipe(
      // 处理器执行完成后，把返回值包装成统一结构
      map((data) => ({
        code: 0,
        data,
        timestamp: new Date().toISOString(),
        duration: \`\${Date.now() - started}ms\`,
      })),
    )
  }
}

// logging.interceptor.ts —— 记录请求耗时（前置逻辑用 tap）
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => console.log(\`耗时 \${Date.now() - start}ms\`)),
    )
  }
}`),
    principle: '拦截器（Interceptor）基于 RxJS 的 Observable 模型，在处理器执行前调用，并通过 next.handle() 拿到处理器返回的流：前置于 handle() 的代码在处理器之前运行，pipe 中的 map/tap 在处理器之后运行。由此可以在不修改业务代码的前提下完成响应包装、耗时统计、缓存、日志等横切关注点。',
    flow: [
      '请求到达 → TransformInterceptor 记录开始时间',
      'next.handle() 调用处理器（控制器 → 服务）',
      '处理器返回数据流，pipe(map(...)) 包装为统一结构',
      '客户端收到 { code, data, timestamp, duration }',
    ],
    notes: [
      'map 转换返回值，tap 只做副作用（日志/埋点）不修改数据',
      '多个拦截器按注册顺序执行，返回值流依次穿过每个拦截器的 pipe',
      '拦截器返回 new Observable 可实现请求级缓存，命中时跳过处理器',
      '与守卫（放行决策）、管道（参数校验）关注点互补，各司其职',
    ],
    problem: '直接在处理器里做响应包装会导致每个接口重复样板代码，且格式难统一——把响应结构变化收敛到拦截器，是保持 API 契约稳定的关键。',
    officialUrl: 'https://docs.nestjs.com/interceptors',
  },
  {
    id: 'NE_06',
    title: '中间件：请求链路的洋葱模型',
    navTitle: '中间件',
    category: '请求处理',
    path: '/nestjs/n-6/middleware',
    summary: '用请求日志链路展示中间件与守卫、管道、拦截器的执行顺序：洋葱模型的层层包裹。',
    demo: N06Middleware,
    code: () => Promise.resolve(`// logger.middleware.ts —— 中间件是请求进入路由前的第一站
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log(\`\${req.method} \${req.originalUrl} @ \${new Date().toISOString()}\`)
    next()  // 必须调用 next() 放行，否则请求卡死
  }
}

// app.module.ts —— 配置中间件作用于哪些路由
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('courses')          // 仅对 /courses* 生效
      // .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}`),
    principle: '中间件在守卫之前执行，是请求生命周期的最外层。典型的执行顺序是：中间件 → 守卫 → 拦截器前置 → 管道 → 处理器 → 拦截器后置。MiddlewareConsumer 用 apply().forRoutes() 声明中间件的作用路径与方法，可用排除法 exclude() 跳过指定路由。中间件适合日志、CORS、请求体解析、Cookie 解析等与路由无关的横切逻辑。',
    flow: [
      '请求进入 → LoggerMiddleware 记录日志并调用 next()',
      '守卫做鉴权决策 → 管道校验参数',
      '拦截器前置逻辑 → 控制器/服务执行',
      '响应原路返回，经过拦截器后置逻辑与中间件',
    ],
    notes: [
      '全局中间件用 app.use(middleware) 注册，作用于所有路由',
      '中间件不区分模块边界，比守卫/拦截器更"低层"',
      'CORS、helmet 等通常作为应用级中间件在 main.ts 注册',
      'next() 不调用时请求会悬挂，务必在异步逻辑完成后放行',
    ],
    problem: '把业务鉴权写进中间件虽然可行，但中间件拿不到完整的 ExecutionContext（例如反射不到 @Roles 元数据）——涉及角色授权时应使用守卫，职责边界更清晰。',
    officialUrl: 'https://docs.nestjs.com/middleware',
  },
  {
    id: 'NE_07',
    title: '异常过滤器：统一错误响应',
    navTitle: '异常过滤器',
    category: '请求处理',
    path: '/nestjs/n-7/exception-filters',
    summary: '用三类典型异常展示 @Catch 过滤器如何把错误转换成统一的 JSON 响应结构。',
    demo: N07ExceptionFilter,
    code: () => Promise.resolve(`// all-exceptions.filter.ts —— 捕获全部异常并统一格式
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any)?.message ?? exception.message
        : 'Internal server error'

    response.status(status).json({
      code: status,
      message,
      path: ctx.getRequest<Request>().url,
      timestamp: new Date().toISOString(),
    })
  }
}

// main.ts —— 全局注册
app.useGlobalFilters(new AllExceptionsFilter())

// 业务代码只需抛出语义化异常
throw new NotFoundException(\`课程 \${id} 不存在\`)`),
    principle: '异常过滤器（Exception Filter）实现 ExceptionFilter 接口，用 @Catch() 声明捕获范围：@Catch(HttpException) 只处理 HTTP 异常，@Catch() 捕获所有异常。过滤器从 ArgumentsHost 中拿到响应对象，统一输出 JSON 结构。业务代码只需抛出带语义的异常（NotFoundException、BadRequestException 等），无需关心响应格式。',
    flow: [
      '处理器抛出 NotFoundException(课程 42 不存在)',
      '异常沿调用链冒泡，被全局过滤器捕获',
      '过滤器读取状态码与 message，构造统一响应',
      '客户端收到 { code: 404, message, path, timestamp }',
    ],
    notes: [
      'HttpException 携带标准 HTTP 状态码，自定义异常可继承它',
      'catch 特定异常类型可以按异常定制响应字段',
      '过滤器作用域：方法级 @UseFilters > 控制器级 > 全局',
      '参数校验失败也是 HttpException（400），会被统一格式',
    ],
    problem: '未接全局过滤器时，未捕获的异常会返回 Nest 默认的 HTML/默认 JSON，前端错误处理代码要为不同格式写多套分支——统一过滤器让 API 契约在任何错误场景下保持一致。',
    officialUrl: 'https://docs.nestjs.com/exception-filters',
  },
  {
    id: 'NE_08',
    title: 'TypeORM 数据库：实体、仓储与事务',
    navTitle: 'TypeORM 数据库',
    category: '数据与实时通信',
    path: '/nestjs/n-8/typeorm-database',
    summary: '用课程报名业务展示实体定义、Repository 模式与事务：名额不足时整笔回滚。',
    demo: N08TypeOrmDb,
    code: () => Promise.resolve(`// course.entity.ts —— 实体映射数据库表
@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn() id: number
  @Column({ length: 100 }) title: string
  @Column({ default: 0 }) capacity: number      // 课程容量
  @Column({ default: 0 }) enrolled: number      // 已报名人数
}

// enrollment.service.ts —— 报名事务：检查名额 → 扣减 → 落库
@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async enroll(courseId: number) {
    // 事务保证三步操作要么全部成功，要么全部回滚
    await this.courseRepo.manager.transaction(async (manager) => {
      const course = await manager.findOneBy(Course, { id: courseId })
      if (!course) throw new NotFoundException('课程不存在')
      if (course.enrolled >= course.capacity) {
        throw new BadRequestException('课程名额已满')
      }
      await manager.increment(Course, { id: courseId }, 'enrolled', 1)
    })
  }
}`),
    principle: 'TypeORM 是 NestJS 官方推荐的 ORM：实体类用装饰器描述表结构，Repository 提供类型安全的 CRUD。事务用于多步写操作：manager.transaction 回调内的所有语句在同一个数据库事务中执行，任一步抛错则整体回滚。报名场景的"检查名额 + 扣减人数"必须原子化，否则并发报名会超额。',
    flow: [
      'POST /enrollments 携带 courseId 请求报名',
      '事务开启 → 查询课程，检查 enrolled < capacity',
      '名额充足 → 自增 enrolled；不足 → 抛异常整笔回滚',
      '事务提交，返回报名成功；异常时返回 400 且数据库无改动',
    ],
    notes: [
      '@InjectRepository 注入实体对应的 Repository，无需手动 new',
      '一对多/多对多用 @OneToMany/@ManyToMany + 关联选项描述',
      '自定义 SQL 用 QueryBuilder：createQueryBuilder(\'course\')',
      '迁移（Migration）管理表结构变更，避免手工改库',
    ],
    problem: '并发下"先查询再判断再写入"存在竞态：两个请求同时读到剩余 1 个名额都可能通过检查。生产环境要用 SELECT ... FOR UPDATE 悲观锁或乐观锁（@Version 列）保证一致性。',
    officialUrl: 'https://docs.nestjs.com/techniques/database',
  },
  {
    id: 'NE_09',
    title: 'WebSocket 网关：实时课堂通知',
    navTitle: 'WebSocket 网关',
    category: '数据与实时通信',
    path: '/nestjs/n-9/websocket-gateway',
    summary: '用课堂公告场景展示 @WebSocketGateway 的事件处理、房间（Room）隔离与广播推送。',
    demo: N09WebSocketGateway,
    code: () => Promise.resolve(`// classroom.gateway.ts —— WebSocket 网关处理实时双向通信
@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class ClassroomGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private online = 0

  @SubscribeMessage('joinRoom')          // 客户端发来的事件
  handleJoinRoom(
    @MessageBody() payload: { roomId: string; name: string },
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(payload.roomId)     // 加入指定房间，实现隔离
    this.online++
    // 向房间内所有人广播，不打扰其它房间
    client.to(payload.roomId).emit('joined', {
      name: payload.name,
      online: this.online,
    })
    return { event: 'joined', data: { ok: true } }
  }

  @SubscribeMessage('announce')
  handleAnnounce(
    @MessageBody() payload: { roomId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    // 讲师发公告 → 房间内广播
    client.to(payload.roomId).emit('announcement', {
      content: payload.content,
      at: new Date().toISOString(),
    })
  }

  handleConnection() {
    console.log('client connected')
  }
}`),
    principle: '网关（Gateway）复用 DI 容器，把 WebSocket 消息映射为类方法。@SubscribeMessage 声明处理的事件名，@MessageBody 取消息数据，@ConnectedSocket 取客户端连接。socket.join(roomId) 让连接进入房间，client.to(roomId).emit() 只向该房间广播，实现课堂、群聊等场景的按组隔离推送。',
    flow: [
      '学员连接 ws://localhost:3000，发送 joinRoom 事件',
      '网关把连接加入 classroom-1 房间，更新在线人数',
      '讲师发送 announce → 网关向房间内所有人广播公告',
      '每个学员实时收到 announcement 事件并渲染',
    ],
    notes: [
      'Nest 网关支持双通道：可同时处理 HTTP 请求与 WebSocket 消息',
      '鉴权可在 handleConnection 校验 token，拒绝无效连接',
      '断开时在 handleDisconnect 清理房间与在线状态',
      '生产环境建议接入 Redis 适配器，支持多实例横向扩展',
    ],
    problem: '只在内存中维护连接与房间时，应用一旦多实例部署，不同实例上的连接无法互相广播——这是 WebSocket 从单机到集群必须解决的问题，需引入 Redis Socket.IO Adapter。',
    officialUrl: 'https://docs.nestjs.com/websockets/gateways',
  },
  {
    id: 'NE_10',
    title: '定时任务：@nestjs/schedule 调度',
    navTitle: '定时任务',
    category: '工程实践',
    path: '/nestjs/n-10/scheduled-tasks',
    summary: '用日报表场景展示 @Cron、@Interval、@Timeout 三种调度方式与 cron 表达式规则。',
    demo: N10ScheduleTask,
    code: () => Promise.resolve(`// report.scheduler.ts —— 定时任务服务
@Injectable()
export class ReportScheduler {
  // cron 表达式：秒 分 时 日 月 周
  // '0 0 8 * * *' = 每天 08:00:00 生成日报表
  @Cron('0 0 8 * * *')
  async generateDailyReport() {
    const data = await this.orderService.aggregateYesterday()
    await this.reportService.save('daily', data)
    this.logger.log('日报表已生成')
  }

  // 每 5 分钟执行一次（服务健康心跳）
  @Interval(5 * 60 * 1000)
  heartbeat() {
    this.healthService.ping()
  }

  // 启动后延迟 10 秒执行一次
  @Timeout(10_000)
  onBoot() {
    this.logger.log('应用启动预热完成')
  }
}`),
    principle: '@nestjs/schedule 模块基于 cron 表达式管理定时任务：@Cron 按表达式周期执行，@Interval 按固定毫秒间隔执行，@Timeout 延迟一次执行。cron 表达式的六段格式为"秒 分 时 日 月 周"，支持 *、?、/、-、, 等通配符。任务方法挂在 Injectable 服务上，可注入其它依赖，天然复用 DI 体系。',
    flow: [
      '应用启动时扫描 @Cron/@Interval/@Timeout 装饰器注册任务',
      '调度器按表达式计算下一次触发时间',
      '到点调用对应方法，异常由调度器记录（默认不中断后续任务）',
      '日报表任务每天 08:00 聚合昨日订单并落库',
    ],
    notes: [
      'cron 第 6 位星期字段用 0-7（0/7 为周日），? 表示不指定',
      '多个实例同时运行会重复执行，配合分布式锁或单实例部署',
      '任务失败默认只记日志，可用 try/catch + 告警提升可观测性',
      '测试时用 @SchedulerRegistry 动态增删任务，便于 mock',
    ],
    problem: '分布式部署下每个实例都会执行同一份 @Cron 任务，导致报表重复生成——需要引入分布式锁（如 Redis SETNX）或把任务收敛到单一调度实例。',
    officialUrl: 'https://docs.nestjs.com/techniques/task-scheduling',
  },
  {
    id: 'NE_11',
    title: '配置管理：@nestjs/config 与环境',
    navTitle: '配置管理',
    category: '工程实践',
    path: '/nestjs/n-11/config-env',
    summary: '用多环境部署场景展示 ConfigModule 读取 .env、自定义配置与启动校验。',
    demo: N11ConfigEnv,
    code: () => Promise.resolve(`// config/configuration.ts —— 自定义配置工厂（类型安全）
export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    name: process.env.DB_NAME ?? 'classroom',
  },
  redis: {
    ttl: parseInt(process.env.REDIS_TTL ?? '3600', 10),
  },
})

// app.module.ts —— 全局配置模块
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,               // 所有模块都可注入 ConfigService
      load: [configuration],        // 加载自定义配置工厂
      envFilePath: ['.env.local', '.env'],
    }),
  ],
})

// 任意服务中注入使用
@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  getDbName() {
    return this.config.get<string>('database.name')
  }
}`),
    principle: '@nestjs/config 封装 dotenv：ConfigModule.forRoot 读取 .env 文件并合并到配置对象，ConfigService 提供类型安全的 get 访问。自定义配置工厂（load 数组）可以集中做默认值与类型转换，避免散落 process.env 读取。生产环境配合环境变量注入（docker/CI），本地用 .env 文件，实现"配置与代码分离"。',
    flow: [
      '应用启动，ConfigModule 读取 .env 与 .env.local 文件',
      '配置工厂按优先级合并默认值，生成配置对象',
      '任意 Provider 构造器注入 ConfigService 读取配置',
      '切换环境（dev/prod）只需替换环境变量，代码不变',
    ],
    notes: [
      'envFilePath 支持多文件，靠前的文件优先级更高',
      'isGlobal: true 后无需在每个模块重复 imports ConfigModule',
      '敏感配置（密码/密钥）只进环境变量，不进代码仓库',
      '可用 Joi/class-validator 对配置做启动校验，缺失即报错',
    ],
    problem: '直接把密钥写死在代码里并提交仓库，等于把生产凭证公开——正确做法是 .env 进 .gitignore，密钥通过部署平台的 Secret 注入，并在启动时校验必填项，缺了就快速失败。',
    officialUrl: 'https://docs.nestjs.com/techniques/configuration',
  },
  {
    id: 'NE_12',
    title: '微服务：TCP 传输与消息模式',
    navTitle: '微服务',
    category: '工程实践',
    path: '/nestjs/n-12/microservices',
    summary: '用下单场景展示微服务间的 TCP 传输：客户端代理调用、请求-响应模式与服务注册。',
    demo: N12Microservices,
    code: () => Promise.resolve(`// main.ts —— 库存服务作为 TCP 微服务启动
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  StockModule,
  {
    transport: Transport.TCP,      // 传输层：TCP（默认 3000 端口）
    options: { port: 4001 },
  },
)
await app.listen()

// stock.controller.ts —— 微服务控制器：监听消息模式
@Controller()
export class StockController {
  // 客户端 send({ cmd: 'deduct_stock' }, data) 会匹配到这里
  @MessagePattern({ cmd: 'deduct_stock' })
  deductStock(@Payload() data: { skuId: string; qty: number }) {
    return this.stockService.deduct(data)   // 返回值回传调用方
  }
}

// order.service.ts —— 订单服务通过 ClientProxy 调用库存服务
@Injectable()
export class OrderService {
  @Client({
    transport: Transport.TCP,
    options: { port: 4001 },
  })
  private readonly stockClient: ClientProxy

  async createOrder(dto: CreateOrderDto) {
    const stock = await this.stockClient
      .send({ cmd: 'deduct_stock' }, dto)   // 请求-响应模式
      .pipe(timeout(5_000))                  // 超时保护
      .toPromise()
    return this.orderRepo.save({ ...dto, stock })
  }
}`),
    principle: 'NestJS 微服务把传输层抽象为 Transport 策略（TCP、Redis、MQTT、gRPC、Kafka、RabbitMQ）。服务方用 @MessagePattern 声明消息处理函数，客户端用 ClientProxy.send(pattern, data) 发起请求-响应式调用（基于 RPC），也可以用 emit() 发送无需回执的事件。TCP 默认端口 3000，多服务需分配不同端口或用服务发现。',
    flow: [
      '订单服务收到 POST /orders 创建订单请求',
      'OrderService 通过 ClientProxy 向库存服务发送 deduct_stock 消息',
      '库存服务 @MessagePattern 匹配并扣减库存，返回结果',
      '订单服务拿到结果后落库；超时/失败按策略处理',
    ],
    notes: [
      'send() 返回 Observable，配合 timeout/retry/pipe 做容错',
      '消息模式用 { cmd } 自定义，事件模式用字符串标识',
      'gRPC 适用于强类型契约场景，Kafka 适合高吞吐事件流',
      '跨服务链路追踪（traceId）是排查微服务问题的前提',
    ],
    problem: '服务间同步调用（send）会把延迟与故障互相传染——需要引入超时、重试、熔断与降级，必要时用事件（emit）解耦，让下游故障不阻塞主流程。',
    officialUrl: 'https://docs.nestjs.com/microservices/basics',
  },
]
