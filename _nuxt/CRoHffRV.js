const n=`// transform.interceptor.ts —— 统一响应包装
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
}`;export{n as default};
