---
title: MySQL - 日志
date: 2022-10-30T17:55:28+08:00
sidebar: 'auto'
categories:
- 面经
- MySQL
tags:
- MySQL
- 面经
---
---

# MySQL - 日志



`MySQL` 日志主要包含 ==错误日志==, ==查询日志==, ==慢查询日志==, ==事务日志==, ==二进制日志== 几大类.

其中比较重要的为这三大日志

-   **二进制日志  ==bin log== (归档日志)**
-   **事务日志 ==redo log== (重做日志)**
-   **回滚日志 ==undo log== **



>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/01.png)



## redo log

### 简介

`redo log` 是 **物理日志**, 记录内容是 "在某个数据页上做了什么修改", 属于 `InnoDB` 存储引擎

`redo log` (重做日志) 是 `InnoDB` 存储引擎独有的, 它让 `MySQL` 拥有了崩溃恢复的能力

比如 `MySQL` 实例挂了或宕机了, 重启时, `InnoDB` 存储引擎会使用 `redo log` 恢复数据, 保证数据的 **持久性** 与 **完整性**



>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/02.png)



### 原理

`MySQL` 中数据是以页为单位, 你查询一条记录, 会从硬盘把一页的数据加载出来, 加载出来的数据叫数据页, 会放入到 `Buffer Pool` 中

后续的查询都是先从 `Buffer Pool` 中找, 没有命中再去硬盘加载, 减少硬盘 `IO` 开销, 提升性能。

更新表数据的时候, 也是如此, 发现 `Buffer Pool` 里存在要更新的数据, 就直接在 `Buffer Pool` 里更新。

**然后会把"在某个数据页上做了什么修改"记录到重做日志缓存（`redo log buffer`）里, 接着刷盘到 `redo log` 文件里**



>   图示

![image-20220708141703421](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/image-20220708141703421.png)

理想情况下, 事务一提交就会进行刷盘操作, 但实际上, 刷盘的时机是根据策略来进行的



>   redo log 组成

每条 redo 记录由**"表空间号 + 数据页号 + 偏移量 + 修改数据长度 + 具体修改的数据"**组成



### 刷盘时机

`InnoDB` 存储引擎为 `redp log` 的刷盘策略提供了 `innodb_flush_log_at_trx_commit` 参数, 它支持三种策略 :

-   0 : 设置为 0 的时候, 表示 **每次事务提交时不进行刷盘操作**
-   1: 设置为 1 的时候, 表示 **每次事务提交时都将进行刷盘操作** (默认值)
-   2 : 设置为 2 的时候, 表示 **每次事务提交时都只把 `redo log buffer` 内容写入 `page cache`**

`innodb_flush_log_at_trx_commit` 参数默认值为 1, 也就是说当事务提交时会调用 `fsync` 对 `redo log` 进行刷盘

另外, `InnoDB` 存储引擎有一个后台线程, 每隔 1 秒, 就会把 `redo log buffer` 中的内容写到 文件系统缓存 `page cache`, 然后调用 `fsync` 刷盘



>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/04.png)

也就是说, 一个没有提交事务的 `redo log` 记录, 也可能会刷盘

因为在事务执行过程 `redo log` 记录是会写入`redo log buffer` 中, 这些 `redo log` 记录会被后台线程刷盘。

除了后台线程每秒 1 次的轮询操作, 还有一种情况, 当 `redo log buffer` 占用的空间即将达到 `innodb_log_buffer_size` 一半的时候, 后台线程会主动刷盘



>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/05.png)

#### innodb_flush_log_at_trx_commit = 0

>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/06.png)

为 0 时，如果 `MySQL` 挂了或宕机可能会有 1 秒数据的丢失



#### innodb_flush_log_at_trx_commit = 1

>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/07.png)

为 1 时, 只要事务提交成功, `redo log` 记录就一定会在硬盘里, 不会有任何数据丢失

如果事务执行期间 `MySQL` 挂了或宕机了, 这部分日记丢了, 但是事务并没有提交, 所以日志丢了也不会有数据丢失



####  innodb_flush_log_at_trx_commit = 2

>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/09.png)

为 2 时, 只要事务提交成功, `redo log buffer` 中的内容只会写入文件系统缓存 `page cache`

如果仅仅只是 `MySQL` 挂了不会有任何数据丢失, 但是宕机可能会有 1 秒数据的丢失



### 日志文件组

#### 简介

硬盘上存储的 `redo log` 日志文件不止一个, 而是以一个 **日志文件组** 的形式出现的, 每个的 `redo` 日志文件大小都是一样的

比如可以配置为一组 4 个文件, 每个文件的大小都是 `1GB`, 整个 `redo log` 日志文件可以记录 `4GB` 的内容



#### 原理

它采用的 **环形数组** 形式, 从头开始写, 写到末尾又回到头循环写



>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/10.png)



在 **日志文件组** 中还有两个重要的属性, 为

-   `write pos` : 当前记录的位置, 一边写一边后移
-   `checkpoint` : 当前要擦除的位置, 一边擦一边后移

每次刷盘 `redo log` 记录到 **日志文件组** 中, `write pos` 位置就会向后移更新

每次 `MySQL` 加载 `日志文件组` 恢复数据时, 会清空加载过的 `redo log` 记录, 并把 `checkpoint` 后移更新

`write pos` 和 `checkpoint` 之间还空着的部分可以用来写入新的 `redo log` 记录



>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/11.png)



如果 `write pos` 追上 `checkpoint`, 表示 **日志文件组** 满了, 这时候不能再写入新的 `redo log` 记录, `MySQL` 得停下来. 清空一些记录, 把 `checkpoint` 推进一下



>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/12.png)



### redo log 总结

>   redo log 意义

数据页大小是 `16KB`, 刷盘比较耗时, 可能就修改了数据页里的几 `Byte` 数据, 没有必要把完整的数据页刷盘

而且数据页刷盘是随机写, 因为一个数据页对应的位置可能在硬盘文件的随机位置, 所以性能是很差

如果是写 `redo log`, 一行记录可能就占几十 `Byte`, 只包含表空间号、数据页号、磁盘文件偏移量、更新值, 再加上是顺序写, 所以刷盘速度很快

所以用 `redo log` 形式记录修改内容, 性能会远远超过刷数据页的方式, 这也让数据库的并发能力更强



## bin log

### 简介

`bin log` 是 **逻辑日志**, 记录内容是语句的原始逻辑, 类似于 "给 ID = 2 这一行的 c 字段加 1", 属于 `MySQL Server` 层

不管是什么存储引擎, 只要发生了表数据更新, 都会产生 `bin log` 日志



### 用途

>   一句话概述

**保证数据的一致性**

`MySQL` 数据库的 **数据备份**, **主备**, **主主**, **主从** 都离不开 `bin log`, 需要依靠 `bin log` 来同步数据, **保证数据的一致性**



>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/01-20220305234724956.png)



`bin log` 会记录所有涉及更新数据的逻辑操作, 并且是顺序写



### 记录格式

`bin log` 日志有三种格式, 可以通过 `binlog_format` 参数指定

-   **statement**
-   **row**
-   **mixed**



#### statement

指定为 `statement`, 记录的内容是 `SQL` 语句原文

比如执行一条

```sql
update T
set update_time = now()
where id = 1;
```

记录的内容如下所示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/02-20220305234738688.png)

同步数据时, 会执行记录的 `SQL` 语句



>   缺点

**但是有个问题 : `update_time = now()` 这里会获取当前系统时间, 直接执行会导致与原库的数据不一致**

为了解决这个问题, 就需要指定为 `row`



#### row

指定为 `row`, 记录的内容就不再是简单的 `SQL` 语句了, **还包含操作的具体数据**

记录的内容如下图所示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/03-20220305234742460.png)

>   小贴士

`row` 格式记录的内容看不到详细信息, 要通过 `mysqlbinlog` 工具解析出来



>   图解

`update_time = now()` 变成了具体的时间 `update_time = 1627112756247`, 条件后面的 `@1 @2 @3` 都是该数据第 1 个 ~ 3 个字段的原始值

这样的就能保证同步数据的一致性, 通常情况下都是指定为 `row`, 这样可以为数据库的恢复与同步带来更好的可靠性



>   缺点

-   这样的格式, 需要更大的容量来记录, 比较占用空间

-   恢复与同步时会更消耗 `IO` 资源, 影响执行速度



#### mixed

指定为 `mixed`, 记录的内容具具体情况决定采用 `row` 还是 `statement` 格式写入

`MySQL` 判断这条 `SQL` 语句是否可能会引起数据不一致, 如果是, 就用 `row` 格式, 否则就用 `statement` 格式



### 写入机制

事务执行过程中, 先把日志写到 `bin log cache`, 事务提交的时候, 再把 `bin log cache` 写到 `bin log` 文件中

因为一个事务的 `bin log` 不能被拆开, 无论这个事务多大, 也要确保一次性写入, 所以系统会被每个线程分配一个块内存作为 `bin log cache`

可以通过 `binlog_cache_size` 参数控制单个线程 `bin log cache` 大小, 如果存储内容超过了这个参数, 就要暂存到磁盘 (`Swap`)



>   刷盘流程图示

![](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/04-20220305234747840.png)



>   图解

-   **上图的 `write`, 是指把日志写入到文件系统缓存 `page cache`, 并没有把数据持久化到磁盘, 所以速度比较快**
-   **上图的 `fsync`, 才是将数据持久化到磁盘的操作**

`write` 和 `fsync` 的时机, 可以由参数 `sync_binlog` 控制, 默认为 0



#### sync_binlog = 0

当参数指定为 0 的时候, 表示 **每次提交都只 `write`, 由系统自行判断什么时候执行 `fsync`**



>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/05-20220305234754405.png)



>   优点

-   性能比较高



>   缺点

-   如果 `MySQL` 宕机, `page cache` 里面的 `bin log` 会丢失



#### sync_binlog = 1

当参数指定为 1 的时候, 表示 **每次提交都会执行 `write` 和 `fsync`**, 就如同 `redo log` 日志刷盘一样



#### sync_binlog = N (N > 1)

当参数指定为 N (N > 1) 时, 表示 **每次提交事务都 `write`, 但累计 N 个事物后才 `fsync`**



>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/06-20220305234801592.png)



>   用途

在出现 `IO` 瓶颈的场景里, 将 `sync_binlog` 设置成一个比较大的值, 可以提升性能

同样的, 如果 `MySQL` 宕机, 会丢失最近 N 个事物的 `bin log` 日志



## 两阶段提交

`redo log` 让 `InnoDB` 存储引擎拥有了崩溃恢复能力

`bin log` 保证了 `MySQL` 集群架构的数据一致性

虽然两者都属于持久化的保证, 但是侧重点不同

在执行更新语句过程, 会记录 `redo log` 与 `bin log` 两块日志, 以基本的事务为单位, `redo log`  在事务执行过程中key不断写入, 而 `bin log` 只有在事务提交时才写入, 所以 `redo log` 与 `bin log` 的写入时机不一样



>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/01-20220305234816065.png)



>   `redo log` 和 `bin log` 两份日志之间逻辑不一致, 会出现什么问题 ?

我们以 `update` 语句为例, 假设 `id = 2` 的记录, 字段 `c` 值是 0, 把字段 `c` 值更新成 1, `SQL` 语句为 `update T set c = 1 where id = 2` 

假设执行过程中写完 `redo log` 日志后, `bin log` 日志写入期间发送了异常, 会出现什么情况呢?

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/02-20220305234828662.png)

由于 `binlog` 没写完就异常, 这时候 `binlog` 里面没有对应的修改记录. 因此, 之后用 `binlog` 日志恢复数据时, 就会少这一次更新, 恢复出来的这一行 `c` 值是 0, 而原库因为 `redo log` 日志恢复, 这一行 `c` 值是 1, 最终数据不一致

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/03-20220305235104445.png)

为了解决两份日志之间的逻辑一致问题, `InnoDB` 存储引擎使用 **两阶段提交** 方案

原理很简单, 将 `redo log` 的写入拆成了两个步骤 `prepare` 和 `commit` , 这就是**两阶段提交**

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/04-20220305234956774.png)

使用 **两阶段提交** 后, 写入 `binlog` 时发生异常也不会有影响, 因为 `MySQL` 根据 `redo log` 日志恢复数据时, 发现 `redo log` 还处于 `prepare` 阶段, 并且没有对应 `binlog` 日志, 就会回滚该事务

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/05-20220305234937243.png)

再看一个场景, `redo log` 设置 `commit` 阶段发生异常, 那会不会回滚事务呢?

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/06-20220305234907651.png)

并不会回滚事务, 它会执行上图框住的逻辑, 虽然 `redo log` 是处于 `prepare` 阶段，但是能通过事务 `id` 找到对应的 `binlog` 日志, 所以 `MySQL` 认为是完整的, 就会提交事务恢复数据



## undo log

我们知道如果想要保证事务的 **原子性**, 就需要在异常发生时, 对已经执行的操作进行**回滚**, 在 MySQL 中, 恢复机制是通过 **回滚日志 (undo log)** 实现的, 所有事务进行的修改都会先记录到这个回滚日志中, 然后再执行相关的操作. 如果执行过程中遇到异常的话, 我们直接利用 **回滚日志** 中的信息将数据回滚到修改之前的样子即可. 并且, 回滚日志会先于数据持久化到磁盘上. 这样就保证了即使遇到数据库突然宕机等情况, 当用户再次启动数据库的时候, 数据库还能够通过查询回滚日志来回滚将之前未完成的事务

另外, `MVCC` 的实现依赖于：**隐藏字段、Read View、undo log**. 在内部实现中, `InnoDB` 通过数据行的 `DB_TRX_ID` 和 `Read View` 来判断数据的可见性, 如不可见, 则通过数据行的 `DB_ROLL_PTR` 找到 `undo log` 中的历史版本. 每个事务读到的数据版本可能是不一样的, 在同一个事务中, 用户只能看到该事务创建 `Read View` 之前已经提交的修改和该事务本身做的修改



### 用途

**保证数据的原子性**



## 总结

`MySQL InnoDB` 存储引擎**使用 `redo log (重做日志)` 保证事务的持久性**, 使用  **`undo log (回滚日志)` 保证事务的原子性**

`MySQL` 数据库的 **数据备份, 主备, 主主, 主从** 都离不开 `bin log`, 需要依靠 `bin log` 来同步数据, **保证数据的一致性**
