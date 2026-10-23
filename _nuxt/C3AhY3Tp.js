const n=`<script setup lang="ts">
import PY16Environments from './PY16Environments.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你本地 <code>pip install requests</code> 明明装好了，脚本跑得好好的；同事把代码 clone 下来一运行，却报 <code>ModuleNotFoundError: No module named 'requests'</code>。同一个仓库、同一个命令，为什么他那边就是缺包？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      新手最常见的操作，就是打开终端直接敲 <code>pip install requests</code>。命令立刻成功，<code>import requests</code> 也马上能用，看起来没有任何问题。<strong>问题是：这个包装进了哪里</strong>——它进了你机器上那一个全局的系统 Python，而不是「这个项目」。
    </p>
    <p>
      于是麻烦会陆续出现：项目 A 要 <code>flask==2.0</code>，项目 B 要 <code>flask==3.0</code>，而全局环境只有一个，装 B 就顶掉 A；升级系统工具时 pip 可能误改系统自带包，把系统 Python 弄坏；换一台机器，别人根本不知道你到底装了哪些包、什么版本——上面那个开场问题就发生了。
    </p>

    <h2>给项目一间独立的房间：虚拟环境</h2>
    <p>
      <strong>虚拟环境</strong>（virtual environment）的思路很直白：为每个项目单独建一份「只属于它」的 Python 环境，里面有一套独立的 <code>site-packages</code>。项目 A 的 <code>flask 2.0</code> 和项目 B 的 <code>flask 3.0</code> 各住各的房间，互不干扰；删掉这个目录，就等于把这个项目的所有依赖一并抹掉，系统 Python 毫发无损。
    </p>
    <ul>
      <li>系统 Python 保持干净，只负责运行解释器本身。</li>
      <li>项目依赖彼此隔离，版本冲突不再传染。</li>
      <li>环境可以随时重建，配合清单就能在别人机器上一字不差地复现。</li>
    </ul>

    <h2>创建与激活：\`python -m venv\` 加一条激活命令</h2>
    <p>
      Python 自带 <code>venv</code> 模块，不用额外安装。<code>python -m venv .venv</code> 会在项目目录下生成一个 <code>.venv</code> 文件夹，把解释器与独立的包目录都装进去。创建只是第一步，之后必须<strong>激活</strong>，让当前终端里的 <code>python</code> 和 <code>pip</code> 都指向这份环境：
    </p>
    <ol class="lesson-steps">
      <li>创建：<code>python -m venv .venv</code>。</li>
      <li>激活（Windows）：<code>.venv\\Scripts\\activate</code>；激活（macOS/Linux）：<code>source .venv/bin/activate</code>。</li>
      <li>确认：命令行提示符前出现了 <code>(.venv)</code>，说明已经进入。</li>
      <li>退出：<code>deactivate</code>，随时回到系统环境。</li>
    </ol>
    <p>
      一个容易忽略的点：<strong>没激活时敲 <code>pip install</code>，装的是系统 Python</strong>。「我装了但没生效」多半就是漏了激活，或者终端重启后忘了重新激活。
    </p>

    <h2>把依赖写下来：pip install 与 requirements.txt</h2>
    <p>
      环境建好了，装包还是 <code>pip install requests</code>，只不过现在装进的是当前虚拟环境。<code>pip</code> 会自动把依赖树里的包一并装上（例如 requests 会带上 urllib3、certifi）。但「装过」不等于「可复现」——别人怎么知道你装了哪些、哪个版本？答案是把它<strong>冻结</strong>成清单：
    </p>
    <pre class="code-block"><code>pip freeze &gt; requirements.txt   # 导出当前所有包及其精确版本
pip install -r requirements.txt # 在别的环境按清单一次性还原</code></pre>
    <p>
      <code>requirements.txt</code> 记的是<strong>精确版本</strong>（如 <code>requests==2.31.0</code>），好处是任何人都能装到同一套版本，坏处是它把间接依赖也钉死了，升级时清单会显得臃肿。它适合「已经定型的部署环境」。
    </p>

    <h2>声明依赖的现代表达：pyproject.toml</h2>
    <p>
      现代 Python 项目更推荐在 <code>pyproject.toml</code> 里<strong>声明</strong>依赖，而不是记录一堆精确版本。你写的是<strong>版本范围</strong>与<strong>意图</strong>，例如 <code>requests&gt;=2.31</code>、<code>flask~=3.0</code>，由 pip 或构建工具去解析出满足条件的版本；还能用 <code>[project.optional-dependencies]</code> 区分运行依赖与开发依赖。
    </p>
    <p>
      这两者并不冲突：<code>pyproject.toml</code> 表达「我允许哪些版本」，再用一份<strong>锁文件</strong>把这一次解析出来的精确版本固定下来，兼顾灵活与可复现。理解「声明范围」和「锁定结果」的区别，是依赖管理真正成熟的分界线。
    </p>

    <h2>工具生态与一条底线</h2>
    <p>
      围绕环境与依赖，社区还发展出一批工具，各管一段：<strong>pyenv</strong> 管理「用哪个 Python 版本」（3.10 还是 3.12）；<strong>venv</strong> 管理「项目内的隔离环境」；<strong>pip</strong> 负责安装；<strong>uv</strong>、<strong>poetry</strong>、<strong>pdm</strong> 则把环境、依赖解析与锁定打包成一站式体验，速度与体验各不相同。
    </p>
    <div class="lesson-box warn">
      <strong>一条底线：</strong>不要往系统 Python（尤其是 Linux 的系统解释器）里直接装业务依赖。所有业务包都应装进项目自己的虚拟环境。这样升级系统、迁移机器时，最坏也只是重建环境，而不会把机器本身搞坏。
    </div>

    <h2>看一遍环境流程与清单对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换平台后，用「上一步 / 下一步」逐步走过创建、激活、安装、冻结、退出五个环节；下方并排对照 <code>requirements.txt</code> 的精确版本与 <code>pyproject.toml</code> 的版本范围。</figcaption>
      <PY16Environments />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      虚拟环境为每个项目提供一套隔离的依赖目录，用 <code>python -m venv</code> 创建、激活后 <code>pip</code> 才会作用于它；<code>requirements.txt</code> 冻结精确版本用于复现，<code>pyproject.toml</code> 声明版本范围用于表达意图，两者配合才能真正「换台机器也装得一模一样」。始终把业务依赖装进项目环境，是一条不能破的底线。
    </p>
    <div class="lesson-term">
      <span class="term-name">「虚拟环境」</span>指一份独立于系统 Python 的、带有专属 <code>site-packages</code> 的解释器环境。边界与例外：环境必须<strong>激活</strong>后 pip 与 python 才指向它；未激活时安装会落到系统环境；重建环境是安全的，因为它只是一个可删除的目录；不同项目之间的环境不会互相影响。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
