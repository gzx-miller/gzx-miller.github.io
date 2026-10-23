const e=`<script setup lang="ts">
import LG16Persistence from './LG16Persistence.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户第二轮说「就按刚才那个路线继续」，助手却反问「您想学什么」。你查代码，图本身没错——状态在进程里活得好好的，只是每次请求都从空状态开始。会话记忆不是模型的能力，而是图的存储问题。
    </div>

    <h2>没有检查点，图就是一次性的</h2>
    <p>
      默认情况下，<code>invoke</code> 执行完就把状态丢掉。下一轮请求即使带着同一段对话，图也无从知道「刚才执行到哪、哪些字段已经有值」。更麻烦的是人机交互：审批节点挂起后进程退出，恢复时没有断点可回，只能从头再跑。
    </p>
    <p>
      检查点（checkpoint）解决的就是这件事：<strong>每执行一个超步，就把完整状态、下一批待执行节点和元数据写一份快照</strong>，并按线程归档。有了快照，恢复、回放、时间旅行才成为可能。
    </p>

    <p>
      <strong>一份检查点包含：</strong>
    </p>
    <ul>
      <li><strong>thread_id</strong>：会话线程的身份。同一线程共享历史，不同线程互相隔离。</li>
      <li><strong>checkpoint_id</strong>：这一份快照的编号，按时间形成链，可以定位到任意一步。</li>
      <li><strong>状态值与通道版本</strong>：每个字段当前的值，以及它是被哪一步写入的。</li>
      <li><strong>next</strong>：接下来要执行的节点。挂起恢复靠的就是它。</li>
      <li><strong>checkpoint_ns</strong>：命名空间。子图有自己的命名空间，父图不会自动看到子图内部的中间快照。</li>
    </ul>
    <p>
      快照保存的是<strong>合并后的完整状态</strong>，不是节点返回的那一小块增量。这样做的好处是恢复时不必重放全部历史，读取一份快照就能重建上下文；代价是每次写入都要序列化整个状态。消息列表很长、状态字段很大时，序列化开销会明显上升，这也是「状态里只放流程真正需要的字段」的另一条理由。
    </p>

    <h2>接入检查点只需要两处改动</h2>
    <p>
      第一处是编译时挂上检查点实现：<code>graph.compile({ checkpointer })</code>。第二处是每次调用带上线程标识：<code>{ configurable: { thread_id: 'course-thread-01' } }</code>。同一个 <code>thread_id</code> 的多次 <code>invoke</code> 会自动接续历史；换一个 <code>thread_id</code>，就是一段全新的会话。
    </p>
    <p>
      这两处缺一不可。只挂 checkpointer 而不传 <code>thread_id</code>，框架无法判断该读写哪条线程；只传 <code>thread_id</code> 而没有 checkpointer，配置会被忽略，状态依旧不落盘。
    </p>

    <h2>MemorySaver 只是开发工具</h2>
    <p>
      <code>MemorySaver</code> 把检查点存放在当前进程的内存里，适合本地调试与单元测试。它有两个硬边界：<strong>进程重启即丢</strong>，<strong>多实例之间不共享</strong>。生产环境必须换成持久化实现：单机部署可以用 <code>SqliteSaver</code>，多实例或需要横向扩展时用 <code>PostgresSaver</code>。后者首次使用要执行 <code>setup()</code> 建表，连接串从环境变量读取，不能写进代码。
    </p>
    <p>
      替换实现时，业务代码基本不用改——图仍然编译、调用仍然传 <code>thread_id</code>。这正是把存储抽成 checkpointer 接口的价值。还需要注意并发：同一个 <code>thread_id</code> 不应该被两个请求同时推进，否则两份执行会基于同一份旧快照各自写入，产生难以复现的分叉。服务端要么按线程串行化，要么在入口处拒绝并发写。
    </p>

    <h2>读状态与时间旅行</h2>
    <p>
      检查点不只用于恢复，也提供了一组查询与改写能力：
    </p>
    <ul>
      <li><code>getState(config)</code>：读取线程的最新状态与 <code>next</code>，用来判断「现在是挂起、还是已经结束」。</li>
      <li><code>getStateHistory(config)</code>：按时间倒序列出该线程的所有快照，是回放与审计的数据源。</li>
      <li><code>updateState(config, values)</code>：以某个检查点为基准写入修正值，生成一份新的快照。配合带 <code>checkpoint_id</code> 的配置，可以从历史点分叉，而不破坏原分支。</li>
    </ul>
    <p>
      「时间旅行」的本质不是把时钟拨回去，而是<strong>从旧快照派生新分支</strong>。旧检查点仍然保留，新执行产生新的 <code>checkpoint_id</code>。这让「改一个中间状态再重跑」变成可控操作，而不是覆盖历史。
    </p>

    <p>
      <strong>检查点会无限增长。</strong>每执行一步就写一份快照，长会话加上高频调用，存储增长会非常快。上线前必须设计保留策略：按线程只保留最近 N 个检查点、按时间设置 TTL、把冷数据归档到对象存储，或在会话结束后显式删除整条线程。策略要避开正在挂起等待恢复的线程，否则「续跑」会找不到断点。更稳妥的做法是按业务价值分层：活跃线程保留完整历史，已结束的线程只留最终快照，审计要求的线程单独延长保留期。
    </p>

    <h2>checkpointer 与 store 分工不同</h2>
    <p>
      两者经常被混为一谈，但作用范围完全不同。<strong>checkpointer 管线程内的短期记忆</strong>：这段对话执行到哪、消息列表是什么、哪些节点还没跑。<strong>store 管跨线程的长期记忆</strong>：用户画像、偏好、历史结论，按命名空间与 key 存储，换一个 <code>thread_id</code> 仍然能读到。把长期事实塞进检查点，会随着线程删除而丢失；把每一步状态塞进 store，又失去了图恢复所需的<strong>next</strong> 与通道版本。一个具体的分工是：消息列表、当前草稿、待执行节点交给 checkpointer；学生姓名、偏好、已完成的课程交给 store，并在节点里按需读取。
    </p>

    <h2>线程时间线演示</h2>
    <figure class="lesson-figure">
      <figcaption>切换线程 A / B，观察 <code>thread_id</code> 如何隔离两段会话；用「回退 / 前进」在检查点之间移动，右侧快照的 <code>checkpoint_id</code>、<code>next</code> 与状态值同步变化。这些操作只读历史，不会重新执行图。</figcaption>
      <LG16Persistence />
    </figure>

    <p>
      <strong>可恢复才谈得上可靠。</strong>持久化把「一次调用」升级为「一条可续跑的线程」。检查点负责线程内的执行断点，store 负责跨线程的长期事实；前者要选持久化后端并设计保留策略，后者要设计命名空间与写入时机。两者都到位，会话才不会因为一次重启而失忆。
    </p>
    <div class="lesson-box warn">
      <strong>上线前检查：</strong><code>MemorySaver</code> 不能进生产；<code>thread_id</code> 必须由服务端生成或校验，不能直接信任前端传值，否则会读到别人的会话；<code>updateState</code> 会写入新快照，不要在排查问题时误改生产线程；检查点保留策略要避开挂起中的线程；数据库连接与建表操作放在启动阶段，不要每次请求都 <code>setup()</code>。
    </div>
    <div class="lesson-term">
      <span class="term-name">「检查点」</span>是图在每个超步写下的状态快照，按 <code>thread_id</code> 归档，包含状态值、<code>next</code> 与命名空间。<strong>compile({ checkpointer })</strong> 开启持久化，<strong>configurable.thread_id</strong> 指定线程；<strong>getState / getStateHistory / updateState</strong> 支撑恢复、回放与分叉。要记住的边界：MemorySaver 只适合开发，生产用 PostgresSaver / SqliteSaver；快照会无限增长，必须设保留策略；checkpointer 管线程内短期记忆，store 管跨线程长期记忆。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
