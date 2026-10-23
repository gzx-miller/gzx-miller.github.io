const n=`// create-enrollment.dto.ts —— 数据传输对象，用装饰器声明规则
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
}`;export{n as default};
