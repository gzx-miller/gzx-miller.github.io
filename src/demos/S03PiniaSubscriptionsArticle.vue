<script setup lang="ts">
import S03PiniaSubscriptions from './S03PiniaSubscriptions.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一次「报名课程」只该是一个动作，可持久化那段代码却被执行了三遍——为什么一个业务动作会在 Store 里变成三次状态提交？
    </div>

    <h2>报名多处改动</h2>
    <p>
      学习计划模块继续往上长。现在用户完成一次报名时，Store 里其实要改好几处：往课程数组里加一门课、更新已完成课程的标记、再顺手刷一下「最近更新」的时间戳。与此同时，业务上还要求把这些变更持久化下来——写进本地存储，并在开发环境里打一条审计日志，方便追溯是谁在什么时候改了状态。
    </p>
    <p>
      于是两个需求顶到了一起：一次操作要改多处状态，而所有变更又都需要被统一地感知和落盘。你不可能在每一处赋值后面都手写一遍持久化，那样迟早会漏；你也不能任由每一处赋值各自触发一次副作用，那样一次报名就会写出三份持久化记录。核心问题是：<strong>怎么把「一次业务动作」和「一次状态提交」对齐，同时有一个统一的观察点来接住所有变更？</strong>
    </p>

    <h2>就地散写改动</h2>
    <p>
      最省事的做法：需要改哪里就写哪里，直接往数组里 <code>push</code>、直接给字段赋值，然后在业务代码里顺手写上持久化逻辑。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「状态怎么变」讲得非常直白</strong>，读代码的人一眼就能看懂这次操作改了哪几个字段，没有任何封装带来的跳跃感。规模小的时候，直白就是最大的优点。
    </p>

    <h2>订阅重复触发</h2>
    <ul>
      <li>一次业务动作里的多次赋值会分别触发观察者，订阅回调被调用多次，持久化随之重复执行，日志里出现三条本应只有一条的记录。</li>
      <li>手写的持久化散落在各个业务分支里，新增一处修改就多一次遗漏风险，而且很难保证它总是在状态稳定之后才执行。</li>
      <li>想观察「任何地方对状态的修改」根本做不到，只能挨个去改那些赋值语句，等于把基础设施逻辑和业务逻辑搅在一起。</li>
      <li>多个修改之间如果互相依赖（比如新课程数量要基于旧数组长度判断），分开赋值还会让中间态短暂可见。</li>
    </ul>

    <h2>批量提交合并</h2>
    <p>
      先把「多次修改」收敛成一次提交，工具是 <code>$patch</code>。它把同一个业务动作里的多个修改合并成一次状态变更，观察者只会收到一次通知。
    </p>
    <ul>
      <li><strong>对象形式</strong> <code>store.$patch({ ... })</code>：适合直接覆盖某个字段的值，写法简短。</li>
      <li><strong>函数形式</strong> <code>store.$patch((state) =&gt; { ... })</code>：适合需要参考旧值的操作，例如向数组 <code>push</code>、按条件 <code>splice</code>。对象形式表达不了「在原有基础上追加」，这类操作必须用函数形式。</li>
    </ul>
    <p>
      再补上统一观察点，工具是 <code>$subscribe</code>。它像 <code>watch</code> 一样观察 Store 的每一次状态变更，回调会收到两样东西：一个是 <code>mutation</code>，里面带有 <code>type</code>、<code>storeId</code> 和 <code>payload</code>；另一个是最新的 <code>state</code>。<code>mutation.type</code> 能区分这次变更来自哪种方式——直接赋值、对象形式的 <code>$patch</code>，还是函数形式的 <code>$patch</code>。有了它，持久化、审计、跨标签同步这些<strong>基础设施层面的副作用</strong>就能集中到一处，不必再散落进业务代码。
    </p>
    <ol class="lesson-steps">
      <li>用 <code>store.$subscribe(...)</code> 注册观察者，并把返回的取消函数保存下来。</li>
      <li>业务动作里改用 <code>store.$patch</code> 的函数形式，把互相依赖的几个修改一次提交完成。</li>
      <li>订阅回调读取 <code>mutation.type</code> 与最新 <code>state</code>，追加到事件列表用于展示或持久化。</li>
      <li>组件卸载时调用那个取消函数，避免组件离开后回调仍在执行。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>两个必须守住的边界：</strong>其一，<code>$subscribe</code> 返回的是取消函数，组件销毁时必须调用它，否则订阅会持续泄漏，回调里访问到的可能已经是卸载后的组件状态。其二，订阅回调里<strong>不要再次无条件修改同一份状态</strong>，那会让每次变更都触发一次新的变更，形成无限循环提交。
    </div>
    <p>
      还有两个场景值得提前知道。如果这份订阅需要脱离组件生命周期存在，比如放在一个全局的初始化模块里，可以在注册时传入 <code>{ detached: true }</code>，此时它不再随组件销毁自动清理，改由调用方手动负责清理，责任也跟着转移了。另一个是服务端渲染：持久化必须区分服务端与客户端，服务端没有本地存储可用，要在水合完成之后再读取并回填本地状态，否则会在两端渲染出不一致的结果。最后回到职责划分上——<code>$subscribe</code> 适合承载持久化、审计、跨标签同步这类基础设施副作用，而带有业务含义的副作用仍应放在 action 里，两者不要互相顶替。
    </p>

    <h2>单条记录验证</h2>
    <figure class="lesson-figure">
      <figcaption>点「批量更新并记录订阅」，看一次业务动作只产生一条订阅记录，并留意 <code>mutation.type</code> 显示的是什么。</figcaption>
      <S03PiniaSubscriptions />
    </figure>

    <h2>提交与通知分工</h2>
    <p>
      批量更新与订阅这两件事，本质上是给 Store 补上「提交」与「通知」两个概念。<code>$patch</code> 保证一次业务动作只产生一次状态提交，函数形式还照顾了需要参考旧值的数组操作；<code>$subscribe</code> 提供一个统一的观察点，把持久化和审计这类副作用收拢到一处，并靠返回的取消函数来控制生命周期。至于业务副作用，仍然该留在 action 里。
    </p>
    <div class="lesson-term">
      <span class="term-name">「$patch 与 $subscribe」</span><code>$patch</code> 把同一业务动作中的多个修改合并成一次提交：对象形式适合覆盖，含 <code>push</code> / <code>splice</code> 等需参考旧值的操作应使用函数形式。<code>$subscribe</code> 像 <code>watch</code> 一样观察 store 的每次状态变更，回调收到 <code>mutation</code>（含 <code>type</code>、<code>storeId</code>、<code>payload</code>）与最新 <code>state</code>，<code>mutation.type</code> 区分 direct、patch object 与 patch function；它返回取消函数，组件销毁时必须调用，需要脱离组件生命周期时可用 <code>{ detached: true }</code>。
    </div>
  </LessonArticle>
</template>
