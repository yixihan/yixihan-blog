(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{444:function(_,v,t){"use strict";t.r(v);var r=t(2),s=Object(r.a)({},(function(){var _=this,v=_._self._c;return v("ContentSlotsDistributor",{attrs:{"slot-key":_.$parent.slotKey}},[v("h1",{attrs:{id:"操作系统面经"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#操作系统面经"}},[_._v("#")]),_._v(" 操作系统面经")]),_._v(" "),v("h2",{attrs:{id:"操作系统简介"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#操作系统简介"}},[_._v("#")]),_._v(" 操作系统简介")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("操作系统 ("),v("code",[_._v("Operation System")]),_._v(", "),v("code",[_._v("OS")]),_._v(") 是管理计算机硬件与软件资源的程序, 是计算机的基石")])]),_._v(" "),v("li",[v("strong",[_._v("操作系统本质上是一个运行在计算机上的软件程序, 用于管理计算机硬件和软件资源")])]),_._v(" "),v("li",[v("strong",[_._v("操作系统存在屏蔽了硬件层的复杂性")])]),_._v(" "),v("li",[v("strong",[_._v("操作系统的内核 ("),v("code",[_._v("Kernel")]),_._v(") 是操作系统的核心部分, 它负责系统的内存管理, 硬件设备的管理, 文件系统的管理以及应用程序的管理")])])]),_._v(" "),v("blockquote",[v("p",[_._v("图示")])]),_._v(" "),v("p",[v("img",{attrs:{src:"https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202208111335040.png",alt:"Kernel_Layout"}})]),_._v(" "),v("h2",{attrs:{id:"系统调用"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#系统调用"}},[_._v("#")]),_._v(" 系统调用")]),_._v(" "),v("h3",{attrs:{id:"用户态与系统态"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#用户态与系统态"}},[_._v("#")]),_._v(" 用户态与系统态")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("用户态 ("),v("code",[_._v("user mode")]),_._v(")")]),_._v(" : 用户态运行的进程可以直接读取用户程序的数据")]),_._v(" "),v("li",[v("strong",[_._v("系统态 ("),v("code",[_._v("Kernel mode")]),_._v(")")]),_._v(" : 系统态运行的进程或程序几乎可以访问计算机的任何资源, 不受限制")])]),_._v(" "),v("h3",{attrs:{id:"系统调用简介"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#系统调用简介"}},[_._v("#")]),_._v(" 系统调用简介")]),_._v(" "),v("p",[_._v("电脑运行的程序基本都是运行在用户态, 如果该程序需要调用操作系统提供的系统态级别的子功能就需要系统调用")]),_._v(" "),v("p",[_._v("也就是说在我们运行的用户程序中, 凡是与系统态级别的资源有关的操作 (如文件管理、进程控制、内存管理等), 都必须通过系统调用方式向操作系统提出服务请求, 并由操作系统代为完成")]),_._v(" "),v("h3",{attrs:{id:"系统调用功能分类"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#系统调用功能分类"}},[_._v("#")]),_._v(" 系统调用功能分类")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("设备管理")]),_._v(" : 完成设备的请求或释放, 以及设备启动等功能")]),_._v(" "),v("li",[v("strong",[_._v("文件管理")]),_._v(" : 完成文件的读, 写, 创建以及删除等功能")]),_._v(" "),v("li",[v("strong",[_._v("进程管理")]),_._v(" : 完成进程的创建, 撤销, 阻塞以及唤醒等功能")]),_._v(" "),v("li",[v("strong",[_._v("进程通信")]),_._v(" : 完成进程之间的消息传递或者信号传递等功能")]),_._v(" "),v("li",[v("strong",[_._v("内存管理")]),_._v(" : 完成内存的分配, 回收以及获取作业占用内存区大小及地址等功能")])]),_._v(" "),v("h2",{attrs:{id:"进程与线程"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#进程与线程"}},[_._v("#")]),_._v(" 进程与线程")]),_._v(" "),v("h3",{attrs:{id:"进程简介"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#进程简介"}},[_._v("#")]),_._v(" 进程简介")]),_._v(" "),v("p",[_._v("一个在内存中运行的应用程序")]),_._v(" "),v("p",[_._v("每个进程都有自己独立的一块内存空间, 一个进程可以有多个线程, 比如在 Windows 系统中, 一个运行的 xx.exe 就是一个进程")]),_._v(" "),v("p",[v("img",{attrs:{src:"https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202208111344293.png",alt:"image-20220811134408225"}})]),_._v(" "),v("h3",{attrs:{id:"线程简介"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#线程简介"}},[_._v("#")]),_._v(" 线程简介")]),_._v(" "),v("p",[_._v("进程中的一个执行任务 (控制单元), 负责当前进程中程序的执行")]),_._v(" "),v("p",[_._v("一个进程至少有一个线程, 一个进程可以运行多个线程, 多个线程可以共享数据")]),_._v(" "),v("p",[_._v("与进程不同的是同类的多个线程共享进程的 "),v("strong",[_._v("堆")]),_._v(" 和 "),v("strong",[_._v("方法区")]),_._v(" 资源, 但每个线程有自己的 "),v("strong",[_._v("程序计数器")]),_._v(", "),v("strong",[_._v("虚拟机栈")]),_._v(" 和 "),v("strong",[_._v("本地方法栈")]),_._v(".")]),_._v(" "),v("p",[_._v("所以系统在产生一个线程, 或者在各个线程之间切换工作时, 负担要比进程小得多")]),_._v(" "),v("h3",{attrs:{id:"进程与线程的区别"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#进程与线程的区别"}},[_._v("#")]),_._v(" 进程与线程的区别")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("根本区别")]),_._v(" : "),v("strong",[_._v("进程是操作系统资源分配的基本单位")]),_._v(", 而 "),v("strong",[_._v("线程是处理器任务调度和执行的基本单位")])]),_._v(" "),v("li",[v("strong",[_._v("资源开销")]),_._v(" : 进程的创建, 切换等操作会 "),v("strong",[_._v("有较大的资源开销")]),_._v(", 而线程的创建, 切换等操作的 "),v("strong",[_._v("资源开销较小")])]),_._v(" "),v("li",[v("strong",[_._v("包含关系")]),_._v(" : 一个进程内可以有多个线程")]),_._v(" "),v("li",[v("strong",[_._v("内存分配")]),_._v(" : 同一进程的线程共享本进程的地址空间和资源, 而进程之间的地址空间和资源是互相独立的")]),_._v(" "),v("li",[v("strong",[_._v("影响关系")]),_._v(" : 一个进程崩溃后, 在保护模式下不会对其他进程产生影响, 而一个线程崩溃会导致整个进程都崩溃. 所以 "),v("strong",[_._v("多进程要比多线程健壮")])]),_._v(" "),v("li",[v("strong",[_._v("执行过程")]),_._v(" : 每个独立的进程有程序运行的入口, 顺序执行序号和程序出口. 但是线程不能独立执行, 必须依存在应用程序中, 由应用程序提供多个线程执行控制, 两者均可并发执行")])]),_._v(" "),v("h3",{attrs:{id:"进程的状态"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#进程的状态"}},[_._v("#")]),_._v(" 进程的状态")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("创建状态 ("),v("code",[_._v("new")]),_._v(")")]),_._v(" : 进程正在被创建, 尚未到就绪状态")]),_._v(" "),v("li",[v("strong",[_._v("就绪状态 ("),v("code",[_._v("ready")]),_._v(")")]),_._v(" : 进程已处于准备运行状态, "),v("strong",[_._v("即进程获得了除了处理器之外的一切所需资源, 一旦得到处理器资源即可运行")])]),_._v(" "),v("li",[v("strong",[_._v("运行状态 ("),v("code",[_._v("running")]),_._v(")")]),_._v(" : 进程正在处理器上运行 (单核 "),v("code",[_._v("CPU")]),_._v(" 下任意时刻只有一个进程处于运行状态)")]),_._v(" "),v("li",[v("strong",[_._v("阻塞状态 ("),v("code",[_._v("waiting")]),_._v(")")]),_._v(" : 又称为等待状态, 进程正在等待某一事件而暂停运行 (如等待某资源为可用或等待 "),v("code",[_._v("IO")]),_._v(" 操作完成), 即使处理器空闲, 该进程也不能运行")]),_._v(" "),v("li",[v("strong",[_._v("结束状态 ("),v("code",[_._v("terminated")]),_._v(")")]),_._v(" : 进程正在从系统中消失. 可能是进程正常结束或者其他原因中断退出运行")])]),_._v(" "),v("blockquote",[v("p",[_._v("图示 : 图中 "),v("code",[_._v("running")]),_._v(" 状态被 "),v("code",[_._v("interrupt")]),_._v(" 向 "),v("code",[_._v("ready")]),_._v(" 状态转换的箭头方向反了")])]),_._v(" "),v("p",[v("img",{attrs:{src:"https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202208111358917.png",alt:"process-state"}})]),_._v(" "),v("h3",{attrs:{id:"进程间的通信方式"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#进程间的通信方式"}},[_._v("#")]),_._v(" 进程间的通信方式")]),_._v(" "),v("p",[_._v("共有 7 中常见的通信方式")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("管道 / 匿名管道 ("),v("code",[_._v("Pipes")]),_._v(")")]),_._v(" : 用于具有亲缘关系的父子进程间或者兄弟进程之间的通信")]),_._v(" "),v("li",[v("strong",[_._v("有名管道 ("),v("code",[_._v("Name Pipes")]),_._v(")")]),_._v(" : 匿名管道由于没有名字, 只能用于亲缘关系的进程间通信. 为了克服这个缺点, 提出了有名管道. 有名管道严格遵循 "),v("strong",[_._v("先进先出("),v("code",[_._v("first in first out")]),_._v(")")]),_._v(". 有名管道以磁盘文件的方式存在, 可以实现本机任意两个进程通信")]),_._v(" "),v("li",[v("strong",[_._v("信号 ("),v("code",[_._v("Signal")]),_._v(")")]),_._v(" : 信号是一种比较复杂的通信方式, 用于通知接收进程某个事件已经发生")]),_._v(" "),v("li",[v("strong",[_._v("信号量 ("),v("code",[_._v("Semaphores")]),_._v(")")]),_._v(" : 信号量是一个计数器, 用于多进程对共享数据的访问, 信号量的意图在于进程间同步. 这种通信方式主要用于解决与同步相关的问题并避免竞争条件")]),_._v(" "),v("li",[v("strong",[_._v("消息队列 ("),v("code",[_._v("Message Queuing")]),_._v(")")]),_._v(" : 消息队列是消息的链表, 具有特定的格式, 存放在内存中并由消息队列标识符标识. 管道和消息队列的通信数据都是 "),v("strong",[_._v("先进先出")]),_._v(" 的原则. "),v("strong",[_._v("消息队列克服了信号承载信息量少, 管道只能承载无格式字节流以及缓冲区大小受限等缺点")])]),_._v(" "),v("li",[v("strong",[_._v("共享内存 ("),v("code",[_._v("Shared memory")]),_._v(")")]),_._v(" : 使得多个进程可以访问同一块内存空间, 不同进程可以及时看到对方进程中对共享内存中数据的更新. 这种方式需要依靠某种同步操作, 如互斥锁和信号量等")]),_._v(" "),v("li",[v("strong",[_._v("套接字 ("),v("code",[_._v("Sockets")]),_._v(")")]),_._v(" : 此方法主要用于在客户端和服务器之间通过网络进行通信")])]),_._v(" "),v("h3",{attrs:{id:"线程间的同步方式"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#线程间的同步方式"}},[_._v("#")]),_._v(" 线程间的同步方式")]),_._v(" "),v("p",[_._v("操作系统有三种线程同步的方式 :")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("互斥量 ("),v("code",[_._v("Mutex")]),_._v(")")]),_._v(" : 采用互斥对象机制, 只有拥有互斥对象的线程才有访问公共资源的权限. 因为互斥对象只有一个, 所以可以保证公共资源不会被多个线程同时访问. 比如 "),v("code",[_._v("Java")]),_._v(" 中的 "),v("code",[_._v("synchronized")]),_._v(" 关键词和各种 "),v("code",[_._v("Lock")]),_._v(" 都是这种机制")]),_._v(" "),v("li",[v("strong",[_._v("信号量 ("),v("code",[_._v("Semaphores")]),_._v(")")]),_._v(" : 它允许同一时刻多个线程访问同一资源, 但是需要控制同一时刻访问此资源的最大线程数量")]),_._v(" "),v("li",[v("strong",[_._v("事件 ("),v("code",[_._v("Event")]),_._v(")")]),_._v(" : "),v("code",[_._v("Wait")]),_._v(" / "),v("code",[_._v("Notfiy")]),_._v(", 通过通知操作的方式来保持多线程同步, 还可以方便的实现多线程优先级的比较操作")])]),_._v(" "),v("h3",{attrs:{id:"进程的调度算法"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#进程的调度算法"}},[_._v("#")]),_._v(" 进程的调度算法")]),_._v(" "),v("p",[_._v("一共有 5 中常见的调度算法 :")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("先到先服务调度算法 ("),v("code",[_._v("FCFS")]),_._v(")")]),_._v(" : 从就绪队列中选择一个最先进入该队列的进程为之分配资源, 使它立即执行并一直执行到完成或发生某事件而被阻塞放弃占用 "),v("code",[_._v("CPU")]),_._v(" 时再重新调度")]),_._v(" "),v("li",[v("strong",[_._v("短作业优先调度算法 (SJF)")]),_._v(" : 从就绪队列中选出一个估计运行时间最短的进程为之分配资源, 使它立即执行并一直执行到完成或发生某事件而被阻塞放弃占用 "),v("code",[_._v("CPU")]),_._v(" 时再重新调度")]),_._v(" "),v("li",[v("strong",[_._v("时间片轮转调度算法")]),_._v(" : 从就绪队列中选出一个估计运行时间最短的进程为之分配资源, 使它立即执行并一直执行到完成或发生某事件而被阻塞放弃占用 "),v("code",[_._v("CPU")]),_._v(" 时再重新调度")]),_._v(" "),v("li",[v("strong",[_._v("多级反馈队列调度算法")]),_._v(" : 前面介绍的几种进程调度的算法都有一定的局限性. 如 "),v("strong",[_._v("短进程优先的调度算法, 仅照顾了短进程而忽略了长进程")]),_._v(" . 多级反馈队列调度算法既能使高优先级的作业得到响应又能使短作业 (进程) 迅速完成. 因而它是目前 "),v("strong",[_._v("被公认的一种较好的进程调度算法")]),_._v(", "),v("code",[_._v("UNIX")]),_._v(" 操作系统采取的便是这种调度算法")]),_._v(" "),v("li",[v("strong",[_._v("优先级调度")]),_._v(" : 为每个流程分配优先级, 首先执行具有最高优先级的进程, 依此类推. 具有相同优先级的进程以 "),v("code",[_._v("FCFS")]),_._v(" 方式执行. 可以根据内存要求, 时间要求或任何其他资源要求来确定优先级")])]),_._v(" "),v("h2",{attrs:{id:"死锁"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#死锁"}},[_._v("#")]),_._v(" 死锁")]),_._v(" "),v("h3",{attrs:{id:"死锁简介"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#死锁简介"}},[_._v("#")]),_._v(" 死锁简介")]),_._v(" "),v("p",[_._v("多个进程 / 线程同时被阻塞, 它们中的一个或者全部都在等待某个资源被释放. 由于进程 / 线程被无限期地阻塞, 因此程序不可能正常终止")]),_._v(" "),v("h3",{attrs:{id:"死锁产生的四个条件"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#死锁产生的四个条件"}},[_._v("#")]),_._v(" 死锁产生的四个条件")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("互斥")]),_._v(" : 资源必须处于非共享模式, 即一次只有一个进程可以使用. 如果另一进程申请该资源, 那么必须等待直到该资源被释放为止")]),_._v(" "),v("li",[v("strong",[_._v("占有并等待")]),_._v(" : 一个进程至少应该占有一个资源, 并等待另一资源, 而该资源被其他进程所占有")]),_._v(" "),v("li",[v("strong",[_._v("非抢占")]),_._v(" : 资源不能被抢占. 只能在持有资源的进程完成任务后, 该资源才会被释放")]),_._v(" "),v("li",[v("strong",[_._v("循环等待")]),_._v(" : 有一组等待进程 "),v("code",[_._v("{P0, P1, ..., Pn}")]),_._v(",  "),v("code",[_._v("P0")]),_._v(" 等待的资源被 "),v("code",[_._v("P1")]),_._v(" 占有, "),v("code",[_._v("P1")]),_._v(" 等待的资源被 "),v("code",[_._v("P2")]),_._v(" 占有, ......, "),v("code",[_._v("Pn-1")]),_._v(" 等待的资源被 "),v("code",[_._v("Pn")]),_._v(" 占有, "),v("code",[_._v("Pn")]),_._v(" 等待的资源被 "),v("code",[_._v("P0")]),_._v(" 占有")])]),_._v(" "),v("p",[_._v("只有当四个条件同时成立时, 死锁才会出现")]),_._v(" "),v("h3",{attrs:{id:"死锁的解决方法"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#死锁的解决方法"}},[_._v("#")]),_._v(" 死锁的解决方法")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("预防")]),_._v(" :  是采用某种策略, "),v("strong",[_._v("限制并发进程对资源的请求")]),_._v(", 从而使得死锁的必要条件在系统执行的任何时间上都不满足")]),_._v(" "),v("li",[v("strong",[_._v("避免")]),_._v(" : 是系统在分配资源时, 根据资源的使用情况 "),v("strong",[_._v("提前做出预测")]),_._v(", 从而 "),v("strong",[_._v("避免死锁的发生")])]),_._v(" "),v("li",[v("strong",[_._v("检测")]),_._v(" : 是指系统设有 "),v("strong",[_._v("专门的机构")]),_._v(", 当死锁发生时, 该机构能够检测死锁的发生, 并精确地确定与死锁有关的进程和资源")]),_._v(" "),v("li",[v("strong",[_._v("解除")]),_._v(" : 是与检测相配套的一种措施, 用于"),v("strong",[_._v("将进程从死锁状态下解脱出来")])])]),_._v(" "),v("h4",{attrs:{id:"死锁的预防"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#死锁的预防"}},[_._v("#")]),_._v(" 死锁的预防")]),_._v(" "),v("p",[v("strong",[_._v("只要破坏死锁的四个必要条件中的任何一个就能预防死锁的发生")])]),_._v(" "),v("p",[_._v("一般考虑破坏第二个条件或第四个条件")]),_._v(" "),v("blockquote",[v("p",[_._v("优缺点")])]),_._v(" "),v("ul",[v("li",[_._v("可以避免死锁的发生")]),_._v(" "),v("li",[_._v("降低了资源利用率")])]),_._v(" "),v("h5",{attrs:{id:"静态分配策略"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#静态分配策略"}},[_._v("#")]),_._v(" 静态分配策略")]),_._v(" "),v("p",[_._v("静态分配策略可以破坏死锁产生的第二个条件 (占有并等待)")]),_._v(" "),v("p",[_._v("所谓静态分配策略, 就是指一个进程必须在执行前就申请到它所需要的全部资源, 并且知道它所要的资源都得到满足之后才开始执行. 进程要么占有所有的资源然后开始执行, 要么不占有资源, 不会出现占有一些资源等待一些资源的情况")]),_._v(" "),v("p",[_._v("静态分配策略逻辑简单, 实现也很容易, 但这种策略 "),v("strong",[_._v("严重地降低了资源利用率")]),_._v(", 因为在每个进程所占有的资源中, 有些资源是在比较靠后的执行时间里采用的, 甚至有些资源是在额外的情况下才是用的, 这样就可能造成了一个进程占有了一些 "),v("strong",[_._v("几乎不用的资源而使其他需要该资源的进程产生等待")]),_._v(" 的情况")]),_._v(" "),v("h5",{attrs:{id:"层次分配策略"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#层次分配策略"}},[_._v("#")]),_._v(" 层次分配策略")]),_._v(" "),v("p",[_._v("层次分配策略破坏了产生死锁的第四个条件 (循环等待)")]),_._v(" "),v("p",[_._v("在层次分配策略下, 所有的资源被分成了多个层次, 一个进程得到某一次的一个资源后, 它只能再申请较高一层的资源")]),_._v(" "),v("p",[_._v("当一个进程要释放某层的一个资源时, 必须先释放所占用的较高层的资源, 按这种策略, 是不可能出现循环等待链的, 因为那样的话, 就出现了已经申请了较高层的资源, 反而去申请了较低层的资源, 不符合层次分配策略, 证明略")]),_._v(" "),v("h4",{attrs:{id:"死锁的避免"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#死锁的避免"}},[_._v("#")]),_._v(" 死锁的避免")]),_._v(" "),v("p",[_._v("上面提到的 "),v("strong",[_._v("破坏")]),_._v(" 死锁产生的四个必要条件之一就可以成功 "),v("strong",[_._v("预防系统发生死锁")]),_._v(" , 但是会导致 "),v("strong",[_._v("低效的进程运行")]),_._v(" 和 "),v("strong",[_._v("资源使用率")]),_._v(" . 而死锁的避免相反, 它的角度是允许系统中"),v("strong",[_._v("同时存在四个必要条件")]),_._v(", 只要掌握并发进程中与每个进程有关的资源动态申请情况, 做出 "),v("strong",[_._v("明智和合理的选择")]),_._v(" , 仍然可以避免死锁, 因为四大条件仅仅是产生死锁的必要条件")]),_._v(" "),v("p",[_._v("我们将系统的状态分为 "),v("strong",[_._v("安全状态")]),_._v(" 和 "),v("strong",[_._v("不安全状态")]),_._v(" , 每当在未申请者分配资源前先测试系统状态, 若把系统资源分配给申请者会产生死锁, 则拒绝分配, 否则接受申请, 并为它分配资源")]),_._v(" "),v("p",[_._v("其中最具有代表性的 "),v("strong",[_._v("避免死锁算法")]),_._v(" 就是 "),v("code",[_._v("Dijkstra")]),_._v(" 的银行家算法")]),_._v(" "),v("p",[_._v("银行家算法用一句话表达就是 : 当一个进程申请使用资源的时候, "),v("strong",[_._v("银行家算法")]),_._v(" 通过先 "),v("strong",[_._v("试探")]),_._v(" 分配给该进程资源, 然后通过 "),v("strong",[_._v("安全性算法")]),_._v(" 判断分配后系统是否处于安全状态, 若不安全则试探分配作废, 让该进程继续等待, 若能够进入到安全的状态, 则就 "),v("strong",[_._v("真的分配资源给该进程")])]),_._v(" "),v("blockquote",[v("p",[_._v("优缺点")])]),_._v(" "),v("ul",[v("li",[_._v("改善解决了 "),v("strong",[_._v("资源使用率低的问题")]),_._v(" ,")]),_._v(" "),v("li",[_._v("它要不断地检测每个进程对各类资源的占用和申请情况, 以及做 "),v("strong",[_._v("安全性检查")]),_._v(" , 需要花费较多的时间")])]),_._v(" "),v("h4",{attrs:{id:"死锁的检测"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#死锁的检测"}},[_._v("#")]),_._v(" 死锁的检测")]),_._v(" "),v("p",[_._v("对资源的分配加以限制可以 "),v("strong",[_._v("预防和避免")]),_._v(" 死锁的发生, 但是都不利于各进程对系统资源的"),v("strong",[_._v("充分共享")]),_._v(". 解决死锁问题的另一条途径是 "),v("strong",[_._v("死锁检测和解除")])]),_._v(" "),v("p",[_._v("这种方法对资源的分配不加以任何限制, 也不采取死锁避免措施, 但系统 "),v("strong",[_._v('定时地运行一个 "死锁检测"')]),_._v(" 的程序, 判断系统内是否出现死锁, 如果检测到系统发生了死锁, 再采取措施去解除它")]),_._v(" "),v("h5",{attrs:{id:"进程-资源分配图"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#进程-资源分配图"}},[_._v("#")]),_._v(" 进程 - 资源分配图")]),_._v(" "),v("p",[_._v("操作系统中的每一刻时刻的 "),v("strong",[_._v("系统状态")]),_._v(" 都可以用 "),v("strong",[_._v("进程 - 资源分配图")]),_._v(" 来表示, 进程-资源分配图是描述进程和资源申请及分配关系的一种有向图, 可用于 "),v("strong",[_._v("检测系统是否处于死锁状态")])]),_._v(" "),v("p",[_._v("用一个方框表示每一个资源类, 方框中的黑点表示该资源类中的各个资源, 每个键进程用一个圆圈表示, 用 "),v("strong",[_._v("有向边")]),_._v(" 来表示 "),v("strong",[_._v("进程申请资源和资源被分配的情况")]),_._v(".")]),_._v(" "),v("p",[v("img",{attrs:{src:"https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202208111448139.jpeg",alt:"进程-资源分配图"}})]),_._v(" "),v("blockquote",[v("p",[_._v("小贴士")])]),_._v(" "),v("p",[_._v("进程 - 资源分配图中存在环路并不一定是发生了死锁. 因为循环等待资源仅仅是死锁发生的必要条件, 而不是充分条件")]),_._v(" "),v("p",[_._v("图 2-22 便是一个有环路而无死锁的例子. 虽然进程 "),v("code",[_._v("P1")]),_._v(" 和进程 "),v("code",[_._v("P3")]),_._v(" 分别占用了一个资源 "),v("code",[_._v("R1")]),_._v(" 和一个资源 "),v("code",[_._v("R2")]),_._v(", 并且因为等待另一个资源 "),v("code",[_._v("R2")]),_._v(" 和另一个资源 "),v("code",[_._v("R1")]),_._v(" 形成了环路, 但进程 "),v("code",[_._v("P2")]),_._v(" 和进程 "),v("code",[_._v("P4")]),_._v(" 分别占有了一个资源 "),v("code",[_._v("R1")]),_._v(" 和一个资源 "),v("code",[_._v("R2")]),_._v(", 它们申请的资源得到了满足, 在有限的时间里会归还资源, 于是进程 "),v("code",[_._v("P1")]),_._v(" 或 "),v("code",[_._v("P3")]),_._v(" 都能获得另一个所需的资源, 环路自动解除, 系统也就不存在死锁状态了")]),_._v(" "),v("h5",{attrs:{id:"死锁检测步骤"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#死锁检测步骤"}},[_._v("#")]),_._v(" 死锁检测步骤")]),_._v(" "),v("p",[_._v("知道了死锁检测的原理, 我们可以利用下列步骤编写一个 "),v("strong",[_._v("死锁检测")]),_._v(" 程序, 检测系统是否产生了死锁")]),_._v(" "),v("ol",[v("li",[_._v("如果进程 - 资源分配图中无环路, 则此时系统没有发生死锁")]),_._v(" "),v("li",[_._v("如果进程 - 资源分配图中有环路, 且每个资源类仅有一个资源, 则系统中已经发生了死锁.")]),_._v(" "),v("li",[_._v("如果进程 - 资源分配图中有环路, 且涉及到的资源类有多个资源, 此时系统未必会发生死锁. 如果能在进程 - 资源分配图中找出一个 "),v("strong",[_._v("既不阻塞又非独立的进程")]),_._v(" , 该进程能够在有限的时间内归还占有的资源, 也就是把边给消除掉了, 重复此过程, 直到能在有限的时间内 "),v("strong",[_._v("消除所有的边")]),_._v(" , 则不会发生死锁, 否则会发生死锁 (消除边的过程类似于 "),v("strong",[_._v("拓扑排序")]),_._v(")")])]),_._v(" "),v("h4",{attrs:{id:"死锁的解除"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#死锁的解除"}},[_._v("#")]),_._v(" 死锁的解除")]),_._v(" "),v("p",[_._v("当死锁检测程序检测到存在死锁发生时, 应设法让其解除, 让系统从死锁状态中恢复过来, 常用的解除死锁的方法有以下四种 :")]),_._v(" "),v("ol",[v("li",[v("strong",[_._v("立即结束所有进程的执行, 重新启动操作系统")]),_._v("  : 这种方法简单, 但以前所在的工作全部作废, 损失很大")]),_._v(" "),v("li",[v("strong",[_._v("撤销涉及死锁的所有进程, 解除死锁后继续运行")]),_._v("  : 这种方法能彻底打破 "),v("strong",[_._v("死锁的循环等待")]),_._v(" 条件, 但将付出很大代价, 例如有些进程可能已经计算了很长时间, 由于被撤销而使产生的部分结果也被消除了, 再重新执行时还要再次进行计算")]),_._v(" "),v("li",[_._v("**逐个撤销涉及死锁的进程, 回收其资源直至死锁解除. **")]),_._v(" "),v("li",[v("strong",[_._v("抢占资源")]),_._v(" : 从涉及死锁的一个或几个进程中抢占资源, 把夺得的资源再分配给涉及死锁的进程直至死锁解除")])]),_._v(" "),v("h2",{attrs:{id:"内存管理"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#内存管理"}},[_._v("#")]),_._v(" 内存管理")]),_._v(" "),v("h3",{attrs:{id:"内存管理简介"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#内存管理简介"}},[_._v("#")]),_._v(" 内存管理简介")]),_._v(" "),v("p",[_._v("操作系统的内存管理主要负责内存的分配与回收 ("),v("code",[_._v("malloc")]),_._v(" 函数 : 申请内存, "),v("code",[_._v("free")]),_._v(" 函数 : 释放内存), 另外地址转换也就是将逻辑地址转换成相应的物理地址等功能也是操作系统内存管理做的事情")]),_._v(" "),v("h3",{attrs:{id:"内存管理机制"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#内存管理机制"}},[_._v("#")]),_._v(" 内存管理机制")]),_._v(" "),v("p",[_._v("简单分为 "),v("strong",[_._v("连续分配管理方式")]),_._v(" 和 "),v("strong",[_._v("非连续分配管理方式")]),_._v(" 这两种")]),_._v(" "),v("p",[_._v("连续分配管理方式是指为一个用户程序分配一个连续的内存空间, 常见的如 "),v("strong",[_._v("块式管理")])]),_._v(" "),v("p",[_._v("非连续分配管理方式允许一个程序使用的内存分布在离散或者说不相邻的内存中, 常见的如 "),v("strong",[_._v("页式管理")]),_._v(" 和 "),v("strong",[_._v("段式管理")])]),_._v(" "),v("ul",[v("li",[v("p",[v("strong",[_._v("块式管理")]),_._v(" : 远古时代的计算机操作系统的内存管理方式. 将内存分为几个固定大小的块, 每个块中只包含一个进程. 如果程序运行需要内存的话, 操作系统就分配给它一块, 如果程序运行只需要很小的空间的话, 分配的这块内存很大一部分几乎被浪费了. 这些在每个块中未被利用的空间, 我们称之为碎片")])]),_._v(" "),v("li",[v("p",[v("strong",[_._v("页式管理")]),_._v(" : 把主存分为大小相等且固定的一页一页的形式, 页较小, 相比于块式管理的划分粒度更小, 提高了内存利用率, 减少了碎片. 页式管理通过页表对应逻辑地址和物理地址")])]),_._v(" "),v("li",[v("p",[v("strong",[_._v("段式管理")]),_._v(" : 页式管理虽然提高了内存利用率, 但是页式管理其中的页并无任何实际意义. 段式管理把主存分为一段段的, 段是有实际意义的, 每个段定义了一组逻辑信息. 例如, 有主程序段 "),v("code",[_._v("MAIN")]),_._v("、子程序段 "),v("code",[_._v("X")]),_._v("、数据段 "),v("code",[_._v("D")]),_._v(" 及栈段 "),v("code",[_._v("S")]),_._v(" 等, 段式管理通过段表对应逻辑地址和物理地址")])]),_._v(" "),v("li",[v("p",[v("strong",[_._v("段页式管理机制")]),_._v(" : 段页式管理机制结合了段式管理和页式管理的优点. 简单来说段页式管理机制就是把主存先分成若干段, 每个段又分成若干页, 也就是说 "),v("strong",[_._v("段页式管理机制")]),_._v(" 中段与段之间以及段的内部的都是离散的")])])]),_._v(" "),v("p",[_._v("简单来说 : 页是物理单位, 段是逻辑单位. "),v("strong",[_._v("分页可以有效提高内存利用率")]),_._v(", "),v("strong",[_._v("分段可以更好满足用户需求")]),_._v(".")]),_._v(" "),v("h3",{attrs:{id:"快表和多级页表"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#快表和多级页表"}},[_._v("#")]),_._v(" 快表和多级页表")]),_._v(" "),v("p",[_._v("在分页内存管理中, 很重要的两点是 :")]),_._v(" "),v("ul",[v("li",[_._v("虚拟地址到物理地址的转换要快")]),_._v(" "),v("li",[_._v("解决虚拟地址空间大, 页表也会很大的问题")])]),_._v(" "),v("h4",{attrs:{id:"快表"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#快表"}},[_._v("#")]),_._v(" 快表")]),_._v(" "),v("p",[_._v("为了提高 "),v("strong",[_._v("虚拟地址到物理地址的转换速度")]),_._v(", 操作系统在 "),v("strong",[_._v("页表方案")]),_._v(" 的基础之上引入了 "),v("strong",[_._v("快表")]),_._v(" 来加速虚拟地址到物理地址的转换")]),_._v(" "),v("p",[_._v("我们可以将快表理解为一种特殊的高速缓冲存储器 ("),v("code",[_._v("Cache")]),_._v("), 其中的内容是 "),v("strong",[_._v("页表的一部分或全部内容")]),_._v(". 作为页表的 "),v("code",[_._v("cache")]),_._v(", 它的作用于页表类似, 但是提高了访问效率. 由于采用页表做地址转换, 读写内存数据时 "),v("code",[_._v("CPU")]),_._v(" 要访问两次主存. 有了快表, 有时候只要访问一次高速缓冲存储器, 一次主存, 这样可加速查找并提高指令执行速度")]),_._v(" "),v("blockquote",[v("p",[_._v("使用快表后的地址转换流程 :")])]),_._v(" "),v("ol",[v("li",[_._v("根据虚拟地址中的页号查快表")]),_._v(" "),v("li",[_._v("如果该页在快表中, 直接从快表中读取相应的物理地址")]),_._v(" "),v("li",[_._v("如果该页不在快表中, 就访问内存中的页表, 再从页表中得到物理地址, 同时将页表中的该映射项添加到快表中")]),_._v(" "),v("li",[_._v("当快表填满后, 又要登记新页时, 就按照一定的淘汰策略淘汰掉快表中的一个页")])]),_._v(" "),v("h4",{attrs:{id:"多级页表"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#多级页表"}},[_._v("#")]),_._v(" 多级页表")]),_._v(" "),v("p",[_._v("引入多级页表的主要目的是 "),v("strong",[_._v("为了避免把全部页表一直放在内存中占用过多空间, 特别是那些根本就不需要的页表就不需要保留在内存中")])]),_._v(" "),v("p",[_._v("多级页表属于时间换空间的典型场景")]),_._v(" "),v("blockquote",[v("p",[_._v("扩展阅读")])]),_._v(" "),v("p",[v("a",{attrs:{href:"https://www.polarxiong.com/archives/%E5%A4%9A%E7%BA%A7%E9%A1%B5%E8%A1%A8%E5%A6%82%E4%BD%95%E8%8A%82%E7%BA%A6%E5%86%85%E5%AD%98.html",target:"_blank",rel:"noopener noreferrer"}},[_._v("多级页表如何节约内存"),v("OutboundLink")],1)]),_._v(" "),v("h4",{attrs:{id:"总结"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[_._v("#")]),_._v(" 总结")]),_._v(" "),v("p",[v("strong",[_._v("为了提高内存的空间性能")]),_._v(", 提出了多级页表的概念")]),_._v(" "),v("p",[_._v("但是提升空间性能是以浪费时间性能为基础的, 因此 "),v("strong",[_._v("为了补充损失的时间性能")]),_._v(", 提出了快表 ("),v("code",[_._v("TLB")]),_._v(") 的概念.")]),_._v(" "),v("p",[_._v("无论是快表还是多级页表实际上 "),v("strong",[_._v("都利用到了程序的局部性原理")])]),_._v(" "),v("h3",{attrs:{id:"分页机制和分段机制的异同"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#分页机制和分段机制的异同"}},[_._v("#")]),_._v(" 分页机制和分段机制的异同")]),_._v(" "),v("h4",{attrs:{id:"共同点"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#共同点"}},[_._v("#")]),_._v(" 共同点")]),_._v(" "),v("ul",[v("li",[_._v("分页机制和分段机制都是 "),v("strong",[_._v("为了提高内存利用率, 减少内存碎片")])]),_._v(" "),v("li",[_._v("页和段都是离散存储的, 所以 "),v("strong",[_._v("两者都是离散分配内存的方式")]),_._v(". 但是, "),v("strong",[_._v("每个页和段中的内存是连续的")])])]),_._v(" "),v("h4",{attrs:{id:"不同点"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#不同点"}},[_._v("#")]),_._v(" 不同点")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("页的大小是固定的")]),_._v(", 由操作系统决定; 段的大小是不固定的, 取决于我们当前运行的程序")]),_._v(" "),v("li",[_._v("分页仅仅是为了 "),v("strong",[_._v("满足操作系统内存管理的需求")]),_._v(", 而段是逻辑信息的单位, 在程序中可以体现为代码段, 数据段, 能 "),v("strong",[_._v("更好的满足用户的需要")])])]),_._v(" "),v("h3",{attrs:{id:"逻辑-虚拟-地址和物理地址"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#逻辑-虚拟-地址和物理地址"}},[_._v("#")]),_._v(" 逻辑 (虚拟) 地址和物理地址")]),_._v(" "),v("p",[_._v("逻辑地址由操作系统决定, 一般编程只有可能于逻辑地址打交道")]),_._v(" "),v("p",[_._v("物理地址指的是真是物理内存中的地址, 具体来说就是内存地址寄存器中的地址. 物理地址是内存单元真正的地址")]),_._v(" "),v("h3",{attrs:{id:"cpu-寻址与虚拟地址空间"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#cpu-寻址与虚拟地址空间"}},[_._v("#")]),_._v(" CPU 寻址与虚拟地址空间")]),_._v(" "),v("p",[_._v("现代处理器使用的是一种称为 "),v("strong",[_._v("虚拟寻址 ("),v("code",[_._v("Virtual Addressing")]),_._v(")")]),_._v(" 的寻址方式.")]),_._v(" "),v("p",[v("strong",[_._v("使用虚拟寻址, "),v("code",[_._v("CPU")]),_._v(" 需要将虚拟地址翻译成物理地址, 这样才能访问到真实的物理内存")])]),_._v(" "),v("p",[_._v("实际上完成虚拟地址转换为物理地址的硬件是 "),v("code",[_._v("CPU")]),_._v(" 中含有一个被称为 "),v("strong",[_._v("内存管理单元 ("),v("code",[_._v("Memory Management Unit")]),_._v(", "),v("code",[_._v("MMU")]),_._v(")")]),_._v(" 的硬件")]),_._v(" "),v("blockquote",[v("p",[v("code",[_._v("MMU")]),_._v(" 示意图")])]),_._v(" "),v("p",[v("img",{attrs:{src:"https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202208151315655.png",alt:"MMU_principle_updated"}})]),_._v(" "),v("h4",{attrs:{id:"为什么要有虚拟地址空间"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#为什么要有虚拟地址空间"}},[_._v("#")]),_._v(" 为什么要有虚拟地址空间 ?")]),_._v(" "),v("blockquote",[v("p",[_._v("没有虚拟地址空间的情况")])]),_._v(" "),v("p",[_._v("没有虚拟地址空间的时候, "),v("strong",[_._v("程序直接访问和操作的都是物理地址")])]),_._v(" "),v("p",[_._v("造成的问题 :")]),_._v(" "),v("ul",[v("li",[_._v("用户程序可以访问任意内存, 寻址内存的每个字节, 这样就很容易破坏操作系统, 造成操作系统崩溃")]),_._v(" "),v("li",[_._v("想要同事运行多个程序非常困难. 因为可能两个不同程序之间会存在覆盖物理内存空间的情况")])]),_._v(" "),v("p",[_._v("总结 : 如果直接把物理地址暴露出来的话会带来严重问题, 比如可能对操作系统造成伤害以及同时运行多个程序造成困难")]),_._v(" "),v("blockquote",[v("p",[_._v("使用虚拟地址空间的优势")])]),_._v(" "),v("ul",[v("li",[_._v("程序可以使用一系列相邻的虚拟地址来访问物理内存中不相邻的大内存缓冲区")]),_._v(" "),v("li",[_._v("程序可以使用一系列虚拟地址来访问大于可用物理内存的内存缓冲区")]),_._v(" "),v("li",[_._v("不同进程使用的虚拟地址彼此隔离. 一个进程中的代码无法更改正在由另一进程或操作系统使用的物理内存")])]),_._v(" "),v("h2",{attrs:{id:"虚拟内存"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#虚拟内存"}},[_._v("#")]),_._v(" 虚拟内存")]),_._v(" "),v("h3",{attrs:{id:"虚拟内存简介"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#虚拟内存简介"}},[_._v("#")]),_._v(" 虚拟内存简介")]),_._v(" "),v("p",[v("strong",[_._v("虚拟内存 ("),v("code",[_._v("Virtual Memory")]),_._v(")")]),_._v(" 是计算机内存管理的一种技术, 我们可以手动设置自己电脑的虚拟内存.")]),_._v(" "),v("p",[_._v("不要简单的认为虚拟内存只是使用硬盘空间来扩展内存的技术, "),v("strong",[_._v("虚拟内存的重要意义在于它定义了一个连续的虚拟地址空间, 并且把内存扩展到硬盘空间")])]),_._v(" "),v("p",[v("strong",[_._v("虚拟内存为每个进程提供了一个一致的, 私有的地址空间, 它让每个进程产生了自己在独享主存的错觉 (每个进程拥有一片连续完整的内存空间)")])]),_._v(" "),v("p",[v("strong",[_._v("虚拟内存")]),_._v(" 使得应用程序认为它拥有连续的可用的内存 (一个连续完整的地址空间), 而实际上, 它通常是被分隔成多个物理内存碎片, 还有部分暂时存储在外部磁盘存储器上, 在需要时进行数据交换. 与没有使用虚拟内存技术的系统相比, 使用这种技术的系统使得大型程序的编写变得更容易, 对真正的物理内存 (例如 "),v("code",[_._v("RAM")]),_._v(") 的使用也更有效率. 目前, 大多数操作系统都使用了虚拟内存")]),_._v(" "),v("blockquote",[v("p",[_._v("推荐阅读")])]),_._v(" "),v("p",[v("a",{attrs:{href:"https://juejin.cn/post/6844903507594575886",target:"_blank",rel:"noopener noreferrer"}},[_._v("虚拟内存的那点事儿"),v("OutboundLink")],1)]),_._v(" "),v("h3",{attrs:{id:"局部性原理"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#局部性原理"}},[_._v("#")]),_._v(" 局部性原理")]),_._v(" "),v("p",[_._v("局部性原理是虚拟内存技术的基础, 正是因为程序运行具有局部性原理, 才可以只装入部分程序到内存就开始运行")]),_._v(" "),v("p",[_._v("局部性原理表现在以下两个方面 :")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("时间局限性")]),_._v(" : 如果程序中的某条指令一旦执行, 不久以后该指令可能再次执行; 如果某数据被访问过, 不久以后该数据可能再次被访问. 产生时间局部性的典型原因, 是 "),v("strong",[_._v("由于在程序中存在着大量的循环操作")])]),_._v(" "),v("li",[v("strong",[_._v("空间局限性")]),_._v(" : 一旦程序访问了某个存储单元, 在不久之后, 其附近的存储单元也将被访问, 即程序在一段时间内所访问的地址, 可能集中在一定的范围之内, 这是因为指令通常是顺序存放, 顺序执行的, 数据也一般是以向量, 数组, 表等形式簇聚存储的")])]),_._v(" "),v("p",[_._v("时间局部性 "),v("strong",[_._v("是通过将近来使用的指令和数据保存到高速缓存存储器中, 并使用高速缓存的层次结构实现")]),_._v('. 空间局部性通常是使用较大的高速缓存, 并将预取机制集成到高速缓存控制逻辑中实现. 虚拟内存技术实际上就是建立了 "内存一外存" 的两级存储器的结构, 利用局部性原理实现髙速缓存')]),_._v(" "),v("h3",{attrs:{id:"虚拟内存的技术实现"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#虚拟内存的技术实现"}},[_._v("#")]),_._v(" 虚拟内存的技术实现")]),_._v(" "),v("p",[v("strong",[_._v("虚拟内存的实现需要建立在离散分配的内存管理方式的基础上")])]),_._v(" "),v("p",[_._v("虚拟内存的实现有三种方式 :")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("请求分页存储管理")]),_._v(" : 建立在分页管理之上, 为了支持虚拟存储器功能而增加了请求调页功能和页面置换功能. 请求分页是目前最常用的一种实现虚拟存储器的方法. 请求分页存储管理系统中, 在作业开始运行之前, 仅装入当前要执行的部分段即可运行. 假如在作业运行的过程中发现要访问的页面不在内存, 则由处理器通知操作系统按照对应的页面置换算法将相应的页面调入到主存, 同时操作系统也可以将暂时不用的页面置换到外存中")]),_._v(" "),v("li",[v("strong",[_._v("请求分段存储管理")]),_._v(" : 建立在分段存储管理之上, 增加了请求调段功能、分段置换功能. 请求分段储存管理方式就如同请求分页储存管理方式一样, 在作业开始运行之前, 仅装入当前要执行的部分段即可运行；在执行过程中, 可使用请求调入中断动态装入要访问但又不在内存的程序段；当内存空间已满, 而又需要装入新的段时, 根据置换功能适当调出某个段, 以便腾出空间而装入新的段")]),_._v(" "),v("li",[v("strong",[_._v("请求段页式存储管理")])])]),_._v(" "),v("h3",{attrs:{id:"请求分页与分页存储管理的不同"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#请求分页与分页存储管理的不同"}},[_._v("#")]),_._v(" 请求分页与分页存储管理的不同")]),_._v(" "),v("p",[_._v("请求分页存储管理建立在分页管理之上")]),_._v(" "),v("p",[_._v("他们的根本区别是是否将程序全部所需的全部地址空间都装入主存, 这也是请求分页存储管理可以提供虚拟内存的原因")]),_._v(" "),v("p",[_._v("它们之间的根本区别在于是否将一作业的全部地址空间同时装入主存. 请求分页存储管理不要求将作业全部地址空间同时装入主存. 基于这一点, 请求分页存储管理可以提供虚存, 而分页存储管理却不能提供虚存")]),_._v(" "),v("p",[_._v("不管是上面那种实现方式, 我们一般都需要 :")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("一定容量的内存和外存")]),_._v(" : 在载入程序的时候, 只需要将程序的一部分装入内存, 而将其他部分留在外存, 然后程序就可以执行了")]),_._v(" "),v("li",[v("strong",[_._v("缺页中断")]),_._v(" : 如果 "),v("strong",[_._v("需执行的指令或访问的数据尚未在内存")]),_._v(" (称为缺页或缺段), 则由处理器通知操作系统将相应的页面或段 "),v("strong",[_._v("调入到内存")]),_._v(", 然后继续执行程序")]),_._v(" "),v("li",[v("strong",[_._v("虚拟地址空间")]),_._v(" : 逻辑地址到物理地址的变换")])]),_._v(" "),v("h3",{attrs:{id:"页面置换算法"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#页面置换算法"}},[_._v("#")]),_._v(" 页面置换算法")]),_._v(" "),v("p",[_._v("地址映射过程中, 若在页面中发现所要访问的页面不在内存中, 则发生缺页中断")]),_._v(" "),v("p",[v("strong",[_._v("缺页中断")]),_._v(" 就是要访问的 "),v("strong",[_._v("页")]),_._v(" 不在主存, 需要操作系统将其调入主存后再进行访问.  在这个时候, 被内存映射的文件实际上成了一个分页交换文件")]),_._v(" "),v("p",[_._v("当发生缺页中断时, 如果当前内存中并没有空闲的页面, 操作系统就必须在内存选择一个页面将其移出内存, 以便为即将调入的页面让出空间. 用来选择淘汰哪一页的规则叫做页面置换算法, 我们可以把页面置换算法看成是淘汰页面的规则")]),_._v(" "),v("ul",[v("li",[v("strong",[v("code",[_._v("OPT")]),_._v(" ("),v("code",[_._v("Optimal")]),_._v(") 页面置换算法 (最佳页面置换算法)")]),_._v(" : 最佳置换算法所选择的被淘汰页面将是以后永不使用的, 或者是在最长时间内不再被访问的页面, 这样可以保证获得最低的缺页率. 但由于人们目前无法预知进程在内存下的若千页面中哪个是未来最长时间内不再被访问的, 因而该算法无法实现. 一般作为衡量其他置换算法的方法")]),_._v(" "),v("li",[v("strong",[v("code",[_._v("FIFO")]),_._v(" ("),v("code",[_._v("First In First Out")]),_._v(") 页面置换算法 (先进先出页面置换算法)")]),_._v(" : 总是淘汰最先进入内存的页面, 即选择在内存中驻留时间最久的页面进行淘汰")]),_._v(" "),v("li",[v("strong",[v("code",[_._v("LRU")]),_._v(" ("),v("code",[_._v("Least Recently Used")]),_._v(") 页面置换算法 (最近最久未使用页面置换算法)")]),_._v(" : "),v("code",[_._v("LRU")]),_._v(" 算法赋予每个页面一个访问字段, 用来记录一个页面自上次被访问以来所经历的时间 T, 当须淘汰一个页面时, 选择现有页面中其 T 值最大的, 即最近最久未使用的页面予以淘汰")]),_._v(" "),v("li",[v("strong",[v("code",[_._v("LFU")]),_._v(" ("),v("code",[_._v("Least Frequently Used")]),_._v(") 页面置换算法 (最少使用页面置换算法)")]),_._v(" : 该置换算法选择在之前时期使用最少的页面作为淘汰页")])])])}),[],!1,null,null,null);v.default=s.exports}}]);