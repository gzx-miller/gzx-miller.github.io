const e=`<script setup lang="ts">
import T22RecursiveTypes from './T22RecursiveTypes.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>配置对象一层套一层，我想在只读的那一侧定义一个「所有层级都只读」的版本，可 <code>Readonly&lt;Config&gt;</code> 只锁住了最外面那层——难道每加深一层，就得手工把每一层都写一遍吗？
    </div>

    <h2>读写语义分离</h2>
    <p>
      你在做一个后台配置系统：一份配置对象里嵌着应用信息、主题设置、功能开关，再往里还嵌着一层。同一份结构你要在两种场景用它——<strong>编辑侧允许改，下游消费侧必须只读</strong>；此外「深度可选」用来表达局部补丁，「深度必填」用来表达带默认值的完整数据。
    </p>
    <p>
      问题就出在「深度」两个字上。内置的 <code>Readonly</code>、<code>Partial</code>、<code>Required</code> 都<strong>只作用于一层</strong>：套上 <code>Readonly</code> 之后，顶层属性不可写了，可第二、第三层依旧可写，改起来照样不报错。而像文件目录树、任意深度的 JSON 这种结构，层级根本没法预先枚举——你连手写都写不完，更别说维护。
    </p>

    <h2>内置工具单层局限</h2>
    <p>
      最直接的做法：用内置工具做一层转换，剩下的层级手工展开。需要只读就写 <code>Readonly&lt;Config&gt;</code>，发现第二层还能改，就再给第二层套一个 <code>Readonly</code>，逐层补齐；深度可选、深度必填同理，各手抄一份。
    </p>
    <p>
      这个方案做对了一件重要的事：<strong>它承认了「同一份结构需要多套读写语义」</strong>。对结构很浅的对象来说，套一层 <code>Readonly</code> 确实就把它挡住了，简单直接，也够用。
    </p>

    <h2>深层只读失效</h2>
    <ul>
      <li><code>Readonly</code> 只作用一层，<code>config.app.settings.debug</code> 依然可写，改了也不报错。</li>
      <li>树形结构与 JSON 的层数无法预先枚举，手写版本根本写不完。</li>
      <li>深度可选、深度必填都要另抄一份，结构一变，两份手写类型同时过期。</li>
      <li>对象新增一层嵌套时，所有手写版本都得补，遗漏的层级编译器不会提醒你。</li>
    </ul>

    <h2>递归引用自身</h2>
    <p>
      不推翻「多套读写语义」，而是让类型<strong>引用自己</strong>。递归思想的第一次出场其实很朴素——描述一棵树时，子节点的类型就是节点自身：
    </p>
    <p>
      <code>interface TreeNode { value: string; children: TreeNode[] }</code>
    </p>
    <p>
      把「引用自己」搬进映射类型与条件类型，就能一次性转完所有层级：
    </p>
    <p>
      <code>type DeepReadonly&lt;T&gt; = { readonly [K in keyof T]: T[K] extends object ? T[K] extends Function ? T[K] : DeepReadonly&lt;T[K]&gt; : T[K] }</code>
    </p>
    <ol class="lesson-steps">
      <li>用 <code>[K in keyof T]</code> 遍历对象的每一个键，逐个生成结果。</li>
      <li>用条件类型判断 <code>T[K]</code> 是不是对象；不是的话（字符串、数字等基础类型）原样返回，作为递归的终止分支。</li>
      <li>是对象就递归调用自身 <code>DeepReadonly&lt;T[K]&gt;</code>，进去把那一层也改成只读。</li>
      <li>给外层属性加上 <code>readonly</code> 修饰符，于是每一层都被锁住。</li>
    </ol>
    <p>
      换一个修饰符就换一种语义：把属性标成可选（<code>[K in keyof T]?</code>）得到 <code>DeepPartial</code>，用来表达任意层级的局部补丁；把可选去掉（<code>[K in keyof T]-?</code>）得到 <code>DeepRequired</code>，用来表达补齐默认值后的完整数据。三个工具共用同一套递归骨架，只是收尾的修饰符不同。
    </p>
    <p>
      有一个细节必须单独处理：<strong>函数成员要原样返回</strong>。函数在类型上同样满足 <code>extends object</code>，如果只用「是对象就递归」这一条判断，函数签名会被一起递归进去、破坏掉。所以要额外放行 <code>T[K] extends Function ? T[K] : ...</code>，让方法保持原样。
    </p>
    <p>
      除了深度转换，递归条件类型还能做别的：给一个多维数组类型一路剥到元素类型，<code>type FlatArray&lt;T&gt; = T extends (infer U)[] ? U extends any[] ? FlatArray&lt;U&gt; : U : T</code>，<code>number[][][]</code> 会被压成 <code>number</code>。判断条件本身，就是它的退出路径。
    </p>
    <div class="lesson-box warn">
      <strong>递归必须能终止。</strong>递归类型一定要有可退出的分支，否则会无限递归、把类型实例化压得越来越深；编译器对类型实例化深度是有限制的，嵌套极深或递归过重时会直接报错。对性能敏感的递归类型，控制在必要深度即可，超过三层嵌套的复杂转换，宁可交给现成的工具库。
    </div>

    <h2>文件树与映射类型</h2>
    <figure class="lesson-figure">
      <figcaption>展开文件树感受结构自身的递归，再切到「深度映射类型」看 <code>DeepReadonly</code>、<code>DeepPartial</code>、<code>DeepRequired</code> 如何一层层生效。</figcaption>
      <T22RecursiveTypes />
    </figure>

    <h2>结构描述与转换</h2>
    <p>
      递归类型的价值，是让「结构描述」和「结构转换」都跟着层级自己走：在定义里引用自身，就能描述树与 JSON 这类无固定深度的结构；在映射类型里递归自己，就能把只读、可选、必填这类转换一口气铺满每一层。只要保证有可退出的分支，编译器就会按规则的终止路径收敛——而函数成员那类不该被递归的角色，要记得单独放行。
    </p>
    <div class="lesson-term">
      <span class="term-name">「递归类型」</span>是在自身定义中引用自己的类型，天然适合描述树、JSON 等嵌套结构。把递归搬进映射类型与条件类型，即可一键生成 <code>DeepReadonly</code>、<code>DeepPartial</code>、<code>DeepRequired</code> 这类深度转换。要点是<strong>必须有退出分支</strong>、函数与对象成员按需原样返回，并留意编译器对类型实例化深度的限制。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
