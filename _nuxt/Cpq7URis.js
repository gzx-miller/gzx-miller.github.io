const e=`<script setup lang="ts">
import T05Keyof from './T05Keyof.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>设置面板要按配置项名字读值，写 <code>preferences['theme']</code> 没问题，可手滑写成 <code>preferences['themes']</code> 只会静默拿到 <code>undefined</code>——有没有办法让拼错的键名根本编译不过？
    </div>

    <h2>动态属性访问</h2>
    <p>
      设置面板里有主题、密度、语言三项配置，每一项既要能读值，也要能按名字被动态访问。你希望函数接收一个「键名」参数，再按键取值，这样就不必为每一项各写一个读取函数。
    </p>
    <p>
      麻烦出在键名的类型上：如果把它写成 <code>string</code>，那么 <code>readSetting('themes')</code> 这种拼错也能通过编译，错误直到运行时才以 <code>undefined</code> 的形式冒出来；而即使拼对了，返回值类型也说不清。所以真正要解决的是：<strong>动态访问对象属性时，如何避免键名拼写错误，并让返回值类型同步精确</strong>。
    </p>

    <h2>字符串键名入参</h2>
    <p>
      最省事的做法，是接受一个字符串键名，直接去对象上取值：
    </p>
    <p>
      <code>function readSetting(key: string) { return preferences[key] }</code>
    </p>
    <p>
      它做对了一件很实用的事：<strong>函数确实实现了「按名字动态取值」</strong>，调用方不必为每一项写一个专用函数，设置面板的每一行都能复用同一条读取路径。
    </p>

    <h2>键名类型过宽</h2>
    <ul>
      <li>键名类型是 <code>string</code>，任何拼写都能传入，错字要到运行时才暴露成 <code>undefined</code>。</li>
      <li><code>preferences[key]</code> 的返回类型只能退成宽泛的联合，甚至被认为是 <code>any</code>。</li>
      <li>按 <code>'theme'</code> 取值本应得到 <code>string</code>，这份精确信息被一并抹平了。</li>
      <li>没有单一来源描述「合法的键有哪些」，键名散落在各处，改名时无法被编译器追踪。</li>
    </ul>

    <h2>属性与键名契约</h2>
    <p>
      把这些不足归纳起来，本质是：<strong>对象属性和字符串之间缺少一层契约</strong>。对象类型明明写清了有哪些字段，可一旦改用字符串去访问，这层信息就断掉了——键名和返回值类型同时失守。键名一旦拼错，编译器不但拦不住，还会把返回值一并放行成宽泛类型，错误于是被藏得更深。
    </p>
    <p>
      解决思路是把「键」和「值」分成两件工具来处理。<strong><code>keyof</code> 从一个对象类型取出全部属性键</strong>，组成一个字面量联合类型；<strong>索引访问类型 <code>T[K]</code> 再按键取回对应的值类型</strong>。把两者一起用在函数签名上：
    </p>
    <p>
      <code>type PreferenceKey = keyof Preferences</code><br />
      <code>&nbsp;&nbsp;// 'theme' | 'density' | 'language'</code><br />
      <code>function readSetting&lt;K extends keyof Preferences&gt;(key: K): Preferences[K] {</code><br />
      <code>&nbsp;&nbsp;return preferences[key]</code><br />
      <code>}</code>
    </p>
    <p>
      这样一来，键名受 <code>K extends keyof Preferences</code> 约束，传入不存在的键会被编译器直接拦下；返回值 <code>Preferences[K]</code> 则随传入的键精确变化——传 <code>'theme'</code> 得到 <code>string</code>，若对象里有数字型的键，取到就是 <code>number</code>。动态属性访问从此既灵活，又不可能拼错键名。
    </p>
    <ol class="lesson-steps">
      <li>用 <code>keyof</code> 从对象模型提取合法键的联合，例如 <code>PreferenceKey</code>。</li>
      <li>让函数参数受该键联合约束，传入不存在的键名会被编译器拦截。</li>
      <li>通过索引访问 <code>T[K]</code> 取得与键匹配的值类型，保证返回类型随键同步精确。</li>
      <li>传入不存在的键名，验证编辑器在调用处直接标红。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>三个容易踩空的地方：</strong><code>Object.keys</code> 默认返回 <code>string[]</code>，必要时通过类型断言或工具函数把它收窄为具体键；<strong>不要用宽泛的 <code>string</code> 索引签名绕过键约束</strong>，那等于重新回到 <code>any</code> 模式；结合 <code>as const</code> 与 <code>satisfies</code>，则能保留更精确的字面量联合与对象结构，与 <code>keyof</code> 配合效果更好。
    </div>
    <p>
      实际使用时还有一处细节值得留意：把键名单独抽成一个具名联合，例如 <code>type PreferenceKey = keyof Preferences</code>，能让「合法键有哪些」这件事在代码里有个可引用的名字。按钮列表、校验函数与读取函数都能复用这一份定义，改模型时也只需改一处，不必再逐个文件地对照。
    </p>
    <p>
      把参数类型写成 <code>K extends keyof T</code>，是动态访问的通用防御姿势：<strong>先固化合法的键，再按键取值</strong>。键与值的类型都来自同一份模型，谁改了模型，所有受牵连的位置都会被编译器点出来。
    </p>

    <h2>返回值随键变化</h2>
    <figure class="lesson-figure">
      <figcaption>切换不同的配置键，观察读取函数的返回结果如何随键名变化。</figcaption>
      <T05Keyof />
    </figure>

    <h2>键联合与索引访问</h2>
    <p>
      <code>keyof</code> 与索引访问类型，把「对象有哪些合法键、每个键对应什么类型」交还给类型系统。<code>keyof</code> 给出键的联合，<code>T[K]</code> 给出值的类型，把两者写进函数签名，动态属性访问就能同时拿到灵活性与精确性，拼错的键名在编辑阶段就被拦下。
    </p>
    <div class="lesson-term">
      <span class="term-name">「keyof 与索引访问类型」</span><code>keyof T</code> 从一个对象类型取出全部属性键、组成字面量联合；<code>T[K]</code> 再按键取回对应的值类型。把两者用作函数参数类型（如 <code>K extends keyof T</code>），动态属性访问既灵活又不可能拼错键名，返回值类型还会随传入的键精确变化——传 <code>'name'</code> 得到 <code>string</code>，传数字型的键得到 <code>number</code>。切勿用宽泛的 <code>string</code> 索引签名绕过键约束。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
