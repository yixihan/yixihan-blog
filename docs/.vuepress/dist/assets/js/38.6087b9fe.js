(window.webpackJsonp=window.webpackJsonp||[]).push([[38],{447:function(v,_,e){"use strict";e.r(_);var s=e(2),o=Object(s.a)({},(function(){var v=this,_=v._self._c;return _("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[_("h1",{attrs:{id:"mysql-面经"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#mysql-面经"}},[v._v("#")]),v._v(" MySQL- 面经")]),v._v(" "),_("h2",{attrs:{id:"存储引擎"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#存储引擎"}},[v._v("#")]),v._v(" 存储引擎")]),v._v(" "),_("h3",{attrs:{id:"简介"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#简介"}},[v._v("#")]),v._v(" 简介")]),v._v(" "),_("p",[_("code",[v._v("MySQL")]),v._v(" 目前默认的存储引擎为 "),_("code",[v._v("InnoDB")]),v._v(", 并且 5.7, 8.0 版本只有 "),_("code",[v._v("InnoDB")]),v._v(" 是事务性存储引擎")]),v._v(" "),_("blockquote",[_("p",[v._v("存储引擎相关的命令")])]),v._v(" "),_("div",{staticClass:"language-sql line-numbers-mode"},[_("pre",{pre:!0,attrs:{class:"language-sql"}},[_("code",[_("span",{pre:!0,attrs:{class:"token comment"}},[v._v("# 查看 MySQL 提供的所有存储引擎")]),v._v("\n"),_("span",{pre:!0,attrs:{class:"token keyword"}},[v._v("show")]),v._v(" engines"),_("span",{pre:!0,attrs:{class:"token punctuation"}},[v._v(";")]),v._v("\n\n"),_("span",{pre:!0,attrs:{class:"token comment"}},[v._v("# 查看 MySQL 当前默认的存储引擎")]),v._v("\n"),_("span",{pre:!0,attrs:{class:"token keyword"}},[v._v("show")]),v._v(" variables "),_("span",{pre:!0,attrs:{class:"token operator"}},[v._v("like")]),v._v(" "),_("span",{pre:!0,attrs:{class:"token string"}},[v._v("'%storage_engine%'")]),_("span",{pre:!0,attrs:{class:"token punctuation"}},[v._v(";")]),v._v("\n\n"),_("span",{pre:!0,attrs:{class:"token comment"}},[v._v("# 查看表的存储引擎")]),v._v("\n"),_("span",{pre:!0,attrs:{class:"token keyword"}},[v._v("show")]),v._v(" "),_("span",{pre:!0,attrs:{class:"token keyword"}},[v._v("table")]),v._v(" "),_("span",{pre:!0,attrs:{class:"token keyword"}},[v._v("status")]),v._v(" "),_("span",{pre:!0,attrs:{class:"token operator"}},[v._v("like")]),v._v(" "),_("span",{pre:!0,attrs:{class:"token string"}},[v._v('"table_name"')]),_("span",{pre:!0,attrs:{class:"token punctuation"}},[v._v(";")]),v._v("\n")])]),v._v(" "),_("div",{staticClass:"line-numbers-wrapper"},[_("span",{staticClass:"line-number"},[v._v("1")]),_("br"),_("span",{staticClass:"line-number"},[v._v("2")]),_("br"),_("span",{staticClass:"line-number"},[v._v("3")]),_("br"),_("span",{staticClass:"line-number"},[v._v("4")]),_("br"),_("span",{staticClass:"line-number"},[v._v("5")]),_("br"),_("span",{staticClass:"line-number"},[v._v("6")]),_("br"),_("span",{staticClass:"line-number"},[v._v("7")]),_("br"),_("span",{staticClass:"line-number"},[v._v("8")]),_("br")])]),_("h3",{attrs:{id:"myisam-与-innodb-的区别"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#myisam-与-innodb-的区别"}},[v._v("#")]),v._v(" MyISAM 与 InnoDB 的区别")]),v._v(" "),_("h4",{attrs:{id:"简介-2"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#简介-2"}},[v._v("#")]),v._v(" 简介")]),v._v(" "),_("p",[_("code",[v._v("MySQL")]),v._v(" 5.5 之前, "),_("code",[v._v("MyISAM")]),v._v(" 存储引擎是 "),_("code",[v._v("MySQL")]),v._v(" 的默认存储引擎")]),v._v(" "),_("p",[_("code",[v._v("MySQL")]),v._v(" 5.5 之后, "),_("code",[v._v("InnoDB")]),v._v(" 存储引擎是 "),_("code",[v._v("MySQL")]),v._v(" 的默认存储引擎")]),v._v(" "),_("blockquote",[_("p",[v._v("MyISAM 存储引擎优缺点")])]),v._v(" "),_("p",[v._v("优点 :")]),v._v(" "),_("ul",[_("li",[v._v("性能还行")]),v._v(" "),_("li",[v._v("各种特性也不错 (全文索引, 压缩, 空间函数等)")])]),v._v(" "),_("p",[v._v("缺点 :")]),v._v(" "),_("ul",[_("li",[v._v("不支持"),_("strong",[v._v("事务")])]),v._v(" "),_("li",[v._v("不支持"),_("strong",[v._v("行级锁")])]),v._v(" "),_("li",[_("strong",[v._v("崩溃后无法安全恢复")])])]),v._v(" "),_("h4",{attrs:{id:"myisam-与-innodb-的对比"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#myisam-与-innodb-的对比"}},[v._v("#")]),v._v(" MyISAM 与 InnoDB 的对比")]),v._v(" "),_("h5",{attrs:{id:"是否支持行级锁"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#是否支持行级锁"}},[v._v("#")]),v._v(" 是否支持行级锁")]),v._v(" "),_("p",[_("code",[v._v("MyISAM")]),v._v(" 只有表级锁 (table-level locking), 而 "),_("code",[v._v("InnoDB")]),v._v(" 支持行级锁 (row-level locking) 和表级锁, 默认为行级锁")]),v._v(" "),_("blockquote",[_("p",[v._v("小贴士")])]),v._v(" "),_("p",[v._v("也就是说, "),_("code",[v._v("MyISAM")]),v._v(" 一锁就是锁住了整张表, 这不利于并发, 而 "),_("code",[v._v("InnoDB")]),v._v(" 默认只锁需要的行, 并发效率更高")]),v._v(" "),_("h5",{attrs:{id:"是否支持事务"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#是否支持事务"}},[v._v("#")]),v._v(" 是否支持事务")]),v._v(" "),_("p",[_("code",[v._v("MyISAM")]),v._v(" 不支持事务")]),v._v(" "),_("p",[_("code",[v._v("InnoDB")]),v._v(" 支持事务, 具有 "),_("strong",[v._v("提交 (commit)")]),v._v(" 和 "),_("strong",[v._v("回滚 (rollback)")]),v._v(" 事务的能力")]),v._v(" "),_("h5",{attrs:{id:"是否支持外键"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#是否支持外键"}},[v._v("#")]),v._v(" 是否支持外键")]),v._v(" "),_("p",[_("code",[v._v("MyISAM")]),v._v(" 不支持外键")]),v._v(" "),_("p",[_("code",[v._v("InnoDB")]),v._v(" 支持外键")]),v._v(" "),_("h5",{attrs:{id:"是否支持数据库异常崩溃后安全恢复"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#是否支持数据库异常崩溃后安全恢复"}},[v._v("#")]),v._v(" 是否支持数据库异常崩溃后安全恢复")]),v._v(" "),_("p",[_("code",[v._v("MyISAM")]),v._v(" 不支持数据库异常崩溃后安全恢复")]),v._v(" "),_("p",[_("code",[v._v("InnoDB")]),v._v(" 支持数据库异常崩溃后安全恢复")]),v._v(" "),_("blockquote",[_("p",[v._v("小贴士")])]),v._v(" "),_("p",[v._v("使用 "),_("code",[v._v("InnoDB")]),v._v(" 的数据库在异常崩溃后, 数据库重新启动的时候会保证数据库恢复到崩溃前的状态, 这个恢复的过程依赖于 "),_("code",[v._v("redo log")])]),v._v(" "),_("blockquote",[_("p",[v._v("扩展")])]),v._v(" "),_("ul",[_("li",[_("code",[v._v("MySQL InnoDB")]),v._v(" 存储引擎使用 "),_("code",[v._v("redo log")]),v._v(" (重做日志) 保证事务的 "),_("strong",[v._v("持久性")]),v._v(", 使用 "),_("code",[v._v("undo log")]),v._v("(回滚日志) 保证事务的 "),_("strong",[v._v("原子性")])]),v._v(" "),_("li",[_("code",[v._v("MySQL InnoDB")]),v._v(" 存储引擎通过 "),_("strong",[v._v("锁机制")]),v._v(", "),_("strong",[v._v("MVVC")]),v._v(" 等手段来保证事务的隔离性 (默认支持的隔离级别是可重复度)")]),v._v(" "),_("li",[v._v("保证了事务的 "),_("strong",[v._v("持久性")]),v._v(", "),_("strong",[v._v("原子性")]),v._v(", "),_("strong",[v._v("隔离性")]),v._v(" 之后, "),_("strong",[v._v("一致性")]),v._v(" 才能得到保障")])]),v._v(" "),_("h5",{attrs:{id:"是否支持-mvvc"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#是否支持-mvvc"}},[v._v("#")]),v._v(" 是否支持 MVVC")]),v._v(" "),_("p",[_("code",[v._v("MyISAM")]),v._v(" 不支持 MVVC")]),v._v(" "),_("p",[_("code",[v._v("InnoDB")]),v._v(" 支持 MVVC")]),v._v(" "),_("blockquote",[_("p",[v._v("小贴士")])]),v._v(" "),_("p",[v._v("MVCC 可以看作是行级锁的一个升级, 可以有效减少加锁操作, 提高性能")]),v._v(" "),_("h2",{attrs:{id:"锁机制和-innodb-锁算法"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#锁机制和-innodb-锁算法"}},[v._v("#")]),v._v(" 锁机制和 InnoDB 锁算法")]),v._v(" "),_("h3",{attrs:{id:"myisam-和-innodb-存储引擎使用的锁"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#myisam-和-innodb-存储引擎使用的锁"}},[v._v("#")]),v._v(" MyISAM 和 InnoDB 存储引擎使用的锁")]),v._v(" "),_("ul",[_("li",[_("code",[v._v("MyISAM")]),v._v(" 采用表级锁 (table-level locking)")]),v._v(" "),_("li",[_("code",[v._v("InnoDB")]),v._v(" 采用行级锁 (row-level locking) 和表级锁, 默认为行级锁")])]),v._v(" "),_("h3",{attrs:{id:"表级锁和行级锁对比"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#表级锁和行级锁对比"}},[v._v("#")]),v._v(" 表级锁和行级锁对比")]),v._v(" "),_("ul",[_("li",[_("strong",[v._v("表级锁")]),v._v(" : "),_("code",[v._v("MySQL")]),v._v(" 中锁定 "),_("strong",[v._v("粒度最大")]),v._v(" 的一种锁, 对当前操作的整张表加锁. "),_("strong",[v._v("实现简单")]),v._v(", "),_("strong",[v._v("资源消耗也比较少")]),v._v(", "),_("strong",[v._v("加锁快")]),v._v(", "),_("strong",[v._v("不会出现死锁")]),v._v(", "),_("strong",[v._v("出发锁冲突概率最高")]),v._v(", "),_("strong",[v._v("并发度最低")]),v._v(", "),_("code",[v._v("MyISAM")]),v._v(" 和 "),_("code",[v._v("InnoDB")]),v._v(" 存储引擎都支持表级锁")]),v._v(" "),_("li",[_("strong",[v._v("行级锁")]),v._v(" : "),_("code",[v._v("MySQL")]),v._v(" 中锁定 "),_("strong",[v._v("粒度最小")]),v._v(" 的一种锁, 只针对当前操作的行加锁, "),_("strong",[v._v("行级锁能大大减少数据库操作的冲突")]),v._v(", "),_("strong",[v._v("加锁粒度最小")]),v._v(", "),_("strong",[v._v("并发度高")]),v._v(", "),_("strong",[v._v("加锁的开销最大")]),v._v(", "),_("strong",[v._v("加锁慢")]),v._v(", "),_("strong",[v._v("会出现死锁")])])]),v._v(" "),_("blockquote",[_("p",[v._v("表级锁和行级锁的区别")])]),v._v(" "),_("ul",[_("li",[_("strong",[v._v("开销")]),v._v(" : 表级锁加锁开销少, 行级锁加锁开销大")]),v._v(" "),_("li",[_("strong",[v._v("加锁粒度")]),v._v(" : 表级锁加锁粒度最大, 行级锁加锁粒度最小")]),v._v(" "),_("li",[_("strong",[v._v("是否会出现死锁")]),v._v(" : 表级锁不会出现死锁, 行级锁会出现死锁")]),v._v(" "),_("li",[_("strong",[v._v("加锁速度")]),v._v(" : 表级锁加锁速度快, 行级锁加锁速度慢")]),v._v(" "),_("li",[_("strong",[v._v("并发度")]),v._v(" : 表级锁并发度低, 行级锁并发度高")])]),v._v(" "),_("h3",{attrs:{id:"innodb-存储引擎的锁的算法"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#innodb-存储引擎的锁的算法"}},[v._v("#")]),v._v(" InnoDB 存储引擎的锁的算法")]),v._v(" "),_("p",[_("code",[v._v("InnoDB")]),v._v(" 存储引擎的锁的算法有三种 :")]),v._v(" "),_("ul",[_("li",[_("code",[v._v("Record lock")]),v._v(" : "),_("strong",[v._v("记录锁")]),v._v(", 单个行记录上的锁")]),v._v(" "),_("li",[_("code",[v._v("Gap lock")]),v._v(" : "),_("strong",[v._v("间隙锁")]),v._v(", 锁定一个范围, 不包括记录本身")]),v._v(" "),_("li",[_("code",[v._v("Next-key lock")]),v._v(" : "),_("code",[v._v("Record")]),v._v(" + "),_("code",[v._v("Gap")]),v._v(" "),_("strong",[v._v("临键锁")]),v._v(", 锁定一个范围, 包含记录本身")])]),v._v(" "),_("h2",{attrs:{id:"一条-sql-语句在-mysql-中如何被执行的"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#一条-sql-语句在-mysql-中如何被执行的"}},[v._v("#")]),v._v(" 一条 SQL 语句在 MySQL 中如何被执行的?")]),v._v(" "),_("h3",{attrs:{id:"mysql-基础架构分析"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#mysql-基础架构分析"}},[v._v("#")]),v._v(" MySQL 基础架构分析")]),v._v(" "),_("h4",{attrs:{id:"mysql-基本架构概览"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#mysql-基本架构概览"}},[v._v("#")]),v._v(" MySQL 基本架构概览")]),v._v(" "),_("p",[v._v("下图是 "),_("code",[v._v("MySQL")]),v._v(" 的一个简要架构图,  从下图你可以很清晰的看到用户的 "),_("code",[v._v("SQL")]),v._v(" 语句在 "),_("code",[v._v("MySQL")]),v._v(" 内部是如何执行的")]),v._v(" "),_("blockquote",[_("p",[v._v("图示")])]),v._v(" "),_("p",[_("img",{attrs:{src:"https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/13526879-3037b144ed09eb88.png",alt:"img"}})]),v._v(" "),_("blockquote",[_("p",[v._v("图解")])]),v._v(" "),_("ul",[_("li",[_("strong",[v._v("连接器")]),v._v(" : 身份认证和权限相关 (登录 "),_("code",[v._v("MySQL")]),v._v(" 的时候)")]),v._v(" "),_("li",[_("strong",[v._v("查询缓存")]),v._v(" : 执行查询语句的时候, 会先查询缓存 ("),_("code",[v._v("MySQL")]),v._v(" 8.0 版本后移除)")]),v._v(" "),_("li",[_("strong",[v._v("分析器")]),v._v(" : 没有命中缓存的话, "),_("code",[v._v("SQL")]),v._v(" 语句就会经过分析器, 分析器说白了就是要先看你的 "),_("code",[v._v("SQL")]),v._v(" 语句要干嘛, 再检查你的 "),_("code",[v._v("SQL")]),v._v(" 语句语法是否正确")]),v._v(" "),_("li",[_("strong",[v._v("优化器")]),v._v(" : 按照 "),_("code",[v._v("MySQL")]),v._v(" 认为最优的方案去执行")])]),v._v(" "),_("p",[v._v("简单来说 "),_("code",[v._v("MySQL")]),v._v(" 主要分为 "),_("code",[v._v("Server")]),v._v(" 层和存储引擎层 :")]),v._v(" "),_("ul",[_("li",[_("strong",[v._v("Server 层")]),v._v(" : 主要包括连接器, 查询缓存, 分析器, 优化器, 执行器等, 所有跨存储引擎的功能都在这一层实现, 比如存储过程, 触发器, 视图, 函数等, 还有一个通用的日志模块 "),_("code",[v._v("binlog")]),v._v(" 日志模块")]),v._v(" "),_("li",[_("strong",[v._v("存储引擎")]),v._v(" : 主要负责数据的存储和读取, 采用可以替换的插件式架构, 支持 "),_("code",[v._v("InnoDB")]),v._v("、"),_("code",[v._v("MyISAM")]),v._v("、"),_("code",[v._v("Memory")]),v._v(" 等多个存储引擎, 其中 "),_("code",[v._v("InnoDB")]),v._v("引擎有自有的日志模块 "),_("code",[v._v("redolog")]),v._v(" 模块. "),_("strong",[v._v("现在最常用的存储引擎是 "),_("code",[v._v("InnoDB")]),v._v(", 它从 "),_("code",[v._v("MySQL 5.5.5")]),v._v(" 版本开始就被当做默认存储引擎了")])])]),v._v(" "),_("h4",{attrs:{id:"server-层基本组件介绍"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#server-层基本组件介绍"}},[v._v("#")]),v._v(" Server 层基本组件介绍")]),v._v(" "),_("h5",{attrs:{id:"连接器"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#连接器"}},[v._v("#")]),v._v(" 连接器")]),v._v(" "),_("p",[v._v("连接器主要和身份认证和权限相关的功能相关, 就好比一个级别很高的门卫一样")]),v._v(" "),_("p",[v._v("主要负责用户登录数据库, 进行用户的身份认证, 包括校验账户密码, 权限等操作, 如果用户账户密码已通过, 连接器会到权限表中查询该用户的所有权限, 之后在这个连接里的权限逻辑判断都是会依赖此时读取到的权限数据, 也就是说, 后续只要这个连接不断开, 即使管理员修改了该用户的权限, 该用户也是不受影响的")]),v._v(" "),_("h5",{attrs:{id:"查询缓存-mysql-8-0-版本后移除"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#查询缓存-mysql-8-0-版本后移除"}},[v._v("#")]),v._v(" 查询缓存 (MySQL 8.0 版本后移除)")]),v._v(" "),_("p",[v._v("查询缓存主要用来缓存我们所执行的 "),_("code",[v._v("SELECT")]),v._v(" 语句以及该语句的结果集")]),v._v(" "),_("p",[v._v("连接建立后, 执行查询语句的时候, 会先查询缓存, "),_("code",[v._v("MySQL")]),v._v(" 会先校验这个 "),_("code",[v._v("sql")]),v._v(" 是否执行过, 以 Key - Value 的形式缓存在内存中, "),_("code",[v._v("Key")]),v._v(" 是查询预计, "),_("code",[v._v("Value")]),v._v(" 是结果集. 如果缓存 "),_("code",[v._v("key")]),v._v(" 被命中, 就会直接返回给客户端, 如果没有命中, 就会执行后续的操作, 完成后也会把结果缓存起来, 方便下一次调用. 当然在真正执行缓存查询的时候还是会校验用户的权限, 是否有该表的查询条件")]),v._v(" "),_("p",[_("strong",[_("code",[v._v("MySQL")]),v._v(" 查询不建议使用缓存")]),v._v(", 因为查询缓存失效在实际业务场景中可能会非常频繁, 假如你对一个表更新的话, 这个表上的所有的查询缓存都会被清空. 对于不经常更新的数据来说, 使用缓存还是可以的")]),v._v(" "),_("p",[v._v("所以, 一般在大多数情况下我们都是不推荐去使用查询缓存的")]),v._v(" "),_("p",[_("code",[v._v("MySQL 8.0")]),v._v(" 版本后删除了缓存的功能, 官方也是认为该功能在实际的应用场景比较少, 所以干脆直接删掉了")]),v._v(" "),_("h5",{attrs:{id:"分析器"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#分析器"}},[v._v("#")]),v._v(" 分析器")]),v._v(" "),_("p",[_("code",[v._v("MySQL")]),v._v(" 没有命中缓存, 那么就会进入分析器, 分析器主要是用来分析 "),_("code",[v._v("SQL")]),v._v(" 语句是来干嘛的, 分析器也会分为几步 :")]),v._v(" "),_("p",[_("strong",[v._v("第一步, 词法分析")]),v._v(", 一条 "),_("code",[v._v("SQL")]),v._v(" 语句有多个字符串组成, 首先要提取关键字, 比如 "),_("code",[v._v("select")]),v._v(", 提出查询的表, 提出字段名, 提出查询条件等等. 做完这些操作后, 就会进入第二步")]),v._v(" "),_("p",[_("strong",[v._v("第二步, 语法分析")]),v._v(", 主要就是判断你输入的 "),_("code",[v._v("sql")]),v._v(" 是否正确, 是否符合 "),_("code",[v._v("MySQL")]),v._v(" 的语法")]),v._v(" "),_("p",[v._v("完成这 2 步之后, "),_("code",[v._v("MySQL")]),v._v(" 就准备开始执行了, 但是如何执行, 怎么执行是最好的结果呢? 这个时候就需要优化器上场了")]),v._v(" "),_("h5",{attrs:{id:"优化器"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#优化器"}},[v._v("#")]),v._v(" 优化器")]),v._v(" "),_("p",[v._v("优化器的作用就是它认为的最优的执行方案去执行 (有时候可能也不是最优, 这篇文章涉及对这部分知识的深入讲解), 比如多个索引的时候该如何选择索引, 多表查询的时候如何选择关联顺序等")]),v._v(" "),_("p",[v._v("可以说, 经过了优化器之后可以说这个语句具体该如何执行就已经定下来")]),v._v(" "),_("h5",{attrs:{id:"执行器"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#执行器"}},[v._v("#")]),v._v(" 执行器")]),v._v(" "),_("p",[v._v("当选择了执行方案后, MySQL 就准备开始执行了, 首先执行前会校验该用户有没有权限, 如果没有权限, 就会返回错误信息, 如果有权限, 就会去调用引擎的接口, 返回接口执行的结果")]),v._v(" "),_("h3",{attrs:{id:"语句分析"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#语句分析"}},[v._v("#")]),v._v(" 语句分析")]),v._v(" "),_("h4",{attrs:{id:"查询语句"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#查询语句"}},[v._v("#")]),v._v(" 查询语句")]),v._v(" "),_("blockquote",[_("p",[v._v("sql 语句")])]),v._v(" "),_("div",{staticClass:"language-sql line-numbers-mode"},[_("pre",{pre:!0,attrs:{class:"language-sql"}},[_("code",[_("span",{pre:!0,attrs:{class:"token keyword"}},[v._v("select")]),v._v(" "),_("span",{pre:!0,attrs:{class:"token operator"}},[v._v("*")]),v._v(" "),_("span",{pre:!0,attrs:{class:"token keyword"}},[v._v("from")]),v._v(" tb_student  A "),_("span",{pre:!0,attrs:{class:"token keyword"}},[v._v("where")]),v._v(" A"),_("span",{pre:!0,attrs:{class:"token punctuation"}},[v._v(".")]),v._v("age "),_("span",{pre:!0,attrs:{class:"token operator"}},[v._v("=")]),v._v(" "),_("span",{pre:!0,attrs:{class:"token string"}},[v._v("'18'")]),v._v(" "),_("span",{pre:!0,attrs:{class:"token operator"}},[v._v("and")]),v._v(" A"),_("span",{pre:!0,attrs:{class:"token punctuation"}},[v._v(".")]),v._v("name "),_("span",{pre:!0,attrs:{class:"token operator"}},[v._v("=")]),v._v(" "),_("span",{pre:!0,attrs:{class:"token string"}},[v._v("' 张三 '")]),_("span",{pre:!0,attrs:{class:"token punctuation"}},[v._v(";")]),v._v("\n")])]),v._v(" "),_("div",{staticClass:"line-numbers-wrapper"},[_("span",{staticClass:"line-number"},[v._v("1")]),_("br")])]),_("blockquote",[_("p",[v._v("执行流程")])]),v._v(" "),_("ul",[_("li",[_("p",[v._v("先检查该语句是否有权限, 如果没有权限, 直接返回错误信息, 如果有权限, 在 "),_("code",[v._v("MySQL8.0")]),v._v(" 版本以前, 会先查询缓存, 以这条 "),_("code",[v._v("sql")]),v._v(" 语句为 "),_("code",[v._v("key")]),v._v(" 在内存中查询是否有结果, 如果有直接缓存, 如果没有, 执行下一步")])]),v._v(" "),_("li",[_("p",[v._v("通过分析器进行词法分析, 提取 "),_("code",[v._v("sql")]),v._v(" 语句的关键元素, 比如提取上面这个语句是查询 "),_("code",[v._v("select")]),v._v(", 提取需要查询的表名为 "),_("code",[v._v("tb_student")]),v._v(", 需要查询所有的列, 查询条件是这个表的 "),_("code",[v._v("id='1'")]),v._v(". 然后判断这个 "),_("code",[v._v("sql")]),v._v(" 语句是否有语法错误, 比如关键词是否正确等等, 如果检查没问题就执行下一步.")])]),v._v(" "),_("li",[_("p",[v._v("接下来就是优化器进行确定执行方案, 上面的 "),_("code",[v._v("sql")]),v._v(" 语句, 可以有两种执行方案 :")]),v._v(" "),_("ul",[_("li",[v._v('先查询学生表中姓名为"张三”的学生, 然后判断是否年龄是 18.')]),v._v(" "),_("li",[v._v('先找出学生中年龄 18 岁的学生, 然后再查询姓名为"张三”的学生.')])]),v._v(" "),_("p",[v._v("那么优化器根据自己的优化算法进行选择执行效率最好的一个方案 (优化器认为, 有时候不一定最好) . 那么确认了执行计划后就准备开始执行了")])]),v._v(" "),_("li",[_("p",[v._v("进行权限校验, 如果没有权限就会返回错误信息, 如果有权限就会调用数据库引擎接口, 返回引擎的执行结果")])])]),v._v(" "),_("h4",{attrs:{id:"更新语句"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#更新语句"}},[v._v("#")]),v._v(" 更新语句")]),v._v(" "),_("blockquote",[_("p",[v._v("sql 语句")])]),v._v(" "),_("div",{staticClass:"language-sql line-numbers-mode"},[_("pre",{pre:!0,attrs:{class:"language-sql"}},[_("code",[_("span",{pre:!0,attrs:{class:"token keyword"}},[v._v("update")]),v._v(" tb_student A "),_("span",{pre:!0,attrs:{class:"token keyword"}},[v._v("set")]),v._v(" A"),_("span",{pre:!0,attrs:{class:"token punctuation"}},[v._v(".")]),v._v("age "),_("span",{pre:!0,attrs:{class:"token operator"}},[v._v("=")]),v._v(" "),_("span",{pre:!0,attrs:{class:"token string"}},[v._v("'19'")]),v._v(" "),_("span",{pre:!0,attrs:{class:"token keyword"}},[v._v("where")]),v._v(" A"),_("span",{pre:!0,attrs:{class:"token punctuation"}},[v._v(".")]),v._v("name "),_("span",{pre:!0,attrs:{class:"token operator"}},[v._v("=")]),v._v(" "),_("span",{pre:!0,attrs:{class:"token string"}},[v._v("' 张三 '")]),_("span",{pre:!0,attrs:{class:"token punctuation"}},[v._v(";")]),v._v("\n")])]),v._v(" "),_("div",{staticClass:"line-numbers-wrapper"},[_("span",{staticClass:"line-number"},[v._v("1")]),_("br")])]),_("blockquote",[_("p",[v._v("执行流程")])]),v._v(" "),_("p",[v._v("其实这条语句也基本上会沿着上一个查询的流程走, 只不过执行更新的时候肯定要记录日志啦, 这就会引入日志模块了, "),_("code",[v._v("MySQL")]),v._v(" 自带的日志模块是 **"),_("code",[v._v("bin log")]),v._v(" (归档日志) ** , 所有的存储引擎都可以使用, 我们常用的 "),_("code",[v._v("InnoDB")]),v._v(" 引擎还自带了一个日志模块 **"),_("code",[v._v("redo log")]),v._v(" (重做日志) **, 我们就以 "),_("code",[v._v("InnoDB")]),v._v(" 模式下来探讨这个语句的执行流程. 流程如下 :")]),v._v(" "),_("ul",[_("li",[v._v("先查询到张三这一条数据, 如果有缓存, 也是会用到缓存")]),v._v(" "),_("li",[v._v("然后拿到查询的语句, 把 "),_("code",[v._v("age")]),v._v(" 改为 19, 然后调用引擎 "),_("code",[v._v("API")]),v._v(" 接口, 写入这一行数据, "),_("code",[v._v("InnoDB")]),v._v(" 引擎把数据保存在内存中, 同时记录 "),_("code",[v._v("redo log")]),v._v(", 此时 "),_("code",[v._v("redo log")]),v._v(" 进入 "),_("code",[v._v("prepare")]),v._v(" 状态, 然后告诉执行器, 执行完成了, 随时可以提交")]),v._v(" "),_("li",[v._v("执行器收到通知后记录 "),_("code",[v._v("bin log")]),v._v(", 然后调用引擎接口, 提交 "),_("code",[v._v("redo log")]),v._v(" 为提交状态")]),v._v(" "),_("li",[v._v("更新完成")])]),v._v(" "),_("blockquote",[_("p",[v._v("小贴士")])]),v._v(" "),_("p",[v._v("这是因为最开始 "),_("code",[v._v("MySQL")]),v._v(" 并没有 "),_("code",[v._v("InnoDB")]),v._v(" 引擎 ("),_("code",[v._v("InnoDB")]),v._v(" 引擎是其他公司以插件形式插入 "),_("code",[v._v("MySQL")]),v._v(" 的) , "),_("code",[v._v("MySQL")]),v._v(" 自带的引擎是 "),_("code",[v._v("MyISAM")]),v._v(", 但是我们知道 "),_("code",[v._v("redo log")]),v._v(" 是 "),_("code",[v._v("InnoDB")]),v._v(" 引擎特有的, 其他存储引擎都没有, 这就导致会没有 "),_("code",[v._v("crash-safe")]),v._v(" 的能力("),_("code",[v._v("crash-safe")]),v._v(" 的能力即使数据库发生异常重启, 之前提交的记录都不会丢失), "),_("code",[v._v("binlog")]),v._v(" 日志只能用来归档")]),v._v(" "),_("p",[v._v("并不是说只用一个日志模块不可以, 只是 "),_("code",[v._v("InnoDB")]),v._v(" 引擎就是通过 "),_("code",[v._v("redo log")]),v._v(" 来支持事务的. 那么, 又会有同学问, 我用两个日志模块, 但是不要这么复杂行不行, 为什么 "),_("code",[v._v("redo log")]),v._v(" 要引入 "),_("code",[v._v("prepare")]),v._v(" 预提交状态?这里我们用反证法来说明下为什么要这么做?")]),v._v(" "),_("ul",[_("li",[_("strong",[v._v("先写 "),_("code",[v._v("redo log")]),v._v(" 直接提交, 然后写 "),_("code",[v._v("bin log")])]),v._v(", 假设写完 "),_("code",[v._v("redo log")]),v._v(" 后, 机器挂了, "),_("code",[v._v("binlog")]),v._v(" 日志没有被写入, 那么机器重启后, 这台机器会通过 "),_("code",[v._v("redo log")]),v._v(" 恢复数据, 但是这个时候 "),_("code",[v._v("binlog")]),v._v(" 并没有记录该数据, 后续进行机器备份的时候, 就会丢失这一条数据, 同时主从同步也会丢失这一条数据")]),v._v(" "),_("li",[_("strong",[v._v("先写 "),_("code",[v._v("bin log")]),v._v(", 然后写 "),_("code",[v._v("redo log")])]),v._v(", 假设写完了 "),_("code",[v._v("bin log")]),v._v(", 机器异常重启了, 由于没有 "),_("code",[v._v("redo log")]),v._v(", 本机是无法恢复这一条记录的, 但是 "),_("code",[v._v("bin log")]),v._v(" 又有记录, 那么和上面同样的道理, 就会产生数据不一致的情况")])]),v._v(" "),_("p",[v._v("如果采用 "),_("code",[v._v("redo log")]),v._v(" 两阶段提交的方式就不一样了, 写完 "),_("code",[v._v("bin log")]),v._v(" 后, 然后再提交 "),_("code",[v._v("redo log")]),v._v(" 就会防止出现上述的问题, 从而保证了数据的一致性. 那么问题来了, 有没有一个极端的情况呢?假设 "),_("code",[v._v("redo log")]),v._v(" 处于预提交状态, "),_("code",[v._v("bin log")]),v._v(" 也已经写完了, 这个时候发生了异常重启会怎么样呢? 这个就要依赖于 "),_("code",[v._v("MySQL")]),v._v(" 的处理机制了, "),_("code",[v._v("MySQL")]),v._v(" 的处理过程如下 :")]),v._v(" "),_("ul",[_("li",[v._v("判断 "),_("code",[v._v("redo log")]),v._v(" 是否完整, 如果判断是完整的, 就立即提交")]),v._v(" "),_("li",[v._v("如果 "),_("code",[v._v("redo log")]),v._v(" 只是预提交但不是 "),_("code",[v._v("commit")]),v._v(" 状态, 这个时候就会去判断 "),_("code",[v._v("bin log")]),v._v(" 是否完整, 如果完整就提交 "),_("code",[v._v("redo log")]),v._v(", 不完整就回滚事务")])]),v._v(" "),_("p",[v._v("这样就解决了数据一致性的问题")]),v._v(" "),_("h3",{attrs:{id:"总结"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[v._v("#")]),v._v(" 总结")]),v._v(" "),_("ul",[_("li",[v._v("MySQL 主要分为 Server 层和引擎层, Server 层主要包括连接器、查询缓存、分析器、优化器、执行器, 同时还有一个日志模块 (binlog) , 这个日志模块所有执行引擎都可以共用, redolog 只有 InnoDB 有")]),v._v(" "),_("li",[v._v("引擎层是插件式的, 目前主要包括, MyISAM,InnoDB,Memory 等")]),v._v(" "),_("li",[v._v("查询语句的执行流程如下 : 权限校验 (如果命中缓存) ---\x3e 查询缓存 ---\x3e 分析器 ---\x3e 优化器 ---\x3e 权限校验 ---\x3e 执行器 ---\x3e 引擎")]),v._v(" "),_("li",[v._v("更新语句执行流程如下 : 分析器 ----\x3e 权限校验 ----\x3e 执行器 ---\x3e 引擎 ---\x3e redo log (prepare 状态) ---\x3e binlog ---\x3e redo log (commit状态)")])])])}),[],!1,null,null,null);_.default=o.exports}}]);