<script setup lang="ts">
import E11Cascader from './E11Cascader.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我要给课程选择分类，可选值是「前端开发 / Vue / 组合式 API」这样三层套下来的；用平铺的下拉框选，用户得先挑一级、再挑二级、再挑三级，选完之后表单里只留一个看不出层级的值——层级数据到底该怎么让用户一次选明白？
    </div>

    <h2>层级数据与路径选择</h2>
    <p>
      后台里大量数据天生就是层级结构：省市区、商品类目、部门组织、课程分类、菜单权限。运营同学要选的是「这个内容归到哪个叶子节点」，可他心里想的是「前端开发下的 Vue 里的组合式 API」——<strong>他是在路径上做选择，而不是在单个值上做选择</strong>。
    </p>
    <p>
      如果不用组件库，你就得把这些层级压平：要么在页面里并排放三个下拉框，选完一级再加载下一级；要么干脆把三级路径拼成一个字符串塞进一个下拉。压平之后，用户看不到自己走的路径，选错了要一级一级退回去；开发这边还得手写「第一级变了要清空第二、三级」这类联动，每一级都是状态按钮。层级越深，这套手写联动越容易出错，而它一点都不算业务逻辑。
    </p>
    <p>
      代价说得再具体一点：省市区三级联动加上「回显已有地址」，纯手写就要维护三份可选列表、三条级联清空规则、一套把 id 转回文字的回显逻辑。这段代码没人愿意读第二遍，却每次需求变更都要动一遍。
    </p>

    <h2>拍平映射表取舍</h2>
    <p>
      最朴素的做法：把分类数据拍平成一张 <code>value</code> 到 <code>label</code> 的映射表，用一个原生 <code>select</code> 让用户选末级，选项文字写完整路径，比如「前端开发 / Vue / 组合式 API」。
    </p>
    <p>
      它做对了一件关键的事：<strong>把「路径」当作选择的最小单位</strong>，而不是让用户在层级间来回跳。用户看到的是完整语义，选中即确定，一步到位，也不用写任何级联清空。
    </p>

    <h2>平铺结构丢失</h2>
    <ul>
      <li>选项一多，一长条「A / B / C」的平铺列表极难扫读，用户找不到自己在哪一层。</li>
      <li>数据由接口返回时层级是现成的树，压平要走一遍递归，还得处理同名末级冲突。</li>
      <li>选择结果只留一个末级值，界面上就无法展示「他选择的那条路径」，回显要额外反查。</li>
      <li>想搜索、想分屏按级浏览、想一键清空，每一样都要自己从零补。</li>
    </ul>

    <h2>树形选项组件接管</h2>
    <p>
      不推翻「在路径上选择」，而是把这个结构原样交给 <code>el-cascader</code>。它接收的 <code>options</code> 就是多级树形数据，每一级由 <code>value</code>、<code>label</code> 和 <code>children</code> 组成，天然对应你接口里那份层级 JSON，不用再压平。
    </p>
    <ol class="lesson-steps">
      <li>把分类组织成 <code>value</code> / <code>label</code> / <code>children</code> 的多级树，直接喂给 <code>options</code>。</li>
      <li>用 <code>v-model</code> 绑定<strong>路径数组</strong>，选中后界面自动显示完整路径，回显时把数组写回去即可。</li>
      <li>只要末级时把 <code>props.emitPath</code> 设为 <code>false</code>，<code>v-model</code> 就只保留最后一级的值。</li>
      <li>设置 <code>clearable</code> 让用户一键清空已选路径，配合 <code>placeholder</code> 提示选择方式。</li>
    </ol>
    <p>
      这里最需要想清楚的是 <code>v-model</code> 到底是什么。<strong>默认情况下它绑定的是各级 value 组成的路径数组</strong>，比如 <code>['frontend', 'vue', 'vue3-composition']</code>；这既是优点也是坑的来源——它比单个值信息更全，但也意味着你的类型声明得按数组来写。当业务只关心末级（比如只存一个分类 id）时，才用 <code>props.emitPath: false</code> 退回单值模式，<code>v-model</code> 类型要跟着改成单值。
    </p>
    <p>
      接着调体验。用户习惯鼠标悬停就展开下一级时，用 <code>props.expandTrigger</code> 设为 <code>hover</code>，省去一次次点击；数据量大找不到目标时，开启 <code>filterable</code> 按 <code>label</code> 搜索过滤，快速定位选项。
    </p>
    <table>
      <thead>
        <tr>
          <th>配置</th>
          <th>作用</th>
          <th>何时用</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>options</code></td>
          <td>多级树形数据源</td>
          <td>接口返回层级数据时直接对接</td>
        </tr>
        <tr>
          <td><code>props.expandTrigger</code></td>
          <td>点击或悬浮展开子级</td>
          <td>层级不深、希望操作更顺手</td>
        </tr>
        <tr>
          <td><code>props.emitPath</code></td>
          <td>绑定路径数组还是末级单值</td>
          <td>只需要末级 id 时设为 false</td>
        </tr>
        <tr>
          <td><code>clearable</code></td>
          <td>一键清空已选路径</td>
          <td>选项可以为空的筛选场景</td>
        </tr>
        <tr>
          <td><code>filterable</code></td>
          <td>按 label 搜索过滤</td>
          <td>选项多、需要快速定位</td>
        </tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <strong>几个必须避开的坑：</strong>其一，<strong>树形数据每一级的 value 都必须唯一</strong>，否则组件无法正确回显选中路径，界面上会出现「已选了但显示不出文字」或「选 A 亮 B」；其二，值唯一是前提，但不同层之间也建议保持全局唯一，避免回显时歧义。其三，数据量很大时不要一次性铺开，配合 <code>props.lazy</code> 与 <code>lazyLoad</code> 异步按需加载子级。其四，级联选项来自接口时要先加载再渲染——空 <code>options</code> 会让用户误判为「没有数据」，而不是「还在加载」。
    </div>
    <p>
      最后验收：把已有分类路径回填进 <code>v-model</code>，看界面是否正确显示而不是空白；打开面板快速滑过各级，确认展开顺畅；清空后确认绑定值变回空数组；搜索一个中间层级的名字，看它是否只保留匹配项及其关联路径。
    </p>

    <h2>路径数组逐级拼接</h2>
    <figure class="lesson-figure">
      <figcaption>点开分类选择器，沿「前端开发 → Vue → 组合式 API」逐级选下去，观察路径数组与完整路径显示。</figcaption>
      <E11Cascader />
    </figure>

    <h2>值与路径对应关系</h2>
    <p>
      级联选择把「层级数据的选择」还原成它本来的样子：数据是树，选择是路径。<code>options</code> 负责承载层级，<code>v-model</code> 用路径数组记录用户走过的那一条线，<code>emitPath</code> 决定你要整条路径还是只要终点。理解了这个「值是路径」的前提，回显、清空、搜索这些衍生需求就都顺理成章了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「级联选择」</span>用 <code>el-cascader</code> 在树形 <code>options</code> 上逐级选择，<code>v-model</code> 默认是各级 value 组成的路径数组。只需要末级值时设 <code>props.emitPath: false</code>；<code>props.expandTrigger</code> 选点击或悬浮展开，<code>clearable</code> 一键清空，<code>filterable</code> 按 label 过滤；大数据量用 <code>props.lazy</code> 与 <code>lazyLoad</code> 异步加载。每级 value 必须唯一，否则回显会错。
    </div>
  </LessonArticle>
</template>
