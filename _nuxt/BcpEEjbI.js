const n=`// 泛型：让类型关系跟随参数流动
interface ApiResult<T> {
  data: T
  message: string
}

// T 在调用时由参数决定，返回值保留精确类型
function success<T>(data: T): ApiResult<T> {
  return { data, message: '读取成功' }
}

interface Course {
  id: number
  title: string
}

const courses: Course[] = [
  { id: 1, title: '组合式 API' },
  { id: 2, title: '组件通信' },
]

// result.data 精确推导为 Course[]
const result = success(courses)
console.log(\`\${result.message}，共 \${result.data.length} 门课程\`)
`;export{n as default};
