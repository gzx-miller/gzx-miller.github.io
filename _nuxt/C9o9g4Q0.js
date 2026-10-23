const e=`// report.scheduler.ts —— 定时任务服务
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
}`;export{e as default};
