<script setup lang="ts">
import E02Form from './E02Form.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户在注册表单里把用户名只填了两个字、邮箱又漏了个 @，点提交却只弹出一句「请检查表单填写」——可他根本不知道，到底该改哪一项。
    </div>

    <h2>校验逻辑分散困境</h2>
    <p>
      后台里几乎每一处录入都离不开表单：新建课程要填课程名、讲师、价格，用户注册要填用户名、邮箱、角色、协议。字段一多，规则就杂——有的必填、有的限长度、有的要符合邮箱格式、有的必须勾选。用户填错的那一刻如果得不到即时、具体、落在字段旁边的提示，他只能靠猜，体验和数据质量会一起崩掉。
    </p>
    <p>
      如果你不用组件库，这件事的代价是什么？<strong>校验逻辑会散落到每一个输入框旁边</strong>：每加一条规则就复制一段 <code>if</code>，每加一个字段就再补一个显示错误的元素。规则、提示、值三者各自为政，改一处牵动全身；提交时还得再遍历一遍，才能知道整体到底通没通过。
    </p>

    <h2>失焦校验与手写判断</h2>
    <p>
      最朴素的做法：在每个输入框的失焦事件里手写判断，再配一个元素显示错误文案，例如 <code>if (username.length &lt; 3) showError('用户名至少 3 个字符')</code>。这个方案做对了一件关键的事——<strong>它把校验反馈放到了用户正在操作的那一刻</strong>，而不是等提交之后才一起算账。
    </p>

    <h2>界面与规则耦合</h2>
    <ul>
      <li>校验规则和界面代码混在一起，新增一个字段就要再复制一整套判断与提示。</li>
      <li>错误文案的显示、定位、清除全靠手动操作，稍不注意就残留上一次的红字。</li>
      <li>提交时拿不到一个统一的「全部是否通过、具体哪一项失败」的结果。</li>
      <li>「重置表单」要逐个字段回填初始值，还要顺手擦掉所有错误状态。</li>
    </ul>

    <h2>模型规则与字段分离</h2>
    <p>
      不推翻「即时反馈」，而是把「数据」「规则」「字段」三者拆开、各归其位。这正是 <code>el-form</code> 的做法：
    </p>
    <ol class="lesson-steps">
      <li>用 <code>reactive</code> 定义一个 <code>form</code> 数据对象，通过 <code>:model</code> 交给表单，让它成为唯一的数据来源。</li>
      <li>把每条校验规则集中写进 <code>rules</code>；每个字段的 <code>el-form-item</code> 用 <code>prop</code> 关联到 <code>model</code> 上的同名字段，控件再用 <code>v-model</code> 绑定。</li>
      <li>规则用内置的 <code>required</code>、<code>min</code>、<code>max</code>、<code>type: 'email'</code> 表达常见约束，特殊逻辑用 <code>validator</code> 自定义函数兜底。</li>
      <li>通过 <code>ref</code> 拿到表单实例，之后统一由它执行校验、重置与定位。</li>
    </ol>
    <p>
      <code>trigger</code> 决定「什么时候校验」，要和控件行为对上：输入类控件用 <code>blur</code>，用户填完离开时提醒；选择类控件用 <code>change</code>，选中那一瞬就反馈。时机不对，用户还没填完就被标红，反而添乱。
    </p>
    <p>
      拿到实例后，三个方法覆盖了绝大部分场景：<code>validate</code> 做整体校验并返回是否通过，<code>validateField</code> 只校验指定字段，<code>resetFields</code> 一次性清空值并把校验状态恢复为初始。<strong>提交时的正确姿势是先 <code>await validate()</code>，通过后再执行业务提交</strong>；若后端返回字段级错误，再把它映射回对应的 <code>prop</code> 并聚焦到那一项，用户就能立刻看到问题出在哪。
    </p>
    <div class="lesson-box warn">
      <strong>两个必须记住的点：</strong>自定义 <code>validator</code> 里 <code>callback()</code> 表示通过、<code>callback(new Error('…'))</code> 表示失败，<strong>失败分支千万不能漏</strong>，否则校验会「静默通过」；另外，前端校验只负责即时反馈，<strong>真实提交仍然必须依赖服务端校验</strong>，绝不能把它当作安全边界。
    </div>

    <h2>错误信息字段定位</h2>
    <figure class="lesson-figure">
      <figcaption>试试不填、填一半、填错格式再提交，看看错误是怎么落在具体字段旁边的。</figcaption>
      <E02Form />
    </figure>

    <h2>声明式规则与校验</h2>
    <p>
      表单校验的本质，是把散落的手写判断收拢成一份「声明式的规则表」：数据在 <code>:model</code> 里，规则在 <code>rules</code> 里，字段靠 <code>prop</code> 关联，时机由 <code>trigger</code> 决定。于是错误提示不再是随手拼出来的，而是组件根据规则自动算出来的——加字段只是多写一条规则，而不是多复制一段逻辑。
    </p>
    <div class="lesson-term">
      <span class="term-name">「表单模型校验」</span>指用 <code>:model</code> 提供数据源、<code>rules</code> 声明规则、<code>prop</code> 关联字段，再由 <code>el-form</code> 统一执行校验的机制。实例提供 <code>validate</code>（整体）、<code>validateField</code>（局部）、<code>resetFields</code>（重置值与校验态）三个方法；<code>trigger</code> 中输入类用 <code>blur</code>、选择类用 <code>change</code>；前端校验仅供即时反馈，真实提交仍需服务端把关。
    </div>
  </LessonArticle>
</template>
