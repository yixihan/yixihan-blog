---
title: MySQL - MVCC
date: 2022-10-30T17:55:28+08:00
sidebar: 'auto'
categories:
- 面经
- MySQL
tags:
- MySQL
- 面经
- MVCC
---

# MySQL - MVCC

## 一致性非锁定读和锁定读

### 一致性非锁定读

对于 [一致性非锁定读 (Consistent Nonlocking Reads)](https://dev.mysql.com/doc/refman/5.7/en/innodb-consistent-read.html) 的实现, 通常做法是加一个 **版本号** 或者 **时间戳** 字段, 在更新数据的同时更新版本号或者时间戳. 查询时, 将当前可见的版本号与对应记录的版本号进行对比, 如果记录的版本号小于可见版本号, 则表示该记录可见

在 `InnoDB` 存储引擎中, [多版本控制 (multi versioning)](https://dev.mysql.com/doc/refman/5.7/en/innodb-multi-versioning.html) 就是对非锁定读的实现. 如果读取的行正在执行 `DELETE` 或 `UPDATE` 操作, 这时读取操作不会去等待行上锁的释放. 相反的, `InnoDB` 存储引擎会去读取行的一个快照数据, 对于这种读取历史数据的方式, 称之为 **快照读 (snapshot read)**

在可重复读 ( `Repeatable Read`) 和读已提交 (`Read Commit`) 两个隔离级别下, 如果执行普通的 `SELECT` 语句 (不包括 `select .... lock in share mode`, `select ... for update`) 则会使用 **一致性非锁定读 (MVCC)**. 并且在 **可重复读 (`Repeatable Read`) 下 `MVCC` 实现了可重复读和防止部分幻读**  



### 锁定读

如果执行的是下列语句, 就是 [锁定读 (Locking Reads)](https://dev.mysql.com/doc/refman/5.7/en/innodb-locking-reads.html)

-   `select ... lock in share mode`
-   `select ... for update`
-   `insert`, `update`, `delete` 操作

在锁定读下, 读取的是数据的最新版本, 这种读也被称为 **当前读 (current read)**. 锁定读会对读取到的记录加锁 :

-   `select ... lock in share mode` : 对记录加 `S` 锁, 其他事务也可以加 `S` 锁, 如果加 `X` 锁则会被阻塞
-   `select ... for update`, `insert`, `update`, `delete` : 对记录加 `X` 锁, 且其他事务不能加任何锁

在一致性非锁定读下, 即使读取的记录已经被其他事务加上 `X` 锁, 这时记录也是可以被读取的, 即读取的是快照数据.

在可重复读 (`Repeatable Read`) 下 `MVCC` 防止了部分幻读, 这里的"部分"是指在 **一致性非锁定读** 的情况下, 只能读取到第一次查询之前所插入的数据 (根据 `Read View` 判断数据可见性, `Read View` 在第一次查询时生成). 

但是, 如果是 **当前读**, 每次读取的都是最新数据, 这时如果两次查询中间有其他事务插入数据, 就会产生幻读. 

所以, **`InnoDB` 在实现可重复读 (`Repeatable Read`) 时, 如果执行的是==当前读==, 则会对读取的记录使用 `Next-key lock`, 来防止其他事务在间隙间插入数据**



## InnoDB 对 MVCC 的实现

`MVCC` 的实现依赖于 : 

-   **隐藏字段**
-   **`Read View`**
-   **`undo log`**

在内部实现中, `InnoDB` 通过数据行的 `DB_TRX_ID` 和 `Read View` 来判断数据的可见性. 

如果数据不可见, 则通过数据行的 `DB_ROLL_PTR` 找到 `undo log` 中的历史版本. 每个事务读到的数据版本可能是不一样的, **在同一个事务中, 用户只能看到该事务创建 `Read View` 之前已经提交的修改和改事务本身做的修改**



### 隐藏字段

在内部, `InnoDB` 存储引擎为每行数据添加了三个 [隐藏字段](https://dev.mysql.com/doc/refman/5.7/en/innodb-multi-versioning.html) :

-   `DB_TRX_ID` (6 字节) : **表示最后一次插入或更新该行的事务 ID**. 此外, `delete` 操作在内部被视为更新, 只不过会在记录头 `Record header` 中的 `deleted_flag` 字段将其标记为已删除
-   `DB_ROLL_PTR` (7 字节) : **回滚指针**, 指向该行的 `undo log`. 如果该行未被更新, 则为空
-   `DB_ROW_ID` (6 字节) : 如果没有设置主键且该表没有唯一非空索引时, `InnoDB` 会使用该 id 来生成聚集索引



### Read View

>   用途

[Read View](https://github.com/facebook/mysql-8.0/blob/8.0/storage/innobase/include/read0types.h#L298) 主要是用来做 **可见性判断**, 里面保存了 "当前对本事务不可见的其他活跃事务"



>   字段

```c++
class ReadView {
  /* ... */
private
  trx_id_t m_low_limit_id;      /* 大于等于这个 ID 的事务均不可见 */

  trx_id_t m_up_limit_id;       /* 小于这个 ID 的事务均可见 */

  trx_id_t m_creator_trx_id;    /* 创建该 Read View 的事务ID */

  trx_id_t m_low_limit_no;      /* 事务 Number, 小于该 Number 的 Undo Logs 均可以被 Purge */

  ids_t m_ids;                  /* 创建 Read View 时的活跃事务列表 */

  m_closed;                     /* 标记 Read View 是否 close */
}
```



`Read View` 主要有以下字段 :

-   `m_low_limit_id` : 目前出现过的最大的事务 ID + 1, 即 **下一个即将被分配的事务 ID, 大于等于这个 ID 的数据版本均不可见**
-   `m_up_limit_id` : 活跃事务列表 `m_ids` 中最小的事务 ID, 如果 `m_ids` 为空, 则 `m_up_limit_id` 为 `m_low_limit_id`. **小于这个 ID 的事务版本均可见**
-   `m_ids` : `Read View` 创建时其他未提交的活跃事务 ID 列表. 创建 `Read View` 时, 将当前未提交事务 ID 记录下来, 后续即使它们修改了记录行的值, 对于当前事务也是不可见的. `m_ids` 不包括当前事务自己和已提交的事务 (正在内存中)
-   `m_creator_trx_id` : 创建该 `Read View` 的事务 ID



>   事务可见性示意图

![trans_visible](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/trans_visible.jpg)



### undo log

>   作用

`undo log` 主要有两个作用 : 

-   当事务回滚时用于将数据恢复到修改前的样子

-   同 隐藏字段, `Read View` 共同实现 `MVCC`

    当读取记录时, 若该记录被其他事务占用或当前版本对该事务不可见, 则可以通过 `undo log` 读取之前的版本数据, 以此实现非锁定读



>   类型

在 `InnoDB` 存储引擎中, `undo log` 分为两种 :

-   `insert undo log` 
-   `update undo log`



#### insert undo log

`insert undo log` 指在 `insert` 操作中产生的 `undo log`

因为 `insert` 操作的记录只对事务本身可见, 对其他事务不可见, 故该 `undo log` 可以在事务提交后直接删除. 不需要进行 `purge` 操作



##### 原理

>   `insert` 时的数据初始状态

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/317e91e1-1ee1-42ad-9412-9098d5c6a9ad.png)



#### update undo log

`update undo log` 是指在 `update` 或 `delete` 操作中产生的 `undo log`

该 `undo log` 可能需要提供 `MVCC` 机制, 因此不能在事务提交时就进行删除. 提交时放入 `undo log` 链表, 等待 `purge` 线程进行最后的删除



##### 原理

>   数据第一次被修改时

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/c52ff79f-10e6-46cb-b5d4-3c9cbcc1934a.png)



>   数据第二次被修改时

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/6a276e7a-b0da-4c7b-bdf7-c0c7b7b3b31c.png)



不同事务或者相同事务的对同一记录行的修改, 会使该记录行的 `undo log` 称为一条链表, 链首就是最新的记录, 链尾就是最早的旧记录

 

### 数据可见性算法

在 `InnoDB` 存储引擎中, 创建一个新事务后, 执行每个 `select` 语句前, 都会创建一个快照 (`Read View`), **快照中保存了当前数据库系统中正处于活跃 (没有 `commit`) 的事务的 ID 号**. 其实简单的说保存的是系统中当前不应该被本事务看到的其他事务 ID 列表 (即 `m_ids`). 

当用户在这个事务中尧都区某个记录行的时候, `InnoDB` 存储引擎会将该记录行的 `DB_TRX_ID` 与 `Read View` 中的一些变量及当前事务 ID 进行比较, 判断是否满足可见性条件



#### 算法实现

>   算法原址 (github)

[算法原址](https://github.com/facebook/mysql-8.0/blob/8.0/storage/innobase/include/read0types.h#L161)



>   图示

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/8778836b-34a8-480b-b8c7-654fe207a8c2.png)



#### 算法原理

1.   如果记录 `DB_TRX_ID` < `m_up_limit_id`, 那么表明最新修改该行的事务 (`DB_TRX_ID`) 在当前事务创建快照之前就提交了, 所以该记录行的值对当前事务是可见的

2.   如果 `DB_TRX_ID` >= `m_low_limit_id`, 那么表明最新修改该行的事务 (`DB_TRX_ID`) 在当前事务创建快照之后才进行修改, 所以该记录行的值对当前事务不可见. 跳到步骤 5

3.   `m_ids` 为空, 则表明在当前事务创建快照之前, 修改该行的事务就已经提交了, 所以该记录行的值对当前事务是可见的

4.   如果 `m_up_limit_id` <= `DB_TRX_ID` < `m_low_limit_id`, 表明最新修改该行的事务 (`DB_TRX_ID`) 在当前事务创建快照的时候可能处于 "活动状态" 或者 "已提交状态". 所以就要对活跃事务列表 `m_ids` 进行查找 (因为事务 ID 是有序的, 所以使用二分查找)

     1.   如果在活跃事务列表 `m_ids` 中能找到 `DB_TRX_ID`, 表名 :

          1.   在当前事务创建快照前, 该记录行的值被事务 ID 为 `DB_TRX_ID` 的事务修改了, 但没有提交

          2.   在当前事务创建快照后, 该记录行的值被事务 ID 为 `DB_TRX_ID` 的时候修改了

               这些情况下, 这个记录行的值对于当前事务都是不可见的. 跳到步骤 5

     2.   在活跃事务列表中找不到, 则表明 "ID 为 `DB_TRX_ID` 的事务" 在修改 "该记录行的值" 后, 在 "当前事务" 创建快照之前就已经提交了, 所以记录行对当前事务可见

5.   在改记录行的 `DB_ROLL_PTR` 指针指向的 `undo log` 取出快照记录, 用快照记录的 `DB_TRX_ID` 跳到步骤 1 重新开始判断, 直到找到满足的快照版本或者返回空



## RC 和 RR 隔离级别下 MVCC 的差异

在事务隔离级别为 读已提交 (`Read Commit`) 和 可重复读 (`Repeatable Read`) 下, `InnoDB` 存储引擎使用 `MVCC` (非锁定一致性读), 但它们生成 `Read View` 的时机不同

-   在 `RC` 隔离级别下, **每次 `select` 查询前都生成一个 `Read View` (m_ids 列表)**
-   在 `RR` 隔离级别下, 只有事务创建后, **第一次 `select` 数据前生成一个 `Read View` (m_ids 列表)**



## MVCC 解决不可重复读问题

虽然 `RC` 和 `RR` 都通过 `MVCC` 来读取快照数据, 但由于 **生成 `Read VIew` 时机不同**, 从而在 `RR` 级别下实现可重复读



>   例子

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/6fb2b9a1-5f14-4dec-a797-e4cf388ed413.png)



### 在 RC 下 Read View 生成情况

**在读已提交级别下，事务在每次查询开始时都会生成并设置新的 `Read View`, (`m_ids` 列表)**



>   T4 时间点, 数据行 ID = 1 的版本链

![img](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/a3fd1ec6-8f37-42fa-b090-7446d488fd04.png)



由于 `RC` 级别下每次查询都会生成 `Read View`, 这时事务 101, 102 并未提交

此时 **103 事务生成的 `Read View` 中活跃的事务 `m_ids` 为 [101, 102], `m_up_limit_id` 为 101, `m_low_limit_id` 为 104, `m_creator_trx_id` 为 103 **

-   此时最新记录的 `DB_TRX_ID` 为 101, `m_up_limit_id` <= 101 < `m_low_limit_id`, 所以要在 `m_ids` 列表中查找, 发现 `DB_TRX_ID` 存在列表中, 那么这个记录不可见
-   根据 `DB_ROLL_PTR` 找到 `undo log` 的上一版记录, 上一条记录的 `DB_TRX_ID` 还是 101, 不可见
-   继续找上一条 `DB_TRX_ID` 为 1, 满足 1 < `m_up_limit_id`, 可见, 所以事务 103 在 T4 时间点查询到数据为 `name = 菜花`



>   T6 时间点, 数据行 ID = 1 的版本链

![markdown](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/528559e9-dae8-4d14-b78d-a5b657c88391.png)



由于 `RC` 级别下每次查询都会生成 `Read View`, 这时事务 101 已经提交, 事务 102 并未提交

此时 **103 事务生成的 `Read VIew` 中活跃的事务 `m_ids` 为 [102], `m_up_limit_id` 为 102, `m_low_limit_id` 为 104, `m_creator_rtx_id` 为 103**

-   此时最新记录中 `DB_TRX_ID` 为 102, `m_up_limit_id` <= 102 < `m_low_limit_id`, 所以要在 `m_ids` 列表中查找, 发现 `DB_TRX_ID` 存在列表中, 那么这个记录不可见
-   根据 `DB_ROLL_PTR` 找到 `undo log` 中的上一版本记录, 上一条记录的 `DB_TRX_ID` 为 101, 满足 101 < `m_up_limit_id`, 记录可见, 所以事务 103 在 T6 时间点查询到数据为 `name = 李四`, 与 T4 事件单查询到的结果不一致, **不可重复读**



>   T9 时间点, 数据行 ID = 1 的版本链

![markdown](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/6f82703c-36a1-4458-90fe-d7f4edbac71a.png)



由于 `RC` 级别下每次查询都会生成 `Read View`, 这时事务 101, 102已经提交

此时 **103 事务生成的 `Read View` 中活跃的事务 `m_ids` 为 [], `m_up_limit_id` 为 104, `m_low_limit_id` 为 104, `m_creator_trx_id` 为 103, **

-   此时最新记录中 `DB_TRX_ID` 为 102, 满足 102 < `m_up_limit_id`, 可见, 所以事务 103 在 T9 时间点查询到数据为 `name = 赵六`, 与 T6 事件单查询到的结果不一致, **不可重复读**



#### 总结

在 `RC` 隔离级别下, 事务在每次查询开始时都会生成并设置新的 `Read View`, 所以导致不可重复读



### 在 RR 下 Read View 生成情况

**在可重复读级别下, 只会在事务开始后第一次读取数据时生成一个 `Read View` (`m_ids` 列表)**



>   T4 时间点, 数据行 ID = 1 的版本链

![markdown](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/0e906b95-c916-4f30-beda-9cb3e49746bf.png)



在当前执行 `select` 语句时生成一个 `Read View`

**`m_ids` 为 [101, 102], `m_up_limit_id` 为 101, `m_low_limit_id` 为 104, `m_creator_trx_id` 为 103**

此时和 `RC` 级别下一样 : 

-   最新记录的 `DB_TRX_ID` 为 101, `m_up_limit_id` <= 101 < `m_low_limit_id`, 所以要在 `m_ids` 列表中查找, 发现 `DB_TRX_ID` 存在列表中, 那么这个记录不可见
-   根据 `DB_ROLL_PTR` 找到 `undo log` 的上一版记录, 上一条记录的 `DB_TRX_ID` 还是 101, 不可见
-   继续找上一条 `DB_TRX_ID` 为 1, 满足 1 < `m_up_limit_id`, 可见, 所以事务 103 在 T4 时间点查询到数据为 `name = 菜花`



>   T6 时间点, 数据行 ID = 1 的版本链

![markdown](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/79ed6142-7664-4e0b-9023-cf546586aa39.png)



在 `RR` 级别下只会生成一次 `Read View`, 所以此时依然沿用 T4 时间点的 `Read View`

**`m_ids` 为 [101, 102], `m_up_limit_id` 为 101, `m_low_limit_id` 为 104, `m_creator_trx_id` 为 103**

-   最新记录的 `DB_TRX_ID` 为 102, `m_up_limit_id` <= 102 < `m_low_limit_id`, 所以要在 `m_ids` 列表中查找, 发现 `DB_TRX_ID` 存在列表中, 那么这个记录不可见
-   根据 `DB_ROLL_PTR` 找到 `undo log` 的上一版记录, 上一条记录的 `DB_TRX_ID` 是 101, `m_up_limit_id` <= 102 < `m_low_limit_id`, 所以要在 `m_ids` 列表中查找, 发现 `DB_TRX_ID` 存在列表中, 不可见
-   根据 `DB_ROLL_PTR` 找到 `undo log` 的上一版记录, 上一条记录的 `DB_TRX_ID` 还是 101, 不可见
-   继续找上一条 `DB_TRX_ID` 为 1, 满足 1 < `m_up_limit_id`, 可见, 所以事务 103 在 T4 时间点查询到数据为 `name = 菜花`



>   T9 时间点, 数据行 ID = 1 的版本链

在 `RR` 级别下只会生成一次 `Read View`, 所以此时依然沿用 T4 时间点的 `Read View`

**`m_ids` 为 [101, 102], `m_up_limit_id` 为 101, `m_low_limit_id` 为 104, `m_creator_trx_id` 为 103**

此时情况和 T6 完全一样, 所以查询结果还是 `name = 菜花`



#### 总结

在 `RR` 隔离级别下, 只会在事务开始后第一次读取数据时生成一个 `Read View`, 所以是可重复读的



## MVCC + Next-key-Lock 防止幻读

`InnoDB` 存储引擎在 `RR` 级别下通过 `MVCC` + `Next-key-Lock` 来解决幻读问题

解决方法主要分为两个方面 : 

-   执行普通 `select`, 此时会以 `MVCC` 快照读的方式读取数据

    在快照读的情况下, `RR` 隔离级别只会在事务开启后的第一次查询生成 `Read View`, 并使用至事务提交.

    所以在生成 `Read View` 之后其他事务所做的更新, 插入记录版本对当前事务并不可见, 实现了可重复读和防止快照读下的 "幻读"

-   执行 `select ... for update / lock in share mode`, `insert`, `update`, `delete` 等当前读

    在当前读下, 读取的都是最新的数据, 如果其他事务有插入新的记录, 并且刚好在当前事务的查询范围内, 就会产生幻读.

    `InnoDB` 存储引擎使用 [Next-key-Lock](https://dev.mysql.com/doc/refman/5.7/en/innodb-locking.html#innodb-next-key-locks) 来防止这种情况. 当执行当前读时, 会锁定读取到的记录的同时, 锁定它们的间隙, 防止其他事务在查询范围内插入数据. 只要我不让你插入, 就不会产生幻读

