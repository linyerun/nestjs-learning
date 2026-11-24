import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from 'express'

// Router 用来把一组相关路由拆到单独文件，避免入口文件越写越长
export const usersRouter = Router()

type User = {
  id: number
  name: string
}

// 内存里的“数据库”，重启服务后数据会重置
let users: User[] = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
]
let nextId = 3

// 路由级中间件：只对当前 Router 里的路由生效
// 读操作不需要授权；写操作必须在请求头带上 Authorization: Bearer demo-token
usersRouter.use((req: Request, res: Response, next: NextFunction) => {
  const isRead = req.method === 'GET'
  const token = req.headers.authorization

  if (!isRead && token !== 'Bearer demo-token') {
    res.status(401).json({
      message: '未授权：请在请求头带上 Authorization: Bearer demo-token',
    })
    return
  }

  next()
})

// GET /api/users?keyword=张 —— 查询列表，可按名字过滤
usersRouter.get('/', (req, res) => {
  const keyword = String(req.query.keyword ?? '')
  const result = keyword
    ? users.filter((user) => user.name.includes(keyword))
    : users

  res.json(result)
})

// GET /api/users/:id —— 路径参数通过 req.params 获取
usersRouter.get('/:id', (req, res) => {
  const user = users.find((item) => item.id === Number(req.params.id))

  if (!user) {
    res.status(404).json({ message: '用户不存在' })
    return
  }

  res.json(user)
})

// POST /api/users —— 创建用户，请求体格式：{ "name": "王五" }
usersRouter.post('/', (req, res) => {
  const { name } = req.body as { name?: string }

  if (!name) {
    res.status(400).json({ message: 'name 不能为空' })
    return
  }

  const user = { id: nextId++, name }
  users.push(user)

  res.status(201).json(user) // 201 表示创建成功
})

// PUT /api/users/:id —— 更新用户
usersRouter.put('/:id', (req, res) => {
  const user = users.find((item) => item.id === Number(req.params.id))

  if (!user) {
    res.status(404).json({ message: '用户不存在' })
    return
  }

  const { name } = req.body as { name?: string }

  if (!name) {
    res.status(400).json({ message: 'name 不能为空' })
    return
  }

  user.name = name
  res.json(user)
})

// DELETE /api/users/:id —— 删除用户
usersRouter.delete('/:id', (req, res) => {
  const index = users.findIndex((item) => item.id === Number(req.params.id))

  if (index === -1) {
    res.status(404).json({ message: '用户不存在' })
    return
  }

  users.splice(index, 1)

  res.status(204).end() // 204 表示成功，但没有响应内容
})