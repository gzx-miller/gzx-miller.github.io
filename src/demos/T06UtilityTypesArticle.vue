<script setup lang="ts">
import T06UtilityTypes from './T06UtilityTypes.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>编辑课程时我只想改一个标题，函数参数却要求把 <code>id</code>、<code>teacher</code>、<code>published</code> 全部传齐——「局部更新」为什么非得和「完整模型」长得一模一样？
    </div>

    <h2>模型多重角色</h2>
    <p>
      课程模型 <code>Course</code> 有 <code>id</code>、<code>title</code>、<code>teacher</code>、<code>published</code> 四个字段。可它在代码里其实要扮演三个角色：新建时要一份完整数据，编辑时要一份「只改几个字段」的补丁，接口返回时又可能是其中一部分。于是同一份形状被抄了三遍。
    </p>
    <p>
      抄写的代价不会立刻显现，而是在字段漂移时才爆发：某天给 <code>Course</code> 加了一个 <code>coverImage</code>，创建、编辑、响应三套副本里总有人忘了补。更隐蔽的是编辑补丁——如果它不小心把主键 <code>id</code> 也写成必填，调用方就得为了改一个标题把 <code>id</code> 再传一遍。<strong>问题不在于「要不要重复」，而在于重复的几份之间没有共同的来源。</strong>
    </p>

    <h2>手写更新副本</h2>
    <p>
      最省事的做法：照着 <code>Course</code> 再手写一份 <code>CourseUpdate</code>，把要允许修改的字段后面都加上问号，变成可选。
    </p>
    <p>
      这个方案做对了一件事：<strong>它承认了「更新」和「创建」是两种不同的契约</strong>。创建要求完整，更新只要求给到要改的部分，二者确实不该共用同一个类型。只要这份手写副本永远不出错，它就完全够用。
    </p>

    <h2>副本与来源分叉</h2>
    <ul>
      <li>手写副本与原始模型是两条独立的知识，加字段、改字段类型时两边很难同时更新。</li>
      <li>「除主键之外」这种规则只能靠人记住，漏掉 <code>id</code> 的排除不会有任何编译报错。</li>
      <li>接口只返回部分字段的场景又要再抄一份，派生关系越来越看不出来。</li>
      <li>想让某些字段只读、某些字段必填时，只能再叠更多手写副本。</li>
      <li>从 <code>CourseUpdate</code> 看不出它来自 <code>Course</code>，读代码的人得回头比对。</li>
    </ul>

    <h2>工具类型派生</h2>
    <p>
      不推翻「更新是独立契约」，而是把这份契约<strong>派生出来</strong>，而不是抄出来。先定义唯一的来源 <code>Course</code>，再用工具类型从它生成其余几种：
    </p>
    <ul>
      <li><code>Omit&lt;Course, 'id'&gt;</code> 排除不可变的主键，得到「除 id 外的所有字段」。</li>
      <li><code>Partial&lt;...&gt;</code> 把剩下的字段全部变成可选。</li>
      <li>两者嵌套起来，更新补丁就是 <code>Partial&lt;Omit&lt;Course, 'id'&gt;&gt;</code>。</li>
    </ul>
    <p>
      组合之后，<code>updateCourse</code> 的补丁参数只需传入真正要修改的字段，合并时用 <code>Object.assign</code> 覆盖即可。更关键的是：模型改了，派生类型会<strong>自动跟着改</strong>。新增字段会立刻出现在补丁里，编译器还能同样指出所有受影响的位置。
    </p>
    <p>
      再往下走，同一套机制能表达的语义比想象中多。用 <code>Readonly</code> 得到只读视图，用 <code>Pick</code> 挑出列表页要展示的几个字段，用 <code>Required</code> 把「从后端拿回来时一定已填好」的字段标成必填——它们都不需要重复定义，只是同一来源在不同读写语义下的投影。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的点：</strong><code>Partial</code> 和 <code>Omit</code> 都只作用于<strong>一层</strong>，嵌套对象的整体可选必须自己写映射类型；另外工具类型嵌套太深时，记得用 <code>type</code> 别名给组合结果起个用途名（如 <code>CoursePatch</code>），使用处的意图才清楚。
    </div>
    <p>
      回头看开场那个别扭的更新函数就通了：补丁不必和模型同形，它应该是从模型派生出的一层「局部视图」，只要求给到要改的那几个字段。
    </p>

    <h2>字段级局部更新</h2>
    <figure class="lesson-figure">
      <figcaption>点两个按钮，体会只传一个字段也能构成一次合法更新。</figcaption>
      <T06UtilityTypes />
    </figure>

    <h2>领域模型唯一来源</h2>
    <p>
      工具类型的价值不在「少写几行」，而在把多份类型收敛回同一个来源。定义一次领域模型，其余契约都由它派生：改一处，全网跟着变，编译器负责把受影响的位置指出来——这正是类型系统替你守住的那部分一致性。
    </p>
    <div class="lesson-term">
      <span class="term-name">「工具类型」</span>是 TypeScript 基于映射类型与条件类型提供的内置派生工具，从既有模型生成新的契约。例如用 <code>Partial&lt;Omit&lt;Course, 'id'&gt;&gt;</code> 表达「除主键外字段皆可选」的更新补丁，另有 <code>Pick</code>、<code>Readonly</code>、<code>Required</code> 等。它们只作用一层，深层结构需自定义映射类型。
    </div>
  </LessonArticle>
</template>
