<script setup lang="ts">
import K04ComputedWatch from './K04ComputedWatch.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>「合计金额」这种数据，到底是该单独存一个变量、每次手动同步，还是根本不存、随用随算？
    </div>

    <h2>合计数量的存储取舍</h2>
    <p>
      做一个购物车：填入单价和数量，页面实时显示合计金额。此外还有两个附带要求——每次金额变化要记一条日志，数量达到批量优惠门槛时要给出提示。
    </p>
    <p>
      合计金额是在 <code>单价 × 数量</code> 这个关系下产生的新值。问题来了：它该被当成一个<strong>要维护的状态</strong>，还是当成一个<strong>要计算的结论</strong>？这个判断会直接影响后面代码里有多少 bug 在等着你。
    </p>

    <h2>声明加监听的重算</h2>
    <p>
      最直觉的做法：声明一个 <code>total</code> 变量，然后「监听」两个输入，一旦它们变化，就重新算一遍并赋值给 <code>total</code>。
    </p>
    <p>
      这个方案做对了两件事：<strong>它承认「金额会变」</strong>，也<strong>承认「变化需要有人响应」</strong>。在只有一个输入源、一条计算规则、一处响应逻辑的场景里，这种做法完全够用，而且行为一目了然。
    </p>

    <h2>双来源的同步矛盾</h2>
    <ul>
      <li>同一份事实出现了两个来源：单价数量和合计金额。它们随时可能因为漏写一次同步而互相矛盾。</li>
      <li>派生关系被写进了命令式代码里，看代码的人很难一眼看出「合计就是单价乘数量」。</li>
      <li>如果在这条同步链路上再挂一个「修改合计反向改数量」的需求，非常容易绕成死循环。</li>
      <li>多个地方都要读这个值，但没人能保证它被更新的时机，读到旧值的概率随代码量上升。</li>
    </ul>

    <h2>计算结果不入状态</h2>
    <p>
      关键的分岔点在于：<strong>能算出来的，就不要存</strong>。把合计从「状态」降级成「派生值」，交给 <code>computed</code> 描述。它接收一段表达式，返回一个结果，依赖变化时自动重算；更妙的是它<strong>带缓存</strong>——只要依赖没变，重复读取不会重新执行，适合高频访问的派生数据。派生关系被写回了「数据本身」，不再是一串需要人记住的同步动作。
    </p>
    <p>
      但「记录日志」不同。它不是数据，它是一个<strong>副作用</strong>：要做的事发生在 Vue 之外，需要明确知道「什么时候触发」。这类需求交给 <code>watch</code>——它监听一个明确的来源，在变化时执行一段回调，适合请求、日志、本地存储和与外部系统同步。
    </p>
    <p>
      还有第三种：<code>watchEffect</code>。它<strong>自动收集回调里同步读取到的依赖</strong>，省去了手写来源列表的麻烦，适合快速建立依赖驱动的副作用；代价是依赖收集更隐式，读代码时要靠回调体反推它到底依赖了什么，复杂场景下不如 <code>watch</code> 好读。
    </p>
    <table>
      <thead>
        <tr>
          <th>工具</th>
          <th>定位</th>
          <th>典型场景</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>computed</code></td>
          <td>可缓存的派生值，依赖不变不重算</td>
          <td>合计金额、筛选后的列表</td>
        </tr>
        <tr>
          <td><code>watch</code></td>
          <td>监听明确来源，执行副作用</td>
          <td>日志、请求、本地存储</td>
        </tr>
        <tr>
          <td><code>watchEffect</code></td>
          <td>自动收集同步依赖，隐式</td>
          <td>快速建立依赖驱动的副作用</td>
        </tr>
      </tbody>
    </table>
    <p>
      选择口径可以一句话记牢：<strong>能用 <code>computed</code> 表达的，就不要用 <code>watch</code> 手动同步</strong>，否则又会出现两份数据不一致；只有当需要明确的触发源与副作用时，才用 <code>watch</code>。
    </p>
    <p>
      还有一个判断技巧：如果某样东西<strong>能被别的东西算出来</strong>，它就是派生值，交给 <code>computed</code>；如果某件事情<strong>必须去做</strong>——打点上报、写入本地存储、清理定时器——它就是副作用，交给 <code>watch</code>。前者回答「是什么」，后者回答「要做什么」，这句话能把大部分选择直接定下来。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易漏的参数：</strong>监听对象属性时，需要 <code>deep: true</code> 才能检测到嵌套变化，否则对象的内部字段被原地修改时不会触发；<code>immediate: true</code> 可以让回调在初始化时立即执行一次，适合「首次也要上报」的场景。
    </div>
    <ol class="lesson-steps">
      <li>单价或数量变化后，<code>total</code> 自动重新计算。</li>
      <li>用 <code>watch</code> 监听 <code>total</code>，把金额变化写入日志。</li>
      <li><code>watchEffect</code> 根据数量阈值给出批量优惠提示。</li>
      <li>对比 <code>computed</code> 与 <code>watch</code> 的触发日志，验证前者只在依赖变化时重算。</li>
    </ol>

    <h2>即时重算与日志触发</h2>
    <figure class="lesson-figure">
      <figcaption>调整单价与数量，看合计即时变化，同时观察下方日志被哪些变化触发。</figcaption>
      <K04ComputedWatch />
    </figure>

    <h2>派生与副作用的划分</h2>
    <p>
      计算与监听的区别，本质是「派生」与「副作用」的区别：能由状态推出来的结果用 <code>computed</code>，让它随依赖自动重算并享受缓存；需要对变化做出反应的事用 <code>watch</code>，监听明确来源、执行明确的副作用。把两者用反，就会出现两份数据打架或者一堆看不懂的隐式依赖。
    </p>
    <div class="lesson-term">
      <span class="term-name">「派生值」</span>指由其他状态计算得出的结果，用 <code>computed</code> 描述，依赖不变时不重算。<code>watch</code> 用于监听明确来源并执行副作用（请求、日志、本地存储），支持 <code>deep</code> 与 <code>immediate</code> 选项；<code>watchEffect</code> 会自动收集同步读取到的依赖。选择顺序是：优先 <code>computed</code>，需要明确触发源与副作用时才用 <code>watch</code>。
    </div>
  </LessonArticle>
</template>
