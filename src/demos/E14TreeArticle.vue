<script setup lang="ts">
import E14Tree from './E14Tree.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>给运营专员配菜单权限，我让他自己勾一遍；勾完保存，权限落库挺顺利。可下次打开这个角色，勾选状态是空的——明明存了，为什么回显不出来？
    </div>

    <h2>权限数据的树形本质</h2>
    <p>
      后台里几乎每个系统都要配权限：菜单权限、操作权限、组织架构、商品类目。这类数据天生是树：一个「课程管理」下面挂着「查看课程 / 编辑课程 / 发布课程」，父节点是分组、叶子才是真正要落库的那条权限。<strong>用户的操作是在一棵树上勾选，而系统要的是一组精确的权限编号</strong>，这两者之间的翻译就是全部难点。
    </p>
    <p>
      如果不用组件库，你得自己递归渲染这棵树，自己维护每个节点的勾选状态，还要处理「勾了父节点，子节点该不该一起勾」「子节点全勾了，父节点要不要自动亮」「搜索时匹配到的节点，它的父级路径要不要一起展开」——最后一项尤其磨人。没有组件库时大家通常干脆放弃搜索，用户只能自己一层层翻，权限一多就翻到手酸。
    </p>
    <p>
      代价具体到代码：一套递归渲染、一份父子联动规则、一套关键词过滤加路径回填、一套「key 数组 ↔ 树结构」的来回转换。这四样任何一样写歪，都会导致上面那个开场问题——存了却回显不出。
    </p>

    <h2>平铺复选组的做法</h2>
    <p>
      最朴素的做法：既然权限最后落库就是一串 id，那不如干脆平铺成一组复选框，每行写「课程管理 - 查看课程」这样的完整路径名，让用户直接勾。
    </p>
    <p>
      它做对了一件事：<strong>把「勾选」和「落库的编号」一一对齐</strong>，每勾一格就是一个合法 id，不存在父子联动的推导，保存和回显都直来直去。权限项不多时，这个方案相当稳。
    </p>

    <h2>归属与搜索的缺失</h2>
    <ul>
      <li>平铺无法体现归属，用户看不出「编辑课程」属于「课程管理」，也无从按模块批量选择。</li>
      <li>权限项一多就是几十上百条长列表，扫读成本极高。</li>
      <li>没有按模块整组勾选的能力，配一个角色的全部课程权限要一条条点。</li>
      <li>关键词搜索无从谈起，找一条权限只能靠肉眼滑。</li>
      <li>菜单本身是层级结构，平铺展示与真实数据模型对不上，维护时容易漏。</li>
    </ul>

    <h2>节点身份的引入</h2>
    <p>
      不推翻「勾编号」，而是把结构还原成树，交给 <code>el-tree</code>。它用 <code>data</code> 接收带 <code>children</code> 的树形数据，并用 <code>node-key</code> 指定节点的唯一标识——在你这里就是权限 id。<strong><code>node-key</code> 是整棵树的身份依据</strong>，所有勾选、回显、过滤都靠它，选错字段后面全乱。
    </p>
    <ol class="lesson-steps">
      <li>把菜单与操作权限整理成带 <code>children</code> 的树形结构，叶子节点对应真正的权限编号。</li>
      <li>配置 <code>node-key</code> 与 <code>show-checkbox</code>，用 <code>default-checked-keys</code> 恢复角色已有权限。</li>
      <li>输入关键词时调用实例的 <code>filter</code> 方法并配合 <code>filter-node-method</code> 过滤，只保留匹配节点及其关联路径。</li>
      <li>保存时用 <code>getCheckedKeys</code> 取出勾选的权限编号提交后端。</li>
    </ol>
    <p>
      接着处理回显。树上的勾选分两层含义：<strong>父节点的勾选状态往往是「子节点全选」推导出来的，不是用户真的勾了它</strong>。所以取出编号时要区分口径：<code>getCheckedKeys()</code> 返回所有处于勾选态的 key，而 <code>getCheckedKeys(true)</code> <strong>只返回叶子节点</strong>。你的后端约定的是哪种，就必须用哪种——权限树通常只落叶子操作，那就用 <code>true</code>；如果约定父子都要存，就要同时取 <code>getHalfCheckedKeys()</code> 这类半选节点。这一步必须前后端一起定，否则会存进一堆本不该落的父分组。
    </p>
    <table>
      <thead>
        <tr>
          <th>API</th>
          <th>作用</th>
          <th>要点</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>node-key</code></td>
          <td>节点唯一标识</td>
          <td>勾选、回显、过滤都依赖它</td>
        </tr>
        <tr>
          <td><code>show-checkbox</code></td>
          <td>开启复选框多选</td>
          <td>与 node-key 搭配使用</td>
        </tr>
        <tr>
          <td><code>default-checked-keys</code></td>
          <td>初始勾选节点</td>
          <td>用于恢复已有角色权限</td>
        </tr>
        <tr>
          <td><code>getCheckedKeys(true)</code></td>
          <td>取勾选 key</td>
          <td>传 true 只返回叶子节点</td>
        </tr>
        <tr>
          <td><code>setCheckedKeys</code></td>
          <td>写入勾选状态</td>
          <td>一次性写入，需在树数据就绪后调用</td>
        </tr>
      </tbody>
    </table>
    <p>
      再补上过滤。树不像列表那样能直接按条件筛掉不匹配项，因为<strong>一个节点即使自己不匹配，也可能因为子孙匹配而需要被保留（连同父级路径一起显示）</strong>。所以过滤逻辑要写在 <code>filter-node-method</code> 里，由组件决定哪些节点该留；你只负责在关键词变化时调用 <code>treeRef.filter(keyword)</code>。
    </p>
    <div class="lesson-box warn">
      <strong>四个容易踩的坑：</strong>其一，<code>getCheckedKeys(true)</code> 是否只返回叶子，要和后端落库格式<strong>约定一致</strong>，权限树通常还要区分父分组与叶子操作。其二，调用实例方法前要确认组件已挂载，树是异步来的数据就先 <code>await nextTick()</code>，否则 <code>setCheckedKeys</code> 打在不存在的树上，静默失效。其三，<strong><code>setCheckedKeys</code> 是一次性写入</strong>——树数据刷新后必须重新调用，它不会自动跟随更新，这也是「回显过一次又空了」的常见原因。其四，数据量大时用 <code>lazy</code> 与 <code>load</code> 按需加载子节点。
    </div>
    <p>
      最后验收：把已有权限回填进 <code>default-checked-keys</code>，看父节点是否正确呈现半选或全选；手动勾一个父分组，确认子节点全被勾上；输入关键词，看匹配项的父级路径是否保留；点保存，核对提交的编号与后端约定完全一致。
    </p>

    <h2>搜索过滤与回填</h2>
    <figure class="lesson-figure">
      <figcaption>在搜索框输入「课程」试试过滤，再点「应用运营专员预设」看树如何按 key 回填勾选。</figcaption>
      <E14Tree />
    </figure>

    <h2>父子勾选联动规则</h2>
    <p>
      树形控件把「在层级数据上勾选」做成了开箱即用的能力：<code>node-key</code> 给每个节点一个身份，<code>show-checkbox</code> 让勾选成为可能，<code>getCheckedKeys</code> 与 <code>setCheckedKeys</code> 负责在编号数组和树结构之间来回翻译。真正考验人的是口径——父子节点算不算数、半选状态存不存、树刷新后要不要重新写入，这些都取决于你和后端约定的那套落库格式。
    </p>
    <div class="lesson-term">
      <span class="term-name">「树形控件」</span>用 <code>el-tree</code> 渲染带 <code>children</code> 的层级数据，<code>node-key</code> 提供节点唯一标识。开启 <code>show-checkbox</code> 多选，<code>default-checked-keys</code> 指定初始勾选；实例方法 <code>getCheckedKeys(true)</code> 取勾选 key（只返回叶子）、<code>setCheckedKeys</code> 回填写入（一次性，数据刷新后需重调）；<code>filter-node-method</code> 配合 <code>filter</code> 过滤并保留匹配节点的关联路径，大数据量用 <code>lazy</code> 与 <code>load</code>。
    </div>
  </LessonArticle>
</template>
