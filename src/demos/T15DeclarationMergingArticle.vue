<script setup lang="ts">
import T15DeclarationMerging from './T15DeclarationMerging.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>启动脚本明明往 <code>window</code> 上挂了 <code>__APP_VERSION__</code>，代码里读它却提示「属性不存在」；第三方库少声明了一个方法，你又不方便改它的源码——这个类型该怎么补？
    </div>

    <h2>第三方类型缺口</h2>
    <p>
      你接手一个既有项目，启动脚本在 <code>window</code> 上挂了一个 <code>__APP_VERSION__</code>，某个埋点库的实例上还多出一个官方类型里没写的 <code>trackOnce</code> 方法。运行时这两样都在，TypeScript 却一律报「属性不存在」。
    </p>
    <p>
      前一种还好办，在业务代码里断言一下就能过去；后一种更麻烦——你不可能去改第三方库的源码，下次升级还会被覆盖。真正想要的是：<strong>在自己这一侧、完全不触碰对方源码的前提下，把缺失的类型补上去</strong>。
    </p>

    <h2>就地断言的变通</h2>
    <p>
      最省事的做法是就地断言：<code>(window as any).__APP_VERSION__</code>。它马上能让编译通过，确实是「绕过类型检查」的一种手段。
    </p>
    <p>
      要承认它的位置：当你只想临时读一个值、又完全不想引入任何配置时，这确实是最短的路径，它至少让你先跑起来。问题出在把这个手段当成方案之后。
    </p>

    <h2>断言丢掉的安全</h2>
    <ul>
      <li>断言把类型安全直接丢掉了：拼错成 <code>__APP_VERISON__</code> 也不会报错，运行时才拿到 <code>undefined</code>。</li>
      <li>同一个属性每处都要断一次，写法啰嗦，还容易前后不一致。</li>
      <li>第三方库缺失的类型，断言只能骗过自己，团队里其他人依旧看不到任何提示。</li>
      <li>最关键的是：<strong>编译器本来可以知道这些属性存在，只是没人告诉它</strong>。</li>
    </ul>

    <h2>声明合并的机制</h2>
    <p>
      TypeScript 有一项特性专门用来回答这类问题：<strong>声明合并</strong>——多份分散的声明可以按规则拼成同一个实体，不必挤在一处写。
    </p>
    <p>
      第一层是<strong>接口合并</strong>。同名的 <code>interface</code> 会被自动合并成一个类型，属性取并集：
    </p>
    <p>
      <code>interface AppConfig { apiBase: string; timeout: number }</code> 与
      <code>interface AppConfig { theme: 'light' | 'dark'; locale: string }</code>
      合并之后，<code>AppConfig</code> 同时拥有四个属性。
    </p>
    <p>
      这条规则的力量在于：<strong>你只需要追加一个字段，而不必重写原有的声明</strong>——这正是「增强」而非「覆盖」。
    </p>
    <p>
      第二层是 <strong>namespace 与 class、函数、枚举的合并</strong>。同名 <code>namespace</code> 可以给一个已存在的类追加静态成员，比如给 <code>Album</code> 类补上 <code>Album.create()</code> 与一组常量。但有一条硬约束要记住：<strong>两个 <code>class</code> 之间不能互相合并</strong>，想扩展一个类的类型形状，只能借助 <code>interface</code> 或 <code>namespace</code>。
    </p>
    <p>
      第三层，也是实战中最常用的，是<strong>模块增强</strong>。在 <code>.d.ts</code> 里用 <code>declare module</code> 为第三方包补充或改写类型，用 <code>declare global</code> 扩展 <code>Window</code>、<code>String</code> 这类全局对象：
    </p>
    <p>
      <code>declare global { interface Window { __APP_VERSION__: string } }</code>
    </p>
    <p>
      这样 <code>window.__APP_VERSION__</code> 就有了类型提示，配合空值检查也能把可能为 <code>undefined</code> 的情况提出来。
    </p>
    <p>
      这里有三个必须记住的坑。其一，<strong>模块增强必须写在模块作用域里</strong>，也就是该文件里得有 <code>import</code> 或 <code>export</code>，否则 <code>declare module</code> 会被当成一个新的环境声明而不是增强。其二，<strong><code>declare global</code> 只在带 <code>import</code> / <code>export</code> 的模块文件中生效</strong>，放在一个没有任何导入导出的脚本文件里是无效的。其三，增强要<strong>按包逐个声明</strong>，并且尽量集中到 <code>types/</code> 目录统一管理——散落在各个业务文件里的 <code>declare</code> 很难追踪，出现冲突时也不好排查。
    </p>
    <p>
      把这三种合并按使用频率排一排会更清楚：接口合并多用于把同一个契约拆到多个文件里维护，或给第三方导出的接口追加字段；<code>namespace</code> 合并主要用于给类补静态工厂与常量；而真正解决「第三方库缺类型」的，还是模块增强——它不改源码，只在类型层面把缺口补平，依赖升级时也不会被冲掉。
    </p>
    <div class="lesson-box warn">
      <strong>声明合并是「增强」，不是「覆盖」：</strong>同名接口会把成员并起来，无法删掉或否决对方已有的属性。如果两边对同一字段给出了互相冲突的类型，编译器会把它揪出来——这反而是发现建模问题的重要信号。
    </div>

    <h2>两份声明的合并</h2>
    <figure class="lesson-figure">
      <figcaption>点按钮查看合并后的配置与全局扩展，注意那四个属性其实来自两份同名的声明。</figcaption>
      <T15DeclarationMerging />
    </figure>

    <h2>增强不覆盖原则</h2>
    <p>
      声明合并让「扩展别人」不必修改别人的源码：同名接口把属性并起来，<code>namespace</code> 给类追加静态成员，<code>declare module</code> 与 <code>declare global</code> 则为第三方包和全局对象补齐类型。规矩只有三条——类与类不能直接合并，模块增强必须待在模块作用域里，全局增强只在带导入导出的文件中生效。
    </p>
    <div class="lesson-term">
      <span class="term-name">「声明合并与模块增强」</span>指多份分散的声明按规则拼成同一实体：同名 <code>interface</code> 属性自动合并，<code>namespace</code> 可与 <code>class</code>、函数、枚举合并以追加静态成员（<strong>类与类之间不能直接合并</strong>），<code>declare module</code> 在模块作用域内为第三方包补充类型，<code>declare global</code> 扩展全局对象且仅在带 <code>import</code> / <code>export</code> 的文件中生效。它用于在不改源码的前提下补类型，增强应集中到 <code>types/</code> 目录统一维护。
    </div>
  </LessonArticle>
</template>
