import { ImageAccess } from '../dataLayer/image.js'
import { ToDoAccess } from '../dataLayer/toDo.js'

const todoAccess = new ToDoAccess()
const imageAccess = new ImageAccess()

export async function getAllTodos(userId, todoId) {
  const allTodos = await todoAccess.getAllTodos(userId, todoId)
  console.log("allTodos", allTodos)
  return allTodos
}

export async function createTodo(userId, todoItems) {
  if (!userId) throw new Error('userId is required')
  return todoAccess.createTodo({
    ...todoItems,
    userId,
    done: false,
    createdAt: new Date().toISOString()
  })
}

export async function deleteTodo(userId, todoId) {
  return todoAccess.deleteTodo(userId, todoId)
}

export async function updateTodo(userId, todoItems, isUpdateAttachment) {
  if (isUpdateAttachment) {
    return todoAccess.updateTodoAttachment(userId, todoItems)
  }
  return todoAccess.updateTodo(userId, todoItems)
}
