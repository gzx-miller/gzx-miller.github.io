const o=`<script setup lang="ts">
import J26WebStorage from './J26WebStorage.vue'
import J27WebSocket from './J27WebSocket.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户在 A 标签页里登录后改了昵称，切到 B 标签页，头像旁边还是旧名字，非得手动刷新一下才更新——同一份 <code>localStorage</code> 数据，为什么另一个标签页像没看见一样？
    </div>

    <h2>两种本地存储</h2>
    <p>
      想在浏览器里存点东西，最常见的钥匙就是 <code>localStorage</code>。它按「键值对」存取，刷新页面不丢，关掉浏览器再打开也还在——几乎所有需要「记住我」的功能都靠它。用着用着，很容易把所有状态都往里塞，直到碰上另一个需求：那份「只在本次填写里生效」的草稿，其实不该长期留着。
    </p>
    <p>
      这时 <code>sessionStorage</code> 才显出自己的定位。两者的用法一模一样，差别在<strong>生命周期</strong>：<code>localStorage</code> 是持久的，跨会话保留；<code>sessionStorage</code> 以标签页为单位，标签页一关就清空，同一个站点的两个标签页各自独立、互不影响。需要「填一次就够」的临时状态放 <code>sessionStorage</code>，需要「下次还认得你」的放 <code>localStorage</code>，各归其位才不互相干扰。
    </p>

    <h2>只能存字符串</h2>
    <p>
      第一次往 <code>localStorage</code> 存对象，多半会踩到坑：读出来是一串 <code>[object Object]</code>。原因是<strong>它只接受字符串</strong>，写入时会把非字符串的值强制转成字符串，这层转换你根本看不见。
    </p>
    <p>
      要存结构化的数据，就得自己承担这层转换：写入前用 <code>JSON.stringify()</code> 序列化成字符串，读取时用 <code>JSON.parse()</code> 还原。多了这两步，对象、数组乃至布尔值、数字都能安全地存下来；代价是自己记住——数字存进去再读出来会变成字符串形态，需要运算时得显式转回。
    </p>

    <h2>storage 事件与配额</h2>
    <p>
      回到开场那个「另一个标签页不更新」的问题：它其实对应一个专门的机制——<code>storage</code> 事件。当某份存储被修改时，浏览器会通知<strong>其他同源的标签页</strong>；监听它，就能在别处同步更新界面，把跨标签页的状态拉齐。
    </p>
    <p>
      这里有个极易误解的点：<strong><code>storage</code> 事件只在「其他」标签页触发</strong>。写入数据的那一个页面自己收不到事件，它本来就是变更的发起方，无需再被通知。所以跨页同步要「一边写、一边在别处听」，指望同一页面听自己的写入会落空。
    </p>
    <p>
      另一个边界是容量。存储是有配额的，写入超出上限时会抛出 <code>QuotaExceededError</code>。这意味着「存进去」并不是一个可以省略错误处理的动作，尤其当内容由用户输入或接口返回时，最好用 <code>try/catch</code> 兜住，以免整段逻辑因为一次超限而中断。
    </p>

    <h2>同步读写的代价</h2>
    <p>
      <code>localStorage</code> 用起来顺手，是因为它<strong>读写同步</strong>——调用就立刻拿到结果，没有回调也没有 Promise。方便的另一面是隐患：同步意味着<strong>这段读写会占住主线程</strong>，期间页面无法响应交互。存几十字节无感，可一旦序列化几万条记录再写进去，卡顿就会肉眼可见。
    </p>
    <p>
      大数据量该换 <code>IndexedDB</code>。它完全不同：<strong>异步</strong>，读写都返回请求对象或 Promise，不阻塞主线程；<strong>基于事务</strong>，一组操作要么全成功、要么一起回滚，不会写到一半留下不一致；数据存在<strong>对象仓库（object store）</strong>里，可以建索引、做范围查询，能力接近一个内嵌的小型数据库。代价是用起来更重，简单的键值存取反而不值得。
    </p>

    <h2>从轮询到长连接</h2>
    <p>
      存储解决的是「本地留数据」，可聊天、行情、协同编辑这类需求，数据要的是「服务端主动送过来」。最笨的做法是<strong>轮询</strong>：客户端每隔几秒去问一次「有新消息吗」。它简单，却把大量请求花在「没有」上，延迟还不稳定。
    </p>
    <p>
      <code>WebSocket</code> 换了一条路。它先用一次普通的 HTTP 请求做<strong>升级握手</strong>，握手成功后，这条连接就升级为<strong>持久、双向</strong>的通道——双方随时可以向对方发送数据，不必再一问一答。代价是状态要靠事件管理：连接建立触发 <code>open</code>，收到数据触发 <code>message</code>，连接关闭触发 <code>close</code>，出错触发 <code>error</code>。少了哪一个都会让连接状态变得难以预料。
    </p>

    <h2>亲手存储与连接</h2>
    <figure class="lesson-figure">
      <figcaption>切换 <code>localStorage</code> 与 <code>sessionStorage</code> 存取，对比两者在刷新与关闭标签页后的不同表现。</figcaption>
      <J26WebStorage />
    </figure>
    <figure class="lesson-figure">
      <figcaption>建立连接后发送一条消息，观察 <code>open</code>、<code>message</code>、<code>close</code> 各自的时机。</figcaption>
      <J27WebSocket />
    </figure>

    <h2>重连心跳与选型</h2>
    <p>
      <code>WebSocket</code> 有一个必须自己补上的短板：<strong>它不会自动重连</strong>。网络一抖、连接一断，就是真的断了，得在 <code>close</code> 事件里自行发起重连，通常配上逐次加长的退避间隔，避免服务器刚恢复就被重连风暴打垮。此外长时间空闲的连接可能被中间层掐断，所以要定期发送<strong>心跳</strong>保活，确认通道仍然可用。
    </p>
    <p>
      并不是所有「服务端推数据」都值得上 WebSocket。若只是服务端单向推送，比如进度通知、日志流，<code>SSE/EventSource</code> 更省事：它就是一条长连接，服务端往客户端单向发，而且<strong>断线后浏览器会自动重连</strong>，重连逻辑不用自己写。选型的分界线很清楚——<strong>只有需要客户端也主动、频繁地发数据（全双工）时，才用 WebSocket</strong>；只需单向推送，SSE 就够了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「全双工」</span>指通信双方可以同时收发数据，<code>WebSocket</code> 在 HTTP 升级握手后建立的正是这样的通道；与之相对，<code>SSE/EventSource</code> 是服务端到客户端的单向推送。前者适合聊天、协同编辑等双向频繁交互，后者适合进度、通知等单向流。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
