const n=`<script setup lang="ts">
import D12PackageManagement from './D12PackageManagement.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong><code>package.json</code> 里写的是 <code>"axios": "^1.6.0"</code>，团队五个人各跑一次 <code>pnpm install</code>，装出来的却是五个不同的小版本——同一份代码，昨天构建还能过，今天在 CI 上挂了。
    </div>

    <h2>声明式依赖解析</h2>
    <p>
      你在做一个应用，需要用到几十个第三方库。这些库自己又依赖别的库，层层叠下去，真正落到你机器上的可能是一棵几百个节点的依赖树。你不可能把这棵树手抄一遍，于是把「我要什么」写成声明，交给包管理器去解析。
    </p>
    <p>
      关键在于，<code>package.json</code> 里写的从来不是「某一个确定版本」，而是<strong>一个允许移动的范围</strong>。<code>^1.6.0</code> 的意思是「1.6.0 及以上、但还不跨到 2.0.0 的任何版本」。于是同一份声明，在不同时间执行会解析出不同的结果。这就引出一个必须回答的问题：<strong>怎么保证每个人、每台机器、每次构建，装出来的都是同一棵树？</strong>
    </p>

    <h2>精确锁定版本号</h2>
    <p>
      最省事的做法：把版本写死，<code>"axios": "1.6.0"</code>，不带任何 <code>^</code> 或 <code>~</code>。这样每次装的都是同一个版本，本地和 CI 自然一致。
    </p>
    <p>
      这个方案做对了一件事：<strong>它抓住了问题的核心——差异来自「范围」</strong>。只要能固定住解析结果，可重复安装就成立。问题是，只固定「直接依赖」还远远不够。
    </p>

    <h2>间接依赖漂移</h2>
    <ul>
      <li>你只钉住了自己写的直接依赖，它们的间接依赖（依赖的依赖）仍带着范围，照样会漂。</li>
      <li>把几十个直接依赖全部写死，版本一升级就要人工改一遍，既累又容易漏。</li>
      <li>写死意味着放弃补丁级的安全修复：明明 <code>1.6.1</code> 修了漏洞，你的死版本还停在 <code>1.6.0</code>。</li>
      <li>就算今天碰巧一致，也说不清具体是怎么解析出来的——没有一份「当时到底装了哪些版本」的记录可以拿来对账。</li>
    </ul>

    <h2>语义化版本与锁文件</h2>
    <p>
      不推翻「固定解析结果」，而是把它拆成两层：<strong>用范围表达意图，用锁文件记录结果</strong>。声明和结果各司其职，问题就解开了。
    </p>
    <p>
      第一层是 <strong>SemVer 范围</strong>。语义化版本把版本号拆成「主版本.次版本.补丁」，并约定各自的含义：主版本变动多半意味着不兼容，次版本是向后兼容的新功能，补丁是向后兼容的修复。范围符号就建立在这套约定之上：
    </p>
    <ul>
      <li><code>^4.1.0</code>（脱字符）允许<strong>次版本与补丁</strong>更新，也就是 <code>&gt;=4.1.0</code> 且 <code>&lt;5.0.0</code>——日常依赖用它，自动吃到兼容的修复。</li>
      <li><code>~4.1.0</code>（波浪号）只允许<strong>补丁</strong>更新，即 <code>&gt;=4.1.0</code> 且 <code>&lt;4.2.0</code>——对次版本都不敢信时用它。</li>
      <li><code>4.1.0</code>（不带符号）是<strong>精确锁定</strong>这一个版本，范围最窄。</li>
      <li><code>*</code> 或 <code>latest</code> 最危险：范围宽到没有边界，不同时间安装必然不同，问题几乎无法复现。</li>
    </ul>
    <p>
      第二层是<strong>锁文件</strong>。第一次安装时，包管理器会把整棵依赖树（包括所有间接依赖）解析出的精确版本、来源和完整性校验信息，全部写进一个锁文件（<code>pnpm-lock.yaml</code>、<code>package-lock.json</code> 或 <code>yarn.lock</code>）。此后安装都以锁文件为准，范围只在「更新锁文件」的那一刻才重新参与解析。那棵树于是不再是「按范围算出来的」，而是「照锁文件还原出来的」。
    </p>
    <p>
      两层合起来，还需要一条纪律把它们对齐：<strong>把锁文件提交进仓库</strong>，让每个人都拿到同一份结果记录；再<strong>在 CI 上用冻结模式安装</strong>——<code>pnpm install --frozen-lockfile</code>。冻结模式的含义是：只允许照锁文件安装，一旦发现 <code>package.json</code> 与锁文件对不上就<strong>直接失败</strong>，而不是悄悄帮你改。这样，「本地装的和 CI 装的不一样」不再是一个偶发问题，而会在安装那一刻被立刻打断。
    </p>
    <div class="lesson-box warn">
      <strong>三条容易踩的线：</strong>不要盲目自动升级<strong>主版本</strong>，那正是语义化版本里允许破坏兼容的那一档；安装脚本（<code>postinstall</code> 等）拥有执行任意代码的权限，来源必须审查；依赖升级要<strong>小步走</strong>——升级一批、验证一批，避免一次性大版本跳跃后无从定位。
    </div>
    <p>
      最后是依赖的日常维护。运行时真正用到的库进 <code>dependencies</code>，只在构建、测试阶段用的工具进 <code>devDependencies</code>，两者分开声明，生产环境才不会白装一堆工具。再定期做依赖审计（如 <code>pnpm audit</code>），发现已知漏洞就评估升级路径——把安全维护也纳入同一套「范围加锁文件」的秩序里。
    </p>

    <h2>版本范围升级档位</h2>
    <figure class="lesson-figure">
      <figcaption>切换 <code>^4.1.0</code> / <code>~4.1.0</code> / <code>4.1.0</code>，看每种范围分别允许升到哪一档，再对照 CI 用的 <code>--frozen-lockfile</code>。</figcaption>
      <D12PackageManagement />
    </figure>

    <h2>意图与结果分离</h2>
    <p>
      可重复安装的诀窍，是把「意图」和「结果」分成两件事：<code>package.json</code> 里的范围只负责表达你愿意接受哪些升级，锁文件负责记录实际解析出的每一个精确版本。提交锁文件、CI 用冻结模式安装，本地、CI 与生产才会落在同一棵依赖树上。
    </p>
    <div class="lesson-term">
      <span class="term-name">「SemVer 与锁文件」</span>语义化版本把版本拆为「主.次.补丁」，范围符 <code>^</code> 允许次版本与补丁更新（<code>&gt;=4.1.0 &lt;5.0.0</code>），<code>~</code> 只允许补丁更新（<code>&gt;=4.1.0 &lt;4.2.0</code>），不含符号则精确锁定。锁文件记录整棵依赖树的精确版本，应提交进仓库；CI 用 <code>--frozen-lockfile</code> 冻结安装，锁文件与 <code>package.json</code> 不一致时直接失败。注意 <code>*</code> 与 <code>latest</code> 范围过宽会导致无法复现，主版本升级可能破坏兼容。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
