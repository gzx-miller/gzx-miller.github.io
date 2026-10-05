const e=`// 映射类型：遍历已有类型的键，生成新的类型结构

interface CourseModel {
  id: number
  title: string
  teacher: string
  duration: number
  published: boolean
}

// ── 基础映射：遍历所有键 ──
type ReadonlyCourse = { readonly [K in keyof CourseModel]: CourseModel[K] }
type NullableCourse = { [K in keyof CourseModel]: CourseModel[K] | null }

// ── 修饰符：+/- readonly、+/- ?（可选） ──
type AllOptional = { [K in keyof CourseModel]?: CourseModel[K] }
// 移除可选（-?）：将所有可选属性变为必填
type AllRequired<T> = { [K in keyof T]-?: T[K] }
// 移除只读（-readonly）
type Mutable<T> = { -readonly [K in keyof T]: T[K] }

type RequiredCourse = AllRequired<AllOptional>  // 所有属性重新变为必填

// ── 键重映射（as 子句） ──
// 给每个键加 get 前缀，生成 Getter 方法映射
type GetterMap<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}
type CourseGetters = GetterMap<CourseModel>
// { getId: () => number; getTitle: () => string; getTeacher: () => string; ... }

// ── 模板字面量 + 映射类型 ──
// 生成 setter 方法映射
type SetterMap<T> = {
  [K in keyof T as \`set\${Capitalize<string & K>}\`]: (value: T[K]) => void
}

// ── 过滤键：用 never 排除不需要的键 ──
type StringKeysOnly<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}
type CourseStrings = StringKeysOnly<CourseModel>  // { title: string; teacher: string }

// 排除函数类型的键
type NonFunctionKeys<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}

// ── 实用示例：表单校验 Schema 生成 ──
type ValidationSchema<T> = {
  [K in keyof T]: {
    required: boolean
    validator: (value: T[K]) => string | null  // 返回错误信息或 null
  }
}

const courseSchema: ValidationSchema<CourseModel> = {
  id:        { required: true,  validator: v => v > 0 ? null : 'ID 必须为正数' },
  title:     { required: true,  validator: v => v.length >= 2 ? null : '标题至少2个字' },
  teacher:   { required: true,  validator: v => v.length > 0 ? null : '讲师不能为空' },
  duration:  { required: false, validator: v => v >= 0 ? null : '时长不能为负' },
  published: { required: false, validator: () => null },
}

console.log(courseSchema.title.validator('好'))  // null（通过校验）
`;export{e as default};
