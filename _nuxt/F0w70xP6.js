const e=`// course.module.ts —— 模块是 NestJS 组织代码的基本单元
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
}`;export{e as default};
