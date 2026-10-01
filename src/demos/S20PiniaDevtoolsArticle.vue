<script setup lang="ts">
import S20PiniaDevtools from './S20PiniaDevtools.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户反馈「日记列表突然只剩一条了」，可你反复操作也复现不出来——状态到底是在哪一次操作、被哪一行代码改坏的？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做一个「秋日心情日记」：用户可以新增笔记、删除笔记、切换当前心情和主题。某天有人报障，说写着写着列表就少了好几篇。你自己怎么点都正常，因为这个 bug 依赖一连串特定操作的先后顺序——<strong>问题不在于改错了哪个字段，而在于你根本看不见「状态变化的历史」</strong>。
    </p>
    <p>
      调试状态类 bug，难点从来不是「值现在是多少」，而是「它是怎么一步步变成这个值的」。只要能把每一步变化都记下来、并能回到任意一步，复现就几乎等于解决了一半。
    </p>

    <h2>最小方案</h2>
    <p>
      最直接的做法：在关键位置 <code>console.log</code> 打印当前状态，靠肉眼比对两次打印的差别。
    </p>
    <p>
      它做对了最基础的一件事：<strong>开始尝试观察状态变化</strong>。当只有一个变量、只变一次时，这招足够用。问题在于，一旦状态由多个字段组成、变化又频繁，打印出的日志会迅速把人淹没，你分不清哪一行对应哪一次操作，更别说回到过去那个状态。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>日志太多，无法从输出里还原出操作与状态的对应关系。</li>
      <li>只能看到「现在」，看不到「几步之前」，无法回放。</li>
      <li>很难判断是哪个 action 引出的这次变化。</li>
      <li>临时加的打印语句容易泄漏到生产代码里。</li>
      <li>想复现一个偶发问题时，缺少可反复回退的机制。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「观察状态」，而是把观察升级成<strong>一路记下每次变化、并且能随时回退</strong>。这正是 Vue DevTools 与 Pinia 集成后提供的能力：在 DevTools 的 Pinia 面板里，你能看到每个 store 的当前状态、按时间排列的 action 调用记录，并基于快照做<strong>时间旅行</strong>——选中历史中的某一刻，直接回溯到当时的状态。
    </p>
    <p>
      这套「时间旅行」听起来玄，原理却只有四个字：<strong>快照 + 回放</strong>。它完全可以用两个 API 手工搭出来。用 <code>store.$subscribe</code> 监听状态变更，每变一次就深拷贝一份状态存起来，得到一条按时间索引的历史；当你想回到某个位置时，用 <code>store.$patch(快照)</code> 把那个快照整体写回去，状态就回到了那一刻。
    </p>
    <ol class="lesson-steps">
      <li>用 <code>$subscribe</code> 监听状态变更，每次变更深拷贝一份快照入队。</li>
      <li>组件触发 <code>addNote</code>、<code>setMood</code> 等 action 时，变更被采样进时间线。</li>
      <li>在时间线上选择某个历史位置，用 <code>$patch</code> 回放该快照，实现撤销与恢复。</li>
      <li>回放期间用一个标记位屏蔽自身的 <code>$subscribe</code>，避免回放又被当成一次新变更。</li>
    </ol>
    <p>
      还有一个容易被忽略的细节：做快照要<strong>深拷贝</strong>，否则存下来的可能只是同一个对象的引用，回放时连「历史」也会跟着一起变，快照就失去了意义。这也是演示里那一步 JSON 深拷贝不能省的原因。把「快照 + 回放」当成一个通用套路记下来，它的价值不止于调试：业务里想做撤销、重做，本质上就是同一件事——<strong>保留历史快照，按需回放</strong>。理解了它，你就不再只是 DevTools 的使用者，而是能在需要时自己造一个轻量版本。
    </p>
    <div class="lesson-box hint">
      <strong>别忘了给历史设上限：</strong>快照会占用内存，演示里就只保留最近若干条。真实项目里同样要限制长度，或只记录关键的 action，否则长时间使用会越积越多，反而拖慢应用。
    </div>
    <div class="lesson-box hint">
      <strong>三个实践建议：</strong>第一，<strong>action 命名要表达业务意图</strong>，叫 <code>addNote</code> 比叫 <code>setList</code> 更容易在时间线里一眼定位来源。第二，开发时结合 <code>import.meta.hot</code> 与 <code>acceptHMRUpdate</code>，<strong>修改 store 代码时保住现场状态</strong>，不必每次都重头点一遍。第三，DevTools 主要服务开发阶段，<strong>生产环境的排障要靠日志与监控</strong>，别指望它。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>写几条日记、切换心情，然后到时间线上回退，看状态如何被整体回放。</figcaption>
      <S20PiniaDevtools />
    </figure>

    <h2>总结</h2>
    <p>
      时间旅行调试把「状态是怎么变成现在这样的」变成了可查看、可回退的东西。它的底层并不神秘：<code>$subscribe</code> 负责捕获变更生成快照，<code>$patch</code> 负责回放快照恢复状态。配合清晰的 action 命名与 HMR，状态类 bug 的定位效率会大幅提升。
    </p>
    <div class="lesson-term">
      <span class="term-name">「时间旅行调试」</span>是 Pinia 与 Vue DevTools 集成后的能力：在面板中查看每个 store 的状态与 action 记录，并基于历史快照<strong>回退到任意时刻</strong>。其原理是「<strong>快照 + 回放</strong>」——用 <code>$subscribe</code> 监听变更保存快照，用 <code>$patch(快照)</code> 回放状态；同一套思路也可在业务中实现撤销与重做。
    </div>
  </LessonArticle>
</template>
