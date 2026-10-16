<script setup lang="ts">
import PY15Modules from './PY15Modules.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把工具函数放进 <code>utils.py</code>，在 <code>main.py</code> 里写下 <code>import utils</code>，运行 <code>python main.py</code> 一切正常；可同一段代码换成 <code>python -m main</code> 就跑不通了。代码一个字没改，为什么换一种运行方式，导入就会失败？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      一开始谁都不需要「包」，把代码全写进一个文件最省事。<code>import math</code>、<code>import random</code> 引进来，直接调用即可，不需要任何目录结构：
    </p>
    <ul>
      <li><code>import math</code>：把整个 <code>math</code> 模块对象绑定到名字 <code>math</code>，用时写 <code>math.sqrt(16)</code>。</li>
      <li><code>from math import sqrt</code>：只把 <code>sqrt</code> 这一个函数绑进来，写起来短，但看不出它来自哪里。</li>
      <li><code>import math as m</code>：同一模块换个短名字，<code>m.sqrt(16)</code> 一样能用，这是 <code>import numpy as np</code> 那种惯例的来源。</li>
    </ul>
    <p>
      单文件脚本阶段，这些写法够用。可代码一旦长大，一个文件塞不下，你就得拆成多个文件、放进多个目录——于是问题来了：拆开之后，谁引用谁、从哪里能找到谁，都需要一套约定。
    </p>

    <h2>模块就是对象：导入只是绑定一个名字</h2>
    <p>
      拆文件之后要先接受一个事实：<strong>一个 <code>.py</code> 文件就是一个模块对象</strong>。文件里定义的函数、类、变量，都是这个对象的属性。<code>import utils</code> 做的事情，只是把 <code>utils</code> 这个名字绑定到那个模块对象上——和 <code>x = 42</code> 绑定一个整数没有本质差别。
    </p>
    <p>
      理解了这一点，前面那个开场问题就有了线索。Python 导入模块时，不是只看你能不能 <code>import</code>，它还要确定模块在<strong>包层级里叫什么名字</strong>。用 <code>python main.py</code> 直接运行，<code>main</code> 被当成顶层脚本，<code>utils</code> 就在旁边，找得到；用 <code>python -m main</code> 运行时，入口变成了包，模块的真实名字带上包前缀，若你写的仍是顶层导入，名字就对不上了。
    </p>

    <h2>`if __name__ == '__main__'` 到底在判断什么</h2>
    <p>
      每个模块都有一个内置属性 <code>__name__</code>。当文件<strong>被导入</strong>时，<code>__name__</code> 就是这个模块名（例如 <code>'utils'</code>）；当文件<strong>被直接运行</strong>时，<code>__name__</code> 会被设成字符串 <code>'__main__'</code>。于是常见写法：
    </p>
    <pre class="code-block"><code>if __name__ == '__main__':
    main()</code></pre>
    <p>
      它的作用是<strong>把「脚本入口」和「可被复用的模块」分开</strong>：被别的模块导入时，<code>main()</code> 不会自动执行，只提供函数；只有你自己直接运行这个文件时，它才作为入口跑起来。少了这个判断，导入时会顺手执行业务逻辑，甚至触发副作用。
    </p>

    <h2>包与 `__init__.py`：目录如何变成包</h2>
    <p>
      当一个功能需要多个文件协同时，就把它们放进一个目录。这个目录只要带上 <code>__init__.py</code>（内容可以是空的），就被视为一个<strong>包</strong>，可以按层级被导入。<code>__init__.py</code> 还承担两个角色：包被导入时会先执行它（可以做初始化），以及可以用 <code>__all__</code> 声明「允许 <code>from 包 import *</code> 导出哪些名字」。
    </p>
    <ul>
      <li><code>__all__ = ["slugify", "normalize"]</code>：只影响 <code>import *</code> 的通配范围，写清楚后别人就不会意外拿到内部实现。</li>
      <li>导入一行 <code>from myapp.utils import slugify</code>，会依次触发 <code>myapp/__init__.py</code>、<code>myapp/utils/__init__.py</code> 的执行。</li>
    </ul>

    <h2>绝对导入与相对导入：两种写法的分寸</h2>
    <p>
      <strong>绝对导入</strong>从包的顶层写起，路径完整，<code>from myapp.utils import slugify</code> 放之四海皆准；<strong>相对导入</strong>用点号省略前缀，<code>from .utils import slugify</code> 里的 <code>.</code> 表示当前包，<code>..</code> 表示上一层包。
    </p>
    <p>
      相对导入更短、重构目录时不易跟着改错，但它<strong>只能在包内部使用</strong>：如果把含相对导入的模块直接当脚本运行，Python 根本不知道「当前包」是谁，就会抛出 <code>ImportError: attempted relative import with no known parent package</code>——这正是开场问题里 <code>python main.py</code> 失败的另一半原因。
    </p>

    <h2>查找路径、副作用与循环导入</h2>
    <p>
      导入一个名字时，解释器按 <code>sys.path</code> 里的顺序去各目录搜索：当前脚本目录、<code>PYTHONPATH</code>、安装目录等，先命中哪个就用哪个。这带来第一个陷阱：<strong>自己起的文件名不要和标准库重名</strong>，一个手写的 <code>random.py</code> 会把自己的目录排在前面，反而「抢走」标准库的 <code>random</code>。
    </p>
    <p>
      第二个陷阱是<strong>导入副作用</strong>：导入一个模块会<strong>从上到下执行它的顶层代码</strong>。如果顶层直接连数据库、读文件、发起请求，那么每次导入都会真实发生这些动作。把这类动作收进函数、用 <code>if __name__ == '__main__'</code> 守住，是常规防御。
    </p>
    <div class="lesson-box warn">
      <strong>循环导入：</strong><code>a.py</code> 导入 <code>b.py</code>、<code>b.py</code> 又导入 <code>a.py</code>，常表现为拿不到某个名字（<code>ImportError: cannot import name ...</code>）。根因是相互依赖到了「谁先执行完都不行」的地步。拆出公共依赖、把顶层导入改为函数内延迟导入，或调整模块职责，是常见解法。
    </div>

    <h2>看一遍导入方式与包结构</h2>
    <figure class="lesson-figure">
      <figcaption>切换上方的四个按钮，对照 <code>import 模块</code>、<code>from 模块 import 名字</code>、<code>import 模块 as 别名</code>、相对导入四类写法所绑定的名字与输出；下方目录树展示了包如何靠 <code>__init__.py</code> 组织起来。</figcaption>
      <PY15Modules />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      模块是对象，导入是把名字绑定到模块对象上；拆成目录后要靠 <code>__init__.py</code> 立成包，用绝对导入走全局路径、用相对导入走包内相对路径；再用 <code>if __name__ == '__main__'</code> 区分「入口脚本」与「被导入的模块」，就能避开查找路径、导入副作用和循环导入这几类常见坑。
    </p>
    <div class="lesson-term">
      <span class="term-name">「导入系统」</span>指 Python 通过 <code>sys.path</code> 搜索、加载模块并缓存到 <code>sys.modules</code> 的机制。边界与例外：同一模块只在首次导入时执行一次，之后导入直接复用缓存；相对导入依赖模块已知的包上下文，脱离包直接运行会报错；<code>__all__</code> 仅约束 <code>import *</code>，不影响其他显式导入。
    </div>
  </LessonArticle>
</template>
