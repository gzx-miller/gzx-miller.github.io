const o=`import { makeAutoObservable, runInAction, configure } from 'mobx'

configure({ enforceActions: 'always' })

// Store 定义
class TodoStore {
  todos = []
  filter = 'all'

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  get completedTodos() {
    return this.todos.filter((todo) => todo.completed)
  }

  get activeTodos() {
    return this.todos.filter((todo) => !todo.completed)
  }

  get filteredTodos() {
    switch (this.filter) {
      case 'active':
        return this.activeTodos
      case 'completed':
        return this.completedTodos
      default:
        return this.todos
    }
  }

  get completedCount() {
    return this.completedTodos.length
  }

  addTodo(text) {
    this.todos.push({
      id: Date.now(),
      text,
      completed: false,
    })
  }

  toggleTodo(id) {
    const todo = this.todos.find((t) => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  setFilter(filter) {
    this.filter = filter
  }

  async loadTodos() {
    const response = await fetch('/api/todos')
    const data = await response.json()
    runInAction(() => {
      this.todos = data
    })
  }
}

// 使用示例
const store = new TodoStore()

console.log('初始 todos:', store.todos.length)

store.addTodo('学习 MobX')
store.addTodo('理解 Observable')

console.log('添加后 todos:', store.todos.length)
console.log('已完成数量:', store.completedCount)

store.toggleTodo(store.todos[0].id)
console.log('切换后已完成数量:', store.completedCount)

store.setFilter('active')
console.log('活跃 todos:', store.filteredTodos.length)

// autorun 示例
import { autorun } from 'mobx'

autorun(() => {
  console.log('当前已完成:', store.completedCount, '/', store.todos.length)
})

store.addTodo('autorun 测试')
store.toggleTodo(store.todos[2].id)
`;export{o as default};
