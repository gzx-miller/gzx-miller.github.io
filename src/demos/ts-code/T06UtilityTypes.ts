// 工具类型：组合内置类型工具表达更新模型
interface Course {
  id: number
  title: string
  teacher: string
  published: boolean
}

// Omit 排除不可变字段，Partial 将剩余字段变为可选
type CoursePatch = Partial<Omit<Course, 'id'>>

const course: Course = {
  id: 7,
  title: '响应式基础',
  teacher: '松松',
  published: false,
}

// 补丁对象只需包含要修改的字段
function updateCourse(target: Course, patch: CoursePatch) {
  Object.assign(target, patch)
}

updateCourse(course, { title: '响应式进阶' })
updateCourse(course, { published: true })

console.log(course.title)      // 响应式进阶
console.log(course.published)  // true
