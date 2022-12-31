---
title: HashMap - 源码分析
date: 2022-10-30T17:55:28+08:00
sidebar: 'auto'
categories:
- 面经
- Java
tags:
- Java
- 面经
---

# HashMap - 源码分析

## HashMap 简介

-   `HashMap` 主要用于存放 **键值对**

-   `HashMap` 基于哈希表 `Map` 接口实现, 是常用 (常问) 的 `Java` 集合之一.

-   `HashMap` 是线程非安全的

-   `HashMap` 可以存储 `null key` 和 `null value`. 只能存储一个 `null key`, 可以存储多个 `null value`

-   `HashMap` 底层在 `JDK 1.8` 之前采用 **数组 + 链表** 实现, 数组是 `HashMap` 的主体, 而链表主要是为了解决哈希冲突而存在的 (拉链法)

-   `HashMap` 底层在 `JDK 1.8` 采用 **数组 + 链表 / 红黑树** 实现. 当链表长度大于阙值 (默认为 8), 且数组长度大于等于 64 时, 会将链表转为红黑树, 以减少搜索速度, 而当链表长度大于阙值, 数组长度却小于 64 时, 不会将链表转为数组, 而是进行数组扩容操作

-   `HashMap` 在 `JDK 1.8` 之前默认初始化大小为 11, 之后每次扩容容量变为原来的 `2n + 1` 倍. 若指定初始化容量大小, 则 `HashMap` 会使用指定的容量

-   `HashMap` 在 `JDK 1.8` 默认初始化大小为 16, 之后每次扩容变为原来的 2 倍. 若指定初始化容量的大小, 则 `HashMap` 会将其扩为 2 的幂次方大小. 也就是说, `HashMap` 总是使用 2 的幂作为哈希表的大小



## HashMap 底层数据结构分析

### JDK 1.8 之前

#### 底层数据结构

`JDK 1.8` 之前 `HashMap` 底层是 **数据 + 链表** 结合在一起, 也就是 **链表散列**.

数组是 `HashMap` 的主体, 而链表主要是为了解决哈希冲突而存在的 (拉链法)



>   示图

![JDK1.7中HashMap的数据结构](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202207141457278.png)



#### 元素存放位置的判断

`HashMap` 通过 `key` 的 `hashcode` 经过扰动函数处理后得到 `hash` 值

然后 `HashMap` 通过公式 `(n - 1) & hash` 判断当前元素的存放位置 (`n` : 数组的长度, `hash` : 当前元素的哈希值)

-   如果计算出的位置不存在元素的话, 则直接存入到计算位置
-   如果计算出的位置存在元素的话, 就判断该元素与要存入的元素的 `hash` 值是否相等
    -   如果不相同, 则通过 **拉链法** 解决冲突 (**头插法插入链表, 即最新插入的元素在链头**)
    -   如果相同, 则调用 `equal ()` 方法判断两个 `key` 是否真的相同
        -   如果不同, 则通过 **拉链法** 解决冲突
        -   如果相同, 直接 **覆盖**



#### 扰动函数

扰动函数就是 `HashMap` 的 `hash ()` 方法

使用 `hash ()` 主要是为了防止一些实现比较差的 `hashCode ()` 方法 (**使用扰动函数后可以减少碰撞**)

`JDK 1.8` 之前的扰动函数扰动了 4 次, 比起 `JDK 1.8` 的扰动函数, 性能会差一些



>   源码

```java
static int hash(int h) {
    // This function ensures that hashCodes that differ only by
    // constant multiples at each bit position have a bounded
    // number of collisions (approximately 8 at default load factor).

    h ^= (h >>> 20) ^ (h >>> 12);
    return h ^ (h >>> 7) ^ (h >>> 4);
}
```



#### 拉链法

拉链法 : 将链表和数组相结合

也就是说创建一个链表数组, 数组中每一格就是一个链表. 若遇到哈希冲突, 则将冲突的值加到链表中即可



>   示图

![](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202207141451917.png)





### JDK 1.8

#### 底层数据结构 

`JDK 1.8` 中 `HashMap` 底层是 **数据 + 链表 / 红黑树** 结合在一起

当链表长度大于阙值 (默认为 8), 且数组长度大于等于 64 时, 会将链表转为红黑树, 减少搜索时间

当链表长度大于阙值 (默认为 8), 但数组长度小于 64 时, 则不会将链表转为红黑树, 而是进行数组扩容



>   示图

![](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202207141451910.png)



>   小贴士

`TreeMap`, `TreeSet ` 以及 `JDK1.8` 之后的 `HashMap` 底层都用到了红黑树

红黑树就是为了解决二叉查找树的缺陷, 因为二叉查找树在某些情况下会退化成一个线性结构



#### 扰动函数

`JDK 1.8` 更新了扰动函数, 相较于 `JDK 1.8` 之前的扰动函数, 性能更好

主体思路 : **`hashcode` 值无符号右移 16 位后再亦或 `hashcode` 值**



>   源码

```java
static final int hash(Object key) {
    int h;
    // key.hashCode()：返回散列值也就是hashcode
    // ^ ：按位异或
    // >>>:无符号右移，忽略符号位，空位都以0补齐
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```







## HashMap  源码分析

### 类声明

```java
// 继承自 AbstractMap
// 实现了 Map, Cloneable, Serializable 三个接口
public class HashMap<K,V> extends AbstractMap<K,V>
    implements Map<K,V>, Cloneable, Serializable {
    
}
```



### 属性

```java
/**
 * 序列化 ID
 */
private static final long serialVersionUID = 362498820763181265L;

/**
 * 默认初始容量 - 必须是 2 的幂
 * 默认为 1 << 4, 即 16
 */
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

/**
 * 最大容量, 当具有参数的任何构造函数隐式指定了更高的值时使用
 * 必须是 2 的幂, 即 2 <= capacity <= (1 << 30)
 */
static final int MAXIMUM_CAPACITY = 1 << 30;

/**
 * 构造函数中未指定时使用的默认负载因子
 */
static final float DEFAULT_LOAD_FACTOR = 0.75f;

/**
 * 链表转为红黑树的计数阙值.
 * 当向大于等于阙值的节点中添加元素, 且数组长度大于 MIN_TREEIFY_CAPACITY 时, 链表会转为红黑树
 * 此值必须大于 2, 并且至少应该为 8.
 * 当桶 (bucket) 上的结点数大于这个值时会转成红黑树
 */
static final int TREEIFY_THRESHOLD = 8;

/**
 * 在调整大小操作期间取消检测 (拆分) 箱子的箱子计数阈值
 * 应小于 UNTREEIFY_THRESHOLD 阈值, 最多 6 个网格，并在移除下进行收缩检测。
 * 即当 HashMap 进行 resize 操作时, 如果重新调整后某节点树的节点数小于 UNTREEIFY_THRESHOLD, 则会转为链表
 * 当桶 (bucket) 上的结点数小于这个值时树转链表
 */
static final int UNTREEIFY_THRESHOLD = 6;

/**
 * 存储箱可以树化的最小表容量
 * 否则如果箱子中的节点太多, 则会调整表格的大小
 * 应至少为 4 * TREEIFY_THRESHOLD 阈值, 以避免调整大小和树化阈值之间的冲突
 * 即只有当数组长度大于等于 MIN_TREEIFY_CAPACITY 且该节点链表长度大于等于 TREEIFY_THRESHOLD 时, 才会转化为红黑树
 * 桶中结构转化为红黑树对应的 table 的最小容量
 */
static final int MIN_TREEIFY_CAPACITY = 64;


/**
 * 存储数据的数组
 * 第一次使用时初始化, 并根据需要调整大小
 * 分配时, 长度始终是 2 的幂. (我们在某些操作中也允许长度为零, 以允许当前不需要的自举机制)
 */
transient Node<K,V>[] table;

/**
 * 保留缓存的 entrySet ()
 * 注意, AbstractMap 字段用于 keySet () 和 values ()
 */
transient Set<Map.Entry<K,V>> entrySet;

/**
 * HashMap 的实际容量大小
 */
transient int size;

/**
 * 此 HashMap 在结构上被修改的次数
 * 结构修改是指更改 HashMap 中映射的数量或以其他方式修改其内部结构 (例如, 重新映射) 的次数
 * 该字段用于使 HashMap 集合视图上的迭代器快速失败
 * 见 ConcurrentModificationException
 */
transient int modCount;

/**
 * 临界值
 * threshold = table.length * loadFactor
 * 当哈希表的容量达到阙值后, 则进行扩容操作
 */
// (The javadoc description is true upon serialization.
// Additionally, if the table array has not been allocated, this
// field holds the initial array capacity, or zero signifying
// DEFAULT_INITIAL_CAPACITY.)
int threshold;

/**
 * 负载因子。
 */
final float loadFactor;
```



#### loadFactor 负载因子

`loadFactor` 负载因子是 **控制数组存放数据的疏密程度**.

`loadFactor` 越趋近于 1, 那么数组中存放的数据 (`entry`) 也就越多, 也就越密, 也就会让链表的长度越长

`loadFactor` 越趋近于 0, 那么数组中存放的数据 (`entry`) 也就越少, 也就越少, 也就会让链表的长度越短



**`loadFactor` 太大导致查找效率低, 太小导致数组的利用效率低, 存放的数据会很分散**

**`loadFactor` 的默认值 0.75F 是官方给出的一个比较好的临界值**

给定的默认容量为 16, 负载因子为 0.75. `Map` 在使用过程中不断的往里面存放数据, 当数量达到了 16 * 0.75 = 12 时, 就需要将当前 16 的容量进行扩容, 而扩容这个过程涉及到 `rehash`, 复制数据等操作, 非常耗费性能



#### threshold 临界值

`threshold = capacity * loadFactor`, 当 `size >= threshold` 时, 那么就需要考虑对数组的扩容了, 也就是说 `threshold` 是 **衡量数组是否需要扩容的一个标准**



### 构造方法

`HashMap` 一共有四个构造方法

```java
/**
 * 指定加载因子和初始容量的构造方法
 *
 * @param  initialCapacity 初始容量
 * @param  loadFactor      加载因子
 */
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                           initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                           loadFactor);
    this.loadFactor = loadFactor;
    this.threshold = tableSizeFor(initialCapacity);
}

/**
 * 指定初始容量的构造方法
 * 加载因子为默认的 0.75F
 *
 * @param  initialCapacity 初始容量
 */
public HashMap(int initialCapacity) {
    this(initialCapacity, DEFAULT_LOAD_FACTOR);
}

/**
 * 默认的无参构造方法.
 * 加载因子为默认的 0.75F
 * 初始容量为默认的 16
 */
public HashMap() {
    this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
}

/**
 * 包含另一个 Map 的构造方法
 * HashMap 是使用默认负载因子 (0.75) 创建的, 初始容量足以在指定的映射中保存映射
 *
 * @param   m 要在此 map 中放置其映射的 map
 * @throws  NullPointerException if the specified map is null
 */
public HashMap(Map<? extends K, ? extends V> m) {
    this.loadFactor = DEFAULT_LOAD_FACTOR;
    putMapEntries(m, false);
}
```



#### tableSizeFor () 方法

>   源码

```java
/**
 * 返回给定目标容量的两个大小的幂
 * 用于确保哈希表的长度永远是 2 的幂
 */
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```



>   用途

`tableSizeFor ()` 方法主要用于 **确保哈希表数组的长度永远为 2 的幂**



#### **putMapEntries** () 方法

>   源码

```java
/**
 * 实现映射. putAll 和 Map 构造函数
 *
 * @param m map
 * @param 最初构造此映射时为 false, 否则为true (中继到节点插入后的方法)
 */
final void putMapEntries(Map<? extends K, ? extends V> m, boolean evict) {
    int s = m.size();
    if (s > 0) {
        // 判断 table 是否初始化
        if (table == null) { // pre-size
            // 未初始化, s 为 m 的实际元素个数
            float ft = ((float)s / loadFactor) + 1.0F;
            int t = ((ft < (float)MAXIMUM_CAPACITY) ?
                     (int)ft : MAXIMUM_CAPACITY);
            // 计算得到的 t 大于阙值, 则初始化阙值
            if (t > threshold)
                threshold = tableSizeFor(t);
        }
        else if (s > threshold)
            // 已初始化, 并且 m 的元素个数大于阙值, 进行扩容处理
            resize();
        // 将 m 中所有元素添加到 HashMap 中
        for (Map.Entry<? extends K, ? extends V> e : m.entrySet()) {
            K key = e.getKey();
            V value = e.getValue();
            putVal(hash(key), key, value, false, evict);
        }
    }
}
```



### 内部类

#### Node

```java
/**
 * basic hash bin node
 */
static class Node<K,V> implements Map.Entry<K,V> {
    /**
     * 哈希值, 存放元素到 hashmap 中时用来与其他元素 hash 值比较
     */
    final int hash;
    /**
     * 键
     */
    final K key;
    /**
     * 值
     */
    V value;
    /**
     * 指向下一个节点
     */
    Node<K,V> next;

    Node(int hash, K key, V value, Node<K,V> next) {
        this.hash = hash;
        this.key = key;
        this.value = value;
        this.next = next;
    }

    public final K getKey()        { return key; }
    public final V getValue()      { return value; }
    public final String toString() { return key + "=" + value; }

    // 重写 hashCode () 方法
    public final int hashCode() {
        return Objects.hashCode(key) ^ Objects.hashCode(value);
    }

    public final V setValue(V newValue) {
        V oldValue = value;
        value = newValue;
        return oldValue;
    }

    // 重写 equals () 方法
    public final boolean equals(Object o) {
        if (o == this)
            return true;
        if (o instanceof Map.Entry) {
            Map.Entry<?,?> e = (Map.Entry<?,?>)o;
            if (Objects.equals(key, e.getKey()) &&
                Objects.equals(value, e.getValue()))
                return true;
        }
        return false;
    }
}
```



#### TreeNode

```java
/**
 * Entry for Tree bins
 */
static final class TreeNode<K,V> extends LinkedHashMap.Entry<K,V> {
    /**
     * 父节点
     */
    TreeNode<K,V> parent;  // red-black tree links
    /**
     * 左子树
     */
    TreeNode<K,V> left;
    /**
     * 右子树
     */
    TreeNode<K,V> right;
    /**
     * 删除后需要取消下一个链接
     */
    TreeNode<K,V> prev;    // needed to unlink next upon deletion
    /**
     * 判断颜色
     */
    boolean red;
    TreeNode(int hash, K key, V val, Node<K,V> next) {
        super(hash, key, val, next);
    }
    
    
    /**
     * 返回根节点
     */
    final TreeNode<K,V> root() {
        for (TreeNode<K,V> r = this, p;;) {
            if ((p = r.parent) == null)
                return r;
            r = p;
        }
    }
}
```



### put () 方法

`HashMap` 只提供了 `put ()` 方法用于添加元素, `putVal ()` 方法只是给 `put ()` 方法调用的一个方法, 用户无法使用



#### 源码

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

/**
 * put () 方法具体实现
 *
 * @param hash          key 的 hash 值
 * @param key           key
 * @param value         value
 * @param onlyIfAbsent  如果为 true, 则不更改现有值
 * @param evict         如果为 false, 则表示表处于创建模式
 * @return previous value, or null if none
 */
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    if ((tab = table) == null || (n = tab.length) == 0)
        // table 未初始化或长度为 0, 进行扩容
        n = (tab = resize()).length;
    // (n -1) & hash, 确定元素存放在那个桶中
    if ((p = tab[i = (n - 1) & hash]) == null)
        // 如果桶为空, 新生成节点放入桶中. 此时这个节点是放在数组中
        tab[i] = newNode(hash, key, value, null);
    else {
        // 如果桶不为空
        Node<K,V> e; K k;
        // 比较桶中第一个元素 (数组中的节点) 的 hash 值和 key 值
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            // 如果 hash 相等, 且 key 相等, 则将第一个元素赋值给 e, 用 e 来记录
            e = p;
        // 如果 hash 不相等, 且该节点为红黑树
        else if (p instanceof TreeNode)
            // 调用 putTreeVal () 方法将值放入树中
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        // 如果 hash 不相等, 且该节点为链表
        else {
            // 在链表末尾插入节点
            for (int binCount = 0; ; ++binCount) {
                // 到达链表尾部节点
                if ((e = p.next) == null) {
                    // 插入新节点
                    p.next = newNode(hash, key, value, null);
                    // 如果此时链表长度大于等于 TREEIFY_THRESHOLD - 1, 执行 treeifyBin () 方法
                    // 这个方法会根据 HashMap 数组长度来决定是否转换为红黑树
                    // 如果数组长度大于等于 MIN_TREEIFY_CAPACITY (64), 则转换为红黑树, 反之则进行数组扩容操作
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    // 跳出循环
                    break;
                }
                // 判断链表节点的 key 值与插入元素的 key 值是否相等
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    // 相等, 跳出循环
                    break;
                // 用于遍历桶中的链表, 与前面的 e = p.next 结合, 可以遍历链表
                p = e;
            }
        }
        // 表示在桶中找到 key 值, hash 值与插入元素相等的节点
        if (e != null) { // existing mapping for key
            // 记录 e 的 value
            V oldValue = e.value;
            // onlyIfAbsent 为 false 或者旧值为 null
            if (!onlyIfAbsent || oldValue == null)
                // 用新值代替旧值
                e.value = value;
            // 访问后回调
            afterNodeAccess(e);
            // 返回旧值
            return oldValue;
        }
    }
    // 结构性修改 + 1
    ++modCount;
    // 如果 size > 临界值, 则进行扩容
    if (++size > threshold)
        resize();
    // 插入后回调
    afterNodeInsertion(evict);
    return null;
}
```



#### 分析

1.   检测 `table`, **如果 `table` 未初始化或者 `table` 长度为 0**, 则进行 **扩容操作**

2.   采用 `(n - 1) & hash` 计算元素放在那个桶中

     1.   如果桶为 `null`, 则 **表明该桶还未存放值, 肯定不存在 `hash` 与 `key` 相等的节点**, 所以 **直接新生成节点并放入桶中**

     2.   如果桶不为 `null`, 则 **表明桶中已存放值**, 进行下一步判断, **并申明一个变量 `e` 用于记录需要替换的节点**

          1.   如果桶中的第一个元素的 `hash`, `key` 均与要插入节点的 `hash`, `key` 相等, 则 **证明插入的是重复 key**, 所以 **将该节点赋值给** `e`

          2.   如果桶中的第一个元素的 `hash`, `key` 不等于要插入节点的 `hash`, `key`, 则进行下一步判断

               1.   如果该节点为 **红黑树**, 则 **调用 `putTreeVal ()` 方法将节点放入树中, 返回节点赋值给 `e`**

               2.   如果该节点为 **链表**, 则循环遍历该链表, 判断链表中的节点是否与要插入的元素的 `key` 相等.

                    1.   如果相等, 则 **将该节点赋值给 `e`, 并结束循环**

                    2.   如果不等, 则继续循环, 直到链表末尾

                    3.   如果遍历到链表末尾都未找到相等的节点, 则 **在链表尾部插入新节点**, 并判断该链表长度是否达到阙值 (8). 如果达到阙值, 则调用 `treeifyBin ()` 方法

                         -   如果数组长度大于等于默认值 (MIN_TREEIFY_CAPACITY 64), 则将数组转换为红黑树

                         -   如果数组长度小于默认值, 则对数组进行扩容

                    4.   结束循环

3.   如果 `e != null`, 表明 **在桶中找到了 `key`, `hash` 值与要插入元素相等的节点**, 则记录下 `e` 的 `value` 为 `oldValue`, 并进行下一步判断. 如果 `onlyIfAbsent == false` 或 `oldValue == null`, 则将 `e` 的值替换为要插入的 `value` , 并调用 `afterNodeAccess()` 方进行访问后回调, 最后再返回旧值

4.   如果 `e == null`, 则表明 **在桶中插入了新的节点**, 则 **进行判断 `size` 的大小, 如果 `size` 达到阙值 (`threshold`), 则进行扩容操作**

5.   返回 `null`



#### 流程图

![image-20220718141156824](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202207181411925.png)



### get () 方法

#### 源码

```java
public V get(Object key) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? null : e.value;
}

/**
 * get () 方法的具体实现
 *
 * @param hash   hash for key
 * @param key    the key
 * @return 节点, 如果没有, 则为 null
 */
final Node<K,V> getNode(int hash, Object key) {
    Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
    // 如果 table 已初始化 且 table.length > 0 且 传入 hash 值对应的桶不为 null
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (first = tab[(n - 1) & hash]) != null) {
        // 桶中第一个元素就是要找的值
        if (first.hash == hash && // always check first node
            ((k = first.key) == key || (key != null && key.equals(k))))
            return first;
        // 桶中不止一个节点
        if ((e = first.next) != null) {
            // 如果桶为树, 则从树中获取
            if (first instanceof TreeNode)
                return ((TreeNode<K,V>)first).getTreeNode(hash, key);
            // 如果桶为链表, 则循环遍历, 从链表中获取
            do {
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    return null;
}
```



#### 分析

1.   如果 **`table` 不为 `null` (`table` 已初始化)** 且 **`table` 的长度大于 0** 且 **`table[(n - 1) & hash] != null`**, 则继续进行下一步判断, 否则直接返回 `null`
2.   如果桶中第一个元素等于要找的元素 (`hash == hash && key == key`), 则返回第一个元素, 否则进行下一步判断
3.   如果桶中不止一个元素, 则判断该桶的数据类型
     1.   如果该桶为 **红黑树**, 则从树中取值
     2.   如果该桶为 **链表**, 则从链表中取值
4.   如果找到相等的元素, 则返回, 反之则返回 `null`



### resize () 方法

进行扩容, 会伴随着一次重新 `hash` 分配, 并且会遍历 `hash` 表中所有的元素, 是非常耗时的. 在编写程序中, 要尽量避免 `resize`

#### 源码

```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    // 获取旧 table 的长度
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    // 获取旧 table 的临界值
    int oldThr = threshold;
    int newCap, newThr = 0;
    if (oldCap > 0) {
        // 如果旧 table 的长度大于等于 HashMap 的最大容量 (MAXIMUM_CAPACITY)
        if (oldCap >= MAXIMUM_CAPACITY) {
            // 将 临界值设为 Integer.MAX_VALUE
            threshold = Integer.MAX_VALUE;
            // 返回旧 table 的长度
            return oldTab;
        }
        // 如果没超过最大容量, 则将新容量扩为旧容量的 2 倍 (newCap = oldCap << 1)
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // double threshold
    }
    else if (oldThr > 0) // initial capacity was placed in threshold
        newCap = oldThr;
    else {               // zero initial threshold signifies using defaults
        // 默认无参构造的情况
        // 新容量为 16 (DEFAULT_INITIAL_CAPACITY)
        // 新临界值为 12 (DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY)
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    // 计算新的临界值
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    threshold = newThr;
    @SuppressWarnings({"rawtypes","unchecked"})
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;
    if (oldTab != null) {
        // 把每个桶都移动到新的桶中
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null;
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // preserve order
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;
                        // 原索引
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        // 原索引 + oldCap
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    // 原索引放到桶中
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    // 原索引 + oldCap 放到桶中
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}

```



#### 分析

>   触发扩容的情况

1.   **首次初始化, 有可能是第一个 `put` 操作或者第一个 `putAll` 操作, 也有可能是使用批量添加元素的构造方法**
2.   **已经初始化, `putAll` 批量添加元素, 增加元素的总个数大于临界值**
3.   **已经初始化, `putVal` 添加一个节点后, 节点个数大于临界值**



##### 构造新的哈希桶

构造新的哈希桶, 首先要得得到新的容量才能构造, 并且在构造的同时还得设置临界值

整体流程如下

1.   如果当前桶容量大于 0, 表示已经初始化, 则应该是触发扩容的情况 2 和情况 3, 则 **设置新的容量当为当前容量的 2 倍**, **如果当前容量大于 16, 则设置新的临界值为当前临界值的两倍** (如果使用了指定容量的构造方法, 可能当前容量为小于 16)
2.   否则, 当前临界值大于 0, 表明是初始化并且使用了指定容量的构造器, 将暂存在 `threshold` 的哈希桶的容量取出来, 即 **新的容量等于当前临界值**
3.   否则, 表明是初始化且没有指定容量, 则 **设置新的容量为默认值 (16), 新的临界值为 12 (新的临界值 = 默认容量 * 负载因子)**
4.   如果当前临界值为 0, 则表明上述没有对新的临界值进行赋值, 则 **新的临界值等于新的容量 * 负载因子**
5.   更新全局变量临界值 (`threshold`), 接着根据新的容量构建新的哈希桶, 并且赋值给全局变量 `table`



##### 合并哈希桶

1.   遍历当前哈希桶

2.   如果当前当前哈希桶的下标, 即链表头节点有元素, 则赋值给 `e`

     1.   当前链表头节点设为 `null` (方便 `GC`)

     2.   如果当前链表只有一个节点, 则表示这个链表之前并没有发生哈希冲突, 所以直接位操作取下标放到新的哈希桶上 (这里为什么不用判断头节点的`hash` 值与原哈希桶容量的大小关系呢? 因为是容量翻倍, 如果当前链表只有一个节点, 位操作取下标 (模运算) 后依旧会是一个节点, 所以不管大小, 最后的链表都只会是一个节点)

     3.   否则, 如果头结点是红黑树, 则进行红黑树的的合并操作

     4.   否则, 当前链表节点小于 8, 则需要根据每个节点的 `hash` 值来放入到低位链表或高位链表

          -   遍历当前链表, 利用位运算 `e.hash & oldCap` 来判断当前节点与当前容量的大小关系, 如果 `e.hash & oldCap = 0`, 则表示当前节点的 `hash` 值小于当前容量, 故放入低位链表; 否则, 放入高位链表
          -   遍历结束, 将低位链表放回原位置, 将高位链表放在新位置, `新位置 = 原位置 + 当前容量 (oldCap)`

          

### 查询方法



#### get () 方法

```java
/**
 * Returns the value to which the specified key is mapped,
 * or {@code null} if this map contains no mapping for the key.
 *
 * <p>More formally, if this map contains a mapping from a key
 * {@code k} to a value {@code v} such that {@code (key==null ? k==null :
 * key.equals(k))}, then this method returns {@code v}; otherwise
 * it returns {@code null}.  (There can be at most one such mapping.)
 *
 * <p>A return value of {@code null} does not <i>necessarily</i>
 * indicate that the map contains no mapping for the key; it's also
 * possible that the map explicitly maps the key to {@code null}.
 * The {@link #containsKey containsKey} operation may be used to
 * distinguish these two cases.
 *
 * @see #put(Object, Object)
 */
public V get(Object key) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? null : e.value;
}
```



#### getOrDefault () 方法

```java
@Override
public V getOrDefault(Object key, V defaultValue) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? defaultValue : e.value;
}
```



#### containsKey () 方法

```java
/**
 * Returns <tt>true</tt> if this map contains a mapping for the
 * specified key.
 *
 * @param   key   The key whose presence in this map is to be tested
 * @return <tt>true</tt> if this map contains a mapping for the specified
 * key.
 */
public boolean containsKey(Object key) {
    return getNode(hash(key), key) != null;
}
```



#### containsValue () 方法

```java
/**
 * Returns <tt>true</tt> if this map maps one or more keys to the
 * specified value.
 *
 * @param value value whose presence in this map is to be tested
 * @return <tt>true</tt> if this map maps one or more keys to the
 *         specified value
 */
public boolean containsValue(Object value) {
    Node<K,V>[] tab; V v;
    if ((tab = table) != null && size > 0) {
        for (int i = 0; i < tab.length; ++i) {
            for (Node<K,V> e = tab[i]; e != null; e = e.next) {
                if ((v = e.value) == value ||
                    (value != null && value.equals(v)))
                    return true;
            }
        }
    }
    return false;
}
```



### 删除方法

#### 根据 key 删除

```java
/**
 * Removes the mapping for the specified key from this map if present.
 *
 * @param  key key whose mapping is to be removed from the map
 * @return the previous value associated with <tt>key</tt>, or
 *         <tt>null</tt> if there was no mapping for <tt>key</tt>.
 *         (A <tt>null</tt> return can also indicate that the map
 *         previously associated <tt>null</tt> with <tt>key</tt>.)
 */
public V remove(Object key) {
    Node<K,V> e;
    return (e = removeNode(hash(key), key, null, false, true)) == null ?
        null : e.value;
}
```



##### removeNode () 方法

```java
/**
 * Implements Map.remove and related methods.
 *
 * @param hash hash for key
 * @param key the key
 * @param value the value to match if matchValue, else ignored
 * @param matchValue if true only remove if value is equal
 * @param movable if false do not move other nodes while removing
 * @return the node, or null if none
 */
final Node<K,V> removeNode(int hash, Object key, Object value,
                           boolean matchValue, boolean movable) {
    Node<K,V>[] tab; Node<K,V> p; int n, index;
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (p = tab[index = (n - 1) & hash]) != null) {
        Node<K,V> node = null, e; K k; V v;
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            node = p;
        else if ((e = p.next) != null) {
            if (p instanceof TreeNode)
                node = ((TreeNode<K,V>)p).getTreeNode(hash, key);
            else {
                do {
                    if (e.hash == hash &&
                        ((k = e.key) == key ||
                         (key != null && key.equals(k)))) {
                        node = e;
                        break;
                    }
                    p = e;
                } while ((e = e.next) != null);
            }
        }
        if (node != null && (!matchValue || (v = node.value) == value ||
                             (value != null && value.equals(v)))) {
            if (node instanceof TreeNode)
                ((TreeNode<K,V>)node).removeTreeNode(this, tab, movable);
            else if (node == p)
                tab[index] = node.next;
            else
                p.next = node.next;
            ++modCount;
            --size;
            afterNodeRemoval(node);
            return node;
        }
    }
    return null;
}
```



>   流程

-   首先根据 `key` 找到哈希桶上对应下标的链表, 然后找待删除的节点

-   如果待删除的节点为链表头, 则直接更新链表头

-   否则, 如果链表头为红黑树, 则进行红黑树的删除操作

-   否则, 遍历链表, 找到待删除的节点, 直接删除该节点

-   如果删除成功, 更新操作次数和哈希表的容量, 返回删除的节点

-   如果删除失败, 则返回 `null`



#### 根据 key 和 value 删除

```java
@Override
public boolean remove(Object key, Object value) {
    return removeNode(hash(key), key, value, true, true) != null;
}
```



## JDK 1.8 和 JDK 1.7 的区别

`HashMap` 在 `JDK 1.8` 主要优化为以下几点 :

-   **减少 `hash` 冲突** (优化扰动函数)
-   **提高哈希表的存取效率** (新增红黑树)



### 初始化

`JDK 1.8` 相对于 `JDK 1.7` 在 **初始化** 上发生了一些变化.

-   `JDK 1.7` 中 **`resize ()` 方法负责扩容, `inflateTable ()` 方法负责创建表**
-   `JDK 1.8` 则是 **继承在扩容函数 `resize ()` 方法中, 在表为空时创建表**



### 数据结构

`JDK 1.8` 相对于 `JDK 1.7` 在 **数据结构** 上发生了一些变化.

-   `JDK 1.7` 是 **数组 + 链表**
-   `JDK 1.8` 是 **数组 + 链表 / 红黑树**



>   示图

![HashMap数据结构的区别](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202207141505661.png)



### 数据存储

`JDK 1.8` 相对于 `JDK 1.7` 在 **数据存储** 上发生了一些变化.

-   `JDK 1.7` 使用的是 **头插法**
-   `JDK 1.8` 使用的是 **尾插法**

这样做的原因是 `JDK 1.7` 是用单链表进行的纵向延伸, **当采用头插法时容易出现逆序且环形链表死循环问题**, 但在 `JDK 1.8` 因为加入了红黑树使用尾插法, 能够避免此问题



>   视图

![HashMap数据存储的区别](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202207141507331.png)



### 扩容机制

`JDK 1.8` 相对于 `JDK 1.7` 在 **扩容后数据存储位置的计算方式** 上发生了一些变化.

-   `JDK 1.7` 是 **直接用 `hash` 值和需要扩容的二进制数进行 `&` 运算**
-   `JDK 1.8` 是 **直接使用扩容前的原始位置或加上扩容的大小值**



>   视图

![HashMap扩容后数据存储位置的计算方式的区别](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202207141509328.png)



>   小贴士

在计算 `hash` 值的时候，`JDK 1.7` 用了 9 次扰动处理 (4 次位运算 + 5 次异或), 而 `JDK 1.8` 只用了 2 次扰动处理 (1 次位运算 + 1 次异或)



### 扩容流程

`JDK 1.8` 相对于 `JDK 1.7` 在 **扩容流程** 上发生了一些变化.



>   示图

![HashMap扩容流程的区别](https://typora-photo-yixihan.oss-cn-chengdu.aliyuncs.com/img/202207141511681.png)



### key 为 null 的处理

`JDK 1.8` 相对于 `JDK 1.7` 在 `key == null` 的处理上发生了一些改变

`JDK 1.7` 对 `key == null` 的情况单独处理, `JDK 1.8` 则没有单独处理

但是两个版本中如果 `key == null`, 那么调用 `hash ()` 方法得到的都将是 0, 所以 `key == null` 的元素都始终位于哈希表 `table[0]` 中
