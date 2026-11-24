# 关于express实现原理说明
```ts
// 返回一个函数, 然后这个函数绑定了一些方法: use, get, post, put, delete
import express from 'express'
```
- 根据use、handler(get/post/put/delete)调用的先后顺序形成一个数组, use要求前缀匹配, handler要求精确匹配；
- 没命中的跳过, use和handler(一般我们不写next)都有next方法传入, 决定了是否继续往下匹配的,只有调用了next才会往下匹配；
- 另外如果配置的函数throw抛异常,会被最近一层的try/catch 抓住，自动转成 next(err)；之后进入“错误模式”——跳过所有普通层和路由，只找 4 个参数的错误中间件。
- 最后，我们传入的箭头函数可以是异步的也可以是同步的
