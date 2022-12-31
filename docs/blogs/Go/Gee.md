---
title: Gee
date: 2022-10-30T17:55:28+08:00
sidebar: 'auto'
categories:
- Go
tags:
- Go
- 自制Web框架
---

# Gee

## Http 基础

### 标准库启动 Web 服务

`Go` 语言内置了 `net/http` 库, 封装了 `HTTP` 网络编程的基础的接口, 我们实现的 `Gee Web` 框架便是基于 `net/http` 的



>   示例代码

[day01-http-base/base01/main.go](https://github.com/yixihan/Gee/blob/master/day01-http-base/base01/main.go)

```go
package main

import (
   "fmt"
   "log"
   "net/http"
)

//main
func main() {

   http.HandleFunc("/", indexHandler)
   http.HandleFunc("/hello", helloHandler)
   /*
   http.ListenAndServe(addr, handler)
   作用 : 启动 web 服务
   参数解释 :
      addr : 地址, :9999 表示在 9999 端口监听
      handler : 代表处理所有的HTTP请求的实例, nil 代表使用标准库中的实例处理
   第二个参数, 则是我们基于 net / http 标准库实现 web 框架的入口
    */
   log.Fatal(http.ListenAndServe(":9999", nil))
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
   _, _ = fmt.Fprintf(w, "URL.Path = %q\n", r.URL.Path)
}

func helloHandler(w http.ResponseWriter, r *http.Request) {

   for k, v := range r.Header {
      _, _ = fmt.Fprintf(w, "Header[%q] = %q\n", k, v)
   }
}
```



>   代码解释

共设置了两个路由

-   `/` : 绑定了 `indexHandler`, 访问 `/`, 响应是 `URL.Path = /`
-   `/hello` : 绑定了 `helloHandler`, 访问 `/hello`, 响应是 `header` 中的键值对信息

`main` 函数的最后一行, 是用来启动 `Web` 服务的

-   第一个参数是地址, `:9999`表示在 `9999` 端口监听

-   第二个参数则代表处理所有的 `HTTP` 请求的实例, `nil` 代表使用标准库中的实例处理

第二个参数, 则是我们基于 `net/http` 标准库实现 `Web` 框架的入口



>   测试

![image-20221006164443730](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210061644922.png)

![image-20221006164744826](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210061647948.png)



### 实现 http.Handler 接口

```go
package http

type Handler interface {
	ServeHTTP(w ResponseWriter, r *Request)
}

func ListenAndServe(address string, handler Handler) error
```

`hander` 是一个接口, 需要实现方法 `ServeHTTP`, 也就是说, 只要传入任何实现了 `ServeHTTP` 接口的实例, 所有的 `HTTP` 请求, 就都交给了该实例处理了



>   示例代码

[day01-http-base/base02/main.go](https://github.com/yixihan/Gee/blob/master/day01-http-base/base02/main.go)

```go
package main

import (
	"fmt"
	"log"
	"net/http"
)

type Engine struct {}

func (e *Engine) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/":
		_, _ = fmt.Fprintf(w, "RL.Path = %q\n", r.URL.Path)
	case "/hello":
		for key, val := range r.Header {
			_, _ = fmt.Fprintf(w, "Header[%q] = %q\n", key, val)
		}
	default:
		_, _ = fmt.Fprintf(w, "404 Not Found : %s\n", r.URL.Path)
	}
}

func main () {
	engine := &Engine{}
	log.Fatal(http.ListenAndServe(":9999", engine))
}

```



>   代码解释

-   定义了一个空的结构体 `Engine`, 实现了方法 `ServeHTTP`. 这个方法有两个参数
    -   第一个参数是 `ResponseWriter`, 利用 `ResponseWriter` 可以构造针对该请求的响应
    -   第二个参数是 `Request`, 该对象包含了该 `HTTP` 请求的所有信息, 比如请求地址, `Header` 和 `Body` 等信息
-   在 `main` 函数中, 我们给 `ListenerAndServe` 方法的第二个参数传入了刚才创建的 `engine` 实例. 至此, 我们走出了实现 `Web` 框架的第一步, 即将所有的 `HTTP` 请求转向了我们自己的处理逻辑. 在实现 `Engine` 之前, 调用 `http.HandleFunc` 实现了路由和 `Handler` 的映射, 也就是只能针对具体的路由写处理逻辑. 但是在实现 `Engine` 之后, 我们拦截了所有的 `HTTP` 请求, 拥有了统一的控制入口, 在这里我们可以自由定义路由映射的规则, 也可以统一添加一些处理逻辑, 例如日志, 异常处理等
-   代码运行结果和之前是一致的



>   测试

同上



### Gee 框架的雏形

>   代码目录结构

```
gee/
	|-- gee.go
	|-- go.mod
main.go
go.mod
```



#### go.mod

[day01-http-base/base03/go.mod](https://github.com/yixihan/Gee/blob/master/day01-http-base/base03/go.mod)

```go
module "Gee/day01-http-base/base03"

go 1.18

require gee v0.0.1

// 使用 replace 将 gee 指向 ./gee
replace gee => ./gee
```



#### main.go

[day01-http-base/base03/main.go](https://github.com/yixihan/Gee/blob/master/day01-http-base/base03/main.go)

```go
package main

import (
   "fmt"
   "gee"
   "net/http"
)

func main() {
   r := gee.New()

   r.GET("/", func(w http.ResponseWriter, r *http.Request) {
      _, _ = fmt.Fprintf(w, "URL,Path = %q\n", r.URL.Path)
   })
   r.GET("/hello", func(w http.ResponseWriter, r *http.Request) {
      for key, value := range r.Header {
         _, _ = fmt.Fprintf(w, "Header[%q]: %q\n", key, value)
      }
   })

   _ = r.Run(":9999")
}
```



#### gee.go

[day01-http-base/base03/gee/gee.go](https://github.com/yixihan/Gee/blob/master/day01-http-base/base03/gee/gee.go)

```go
package gee

import (
   "fmt"
   "net/http"
)

//HandlerFunc 定义了 gee 使用的请求处理程序
type HandlerFunc func(http.ResponseWriter, *http.Request)

//Engine 实现了 ServeHandler 接口
type Engine struct {
   router map[string]HandlerFunc
}

//New Engine 的构造函数
func New() *Engine {
   return &Engine{router: make(map[string]HandlerFunc)}
}

//addRoute Engine 添加路由的函数, 私有
func (e *Engine) addRoute(method string, pattern string, handler HandlerFunc) {
   key := method + "-" + pattern
   e.router[key] = handler
}

//GET 定义添加 GET 请求的方法
func (e *Engine) GET(pattern string, handler HandlerFunc) {
   e.addRoute("GET", pattern, handler)
}

//POST 定义添加 POST 请求的方法
func (e *Engine) POST(pattern string, handler HandlerFunc) {
   e.addRoute("POST", pattern, handler)
}

//Run 定义启动 http 服务器的方法
func (e *Engine) Run(addr string) (err error) {
   return http.ListenAndServe(addr, e)
}

//ServeHTTP 自定义实现的的 ServeHTTP 方法
func (e *Engine) ServeHTTP(w http.ResponseWriter, r *http.Request) {
   key := r.Method + "-" + r.URL.Path
   if hander, ok := e.router[key]; ok {
      hander(w, r)
   } else {
      w.WriteHeader(http.StatusNotFound)
      fmt.Fprintf(w, "404 Not Found : %s\n", r.URL.Path)
   }
}
```



#### gee/go.mod

[day01-http-base/base03/gee/go.mod](https://github.com/yixihan/Gee/blob/master/day01-http-base/base03/gee/go.mod)

```go
module "Gee/day01-http-base/base03/gee"

go 1.18
```



#### 框架解释

##### gee.go

-   首先定义了类型 `HandlerFunc`, 这是提供给框架用户的, 用来定义路由映射的处理方法. 在 `Engine` 中, 添加了一张路由映射表 `router`, `key` 由请求方法和静态路由地址构成, `value` 是用户映射的处理方法
-   当用户调用 `(* Engine).GET()` 方法时, 会将路由和处理方法注册到映射表 `router` 中, `(* Engine).Run()` 方法, 是 `ListenAndServe` 方法的包装
-   `Engine` 实现的 `ServeHTTP` 方法的作用就是, 解析请求的路径, 查找路由映射表, 如果查到, 就执行注册的处理方法, 如果查不到, 就返回 `404 Not Found`



##### mian.go

-   `gee` 框架的设计及 `API` 均参考了 `gin`
-   使用 `New()` 创建 `gee` 的实例, 使用 `GET()` 方法添加路由, 最后使用 `Run()` 方法启动 `Web` 服务
-   这里的路由, 只是静态路由, 不支持动态路由



#### 测试

![image-20221006175023383](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210061750526.png)

![image-20221006175037250](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210061750342.png)

![image-20221006175057884](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210061750024.png)



## 上下文

### 设计 Context

#### 必要性

对于 `Web` 服务来说, 无非是根据请求 `*http.Request`, 构造响应 `http.ResponseWriter`.

但是这两个对象提供的接口粒度太细, 我们构造一个完整的响应, 需要考虑消息头 (`Header`) 和消息体 (`Body`), 而 `Header` 包含了状态码 (`StatusCode`), 消息类型 (`ContentType`) 等几乎每次请求都需要设置的信息

因此, 如果不进行有效的封装, 那么框架的用户将需要写大量重复繁杂的代码.

针对常用场景, 能够高效的构造出 `HTTP` 响应是一个好的框架必须考虑的点



>   封装前

```go
obj = map[string]interface{}{
    "name": "geektutu",
    "password": "1234",
}
w.Header().Set("Content-Type", "application/json")
w.WriteHeader(http.StatusOK)
encoder := json.NewEncoder(w)
if err := encoder.Encode(obj); err != nil {
    http.Error(w, err.Error(), 500)
}
```



>   封装后

```go
c.JSON(http.StatusOK, gee.H{
    "username": c.PostForm("username"),
    "password": c.PostForm("password"),
})
```



针对使用场景, 封装  `*http.Request` 和 `http.ResponseWriter` 的方法, 简化相关接口的调用, 只是设计 `Context` 的原因之一. 对于框架来说, 还需要支撑额外的功能

-   动态路由支持
-   中间件支持

`Context` 随着每一个请求的出现而产生, 请求的结束而销毁, 和当前请求强相关的信息都应由 `Context` 承载.

因此, 设计 `Context` 结构, 扩展性和复杂性留在内部, 对外简化接口. 路由的处理函数, 以及将要实现的中间件, 参数都统一使用 `Context` 实例, `Context` 就像一次会话的百宝箱, 可以找到任何东西



#### 代码实现

[day02-context/gee/context.go](https://github.com/yixihan/Gee/blob/master/day02-context/gee/context.go)

```go
package gee

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// 给 map[string]interface{} 起了一个别名 gee.H, 构建 JSON 数据时, 显得更简洁
type H map[string]interface{}

type Context struct {
	// Req request
	Req *http.Request
	// Writer response
	Writer http.ResponseWriter
	// Path path
	Path string
	// Method method
	Method string
	// StatusCode response status code
	StatusCode int
}

// NewContext Context 构造函数
func NewContext(req *http.Request, w http.ResponseWriter) *Context {
	return &Context{
		Req:    req,
		Writer: w,
		Path:   req.URL.Path,
		Method: req.Method,
	}
}

// PostForm 根据 key 返回 form 中对应的 value
func (c *Context) PostForm(key string) string {
	return c.Req.FormValue(key)
}

// Query 根据 key 返回 query 中对应的 value
func (c *Context) Query(key string) string {
	return c.Req.URL.Query().Get(key)
}

// Status 设置响应状态码
func (c *Context) Status(code int) {
	c.StatusCode = code
	c.Writer.WriteHeader(c.StatusCode)
}

// SetHeader 设置响应头
func (c *Context) SetHeader(key, value string) {
	c.Writer.Header().Set(key, value)
}

// String 响应体以 string 格式返回
func (c *Context) String(code int, format string, values ...interface{}) {
	c.Status(code)
	c.SetHeader("Content-Type", "text/plain")
	_, _ = c.Writer.Write([]byte(fmt.Sprintf(format, values...)))
}

// JSON 响应体以 JSON 格式返回
func (c *Context) JSON(code int, obj interface{}) {
	c.Status(code)
    c.SetHeader("Content-Type", "application/json")
	encoder := json.NewEncoder(c.Writer)
	if err := encoder.Encode(obj); err != nil {
		http.Error(c.Writer, err.Error(), http.StatusInternalServerError)
	}
}

// Data 响应体为 data 数据
func (c *Context) Data (code int, data []byte) {
	c.Status(code)
	_, _ = c.Writer.Write(data)
}

// HTML 响应体以 HTML 格式返回
func (c *Context) HTML (code int, html string) {
	c.Status(code)
	c.SetHeader("Content-Type", "text/html")
	_, _ = c.Writer.Write([]byte(html))
}

```



#### 代码解释

-   代码最开头, 给 `map[string]interface{}` 起了一个别名 `gee.H`, 构建 `JSON` 数据时, 显得更简洁
-   `Context` 目前只包含了 `*http.Request` 和 `http.ResponseWriter` , 另外提供了对 `Method` 和 `Path` 这两个常用数据的直接访问
-   提供了访问 `Query` 和 `PostForm` 参数的方法
-   提供了快速构造 `String` / `Data` / `JSON` / `HTML` 响应的方法



### 路由 (router)

我们将和路由相关的方法和结构提取了出来, 放到了一个新的文件中 `router.go`, 方便我们下一次对 `router` 的功能进行增强

`router` 的 `handle` 方法作了一个细微的调整, 即 `handler` 的参数, 变成了 `Context`



#### 代码实现

[day02-context/gee/router.go](https://github.com/yixihan/Gee/blob/master/day02-context/gee/router.go)

```go
package gee

import (
   "log"
   "net/http"
)

type router struct {
   handler map[string]HandlerFunc
}

// NewRouter router 构造函数
func NewRouter () *router {
   return &router{
      handler: make(map[string]HandlerFunc),
   }
}

// addRoute 添加一个新的路由到 router 中
func (r *router) addRoute(method, pattern string, handler HandlerFunc) {
   log.Printf("Route %4s - %s", method, pattern)
   key := method + "-" + pattern
   r.handler[key] = handler
}

// handle 路由
func (r *router) handle (c *Context) {
   log.Printf("Route %4s - %s", c.Method, c.Path)
   key := c.Method + "-" + c.Path
   if handler, ok := r.handler[key]; ok {
      handler(c)
   } else {
      c.String(http.StatusNotFound, "404 Not Found", c.Path)
   }
}
```



### 框架入口

#### 代码实现

[day02-context/gee/gee.go](https://github.com/yixihan/Gee/blob/master/day02-context/gee/gee.go)

```go
package gee

import "net/http"

// HandlerFunc 定义了 gee 使用的请求处理程序, 参数为自定义的 Context
type HandlerFunc func(*Context)

// Engine 实现 ServeHTTP 接口
type Engine struct {
   router *router
}

// New Engine 构造函数
func New() *Engine {
   return &Engine{
      router: NewRouter(),
   }
}

// addRoute 添加一个新的路由
func (e *Engine) addRoute(method, pattern string, handler HandlerFunc) {
   e.router.addRoute(method, pattern, handler)
}

//GET 定义添加 GET 请求的方法
func (e *Engine) GET(pattern string, handler HandlerFunc) {
   e.addRoute("GET", pattern, handler)
}

//POST 定义添加 POST 请求的方法
func (e *Engine) POST(pattern string, handler HandlerFunc) {
   e.addRoute("POST", pattern, handler)
}

//Run 定义启动 http 服务器的方法
func (e *Engine) Run(addr string) (err error) {
   return http.ListenAndServe(addr, e)
}

//ServeHTTP 自定义实现的的 ServeHTTP 方法, 具体处理逻辑放在 router.go
func (e *Engine) ServeHTTP(w http.ResponseWriter, r *http.Request) {
   c := NewContext(r, w)
   e.router.handle(c)
}

```



#### 代码解释

将 `router` 相关的代码独立后, `gee.go` 简单了不少

最重要的还是通过实现了 `ServeHTTP` 接口, 接管了所有的 `HTTP` 请求. 相比第一天的代码, 这个方法也有细微的调整, 在调用 `router.handle` 之前, 构造了一个 `Context` 对象. 这个对象目前还非常简单, 仅仅是包装了原来的两个参数, 之后我们会慢慢地给`Context` 插上翅膀。



### 主函数

#### 代码实现

[day02-context/main.go](https://github.com/yixihan/Gee/blob/master/day02-context/main.go)

```go
package main

import (
	"gee"
	"net/http"
)

func main() {
	r := gee.New()

	r.GET("/", func(c *gee.Context) {
		c.HTML(http.StatusOK, "<h1>Welcome to Gee</h1>")
	})
	r.GET("/hello", func(c *gee.Context) {
		c.String(http.StatusOK, "hello, %v!\n", c.Query("username"))
	})
	r.GET("/login", func(c *gee.Context) {
		c.JSON(http.StatusOK, gee.H{
			"username": c.PostForm("username"),
			"password": c.PostForm("password"),
		})
	})

	_ = r.Run(":9999")
}

```



### 测试

```shell
curl -i http://localhost:9999/
curl "http://localhost:9999/hello?name=yixihan"
curl "http://localhost:9999/login" -X POST -d 'username=yixihan&password=123456'
curl "http://localhost:9999/register"
```



>   测试1

![image-20221007133947905](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210071339191.png)

![image-20221007133956125](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210071339204.png)



>   测试2

![image-20221007134020504](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210071340614.png)



>   测试3

![image-20221007134043238](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210071340346.png)



>   测试4

![image-20221007134059715](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210071340832.png)



## 前缀树路由 Router

### trie 数简介

动态路由有很多种实现方式, 支持的规则, 性能等有很大的差异

实现动态路由最常见的数据结构, 被称为前缀树 (`trie` 树)

**每一个节点的所有的子节点都拥有相同的前缀**

这种结构非常适用于路由匹配



>   例子

-   /:lang/doc
-   /:lang/tutorial
-   /:lang/intro
-   /about
-   /p/blog
-   /p/related

用前缀树表示则是这样

![image-20221007221235254](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210072212416.png)

`HTTP` 请求的路径恰好是由 `/` 分隔的多段构成的, 因此, 每一段可以作为前缀树的一个节点. 我们通过树结构查询, 如果中间某一层的节点都不满足条件, 那么就说明没有匹配到的路由, 查询结束



接下来我们实现的动态路由具备以下两个功能

-   参数匹配 `:` : 例如 `/p/:lang/doc`, 可以匹配 `/p/c/doc` 和 `/p/d/doc`
-   通配 `*` : 例如 `static/*filepath`, 可以匹配 `/static/fav.ico` 和 `/static/js/jQuery.js`



### trie 树

首先我们需要设计树节点上应该存储哪些信息



#### 树节点实现

[day03-router/gee/trie.go](https://github.com/yixihan/Gee/blob/master/day03-router/gee/trie.go)

```go
// node router 前缀树
// 与普通的树不同, 为了实现动态路由匹配, 加上了 isWild 这个参数
type node struct {
	// pattern 待匹配路由, 例如 /p/:lang
	pattern string

	// part 路由中的一部分, 例如 /:lang
	part string

	// children 子节点, 例如 [doc, tutorial, intro]
	children []*node

	// isWild 是否精确匹配, part 含有 * / : 时为 true
	isWild bool
}

```





#### 辅助函数实现



##### 匹配函数实现

即当我们匹配 `/p/go/doc/` 这个路由时, 第一层节点, `p` 精确的匹配到了 `p`, 第二层节点, `go` 模糊匹配到了 `:lang`, 那么会将 `lang` 这个参数赋值给 `go`, 继续下一层匹配

```go
// matchChild 第一个匹配成功的节点, 用于插入
func (n *node) matchChild(part string) *node {
	for _, child := range n.children {
		// 精确匹配或模糊匹配
		if child.part == part || child.isWild {
			return child
		}
	}

	return nil
}

// matchChildren 所有匹配成功的节点, 用于查找
func (n *node) matchChildren(part string) []*node {
	nodes := make([]*node, 0, len(part))

	for _, child := range n.children {
		if child.part == part || child.isWild {
			nodes = append(nodes, child)
		}
	}

	return nodes
}

```



##### 插入与查询函数

对于路由来说, 最重要的是 **注册** 与 **匹配**

开发服务时, 注册路由规则, 映射 `handler`; 访问时, 匹配路由规则, 查找到对于的 `handler` 

因此, `trie` 树需要支持节点的插入与查询



###### 插入函数实现

插入功能很简单, 递归查找每一层的节点, 如果没有匹配到当前 `part` 的节点, 则新建一个

**有一点需要注意, `/p/:lang/doc` 只有在第三层节点, 即 `doc` 节点, `pattern` 才会设置为 `/p/:lang/doc`. `p` 和 `:lang` 节点的 `pattern` 属性皆为空**

```go
// insert 插入节点
func (n *node) insert(pattern string, parts []string, height int) {
	// 如果已经到 parts 的最后一层数据, 则表明插入结束, 将 pattern 放入节点的 pattern 中
	if len(parts) == height {
		n.pattern = pattern
		return
	}

	// 获取第 height 层 part, 并查询对应 part 是否有子节点
	part := parts[height]
	child := n.matchChild(part)

	// 如果没有子节点, 则构建一个新的子节点
	if child == nil {
		child = &node{
			part:   part,
			isWild: part[0] == ':' || part[0] == '*',
		}
		n.children = append(n.children, child)
	}
	child.insert(pattern, parts, height+1)
}

```





###### 查询函数实现

查询功能也是递归查询每一层的节点, 当匹配结束时, 我们可以使用 `n.pattern == ""` 来判断路由规则是否匹配成功. 例如, `/p/python` 虽能成功匹配到 `:lang`, 但 `:lang` 的 `pattern` 值为空, 因此匹配失败

查询功能退出规则是

-   匹配到了`*`
-   匹配失败,
-   匹配到了第 `len(parts)` 层节点

```go
// search 查询节点
func (n *node) search(parts []string, height int) *node {
	// 已经找到 parts 的最后一层数据或 当前 part 前缀为 *(全匹配)
	if len(parts) == height || strings.HasPrefix(n.part, "*") {
		// 如果当前树节点 pattern == "", 表明该节点并非最后一个节点, 匹配失败
		if n.pattern == "" {
			return nil
		}
		return n
	}

	// 获取第 height 层 part, 并查询对应 part 是否有子节点
	part := parts[height]
	children := n.matchChildren(part)

	for _, child := range children {
		result := child.search(parts, height+1)

		if result != nil {
			return result
		}
	}

	return nil
}

```



### Router

`trie` 树的插入与查找都成功实现了, 接下来我们将 `trie` 树应用到路由中去吧

我们使用 `roots` 来存储每种请求方式的 `trie` 树根节点. 使用 `handlers` 存储每种请求方式的 `HandlerFunc` 

`getRoute` 函数中, 还解析了 `:` 和 `*` 两种匹配符的参数, 返回一个 `map` . 例如 `/p/go/doc` 匹配到 `/p/:lang/doc`, 解析结果为 : `{lang: "go"}`, `/static/css/geektutu.css` 匹配到 `/static/*filepath`, 解析结果为 `{filepath: "css/geektutu.css"}`



#### 代码实现

[day03-router/gee/router.go](https://github.com/yixihan/Gee/blob/master/day03-router/gee/router.go)

```go
package gee

import (
	"net/http"
	"strings"
)

// router router 定义
// roots key eg, roots['GET'] roots['POST']
// handlers key eg, handlers['GET-/p/:lang/doc'], handlers['POST-/p/book']
type router struct {
	roots    map[string]*node
	handlers map[string]HandlerFunc
}

// NewRouter router 构造函数
func NewRouter() *router {
	return &router{
		roots:    make(map[string]*node),
		handlers: make(map[string]HandlerFunc),
	}
}

// parsePattern 路由解析
// * 为全匹配模式
func parsePattern(pattern string) []string {
	vs := strings.Split(pattern, "/")

	parts := make([]string, 0, len(vs))
	for _, item := range vs {
		if item != "" {
			parts = append(parts, item)
			if item[0] == '*' {
				break
			}
		}
	}

	return parts
}

// addRoute 添加一个路由进 router
func (r *router) addRoute(method, pattern string, handler HandlerFunc) {
	// 获取 parts
	parts := parsePattern(pattern)
	key := method + "-" + pattern

	// 如果 roots 里面没有当前请求方法的数, 则新建一颗树
	if _, ok := r.roots[method]; !ok {
		r.roots[method] = &node{}
	}

	// roots 中插入新节点, handler 中放入新 handler
	r.roots[method].insert(pattern, parts, 0)
	r.handlers[key] = handler
}

// getRoute 获取路由 获取路由对应树节点和 params
func (r *router) getRoute(method, path string) (*node, map[string]string) {
	// 获取 path 对应的 parts
	searchParts := parsePattern(path)
	params := make(map[string]string)

	// 尝试从 roots 里面获取对应方法的 trie 树
	root, ok := r.roots[method]

	// 如果没有, 返回 nil
	if !ok {
		return nil, nil
	}

	// 如果有的话, 从树中搜索节点
	if n := root.search(searchParts, 0); n != nil {
		// 如果搜索到节点, 则将节点中的 pattern 解析出来
		parts := parsePattern(n.pattern)

		for index, part := range parts {
			// 如果是全匹配模式 (*)
			if part[0] == ':' {
				params[part[1:]] = searchParts[index]
			}
			// 如果是动态路由
			if part[0] == '*' && len(part) > 1{
				params[part[1:]] = strings.Join(searchParts[index:], "/")
				break
			}
		}
		return n, params
	}

	return nil, nil
}

// handle 路由匹配
func (r *router) handle(c *Context) {
	if n, params := r.getRoute(c.Method, c.Path); n != nil {
		c.Params = params
		key := c.Method + "-" + n.pattern
		r.handlers[key](c)
	} else {
		c.String(http.StatusNotFound, "404 Not Found : %s\n", c.Path)
	}
}

```



#### 单元测试

##### 代码实现

[day03-router/gee/router_test.go](https://github.com/yixihan/Gee/blob/master/day03-router/gee/router_test.go)

```go
package gee

import (
	"fmt"
	"reflect"
	"testing"
)

func newTestRouter() *router {
	r := NewRouter()
	r.addRoute("GET", "/", nil)
	r.addRoute("GET", "/hello/:name", nil)
	r.addRoute("GET", "/hello/b/c", nil)
	r.addRoute("GET", "/hi/:name", nil)
	r.addRoute("GET", "/assets/*filepath", nil)
	return r
}

func TestParsePattern(t *testing.T) {
	ok := reflect.DeepEqual(parsePattern("/p/:name"), []string{"p", ":name"})
	ok = ok && reflect.DeepEqual(parsePattern("/p/*"), []string{"p", "*"})
	ok = ok && reflect.DeepEqual(parsePattern("/p/*name/*"), []string{"p", "*name"})
	if !ok {
		t.Fatal("test parsePattern failed")
	}
}

func TestGetRoute(t *testing.T) {
	r := newTestRouter()
	n, ps := r.getRoute("GET", "/hello/geektutu")

	if n == nil {
		t.Fatal("nil shouldn't be returned")
	}

	if n.pattern != "/hello/:name" {
		t.Fatal("should match /hello/:name")
	}

	if ps["name"] != "geektutu" {
		t.Fatal("name should be equal to 'geektutu'")
	}

	fmt.Printf("matched path: %s, params['name']: %s\n", n.pattern, ps["name"])

}
```



##### 运行结果

![image-20221007235220074](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210072352348.png)



### Context

在 `HandlerFunc` 中, 希望能够访问到解析的参数

因此, 需要对 `Context` 对象增加一个属性和方法, 来提供对路由参数的访问

我们将解析后的参数存储到 `Params` 中, 通过 `c.Param("lang")` 的方式获取到对应的值



#### 代码实现

[day03-router/gee/context.go](https://github.com/yixihan/Gee/blob/master/day03-router/gee/context.go)

```go
package gee

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// H 给 map[string]interface{} 起了一个别名 gee.H, 构建 JSON 数据时, 显得更简洁
type H map[string]interface{}

// Context context 定义
type Context struct {
	// Req request
	Req *http.Request

	// Writer responseWriter
	Writer http.ResponseWriter

	// Path 路由路径
	Path string

	// Method 请求方法
	Method string

	// Params 参数
	Params map[string]string

	// StatusCode 响应状态码
	StatusCode int
}

// NewContext Context 构造函数
func NewContext(req *http.Request, w http.ResponseWriter) *Context {
	return &Context{
		Req:    req,
		Writer: w,
		Path:   req.URL.Path,
		Method: req.Method,
	}
}

// PostForm 根据 key 返回 form 中对应的 value
func (c *Context) PostForm(key string) string {
	return c.Req.FormValue(key)
}

// Query 根据 key 返回 query 中对应的 value
func (c *Context) Query(key string) string {
	return c.Req.URL.Query().Get(key)
}

// Param 根据 key 返回 params 中对应的 value
func (c *Context) Param(key string) string {
	if value, ok := c.Params[key]; !ok {
		return ""
	} else {
		return value
	}
}

// Status 设置响应状态码
func (c *Context) Status(code int) {
	c.StatusCode = code
	c.Writer.WriteHeader(c.StatusCode)
}

// SetHeader 设置响应头
func (c *Context) SetHeader(key, value string) {
	c.Writer.Header().Set(key, value)
}

// String 响应体以 string 格式返回
func (c *Context) String(code int, format string, values ...interface{}) {
	c.Status(code)
	c.SetHeader("Content-Type", "text/plain")
	_, _ = c.Writer.Write([]byte(fmt.Sprintf(format, values...)))
}

// JSON 响应体以 JSON 格式返回
func (c *Context) JSON(code int, obj interface{}) {
	c.Status(code)
	c.SetHeader("Content-Type", "application/json")
	encoder := json.NewEncoder(c.Writer)
	if err := encoder.Encode(obj); err != nil {
		http.Error(c.Writer, err.Error(), http.StatusInternalServerError)
	}
}

// Data 响应体为 data 数据
func (c *Context) Data(code int, data []byte) {
	c.Status(code)
	_, _ = c.Writer.Write(data)
}

// HTML 响应体以 HTML 格式返回
func (c *Context) HTML(code int, html string) {
	c.Status(code)
	c.SetHeader("Content-Type", "text/html")
	_, _ = c.Writer.Write([]byte(html))
}

```



### gee

#### 代码实现

[day03-router/gee/gee.go](https://github.com/yixihan/Gee/blob/master/day03-router/gee/gee.go)

```go
package gee

import (
	"log"
	"net/http"
)

// HandlerFunc 定义了 gee 使用的请求处理程序, 参数为自定义的 Context
type HandlerFunc func(*Context)

// Engine 实现 ServeHTTP 接口
type Engine struct {
	router *router
}

// New Engine 构造函数
func New() *Engine {
	return &Engine{
		router: NewRouter(),
	}
}

// addRoute 添加一个新的路由
func (e *Engine) addRoute(method, pattern string, handler HandlerFunc) {
	e.router.addRoute(method, pattern, handler)
}

//GET 定义添加 GET 请求的方法
func (e *Engine) GET(pattern string, handler HandlerFunc) {
	e.addRoute("GET", pattern, handler)
}

//POST 定义添加 POST 请求的方法
func (e *Engine) POST(pattern string, handler HandlerFunc) {
	e.addRoute("POST", pattern, handler)
}

//Run 定义启动 http 服务器的方法
func (e *Engine) Run(addr string) (err error) {
	return http.ListenAndServe(addr, e)
}

//ServeHTTP 自定义实现的的 ServeHTTP 方法, 具体处理逻辑放在 router.go
func (e *Engine) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	c := NewContext(r, w)
	e.router.handle(c)
	log.Print(c.Params)
}

```



### main

#### 代码实现

[day03-router/main.go](https://github.com/yixihan/Gee/blob/master/day03-router/main.go)

```go
package main

import (
	"gee"
	"net/http"
)

func main() {
	r := gee.New()
	r.GET("/", func(c *gee.Context) {
		c.HTML(http.StatusOK, "<h1>Hello Gee</h1>")
	})

	// expect /hello?name=yixihan
	r.GET("/hello", func(c *gee.Context) {
		c.String(http.StatusOK, "hello %s, you're at %s\n", c.Query("name"), c.Path)
	})

	// expect /hello/yixihan
	r.GET("/hello/:name", func(c *gee.Context) {
		c.String(http.StatusOK, "hello %s, you're at %s\n", c.Param("name"), c.Path)
	})

	r.GET("/assets/*filepath", func(c *gee.Context) {
		c.JSON(http.StatusOK, gee.H{"filepath": c.Param("filepath")})
	})

	_ = r.Run(":9999")
}

```



### 测试

```shell
curl -i http://localhost:9999/
curl "http://localhost:9999/hello?name=yixihan"
curl "http://localhost:9999/hello/yixihan"
curl "http://localhost:9999/assets/main.java"
curl "http://localhost:9999/assets/css/style.css"
```



>   测试1

![image-20221007235644920](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210072356118.png)



>   测试2

![image-20221007235633977](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210072356147.png)



>   测试3

![image-20221007235622653](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210072356800.png)



>   测试4

![image-20221007235546905](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210072356304.png)



>   测试5

![image-20221007235531374](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210072355603.png)



## 分组控制

### 分组的意义

分组控制 (`Group Control`) 是 `Web` 框架应提供的基础功能之一

所谓分组, 是指路由的分组. 如果没有路由分组, 我们需要针对每一个路由进行控制. 但是真实的业务场景中, 往往某一组路由需要相似的处理. 例如 : 

-   以 `/post` 开头的路由匿名可访问
-   以 `/admin` 开头的路由需要鉴权
-   以 `/api` 开头的路由是 `RESTful` 接口, 可以对接第三方平台, 需要三方平台鉴权

大部分情况下的路由分组, 是以相同的前缀来区分的. 因此, 我们今天实现的分组控制也是以前缀来区分, 并且支持分组的嵌套. 例如 `/post` 是一个分组, `/post/a` 和 `/post/b` 可以是该分组下的子分组. 作用在 `/post` 分组上的中间件 (`middleware`), 也都会作用在子分组, 子分组还可以应用自己特有的中间件

中间件可以给框架提供无限的扩展能力, 应用在分组上, 可以使得分组控制的收益更为明显, 而不是共享相同的路由前缀这么简单. 例如 `/admin` 的分组, 可以应用鉴权中间件; `/` 分组应用日志中间件, `/` 是默认的最顶层的分组, 也就意味着给所有的路由, 即整个框架增加了记录日志的能力



### 分组嵌套

一个 `Group` 对象需要具备哪些属性呢? 

-   前缀 (`prefix`)

-   父亲 (`parent`)

-   中间件 (`middlewares`)
-   有访问 `Router` 的能力

如果 `Group` 对象需要直接映射路由规则的话, 比如我们想在使用框架时, 这么调用 :

```go
r := gee.New()
v1 := r.Group("/v1")
v1.GET("/", func(c *gee.Context) {
	c.HTML(http.StatusOK, "<h1>Hello Gee</h1>")
})
```

`Group` 对象, 还需要有访问 `Router` 的能力. 

为了方便, 我们可以在 `Group`中, 保存一个指针, 指向 `Engine`, 整个框架的所有资源都是由 `Engine` 统一协调的, 那么就可以通过 `Engine` 间接地访问各种接口了



### Group 定义

```go
// RouterGroup 路由组
type RouterGroup struct {
    // prefix 前缀
    prefix      string
    // middlewares 中间件
    middlewares []HandlerFunc
    // parent 父路由组
    parent      *RouterGroup
    // engine engine
    engine      *Engine
}

```



### Engine 定义

将 `Engine` 作为最顶层的分组, 也就是说 `Engine` 拥有 `RouterGroup` 所有的能力

```go
// Engine 实现 ServeHTTP 接口
type Engine struct {
   // RouterGroup 路由组指针
   *RouterGroup
   // router 路由
   router *router
   // groups 路由组数组
   groups []*RouterGroup
}

```



### 路由相关函数实现

和路由有关的函数, 都交给 `RouterGroup` 实现

```go
// New Engine 构造函数
func New() *Engine {
   engine := &Engine{router: &router{}}
   engine.RouterGroup = &RouterGroup{engine: engine}
   engine.groups = []*RouterGroup{engine.RouterGroup}
   return engine
}

// Group RouterGroup 构造函数
func (group *RouterGroup) Group(prefix string) *RouterGroup {
   engine := group.engine
   newGroup := &RouterGroup{
      prefix: group.prefix + prefix,
      parent: group,
      engine: engine,
   }
   engine.groups = append(engine.groups, newGroup)
   return newGroup
}

// addRoute 添加一个新的路由
func (group *RouterGroup) addRoute(method, comp string, handler HandlerFunc) {
   pattern := group.prefix + comp
   log.Printf("Route %4s - %s\n", method, pattern)
   group.engine.router.addRoute(method, pattern, handler)
}

//GET 定义添加 GET 请求的方法
func (group *RouterGroup) GET(pattern string, handler HandlerFunc) {
   group.addRoute("GET", pattern, handler)
}

//POST 定义添加 POST 请求的方法
func (group *RouterGroup) POST(pattern string, handler HandlerFunc) {
   group.addRoute("POST", pattern, handler)
}

```



>   ps

可以仔细观察下 `addRoute` 函数, 调用了 `group.engine.router.addRoute` 来实现了路由的映射. 由于 `Engine` 从某种意义上继承了 `RouterGroup` 的所有属性和方法, 因为 `(*Engine).engine` 是指向自己的. 这样实现, **我们既可以像原来一样添加路由, 也可以通过分组添加路由**



### gee 完整实现

[day04-group/gee/gee.go](https://github.com/yixihan/Gee/blob/master/day04-group/gee/gee.go)

```go
package gee

import (
   "log"
   "net/http"
)

// HandlerFunc 定义了 gee 使用的请求处理程序, 参数为自定义的 Context
type HandlerFunc func(*Context)

type (
   // Engine 实现 ServeHTTP 接口
   Engine struct {
      // RouterGroup 路由组指针
      *RouterGroup
      // router 路由
      router *router
      // groups 路由组数组
      groups []*RouterGroup
   }

   // RouterGroup 路由组
   RouterGroup struct {
      // prefix 前缀
      prefix      string
      // middlewares 中间件
      middlewares []HandlerFunc
      // parent 父路由组
      parent      *RouterGroup
      // engine engine
      engine      *Engine
   }
)

// New Engine 构造函数
func New() *Engine {
   engine := &Engine{router: NewRouter()}
   engine.RouterGroup = &RouterGroup{engine: engine}
   engine.groups = []*RouterGroup{engine.RouterGroup}
   return engine
}

// Group RouterGroup 构造函数
func (group *RouterGroup) Group(prefix string) *RouterGroup {
   engine := group.engine
   newGroup := &RouterGroup{
      prefix: group.prefix + prefix,
      parent: group,
      engine: engine,
   }
   engine.groups = append(engine.groups, newGroup)
   return newGroup
}

// addRoute 添加一个新的路由
func (group *RouterGroup) addRoute(method, comp string, handler HandlerFunc) {
   pattern := group.prefix + comp
   log.Printf("Route %4s - %s\n", method, pattern)
   group.engine.router.addRoute(method, pattern, handler)
}

//GET 定义添加 GET 请求的方法
func (group *RouterGroup) GET(pattern string, handler HandlerFunc) {
   group.addRoute("GET", pattern, handler)
}

//POST 定义添加 POST 请求的方法
func (group *RouterGroup) POST(pattern string, handler HandlerFunc) {
   group.addRoute("POST", pattern, handler)
}

//Run 定义启动 http 服务器的方法
func (e *Engine) Run(addr string) (err error) {
   return http.ListenAndServe(addr, e)
}

//ServeHTTP 自定义实现的的 ServeHTTP 方法, 具体处理逻辑放在 router.go
func (e *Engine) ServeHTTP(w http.ResponseWriter, r *http.Request) {
   c := NewContext(r, w)
   e.router.handle(c)
   log.Print(c.Params)
}
```



### main 实现

[day04-group/main.go](https://github.com/yixihan/Gee/blob/master/day04-group/main.go)

```go
package main

import (
   "gee"
   "net/http"
)

func main() {
   r := gee.New()
   r.GET("/index", func(c *gee.Context) {
      c.HTML(http.StatusOK, "<h1>Index Page</h1>")
   })
   v1 := r.Group("/v1")
   {
      v1.GET("/", func(c *gee.Context) {
         c.HTML(http.StatusOK, "<h1>Hello Gee</h1>")
      })

      v1.GET("/hello", func(c *gee.Context) {
         // expect /hello?name=yixihan
         c.String(http.StatusOK, "hello %s, you're at %s\n", c.Query("name"), c.Path)
      })
   }
   v2 := r.Group("/v2")
   {
      v2.GET("/hello/:name", func(c *gee.Context) {
         // expect /hello/yixihan
         c.String(http.StatusOK, "hello %s, you're at %s\n", c.Param("name"), c.Path)
      })
      v2.POST("/login", func(c *gee.Context) {
         c.JSON(http.StatusOK, gee.H{
            "username": c.PostForm("username"),
            "password": c.PostForm("password"),
         })
      })

   }

   _ = r.Run(":9999")
}
```



### 测试

```shell
curl -i http://localhost:9999/index
curl "http://localhost:9999/v1"
curl "http://localhost:9999/v1/hello?name=yixihan"
curl "http://localhost:9999/v2/hello/yixihan"
curl "http://localhost:9999/v2/login" -X POST -d 'username=yixihan&password=123456'
curl "http://localhost:9999/v3/hello/yixihan"
```



>   测试1

![image-20221008204826260](C:/Users/31137/AppData/Roaming/Typora/typora-user-images/image-20221008204826260.png)



>   测试2

![image-20221008204841218](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210082048340.png)



>   测试3

![image-20221008204851429](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210082048587.png)



>   测试4

![image-20221008204901824](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210082049949.png)



>   测试5

![image-20221008204915379](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210082049511.png)



>   测试6

![image-20221008204926547](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210082049668.png)



## 中间件

### 中间件简介

中间件 (`middlewares`), 简单说, 就是非业务的技术类组件

`Web` 框架本身不可能去理解所有的业务, 因而不可能实现所有的功能. 因此, 框架需要有一个插口, 允许用户自己定义功能, 嵌入到框架中, 仿佛这个功能是框架原生支持的一样. 

因此, 对中间件而言, 需要考虑2个比较关键的点：

-   插入点在哪? 使用框架的人并不关心底层逻辑的具体实现, 如果插入点太底层, 中间件逻辑就会非常复杂. 如果插入点离用户太近, 那和用户直接定义一组函数, 每次在 Handler 中手工调用没有多大的优势了
-   中间件的输入是什么? 中间件的输入, 决定了扩展能力. 暴露的参数太少, 用户发挥空间有限

那对于一个 `Web` 框架而言, 中间件应该设计成什么样呢? 接下来的实现, 基本参考了 `Gin` 框架



### 中间件设计

`Gee` 的中间件的定义与路由映射的 `Handler` 一致, 处理的输入是 `Context` 对象. 插入点是框架接收到请求初始化 `Context` 对象后, 允许用户使用自己定义的中间件做一些额外的处理, 例如记录日志等, 以及对 `Context` 进行二次加工. 另外通过调用 `(*Context).Next()` 函数, 中间件可等待用户自己定义的 `Handler` 处理结束后, 再做一些额外的操作, 例如计算本次处理所用时间等. 即 `Gee` 的中间件支持用户在请求被处理的前后, 做一些额外的操作. 举个例子，我们希望最终能够支持如下定义的中间件，`c.Next()` 表示等待执行其他的中间件或用户的 `Handler` : 

[day05-middleware/gee/logger.go](https://github.com/yixihan/Gee/blob/master/day05-middleware/gee/logger.go)

```go
package gee

import (
	"log"
	"time"
)

func Logger() HandlerFunc {
	return func(c *Context) {
		// Start timer
		t := time.Now()
		// Process request
		c.Next()
		// Calculate resolution time
		log.Printf("[%d] %s in %v", c.StatusCode, c.Req.RequestURI, time.Since(t))
	}
}
```

另外, 支持设置多个中间件, 依次进行调用

我们上一篇文章 *分组控制 Group Control* 中讲到, 中间件是应用在 `RouterGroup` 上的, 应用在最顶层的 `Group`, 相当于作用于全局, 所有的请求都会被中间件处理. 那为什么不作用在每一条路由规则上呢? 作用在某条路由规则, 那还不如用户直接在 `Handler` 中调用直观. 只作用在某条路由规则的功能通用性太差, 不适合定义为中间件

我们之前的框架设计是这样的, 当接收到请求后, 匹配路由, 该请求的所有信息都保存在 `Context` 中. 中间件也不例外, 接收到请求后, 应查找所有应作用于该路由的中间件, 保存在 `Context` 中, 依次进行调用. 为什么依次调用后, 还需要在 `Context` 中保存呢? 因为在设计中, 中间件不仅作用在处理流程前, 也可以作用在处理流程后, 即在用户定义的 `Handler` 处理完毕后, 还可以执行剩下的操作

为此, 我们给 `Context` 添加了 2 个参数, 定义了 `Next` 方法 :

```go
// Context context 定义
type Context struct {
	// Req request
	Req *http.Request

	// Writer responseWriter
	Writer http.ResponseWriter

	// Path 路由路径
	Path string

	// Method 请求方法
	Method string

	// Params 参数
	Params map[string]string

	// StatusCode 响应状态码
	StatusCode int

	// handlers 中间件
	handlers []HandlerFunc

	// index 记录当前执行到第几个中间件
	index int
}

// NewContext Context 构造函数
func NewContext(req *http.Request, w http.ResponseWriter) *Context {
	return &Context{
		Req:    req,
		Writer: w,
		Path:   req.URL.Path,
		Method: req.Method,
		index:  -1,
	}
}

// Next 执行下一个中间件
func (c *Context) Next () {
	c.index++
	s := len(c.handlers)

	for ; c.index < s; c.index++ {
		c.handlers[c.index](c)
	}
}

```

`index `是记录当前执行到第几个中间件, 当在中间件中调用 `Next` 方法时, 控制权交给了下一个中间件, 直到调用到最后一个中间件, 然后再从后往前, 调用每个中间件在 `Next` 方法之后定义的部分. 如果我们将用户在映射路由时定义的 `Handler` 添加到 `c.handlers` 列表中, 结果会怎么样呢? 想必你已经猜到了

```go
func A(c *Context) {
    part1
    c.Next()
    part2
}
func B(c *Context) {
    part3
    c.Next()
    part4
}
```

假设我们应用了中间件 `A` 和 `B`, 和路由映射的 `Handler`. `c.handlers` 是这样的 `[A, B, Handler]`, `c.index` 初始化为 -1. 调用 `c.Next()`, 接下来的流程是这样的 : 

-   c.index++，c.index 变为 0
-   0 < 3，调用 c.handlers[0]，即 A
-   执行 part1，调用 c.Next()
-   c.index++，c.index 变为 1
-   1 < 3，调用 c.handlers[1]，即 B
-   执行 part3，调用 c.Next()
-   c.index++，c.index 变为 2
-   2 < 3，调用 c.handlers[2]，即Handler
-   Handler 调用完毕，返回到 B 中的 part4，执行 part4
-   part4 执行完毕，返回到 A 中的 part2，执行 part2
-   part2 执行完毕，结束。

一句话说清楚重点，最终的顺序是 `part1 -> part3 -> Handler -> part 4 -> part2`. 恰恰满足了我们对中间件的要求, 接下来看调用部分的代码, 就能全部串起来了



### context 实现

-   给 `Context` 添加了 2 个参数, `handlers`, `index`
-   定义了 `Next` 方法



[day05-middleware/gee/context.go](https://github.com/yixihan/Gee/blob/master/day05-middleware/gee/context.go)

```go
package gee

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// H 给 map[string]interface{} 起了一个别名 gee.H, 构建 JSON 数据时, 显得更简洁
type H map[string]interface{}

// Context context 定义
type Context struct {
	// Req request
	Req *http.Request

	// Writer responseWriter
	Writer http.ResponseWriter

	// Path 路由路径
	Path string

	// Method 请求方法
	Method string

	// Params 参数
	Params map[string]string

	// StatusCode 响应状态码
	StatusCode int

	// handlers 中间件
	handlers []HandlerFunc

	// index 记录当前执行到第几个中间件
	index int
}

// NewContext Context 构造函数
func NewContext(req *http.Request, w http.ResponseWriter) *Context {
	return &Context{
		Req:    req,
		Writer: w,
		Path:   req.URL.Path,
		Method: req.Method,
		index:  -1,
	}
}

// Next 执行下一个中间件
func (c *Context) Next () {
	c.index++
	s := len(c.handlers)

	for ; c.index < s; c.index++ {
		c.handlers[c.index](c)
	}
}

func (c *Context) Fail(code int, err string) {
	c.index = len(c.handlers)
	c.JSON(code, H{"message" : err})
}

// PostForm 根据 key 返回 form 中对应的 value
func (c *Context) PostForm(key string) string {
	return c.Req.FormValue(key)
}

// Query 根据 key 返回 query 中对应的 value
func (c *Context) Query(key string) string {
	return c.Req.URL.Query().Get(key)
}

// Param 根据 key 返回 params 中对应的 value
func (c *Context) Param(key string) string {
	if value, ok := c.Params[key]; !ok {
		return ""
	} else {
		return value
	}
}

// Status 设置响应状态码
func (c *Context) Status(code int) {
	c.StatusCode = code
	c.Writer.WriteHeader(c.StatusCode)
}

// SetHeader 设置响应头
func (c *Context) SetHeader(key, value string) {
	c.Writer.Header().Set(key, value)
}

// String 响应体以 string 格式返回
func (c *Context) String(code int, format string, values ...interface{}) {
	c.Status(code)
	c.SetHeader("Content-Type", "text/plain")
	_, _ = c.Writer.Write([]byte(fmt.Sprintf(format, values...)))
}

// JSON 响应体以 JSON 格式返回
func (c *Context) JSON(code int, obj interface{}) {
	c.Status(code)
	c.SetHeader("Content-Type", "application/json")
	encoder := json.NewEncoder(c.Writer)
	if err := encoder.Encode(obj); err != nil {
		http.Error(c.Writer, err.Error(), http.StatusInternalServerError)
	}
}

// Data 响应体为 data 数据
func (c *Context) Data(code int, data []byte) {
	c.Status(code)
	_, _ = c.Writer.Write(data)
}

// HTML 响应体以 HTML 格式返回
func (c *Context) HTML(code int, html string) {
	c.Status(code)
	c.SetHeader("Content-Type", "text/html")
	_, _ = c.Writer.Write([]byte(html))
}

```



### gee 实现

-   定义`Use`函数, 将中间件应用到某个 `Group` 
-   `ServeHTTP` 函数也有变化, 当我们接收到一个具体请求时, 要判断该请求适用于哪些中间件, 在这里我们简单通过 `URL` 的前缀来判断. 得到中间件列表后, 赋值给 `c.handlers`



[day05-middleware/gee/gee.go](https://github.com/yixihan/Gee/blob/master/day05-middleware/gee/gee.go)

```go
package gee

import (
	"log"
	"net/http"
	"strings"
)

// router router 定义
// roots key eg, roots['GET'] roots['POST']
// handlers key eg, handlers['GET-/p/:lang/doc'], handlers['POST-/p/book']
type router struct {
	roots    map[string]*node
	handlers map[string]HandlerFunc
}

// NewRouter router 构造函数
func newRouter() *router {
	return &router{
		roots:    make(map[string]*node),
		handlers: make(map[string]HandlerFunc),
	}
}

// parsePattern 路由解析
// * 为全匹配模式
func parsePattern(pattern string) []string {
	vs := strings.Split(pattern, "/")

	parts := make([]string, 0, len(vs))
	for _, item := range vs {
		if item != "" {
			parts = append(parts, item)
			if item[0] == '*' {
				break
			}
		}
	}

	return parts
}

// addRoute 添加一个路由进 router
func (r *router) addRoute(method, pattern string, handler HandlerFunc) {
	// 获取 parts
	parts := parsePattern(pattern)
	key := method + "-" + pattern

	// 如果 roots 里面没有当前请求方法的数, 则新建一颗树
	if _, ok := r.roots[method]; !ok {
		r.roots[method] = &node{}
	}

	// roots 中插入新节点, handler 中放入新 handler
	r.roots[method].insert(pattern, parts, 0)
	r.handlers[key] = handler
}

// getRoute 获取路由 获取路由对应树节点和 params
func (r *router) getRoute(method, path string) (*node, map[string]string) {
	// 获取 path 对应的 parts
	searchParts := parsePattern(path)
	params := make(map[string]string)

	// 尝试从 roots 里面获取对应方法的 trie 树
	root, ok := r.roots[method]

	// 如果没有, 返回 nil
	if !ok {
		return nil, nil
	}

	// 如果有的话, 从树中搜索节点
	if n := root.search(searchParts, 0); n != nil {
		// 如果搜索到节点, 则将节点中的 pattern 解析出来
		parts := parsePattern(n.pattern)

		for index, part := range parts {
			// 如果是全匹配模式 (*)
			if part[0] == ':' {
				params[part[1:]] = searchParts[index]
			}
			// 如果是动态路由
			if part[0] == '*' && len(part) > 1 {
				params[part[1:]] = strings.Join(searchParts[index:], "/")
				break
			}
		}
		return n, params
	}

	return nil, nil
}

func (r *router) getRoutes (method string) []*node {
	root, ok := r.roots[method]

	if !ok {
		return nil
	}

	nodes := make([]*node, 0)
	root.travel (&nodes)
	return nodes
}

// handle 路由匹配
func (r *router) handle(c *Context) {
	log.Printf("Route %4s - %s\n", c.Method, c.Path)
	n, params := r.getRoute(c.Method, c.Path)
	if n != nil {
		c.Params = params
		key := c.Method + "-" + n.pattern
		c.handlers = append(c.handlers, r.handlers[key])
	} else {
		c.handlers = append(c.handlers, func(c *Context) {
			c.String(http.StatusNotFound, "404 NOT FOUND: %s\n", c.Path)
		})
	}

	c.Next()
}

```



#### 单元测试

[day05-middleware/gee/gee_test.go](https://github.com/yixihan/Gee/blob/master/day05-middleware/gee/gee_test.go)

```
package gee

import "testing"

func TestNestedGroup(t *testing.T) {
   r := New()
   v1 := r.Group("/v1")
   v2 := v1.Group("/v2")
   v3 := v2.Group("/v3")
   if v2.prefix != "/v1/v2" {
      t.Fatal("v2 prefix should be /v1/v2")
   }
   if v3.prefix != "/v1/v2/v3" {
      t.Fatal("v2 prefix should be /v1/v2")
   }
}
```



### router 实现

-   `handle` 函数中, 将从路由匹配得到的 `Handler` 添加到 `c.handlers` 列表中, 执行 `c.Next()`



[day05-middleware/gee/router.go](https://github.com/yixihan/Gee/blob/master/day05-middleware/gee/router.go)

```go
package gee

import (
	"log"
	"net/http"
	"strings"
)

// router router 定义
// roots key eg, roots['GET'] roots['POST']
// handlers key eg, handlers['GET-/p/:lang/doc'], handlers['POST-/p/book']
type router struct {
	roots    map[string]*node
	handlers map[string]HandlerFunc
}

// NewRouter router 构造函数
func newRouter() *router {
	return &router{
		roots:    make(map[string]*node),
		handlers: make(map[string]HandlerFunc),
	}
}

// parsePattern 路由解析
// * 为全匹配模式
func parsePattern(pattern string) []string {
	vs := strings.Split(pattern, "/")

	parts := make([]string, 0, len(vs))
	for _, item := range vs {
		if item != "" {
			parts = append(parts, item)
			if item[0] == '*' {
				break
			}
		}
	}

	return parts
}

// addRoute 添加一个路由进 router
func (r *router) addRoute(method, pattern string, handler HandlerFunc) {
	// 获取 parts
	parts := parsePattern(pattern)
	key := method + "-" + pattern

	// 如果 roots 里面没有当前请求方法的数, 则新建一颗树
	if _, ok := r.roots[method]; !ok {
		r.roots[method] = &node{}
	}

	// roots 中插入新节点, handler 中放入新 handler
	r.roots[method].insert(pattern, parts, 0)
	r.handlers[key] = handler
}

// getRoute 获取路由 获取路由对应树节点和 params
func (r *router) getRoute(method, path string) (*node, map[string]string) {
	// 获取 path 对应的 parts
	searchParts := parsePattern(path)
	params := make(map[string]string)

	// 尝试从 roots 里面获取对应方法的 trie 树
	root, ok := r.roots[method]

	// 如果没有, 返回 nil
	if !ok {
		return nil, nil
	}

	// 如果有的话, 从树中搜索节点
	if n := root.search(searchParts, 0); n != nil {
		// 如果搜索到节点, 则将节点中的 pattern 解析出来
		parts := parsePattern(n.pattern)

		for index, part := range parts {
			// 如果是全匹配模式 (*)
			if part[0] == ':' {
				params[part[1:]] = searchParts[index]
			}
			// 如果是动态路由
			if part[0] == '*' && len(part) > 1 {
				params[part[1:]] = strings.Join(searchParts[index:], "/")
				break
			}
		}
		return n, params
	}

	return nil, nil
}

func (r *router) getRoutes (method string) []*node {
	root, ok := r.roots[method]

	if !ok {
		return nil
	}

	nodes := make([]*node, 0)
	root.travel (&nodes)
	return nodes
}

// handle 路由匹配
func (r *router) handle(c *Context) {
	log.Printf("Route %4s - %s\n", c.Method, c.Path)
	n, params := r.getRoute(c.Method, c.Path)
	if n != nil {
		c.Params = params
		key := c.Method + "-" + n.pattern
		c.handlers = append(c.handlers, r.handlers[key])
	} else {
		c.handlers = append(c.handlers, func(c *Context) {
			c.String(http.StatusNotFound, "404 NOT FOUND: %s\n", c.Path)
		})
	}

	c.Next()
}

```



#### 单元测试

[day05-middleware/gee/router_test.go](https://github.com/yixihan/Gee/blob/master/day05-middleware/gee/router_test.go)

```go
package gee

import (
   "fmt"
   "reflect"
   "testing"
)

func newTestRouter() *router {
   r := newRouter()
   r.addRoute("GET", "/", nil)
   r.addRoute("GET", "/hello/:name", nil)
   r.addRoute("GET", "/hello/b/c", nil)
   r.addRoute("GET", "/hi/:name", nil)
   r.addRoute("GET", "/assets/*filepath", nil)
   return r
}

func TestParsePattern(t *testing.T) {
   ok := reflect.DeepEqual(parsePattern("/p/:name"), []string{"p", ":name"})
   ok = ok && reflect.DeepEqual(parsePattern("/p/*"), []string{"p", "*"})
   ok = ok && reflect.DeepEqual(parsePattern("/p/*name/*"), []string{"p", "*name"})
   if !ok {
      t.Fatal("test parsePattern failed")
   }
}

func TestGetRoute(t *testing.T) {
   r := newTestRouter()
   n, ps := r.getRoute("GET", "/hello/geektutu")

   if n == nil {
      t.Fatal("nil shouldn't be returned")
   }

   if n.pattern != "/hello/:name" {
      t.Fatal("should match /hello/:name")
   }

   if ps["name"] != "geektutu" {
      t.Fatal("name should be equal to 'geektutu'")
   }

   fmt.Printf("matched path: %s, params['name']: %s\n", n.pattern, ps["name"])

}

func TestGetRoute2(t *testing.T) {
   r := newTestRouter()
   n1, ps1 := r.getRoute("GET", "/assets/file1.txt")
   ok1 := n1.pattern == "/assets/*filepath" && ps1["filepath"] == "file1.txt"
   if !ok1 {
      t.Fatal("pattern shoule be /assets/*filepath & filepath shoule be file1.txt")
   }

   n2, ps2 := r.getRoute("GET", "/assets/css/test.css")
   ok2 := n2.pattern == "/assets/*filepath" && ps2["filepath"] == "css/test.css"
   if !ok2 {
      t.Fatal("pattern shoule be /assets/*filepath & filepath shoule be css/test.css")
   }

}

func TestGetRoutes(t *testing.T) {
   r := newTestRouter()
   nodes := r.getRoutes("GET")
   for i, n := range nodes {
      fmt.Println(i+1, n)
   }

   if len(nodes) != 5 {
      t.Fatal("the number of routes shoule be 4")
   }
}
```



### trie 实现

-   新增 `travel` 方法



[day05-middleware/gee/trie.go](https://github.com/yixihan/Gee/blob/master/day05-middleware/gee/trie.go)

```go
package gee

import (
	"fmt"
	"strings"
)

// node router 前缀树
// 与普通的树不同, 为了实现动态路由匹配, 加上了 isWild 这个参数
type node struct {
	// pattern 待匹配路由, 例如 /p/:lang
	pattern string

	// part 路由中的一部分, 例如 /:lang
	part string

	// children 子节点, 例如 [doc, tutorial, intro]
	children []*node

	// isWild 是否精确匹配, part 含有 * / : 时为 true
	isWild bool
}

// String 返回 node 信息
func (n *node) String() string {
	return fmt.Sprintf("node{pattern=%s, part=%s, isWild=%t}", n.pattern, n.part, n.isWild)
}

// matchChild 第一个匹配成功的节点, 用于插入
func (n *node) matchChild(part string) *node {
	for _, child := range n.children {
		// 精确匹配或模糊匹配
		if child.part == part || child.isWild {
			return child
		}
	}

	return nil
}

// matchChildren 所有匹配成功的节点, 用于查找
func (n *node) matchChildren(part string) []*node {
	nodes := make([]*node, 0, len(part))

	for _, child := range n.children {
		if child.part == part || child.isWild {
			nodes = append(nodes, child)
		}
	}

	return nodes
}

// insert 插入节点
func (n *node) insert(pattern string, parts []string, height int) {
	// 如果已经到 parts 的最后一层数据, 则表明插入结束, 将 pattern 放入节点的 pattern 中
	if len(parts) == height {
		n.pattern = pattern
		return
	}

	// 获取第 height 层 part, 并查询对应 part 是否有子节点
	part := parts[height]
	child := n.matchChild(part)

	// 如果没有子节点, 则构建一个新的子节点
	if child == nil {
		child = &node{
			part:   part,
			isWild: part[0] == ':' || part[0] == '*',
		}
		n.children = append(n.children, child)
	}
	child.insert(pattern, parts, height+1)
}

// search 查询节点
func (n *node) search(parts []string, height int) *node {
	// 已经找到 parts 的最后一层数据或 当前 part 前缀为 *(全匹配)
	if len(parts) == height || strings.HasPrefix(n.part, "*") {
		// 如果当前树节点 pattern == "", 表明该节点并非最后一个节点, 匹配失败
		if n.pattern == "" {
			return nil
		}
		return n
	}

	// 获取第 height 层 part, 并查询对应 part 是否有子节点
	part := parts[height]
	children := n.matchChildren(part)

	for _, child := range children {
		result := child.search(parts, height+1)

		if result != nil {
			return result
		}
	}

	return nil
}

// travel 返回 node 树中的所有 pattern
func (n *node) travel(list *[]*node) {
	if n.pattern != "" {
		*list = append(*list, n)
	}
	for _, child := range n.children {
		child.travel(list)
	}
}

```



### main 实现

[day05-middleware/main.go](https://github.com/yixihan/Gee/blob/master/day05-middleware/main.go)

```go
package main

import (
	"gee"
	"log"
	"net/http"
	"time"
)

func onlyForV2() gee.HandlerFunc {
	return func(c *gee.Context) {
		// Start timer
		t := time.Now()
		// if a server error occurred
		c.Fail(500, "Internal Server Error")
		// Calculate resolution time
		log.Printf("[%d] %s in %v for group v2", c.StatusCode, c.Req.RequestURI, time.Since(t))
	}
}

func main() {
	r := gee.New()
	r.Use(gee.Logger()) // global midlleware
	r.GET("/", func(c *gee.Context) {
		c.HTML(http.StatusOK, "<h1>Hello Gee</h1>")
	})

	v2 := r.Group("/v2")
	v2.Use(onlyForV2()) // v2 group middleware
	{
		v2.GET("/hello/:name", func(c *gee.Context) {
			// expect /hello/yixihan
			c.String(http.StatusOK, "hello %s, you're at %s\n", c.Param("name"), c.Path)
		})
	}

	_ = r.Run(":9999")
}

```



### 测试

```shell
curl -i http://localhost:9999/
curl http://localhost:9999/v2/hello/yixihan
```



>   测试1

![image-20221009213412483](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210092134823.png)

![image-20221009213425200](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210092134699.png)



>   测试2 不启用中间件

![image-20221009213521627](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210092135803.png)

![image-20221009213533528](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210092135806.png)



>   测试3 启用中间件

![](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210092136620.png)

![image-20221009213612741](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210092136913.png)



## 模板 Template

### 服务端渲染

现在越来越流行前后端分离的开发模式, 即 `Web` 后端提供 `RESTful` 接口, 返回结构化的数据 (通常为 `JSON` 或者 `XML`). 前端使用 `AJAX` 技术请求到所需的数据, 利用 `JavaScript` 进行渲染. `Vue` / `React` 等前端框架持续火热, 这种开发模式前后端解耦, 优势非常突出. 

后端童鞋专心解决资源利用, 并发, 数据库等问题, 只需要考虑数据如何生成. 前端童鞋专注于界面设计实现, 只需要考虑拿到数据后如何渲染即可. 而且前后端分离在当前还有另外一个不可忽视的优势. 因为后端只关注于数据, 接口返回值是结构化的, 与前端解耦. 同一套后端服务能够同时支撑小程序, 移动 `APP`, `PC` 端 `Web` 页面, 以及对外提供的接口. 

随着前端工程化的不断地发展, `Webpack`, `gulp` 等工具层出不穷, 前端技术越来越自成体系了

但前后分离的一大问题在于, 页面是在客户端渲染的, 比如浏览器, 这对于爬虫并不友好. `Google` 爬虫已经能够爬取渲染后的网页, 但是短期内爬取服务端直接渲染的 `HTML` 页面仍是主流. 

今天的内容便是介绍 `Web` 框架如何支持服务端渲染的场景。



### 静态文件(Serve Static Files)

网页的三剑客, `JavaScript`, `CSS` 和 `HTML`. 要做到服务端渲染, 第一步便是要支持 `JS`, `CSS` 等静态文件

还记得我们之前设计动态路由的时候, 支持通配符 `*` 匹配多级子路径. 比如路由规则 `/assets/*filepath`, 可以匹配 `/assets/` 开头的所有的地址. 例如 `/assets/js/geektutu.js`, 匹配后, 参数 `filepath` 就赋值为 `js/geektutu.js`

那如果我么将所有的静态文件放在 `/usr/web` 目录下, 那么 `filepath` 的值即是该目录下文件的相对地址. 映射到真实的文件后, 将文件返回, 静态服务器就实现了

找到文件后, 如何返回这一步, `net/http` 库已经实现了. 因此, `gee` 框架要做的, 仅仅是解析请求的地址, 映射到服务器上文件的真实地址, 交给`http.FileServer` 处理就好了

```go
// createStaticHandler 创建一个静态 handler
func (group *RouterGroup) createStaticHandler(relativePath string, fs http.FileSystem) HandlerFunc {
	absolutePath := path.Join(group.prefix, relativePath)
	fileServer := http.StripPrefix(absolutePath, http.FileServer(fs))
	return func(c *Context) {
		file := c.Param("filepath")
		if _, err := fs.Open(file); err != nil {
			c.Status (http.StatusNotFound)
			return
		}

		fileServer.ServeHTTP(c.Writer, c.Req)
	}
}

// Static 添加一个静态文件路由
func (group *RouterGroup) Static (relativePath string, root string){
	handler := group.createStaticHandler(relativePath, http.Dir(root))
	urlPattern := path.Join(relativePath, "/*filepath")

	// 注册路由
	group.GET(urlPattern, handler)
}

```

我们给 `RouterGroup` 添加了2个方法, `Static` 这个方法是暴露给用户的. 用户可以将磁盘上的某个文件夹 `root` 映射到路由 `relativePath`.  例如 :

```go
r := gee.New()
r.Static("/assets", "/usr/geektutu/blog/static")
// 或相对路径 r.Static("/assets", "./static")
r.Run(":9999")
```

用户访问 `localhost:9999/assets/js/geektutu.js`, 最终返回 `/usr/geektutu/blog/static/js/geektutu.js`



### HTML 模板渲染

`Go` 语言内置了 `text/template` 和 `html/template` 2个模板标准库, 其中 [`html/template`](https://golang.org/pkg/html/template/) 为 `HTML` 提供了较为完整的支持. 包括普通变量渲染, 列表渲染, 对象渲染等. `gee` 框架的模板渲染直接使用了 `html/template` 提供的能力

```go
Engine struct {
    // RouterGroup 路由组指针
    *RouterGroup
    // router 路由
    router *router
    // groups 路由组数组
    groups []*RouterGroup
    // htmlTemplates 将所有的模板加载进内存
    htmlTemplates *template.Template
    // funcMap 所有的自定义模板渲染函数
    funcMap template.FuncMap
}

func (e *Engine) SetFuncMap(funcMap template.FuncMap) {
	e.funcMap = funcMap
}

func (e *Engine) LoadHTMLGlob(pattern string) {
	e.htmlTemplates = template.Must(template.New("").Funcs(e.funcMap).ParseGlob(pattern))
}

```

首先为 `Engine` 示例添加了 `*template.Template` 和 `template.FuncMap` 对象, 前者将所有的模板加载进内存, 后者是所有的自定义模板渲染函数

另外, 给用户分别提供了设置自定义渲染函数 `funcMap` 和加载模板的方法

接下来, 对原来的 `(*Context).HTML()` 方法做了些小修改, 使之支持根据模板文件名选择模板进行渲染

```go
type Context struct {
    // ...
	// engine engine
	engine *Engine
}

// HTML 响应体以 HTML 格式返回
func (c *Context) HTML(code int, name string, data interface{}) {
	c.SetHeader("Content-Type", "text/html")
	c.Status(code)
	if err := c.engine.htmlTemplates.ExecuteTemplate(c.Writer, name, data); err != nil {
		c.Fail(500, err.Error())
	}
}
```

我们在 `Context` 中添加了成员变量 `engine *Engine`, 这样就能够通过 `Context` 访问 `Engine` 中的 `HTML` 模板. 实例化 `Context` 时, 还需要给 `c.engine` 赋值

```go
func (engine *Engine) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	// ...
	c := newContext(w, req)
	c.handlers = middlewares
	c.engine = engine
	engine.router.handle(c)
}
```



### 最终实现

>   项目目录结构

[day06-template](https://github.com/yixihan/Gee/blob/master/day06-template/)

```
---gee/
   |---context.go
   |---gee.go
   |---go.mod
   |---logger.go
   |---router.go
   |---trie.go
---static/
   |---css/
        |---geektutu.css
   |---file.txt
---templates/
   |---arr.tmpl
   |---css.tmpl
   |---custom_func.tmpl
---main.go
---go.mod
```



#### gee.go

[day06-template/gee/gee.go](https://github.com/yixihan/Gee/blob/master/day06-template/gee/gee.go)

```go
package gee

import (
	"html/template"
	"log"
	"net/http"
	"path"
	"strings"
)

// HandlerFunc 定义了 gee 使用的请求处理程序, 参数为自定义的 Context
type HandlerFunc func(*Context)

type (
	// Engine 实现 ServeHTTP 接口
	Engine struct {
		// RouterGroup 路由组指针
		*RouterGroup
		// router 路由
		router *router
		// groups 路由组数组
		groups []*RouterGroup
		// htmlTemplates 将所有的模板加载进内存
		htmlTemplates *template.Template
		// funcMap 所有的自定义模板渲染函数
		funcMap template.FuncMap
	}

	// RouterGroup 路由组
	RouterGroup struct {
		// prefix 前缀
		prefix string
		// middlewares 中间件
		middlewares []HandlerFunc
		// parent 父路由组
		parent *RouterGroup
		// engine engine
		engine *Engine
	}
)

// New Engine 构造函数
func New() *Engine {
	engine := &Engine{router: newRouter()}
	engine.RouterGroup = &RouterGroup{engine: engine}
	engine.groups = []*RouterGroup{engine.RouterGroup}
	return engine
}

// Group RouterGroup 构造函数
func (group *RouterGroup) Group(prefix string) *RouterGroup {
	engine := group.engine
	newGroup := &RouterGroup{
		prefix: group.prefix + prefix,
		parent: group,
		engine: engine,
	}
	engine.groups = append(engine.groups, newGroup)
	return newGroup
}


func (e *Engine) SetFuncMap(funcMap template.FuncMap) {
	e.funcMap = funcMap
}

func (e *Engine) LoadHTMLGlob(pattern string) {
	e.htmlTemplates = template.Must(template.New("").Funcs(e.funcMap).ParseGlob(pattern))
}

// addRoute 添加一个新的路由
func (group *RouterGroup) addRoute(method, comp string, handler HandlerFunc) {
	pattern := group.prefix + comp
	log.Printf("Route %4s - %s\n", method, pattern)
	group.engine.router.addRoute(method, pattern, handler)
}

//GET 定义添加 GET 请求的方法
func (group *RouterGroup) GET(pattern string, handler HandlerFunc) {
	group.addRoute("GET", pattern, handler)
}

//POST 定义添加 POST 请求的方法
func (group *RouterGroup) POST(pattern string, handler HandlerFunc) {
	group.addRoute("POST", pattern, handler)
}

// createStaticHandler 创建一个静态 handler
func (group *RouterGroup) createStaticHandler(relativePath string, fs http.FileSystem) HandlerFunc {
	absolutePath := path.Join(group.prefix, relativePath)
	fileServer := http.StripPrefix(absolutePath, http.FileServer(fs))
	return func(c *Context) {
		file := c.Param("filepath")
		if _, err := fs.Open(file); err != nil {
			c.Status (http.StatusNotFound)
			return
		}

		fileServer.ServeHTTP(c.Writer, c.Req)
	}
}

// Static 添加一个静态文件路由
func (group *RouterGroup) Static (relativePath string, root string){
	handler := group.createStaticHandler(relativePath, http.Dir(root))
	urlPattern := path.Join(relativePath, "/*filepath")

	// 注册路由
	group.GET(urlPattern, handler)
}

//Run 定义启动 http 服务器的方法
func (e *Engine) Run(addr string) (err error) {
	return http.ListenAndServe(addr, e)
}

func (group *RouterGroup) Use(middlewares ...HandlerFunc) {
	group.middlewares = append(group.middlewares, middlewares...)
}

//ServeHTTP 自定义实现的的 ServeHTTP 方法, 具体处理逻辑放在 router.go
func (e *Engine) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	middlewares := make([]HandlerFunc, 0)
	for _, group := range e.groups {
		if strings.HasPrefix(r.URL.Path, group.prefix) {
			middlewares = append(middlewares, group.middlewares...)
		}
	}
	c := NewContext(r, w)
	c.handlers = middlewares
	c.engine = e
	e.router.handle(c)
	log.Print(c.Params)
}

```



#### context.go

[day06-template/gee/context.go](https://github.com/yixihan/Gee/blob/master/day06-template/gee/context.go)

```go
package gee

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// H 给 map[string]interface{} 起了一个别名 gee.H, 构建 JSON 数据时, 显得更简洁
type H map[string]interface{}

// Context context 定义
type Context struct {
	// Req request
	Req *http.Request

	// Writer responseWriter
	Writer http.ResponseWriter

	// Path 路由路径
	Path string

	// Method 请求方法
	Method string

	// Params 参数
	Params map[string]string

	// StatusCode 响应状态码
	StatusCode int

	// handlers 中间件
	handlers []HandlerFunc

	// index 记录当前执行到第几个中间件
	index int

	// engine engine
	engine *Engine
}

// NewContext Context 构造函数
func NewContext(req *http.Request, w http.ResponseWriter) *Context {
	return &Context{
		Req:    req,
		Writer: w,
		Path:   req.URL.Path,
		Method: req.Method,
		index:  -1,
	}
}

// Next 执行下一个中间件
func (c *Context) Next() {
	c.index++
	s := len(c.handlers)

	for ; c.index < s; c.index++ {
		c.handlers[c.index](c)
	}
}

func (c *Context) Fail(code int, err string) {
	c.index = len(c.handlers)
	c.JSON(code, H{"message": err})
}

// PostForm 根据 key 返回 form 中对应的 value
func (c *Context) PostForm(key string) string {
	return c.Req.FormValue(key)
}

// Query 根据 key 返回 query 中对应的 value
func (c *Context) Query(key string) string {
	return c.Req.URL.Query().Get(key)
}

// Param 根据 key 返回 params 中对应的 value
func (c *Context) Param(key string) string {
	if value, ok := c.Params[key]; !ok {
		return ""
	} else {
		return value
	}
}

// Status 设置响应状态码
func (c *Context) Status(code int) {
	c.StatusCode = code
	c.Writer.WriteHeader(c.StatusCode)
}

// SetHeader 设置响应头
func (c *Context) SetHeader(key, value string) {
	c.Writer.Header().Set(key, value)
}

// String 响应体以 string 格式返回
func (c *Context) String(code int, format string, values ...interface{}) {
	c.Status(code)
	c.SetHeader("Content-Type", "text/plain")
	_, _ = c.Writer.Write([]byte(fmt.Sprintf(format, values...)))
}

// JSON 响应体以 JSON 格式返回
func (c *Context) JSON(code int, obj interface{}) {
	c.Status(code)
	c.SetHeader("Content-Type", "application/json")
	encoder := json.NewEncoder(c.Writer)
	if err := encoder.Encode(obj); err != nil {
		http.Error(c.Writer, err.Error(), http.StatusInternalServerError)
	}
}

// Data 响应体为 data 数据
func (c *Context) Data(code int, data []byte) {
	c.Status(code)
	_, _ = c.Writer.Write(data)
}

// HTML 响应体以 HTML 格式返回
func (c *Context) HTML(code int, name string, data interface{}) {
	c.SetHeader("Content-Type", "text/html")
	c.Status(code)
	if err := c.engine.htmlTemplates.ExecuteTemplate(c.Writer, name, data); err != nil {
		c.Fail(500, err.Error())
	}
}

```



#### main

[day06-template/main.go](https://github.com/yixihan/Gee/blob/master/day06-template/main.go)

```go
package main

import (
	"fmt"
	"gee"
	"html/template"
	"net/http"
	"time"
)

type student struct {
	Name string
	Age  int8
}

func FormatAsDate(t time.Time) string {
	year, month, day := t.Date()
	return fmt.Sprintf("%d-%02d-%02d", year, month, day)
}

func main() {
	r := gee.New()
	r.Use(gee.Logger())
	r.SetFuncMap(template.FuncMap{
		"FormatAsDate": FormatAsDate,
	})
	r.LoadHTMLGlob("templates/*")
	r.Static("/assets", "./static")

	stu1 := &student{Name: "yixihan", Age: 18}
	stu2 := &student{Name: "zst", Age: 16}
	r.GET("/", func(c *gee.Context) {
		c.HTML(http.StatusOK, "css.tmpl", nil)
	})
	r.GET("/students", func(c *gee.Context) {
		c.HTML(http.StatusOK, "arr.tmpl", gee.H{
			"title":  "gee",
			"stuArr": [2]*student{stu1, stu2},
		})
	})

	r.GET("/date", func(c *gee.Context) {
		c.HTML(http.StatusOK, "custom_func.tmpl", gee.H{
			"title": "gee",
			"now":   time.Date(2022, 11, 11, 11, 11, 11, 11, time.UTC),
		})
	})

	r.Run(":9999")
}

```



### 测试

[测试1](localhost:9999)

[测试2](localhost:9999/students)

[测试3](localhost:9999/date)

>   测试1

![image-20221011203245630](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210112032795.png)



>   测试2

![image-20221011203459448](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210112034548.png)



>   测试3

![image-20221011203545232](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210112035345.png)



## 错误恢复

### panic

`Go` 语言中, 比较常见的错误处理方法是返回 `error`, 由调用者决定后续如何处理. 但是如果是无法恢复的错误, 可以手动触发 `panic`, 当然如果在程序运行过程中出现了类似于数组越界的错误, `panic` 也会被触发. `panic` 会中止当前执行的程序, 退出



>   主动触发

```go
// panic.go
func main() {
	fmt.Println("before panic")
	panic("crash")
	fmt.Println("after panic")
}
```

```shell
$ go run panic.go

before panic
panic: crash

goroutine 1 [running]:
main.main()
	D:/goProject/src/Gee/day07-panic-recover/panic.go:9 +0x65
```



>   数组越界触发

```go
// panic.go
func main() {
	arr := []int{1, 2, 3}
	fmt.Println(arr[4])
}
```

```shell
$ go run panic.go
panic: runtime error: index out of range [4] with length 3
```



### defer

`panic` 会导致程序被中止, 但是在退出前, 会先处理完当前协程上已经 `defer` 的任务, 执行完成后再退出. 效果类似于 `java` 语言的 `try...catch`

```go
// panic.go
func main() {
	defer func() {
		fmt.Println("defer func")
	}()

	arr := []int{1, 2, 3}
	fmt.Println(arr[4])
}
```

```shell
$ go run panic.go
defer func
panic: runtime error: index out of range [4] with length 3
```



### recover

`Go` 语言还提供了 `recover` 函数, 可以避免因为 `panic` 发生而导致整个程序终止, `recover` 函数只在 `defer` 中生效

```go
// panic.go
func test_recover() {
	defer func() {
		fmt.Println("defer func")
		if err := recover(); err != nil {
			fmt.Println("recover success")
		}
	}()

	arr := []int{1, 2, 3}
	fmt.Println(arr[4])
	fmt.Println("after panic")
}

func main() {
	test_recover()
	fmt.Println("after recover")
}
```

```shell
$ go run panic.go
defer func
recover success
after recover
```

我们可以看到, `recover` 捕获了 `panic`, 程序正常结束. *test_recover()* 中的 *after panic* 没有打印, 这是正确的, 当 `panic` 被触发时, 控制权就被交给了 `defer` . 就像在 `java` 中, `try` 代码块中发生了异常, 控制权交给了 `catch`, 接下来执行 `catch` 代码块中的代码. 而在 *main()* 中打印了 *after recover*, 说明程序已经恢复正常, 继续往下执行直到结束

错误处理也可以作为一个中间件, 增强 `gee` 框架的能力



### recovery 实现

```go
func Recovery() HandlerFunc {
	return func(c *Context) {
		defer func() {
			if err := recover(); err != nil {
				message := fmt.Sprintf("%s", err)
				log.Printf("%s\n\n", trace(message))
				c.Fail(http.StatusInternalServerError, "Internal Server Error")
			}
		}()

		c.Next()
	}
}
```

`Recovery` 的实现非常简单, 使用 `defer` 挂载上错误恢复的函数, 在这个函数中调用 *recover()*, 捕获 `panic`, 并且将堆栈信息打印在日志中, 向用户返回 *Internal Server Error*

你可能注意到, 这里有一个 *trace()* 函数, 这个函数是用来获取触发 `panic` 的堆栈信息, 完整代码如下 :

[day07-panic-recovery/gee/recovery.go](https://github.com/yixihan/Gee/blob/master/day07-panic-recovery/gee/recovery.go)

```go
package gee

import (
	"fmt"
	"log"
	"net/http"
	"runtime"
	"strings"
)

// print stack trace for debug
func trace(message string) string {
	var pcs [32]uintptr
	n := runtime.Callers(3, pcs[:]) // skip first 3 caller

	var str strings.Builder
	str.WriteString(message + "\nTraceback:")
	for _, pc := range pcs[:n] {
		fn := runtime.FuncForPC(pc)
		file, line := fn.FileLine(pc)
		str.WriteString(fmt.Sprintf("\n\t%s:%d", file, line))
	}
	return str.String()
}

func Recovery() HandlerFunc {
	return func(c *Context) {
		defer func() {
			if err := recover(); err != nil {
				message := fmt.Sprintf("%s", err)
				log.Printf("%s\n\n", trace(message))
				c.Fail(http.StatusInternalServerError, "Internal Server Error")
			}
		}()

		c.Next()
	}
}
```

在 *trace()* 中, 调用了 `runtime.Callers(3, pcs[:])`, `Callers` 用来返回调用栈的程序计数器, 第 0 个 `Caller` 是 `Callers` 本身, 第 1 个是上一层 `trace`, 第 2 个是再上一层的 `defer func`. 因此, 为了日志简洁一点, 我们跳过了前 3 个 `Caller`

接下来, 通过 `runtime.FuncForPC(pc)` 获取对应的函数, 在通过 `fn.FileLine(pc)` 获取到调用该函数的文件名和行号, 打印在日志中

至此, `gee` 框架的错误处理机制就完成了



### main 实现

[day07-panic-recovery/main.go](https://github.com/yixihan/Gee/blob/master/day07-panic-recovery/main.go)

```go
package main

import (
	"gee"
	"net/http"
)

func main() {
	r := gee.New()
	r.Use(gee.Logger(), gee.Recovery())
	r.GET("/", func(c *gee.Context) {
		c.String(http.StatusOK, "Hello Yixihan\n")
	})
	// index out of range for testing Recovery()
	r.GET("/panic", func(c *gee.Context) {
		names := []string{"yixihan"}
		c.String(http.StatusOK, names[100])
	})

	r.Run(":9999")
}

```



### 测试

[panic接口](http://localhost:9999/panic)

![image-20221012210130050](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202210122101607.png)

