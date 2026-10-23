const n=`// classroom.gateway.ts —— WebSocket 网关处理实时双向通信
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
}`;export{n as default};
