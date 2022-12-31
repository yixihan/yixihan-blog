---
title: ArrayList - 源码分析
date: 2022-10-30T17:55:28+08:00
sidebar: 'auto'
categories:
 - 面经
 - Java
tags: 
 - Java
 - 面经
---

# ArrayList - 源码分析

## ArrayList 简介

`ArrayList` 的底层是数组队列, 相当于动态数组. 

与 Java 中的数组相比, 它的容量能动态增长. 

在添加大量元素前, 应用程序可以使用 `ensureCapacity` 操作来增加 `ArrayList` 实例的容量. 这可以减少递增式再分配的数量. 

`ArrayList` 继承于 **`AbstractList`** , 实现了 **`List`**, **`RandomAccess`**, **`Cloneable`**, **`java.io.Serializable`** 这些接口

-   `RandomAccess` 是一个 **标志接口**, 表明实现这个这个接口的 `List` 集合是支持 **快速随机访问** 的. 在 `ArrayList` 中, 我们即 **可以通过元素的序号快速获取元素对象**, 这就是快速随机访问
-   `ArrayList` 实现了 **`Cloneable` 接口**, 即覆盖了函数 `clone ()`, 能被克隆
-   `ArrayList` 实现了 `java.io.Serializable` 接口, 这意味着 `ArrayList` 支持序列化, 能通过序列化去传输



## ArrayList 核心源码

### 类声明

```java
// 继承自 AbstractList
// 实现了 List, RandomAccess, Cloneable, java.io.Serializable 四个接口
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{
    
}
```



### 属性

```java
/**
 * 序列化 ID
 */
private static final long serialVersionUID = 8683452581122892189L;

/**
 * 默认初始容量大小
 */
private static final int DEFAULT_CAPACITY = 10;

/**
 * 空数组（用于空实例）。
 */
private static final Object[] EMPTY_ELEMENTDATA = {};

/**
 * 用于默认大小空实例的共享空数组实例
 * 我们把它从 EMPTY_ELEMENTDATA 数组中区分出来, 以知道在添加第一个元素时容量需要增加多少
 */
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

/**
 * 保存 ArrayList 数据的数组
 */
transient Object[] elementData; // non-private to simplify nested class access

/**
 * ArrayList 所包含的元素个数
 */
private int size;

/**
 * 能分配的最大数组大小
 * 比 Integer.MAX_VALUE 小 8 的原因是防止 OOM
 */
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
```



### 构造方法

```java
/**
 * 构造具有指定初始容量的空列表
 * 带初始容量参数的构造函数
 * 用户可以在创建 ArrayList 对象时自己指定集合的初始大小
 *
 * @param  initialCapacity   初始容量大小
 * @throws IllegalArgumentException if the specified initial capacity
 *         is negative
 */
public ArrayList(int initialCapacity) {
	if (initialCapacity > 0) {
        //如果传入的参数大于 0, 创建 initialCapacity 大小的数组
		this.elementData = new Object[initialCapacity];
	} else if (initialCapacity == 0) {
        // 如果传入的参数等于 0, 创建空数组
		this.elementData = EMPTY_ELEMENTDATA;
	} else {
        // 其他情况, 抛出异常
		throw new IllegalArgumentException("Illegal Capacity: "+
										   initialCapacity);
	}
}

/**
 * 构造一个初始容量为 10 的空列表
 * 默认无参构造函数
 * DEFAULTCAPACITY_EMPTY_ELEMENTDATA 为0. 初始化为10, 也就是说初始其实是空数组, 当添加第一个元素的时候数组容量才变成 10
 */
public ArrayList() {
	this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}

/**
 * 按照集合迭代器返回的顺序, 构造一个包含指定集合元素的列表
 * 构造一个包含指定集合的元素的列表, 按照它们由集合的迭代器返回的顺序
 *
 * @param c   要将其元素放入此列表的集合
 * @throws NullPointerException if the specified collection is null
 */
public ArrayList(Collection<? extends E> c) {
    // 将指定集合转换为数组
	Object[] a = c.toArray();
    // 如果 a 数组长度不为 0
	if ((size = a.length) != 0) {
        // 如果 c 的类型为 ArrayList
		if (c.getClass() == ArrayList.class) {
            // 直接赋值
			elementData = a;
		} else {
            // 其他情况, 将 a 数组内的内容, 赋值给 elementData 数组
			elementData = Arrays.copyOf(a, size, Object[].class);
		}
	} else {
		// 其他情况, 用空数组代替.
		elementData = EMPTY_ELEMENTDATA;
	}
}
```



### 扩容机制

```java
/**
 * 如有必要, 增加此 ArrayList 实例的容量, 以确保它至少可以容纳由最小容量参数指定的元素数
 *
 * 用于 DenseIntMapImpl.extend () 方法和大量数据添加时预先确保列表可容纳大量数组 (可减少扩容次数, 提高效率)
 *
 * @param   minCapacity   所需的最小容量
 */
public void ensureCapacity(int minCapacity) {
    // 如果是 true, minExpand = 0
    // 如果是 false, minExpand = DEFAULT_CAPACITY (10)
	int minExpand = (elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA)
		// any size if not default element table
		? 0
		// larger than default for default empty table. It's already
		// supposed to be at default size.
		: DEFAULT_CAPACITY;

    // 如果最小容量大于已有最大容量
	if (minCapacity > minExpand) {
		ensureExplicitCapacity(minCapacity);
	}
}

/**
 * 1. 得到最小扩容量
 * 2. 通过最小扩容量扩容
 *
 * 用于 ensureCapacityInternal (), readObject () 方法
 */
private static int calculateCapacity(Object[] elementData, int minCapacity) {
	// 如果是空列表 (无参构造方法创建的列表)
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        // 获取默认的容量和传入参数两者之间的最大值
		return Math.max(DEFAULT_CAPACITY, minCapacity);
	}
    // 返回最小扩容量
	return minCapacity;
}

/**
 * 判断是否需要扩容
 * 先判断是否为空列表 (calculateCapacity () 方法)
 *  - 如果是空列表, 返回最小扩容量和默认容量两者最大值
 *  - 如果不是空列表, 返回最小扩容量
 * 再判断最小扩容量是否小于数组长度 (ensureExplicitCapacity () 方法)
 *  - 如果小于, 则不扩容
 *  - 如果大于, 则进行扩容操作 (grow () 方法)
 *
 * 用于 add (), addAll (), readObject () 方法
 */
private void ensureCapacityInternal(int minCapacity) {
	ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
}

/**
 * 判断最小扩容量是否小于数组长度
 *
 * 用于 ensureCapacityInternal (), ensureCapacity () 方法
 */
private void ensureExplicitCapacity(int minCapacity) {
	modCount++;

	// overflow-conscious code
	if (minCapacity - elementData.length > 0)
        // 调用 grow () 方法进行扩容, 调用此方法表示已经开始扩容了
		grow(minCapacity);
}


/**
 * 能分配的最大数组大小
 */
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

/**
 * 增加容量,以确保它至少可以容纳由最小容量参数指定的元素数。
 * 扩容机制核心方法
 *
 * 用于 ensureExplicitCapacity () 方法
 *
 * @param minCapacity   所需的最小容量
 */
private void grow(int minCapacity) {
	// oldCapacity 为旧容量, newCapacity 为新容量
	int oldCapacity = elementData.length;
    // oldCapacity + (oldCapacity >> 1) = 1.5 倍 oldCapacity
    // oldCapacity >> 1, 将 oldCapacity 右移一位, 相当于 oldCapacity / 2, 比起除法这样效率更高
	int newCapacity = oldCapacity + (oldCapacity >> 1);
    // 如果新容量小于最小需要容量, 则新容量为最小需要容量
	if (newCapacity - minCapacity < 0)
		newCapacity = minCapacity;
    // 如果新容量大于能分配的最大容量
	if (newCapacity - MAX_ARRAY_SIZE > 0)
        // 调用 hugeCapacity () 方法获得一个新容量
        // 如果 minCapacity > MAX_ARRAY_SIZE, 则 newCapacity = Integer.MAX_VALUE
        // 如果 minCapacity < MAX_ARRAY_SIZE, 则 newCapacity = MAX_ARRAY_SIZE
		newCapacity = hugeCapacity(minCapacity);
	// minCapacity is usually close to size, so this is a win:
	elementData = Arrays.copyOf(elementData, newCapacity);
}

/**
 * 比较 minCapacity 和 MAX_ARRAY_SIZE
 *
 * 用于 grow () 方法
 */
private static int hugeCapacity(int minCapacity) {
	if (minCapacity < 0) // overflow
		throw new OutOfMemoryError();
	return (minCapacity > MAX_ARRAY_SIZE) ?
		Integer.MAX_VALUE :
		MAX_ARRAY_SIZE;
}
```



### 增删改查遍历

```java
/**
 * 如果此列表中包含指定的元素, 则返回 true, 否则返回 false
 *
 * @param o   要测试其在该列表中的存在的元素
 * @return    如果此列表包含指定元素, 则为true
 */
public boolean contains(Object o) {
    // 调用 indexOf () 方法判读 
	return indexOf(o) >= 0;
}

/**
 * 返回此列表中指定元素的首次出现的索引, 如果此列表不包含此元素, 则为 -1
 */
public int indexOf(Object o) {
	if (o == null) {
        // 如果 o 为 null, 则 for 循环正向遍历, 返回列表中第一个为 null 的
		for (int i = 0; i < size; i++)
			if (elementData[i]==null)
				return i;
	} else {
        // 否则 for 循环正向遍历, 并利用 equals () 方法比较
		for (int i = 0; i < size; i++)
			if (o.equals(elementData[i]))
				return i;
	}
	return -1;
}

/**
 * 返回此列表中指定元素最后一次出现的索引, 如果此列表中不包含次元素, 则返回 -1
 */
public int lastIndexOf(Object o) {
	if (o == null) {
        // 如果 o 为 null, 则 for 循环逆向遍历, 返回列表中第一个为 null 的
		for (int i = size-1; i >= 0; i--)
			if (elementData[i]==null)
				return i;
	} else {
        // 否则 for 循环逆向遍历, 并利用 equals () 方法比较
		for (int i = size-1; i >= 0; i--)
			if (o.equals(elementData[i]))
				return i;
	}
	return -1;
}

/**
 * 缺省方法, 返回列表中指定位置的元素
 *
 */
@SuppressWarnings("unchecked")
E elementData(int index) {
	return (E) elementData[index];
}

/**
 * 返回此列表中指定位置的元素
 * 步骤 :
 *   	1. 调用 rangeCheck () 方法对 index 进行界限检查
 *		2. 调用 elementData () 方法返回元素
 *
 * @param  index   要返回的元素的索引
 * @return  	   此列表中指定位置的元素
 * @throws IndexOutOfBoundsException {@inheritDoc}
 */
public E get(int index) {
    // 调用 rangeCheck () 方法检测 index
	rangeCheck(index);

    // 调用 elementData () 方法返回指定位置的元素
	return elementData(index);
}

/**
 * 用指定的元素替换此列表中指定位置的元素
 *
 * @param index   要替换的元素的索引
 * @param element 存储在指定位置的元件
 * @return   	  之前位于指定位置的元素
 * @throws IndexOutOfBoundsException {@inheritDoc}
 */
public E set(int index, E element) {
    // 调用 rangeCheck () 方法对 index 进行界限检查
	rangeCheck(index);

	E oldValue = elementData(index);
    // 替换新值
	elementData[index] = element;
    // 返回旧值
	return oldValue;
}

/**
 * 将指定的元素追加到此列表的末尾
 *
 * 步骤 :
 *		1. 判断是否需要扩容
 *		2. 添加元素, size++
 *		3. 返回 true
 *
 * @param e   要附加到此列表的元素
 * @return    true（由Collection.add指定）
 */
public boolean add(E e) {
    // 确保列表的容量能满足需求
	ensureCapacityInternal(size + 1);  // Increments modCount!!
    // 添加元素
	elementData[size++] = e;
	return true;
}

/**
 * 在此列表中的指定位置插入指定的元素
 *
 * 步骤 : 
 *		1. 对 index 进行界限检查
 *		2. 判断是否需要扩容
 *		3. 将 index 开始后所有元素后移一个位置
 *		4. 将 element 插入 index 位置
 *		5. size++
 *
 * @param index   要插入指定元素的索引
 * @param element 要插入的元素
 * @throws IndexOutOfBoundsException {@inheritDoc}
 */
public void add(int index, E element) {
    // 对 index 进行界限检查
	rangeCheckForAdd(index);

    // 确保列表的容量能满足需求
	ensureCapacityInternal(size + 1);  // Increments modCount!!
    // 将 index 开始后所有元素后移一个位置
    // 通过调用 System.arrayCopy () 方法实现
	System.arraycopy(elementData, index, elementData, index + 1,
					 size - index);
    // 插入 element
	elementData[index] = element;
    // size++
	size++;
}

/**
 * 删除该列表指定位置的元素, 将任何后续元素移动到左侧
 *
 * @param index    要删除的元素的索引
 * @return  	   从列表中删除的元素
 * @throws IndexOutOfBoundsException {@inheritDoc}
 */
public E remove(int index) {
    // 界限检查
	rangeCheck(index);

	modCount++;
	E oldValue = elementData(index);

    // 判断 index 后面是否还有元素
	int numMoved = size - index - 1;
	if (numMoved > 0)
        //如果还有元素, 后面所有元素整体前移一位
		System.arraycopy(elementData, index+1, elementData, index,
						 numMoved);
    // 最后一位元素置为 null
	elementData[--size] = null; // clear to let GC do its work

    //返回被删除的元素
	return oldValue;
}

/**
 * 从列表中删除第一个出现的指定元素 (如果存在). 如果列表中不包含该元素, 则列表不会更改
 *
 * @param o   要从此列表中删除的元素（如果存在）
 * @return 	  如果此列表包含指定元素,则为true
 */
public boolean remove(Object o) {
	if (o == null) {
        // 如果 o 为 null, 调用 for 循环正向遍历, 找到第一个为 null 的索引
		for (int index = 0; index < size; index++)
			if (elementData[index] == null) {
                // 调用 fastRemove () 方法删除
				fastRemove(index);
                // 返回 true
				return true;
			}
	} else {
        // 如果 o 不为 null, 调用 for 循环正向遍历, 找到等于 o 元素的索引
		for (int index = 0; index < size; index++)
			if (o.equals(elementData[index])) {
				// 调用 fastRemove () 方法删除
				fastRemove(index);
                // 返回 true
				return true;
			}
	}
    //如果没找到, 则返回 false
	return false;
}

/*
 * 私有方法. 删除指定位置的元素, 并将其后面的全部元素 (如果有) 前移一位
 */
private void fastRemove(int index) {
	modCount++;
	int numMoved = size - index - 1;
	if (numMoved > 0)
		System.arraycopy(elementData, index+1, elementData, index,
						 numMoved);
	elementData[--size] = null; // clear to let GC do its work
}

/**
 * 从列表中删除所有元素
 */
public void clear() {
	modCount++;

	// clear to let GC do its work
	for (int i = 0; i < size; i++)
		elementData[i] = null;

	size = 0;
}

/**
 * 按指定集合的 Iterator 返回的顺序将指定集合中的所有元素追加到此列表的末尾
 *
 * @param c   包含要添加到此列表的元素的集合
 * @return    如果此列表因调用而更改,则为true
 * @throws NullPointerException if the specified collection is null
 */
public boolean addAll(Collection<? extends E> c) {
    // 调用 toArray () 方法将传入的列表转为数组
	Object[] a = c.toArray();
	int numNew = a.length;
    // 确保列表的容量能满足需求
	ensureCapacityInternal(size + numNew);  // Increments modCount
    // 复制元素到列表中
	System.arraycopy(a, 0, elementData, size, numNew);
	size += numNew;
	return numNew != 0;
}

/**
 * 将指定集合中的所有元素插入到此列表中, 从指定的位置开始
 *
 * @param index   从指定集合中插入第一个元素的索引
 * @param c 	  包含要添加到此列表的元素的集合
 * @return 		  如果此列表因调用而更改,则为true
 * @throws IndexOutOfBoundsException {@inheritDoc}
 * @throws NullPointerException if the specified collection is null
 */
public boolean addAll(int index, Collection<? extends E> c) {
    // 界限检查
	rangeCheckForAdd(index);

    // 调用 toArray () 方法将传入的列表转为数组
	Object[] a = c.toArray();
	int numNew = a.length;
    // 确保列表的容量能满足需求
	ensureCapacityInternal(size + numNew);  // Increments modCount

    // 判断指定位置后面是否还有元素
	int numMoved = size - index;
	if (numMoved > 0)
        //如果还有, 则将 index 后面所有元素移动 munNew 个位置
		System.arraycopy(elementData, index, elementData, index + numNew,
						 numMoved);

    // 复制元素到列表中
	System.arraycopy(a, 0, elementData, index, numNew);
	size += numNew;
	return numNew != 0;
}

/**
 * 从此列表中删除所有索引为 fromIndex (含) 和 toIndex 之间的元素
 * 将任何后续元素移动到左侧 (减少其索引)
 * 删除 [fromIndex, toIndex) 之间的所有元素
 *
 * @throws IndexOutOfBoundsException if {@code fromIndex} or
 *         {@code toIndex} is out of range
 *         ({@code fromIndex < 0 ||
 *          fromIndex >= size() ||
 *          toIndex > size() ||
 *          toIndex < fromIndex})
 */
protected void removeRange(int fromIndex, int toIndex) {
	modCount++;
	int numMoved = size - toIndex;
    // 移动元素
	System.arraycopy(elementData, toIndex, elementData, fromIndex,
					 numMoved);

	// clear to let GC do its work
    // 计算出新 size
	int newSize = size - (toIndex-fromIndex);
    // 将 [newSize, size) 之间所有元素置为 null
	for (int i = newSize; i < size; i++) {
		elementData[i] = null;
	}
	size = newSize;
}


/**
 * 私有方法. 检查给定的索引是否在范围内
 * get (), set (), remove () 中使用的界限检查方法
 */
private void rangeCheck(int index) {
	if (index >= size)
		throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
}

/**
 * 私有方法. 检查给定的索引是否在范围内
 * add () 和 addAll () 使用的 rangeCheck () 的一个版本
 */
private void rangeCheckForAdd(int index) {
	if (index > size || index < 0)
		throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
}

/**
 * 私有方法. 返回 IndexOutOfBoundException 细节信息
 * 用于 rangeCheck(), rangeCheckForAdd() 方法
 */
private String outOfBoundsMsg(int index) {
	return "Index: "+index+", Size: "+size;
}

/**
 * 从此列表中删除指定集合中包含的所有元素
 *
 * @param c   包含要从此列表中删除的元素的集合
 * @return    如果此列表因调用而更改,则为true
 * @throws ClassCastException if the class of an element of this list
 *         is incompatible with the specified collection
 * (<a href="Collection.html#optional-restrictions">optional</a>)
 * @throws NullPointerException if this list contains a null element and the
 *         specified collection does not permit null elements
 * (<a href="Collection.html#optional-restrictions">optional</a>),
 *         or if the specified collection is null
 * @see Collection#contains(Object)
 */
public boolean removeAll(Collection<?> c) {
	Objects.requireNonNull(c);
	return batchRemove(c, false);
}


/**
 * 保留此列表中包含在指定集合中的元素
 * 从此列表中删除不包含在指定集合中的所有元素
 *
 * @param c   包含要保留在此列表中的元素的集合
 * @return    如果此列表因调用而更改, 则为 true
 * @throws ClassCastException if the class of an element of this list
 *         is incompatible with the specified collection
 * (<a href="Collection.html#optional-restrictions">optional</a>)
 * @throws NullPointerException if this list contains a null element and the
 *         specified collection does not permit null elements
 * (<a href="Collection.html#optional-restrictions">optional</a>),
 *         or if the specified collection is null
 * @see Collection#contains(Object)
 */
public boolean retainAll(Collection<?> c) {
	Objects.requireNonNull(c);
	return batchRemove(c, true);
}

/**
 * 私有方法. 
 * 当 complement 为 true 时删除该列表中不包含在 c 集合中的所有元素
 * 当 complement 为 false 时删除该列表中包含在 c 集合中的所有元素
 *
 * 用于 removeAll (), retainAll () 方法
 */
private boolean batchRemove(Collection<?> c, boolean complement) {
	final Object[] elementData = this.elementData;
	int r = 0, w = 0;
	boolean modified = false;
	try {
		for (; r < size; r++)
			if (c.contains(elementData[r]) == complement)
				elementData[w++] = elementData[r];
	} finally {
		// Preserve behavioral compatibility with AbstractCollection,
		// even if c.contains() throws.
		if (r != size) {
			System.arraycopy(elementData, r,
							 elementData, w,
							 size - r);
			w += size - r;
		}
		if (w != size) {
			// clear to let GC do its work
			for (int i = w; i < size; i++)
				elementData[i] = null;
			modCount += size - w;
			size = w;
			modified = true;
		}
	}
	return modified;
}

/**
 * 从列表的指定位置开始, 返回列表中的元素 (按正确顺序) 的列表迭代器
 * 指定的索引表示初始调用将返回的第一个元素为 next. 初始调用 previous 将返回指定索引减一的元素
 * 返回的列表迭代器是 fail-fast
 *
 * @throws IndexOutOfBoundsException {@inheritDoc}
 */
public ListIterator<E> listIterator(int index) {
	if (index < 0 || index > size)
		throw new IndexOutOfBoundsException("Index: "+index);
	return new ListItr(index);
}

/**
 * 返回列表中的列表迭代器 (按适当的顺序)
 * 返回的列表迭代器是 fail-fast
 *
 * @see #listIterator(int)
 */
public ListIterator<E> listIterator() {
	return new ListItr(0);
}

/**
 * 以正确的顺序返回该列表中的元素的迭代器
 * 返回的列表迭代器是 fail-fast
 *
 * @return 按适当顺序遍历此列表中元素的迭代器
 */
public Iterator<E> iterator() {
	return new Itr();
}
```



### 其他方法

```java
/**
 * 修改这个 ArrayList 实例的容量是列表的当前大小
 * 应用程序可以使用此操作来最小化 ArrayList 实例的存储
 */
public void trimToSize() {
	modCount++;
	if (size < elementData.length) {
		elementData = (size == 0)
		  ? EMPTY_ELEMENTDATA
		  : Arrays.copyOf(elementData, size);
	}
}


/**
 * 返回此列表中的元素数
 */
public int size() {
	return size;
}

/**
 * 如果此列表不包含元素，则返回 true
 */
public boolean isEmpty() {
	return size == 0;
}


/**
 * 返回此 ArrayList 实例的浅拷贝 (元素本身不被复制)
 */
public Object clone() {
	try {
		ArrayList<?> v = (ArrayList<?>) super.clone();
		v.elementData = Arrays.copyOf(elementData, size);
		v.modCount = 0;
		return v;
	} catch (CloneNotSupportedException e) {
		// this shouldn't happen, since we are Cloneable
		throw new InternalError(e);
	}
}


/**
 * 以正确的顺序 (从第一个到最后一个元素) 返回一个包含此列表中所有元素的数组。
 * 返回的数组将是 "安全的", 因为该列表不保留对它的引用 (换句话说,这个方法必须分配一个新的数组)
 * 因此, 调用者可以自由地修改返回的数组. 此方法充当基于阵列和基于集合的 API 之间的桥梁。
 */
public Object[] toArray() {
	return Arrays.copyOf(elementData, size);
}

/**
 * 以正确的顺序返回一个包含此列表中所有元素的数组 (从第一个到最后一个元素)
 * 返回的数组的运行时类型是指定数组的运行时类型. 如果列表适合指定的数组, 则返回其中
 * 否则, 将为指定数组的运行时类型和此列表的大小分配一个新数组
 * 如果列表适用于指定的数组, 其余空间 (即数组的列表数量多于此元素), 则紧跟在集合结束后的数组中的元素设置为 null
 * 这仅在调用者知道列表不包含任何空元素的情况下才能确定列表的长度
 */
@SuppressWarnings("unchecked")
public <T> T[] toArray(T[] a) {
	if (a.length < size)
		// Make a new array of a's runtime type, but my contents:
		return (T[]) Arrays.copyOf(elementData, size, a.getClass());
	System.arraycopy(elementData, 0, a, 0, size);
	if (a.length > size)
		a[size] = null;
	return a;
}


/**
 * 将 ArrayList 实例的状态保存到流 (即序列化它)
 *
 */
private void writeObject(java.io.ObjectOutputStream s)
	throws java.io.IOException{
	// Write out element count, and any hidden stuff
	int expectedModCount = modCount;
	s.defaultWriteObject();

	// Write out size as capacity for behavioural compatibility with clone()
	s.writeInt(size);

	// Write out all elements in the proper order.
	for (int i=0; i<size; i++) {
		s.writeObject(elementData[i]);
	}

	if (modCount != expectedModCount) {
		throw new ConcurrentModificationException();
	}
}

/**
 * 从流中重构 ArrayList 实例 (即, 反序列化它)
 */
private void readObject(java.io.ObjectInputStream s)
	throws java.io.IOException, ClassNotFoundException {
	elementData = EMPTY_ELEMENTDATA;

	// Read in size, and any hidden stuff
	s.defaultReadObject();

	// Read in capacity
	s.readInt(); // ignored

	if (size > 0) {
		// be like clone(), allocate array based upon size not capacity
		int capacity = calculateCapacity(elementData, size);
		SharedSecrets.getJavaOISAccess().checkArray(s, Object[].class, capacity);
		ensureCapacityInternal(size);

		Object[] a = elementData;
		// Read in all elements in the proper order.
		for (int i=0; i<size; i++) {
			a[i] = s.readObject();
		}
	}
}

/*
 * 排序方法. 传入一个定制排序实现类
 */
@Override
@SuppressWarnings("unchecked")
public void sort(Comparator<? super E> c) {
	final int expectedModCount = modCount;
	Arrays.sort((E[]) elementData, 0, size, c);
	if (modCount != expectedModCount) {
		throw new ConcurrentModificationException();
	}
	modCount++;
}
```



## ArrayList 扩容机制详解

### ArrayList 的构造方法

`ArrayList` 一共有 3 个构造方法

```java
/**
 * 默认初始容量大小
 */
private static final int DEFAULT_CAPACITY = 10;

/**
 * 空数组（用于空实例）。
 */
private static final Object[] EMPTY_ELEMENTDATA = {};

/**
 * 用于默认大小空实例的共享空数组实例
 * 我们把它从 EMPTY_ELEMENTDATA 数组中区分出来, 以知道在添加第一个元素时容量需要增加多少
 */
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

/**
 * 构造具有指定初始容量的空列表
 * 带初始容量参数的构造函数
 * 用户可以在创建 ArrayList 对象时自己指定集合的初始大小
 *
 * @param  initialCapacity   初始容量大小
 * @throws IllegalArgumentException if the specified initial capacity
 *         is negative
 */
public ArrayList(int initialCapacity) {
	if (initialCapacity > 0) {
        //如果传入的参数大于 0, 创建 initialCapacity 大小的数组
		this.elementData = new Object[initialCapacity];
	} else if (initialCapacity == 0) {
        // 如果传入的参数等于 0, 创建空数组
		this.elementData = EMPTY_ELEMENTDATA;
	} else {
        // 其他情况, 抛出异常
		throw new IllegalArgumentException("Illegal Capacity: "+
										   initialCapacity);
	}
}

/**
 * 构造一个初始容量为 10 的空列表
 * 默认无参构造函数
 * DEFAULTCAPACITY_EMPTY_ELEMENTDATA 为0. 初始化为10, 也就是说初始其实是空数组, 当添加第一个元素的时候数组容量才变成 10
 */
public ArrayList() {
	this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}

/**
 * 按照集合迭代器返回的顺序, 构造一个包含指定集合元素的列表
 * 构造一个包含指定集合的元素的列表, 按照它们由集合的迭代器返回的顺序
 *
 * @param c   要将其元素放入此列表的集合
 * @throws NullPointerException if the specified collection is null
 */
public ArrayList(Collection<? extends E> c) {
    // 将指定集合转换为数组
	Object[] a = c.toArray();
    // 如果 a 数组长度不为 0
	if ((size = a.length) != 0) {
        // 如果 c 的类型为 ArrayList
		if (c.getClass() == ArrayList.class) {
            // 直接赋值
			elementData = a;
		} else {
            // 其他情况, 将 a 数组内的内容, 赋值给 elementData 数组
			elementData = Arrays.copyOf(a, size, Object[].class);
		}
	} else {
		// 其他情况, 用空数组代替.
		elementData = EMPTY_ELEMENTDATA;
	}
}
```

**以无参构造方法创建 `ArrayList` 时, 实际上初始化赋值的是一个空数组 (`this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;`)**

**当真正对数组进行添加元素操作时, 才真正分配容量. 即向数组中添加第一个元素时, 数组容量扩为 10**



### 深入扩容机制

#### add () 方法

>   `add ()` 方法源码

```java
/**
 * 将指定的元素追加到此列表的末尾
 *
 * 步骤 :
 *		1. 判断是否需要扩容
 *		2. 添加元素, size++
 *		3. 返回 true
 *
 * @param e   要附加到此列表的元素
 * @return    true（由Collection.add指定）
 */
public boolean add(E e) {
    // 确保列表的容量能满足需求
	ensureCapacityInternal(size + 1);  // Increments modCount!!
    // 添加元素
	elementData[size++] = e;
	return true;
}
```



>   分析

当添加新元素时, **首先会执行 `ensureCapacityInternal ()` 方法确保列表能装下新元素**, 然后才会进行添加操作



#### 检测是否需要扩容的三个方法

>   `ensureCapacityInternal ()` 方法源码

```java
/**
 * 判断是否需要扩容
 * 先判断是否为空列表 (calculateCapacity () 方法)
 *  - 如果是空列表, 返回最小扩容量和默认容量两者最大值
 *  - 如果不是空列表, 返回最小扩容量
 * 再判断最小扩容量是否小于数组长度 (ensureExplicitCapacity () 方法)
 *  - 如果小于, 则不扩容
 *  - 如果大于, 则进行扩容操作 (grow () 方法)
 *
 * 用于 add (), addAll (), readObject () 方法
 */
private void ensureCapacityInternal(int minCapacity) {
	ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
}
```



>   `calculateCapacity ()` 方法源码

```java
/**
 * 1. 得到最小扩容量
 * 2. 通过最小扩容量扩容
 *
 * 用于 ensureCapacityInternal (), readObject () 方法
 */
private static int calculateCapacity(Object[] elementData, int minCapacity) {
	// 如果是空列表 (无参构造方法创建的列表)
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        // 获取默认的容量和传入参数两者之间的最大值
		return Math.max(DEFAULT_CAPACITY, minCapacity);
	}
    // 返回最小扩容量
	return minCapacity;
}
```



>   `ensureExplicitCapacity ()` 方法源码

```java
/**
 * 判断最小扩容量是否小于数组长度
 *
 * 用于 ensureCapacityInternal (), ensureCapacity () 方法
 */
private void ensureExplicitCapacity(int minCapacity) {
	modCount++;

	// overflow-conscious code
	if (minCapacity - elementData.length > 0)
        // 调用 grow () 方法进行扩容, 调用此方法表示已经开始扩容了
		grow(minCapacity);
}
```



>   分析

当用无参构造创建一个新的 `ArrayList` 列表后, 调用 `add ()` 方法添加第一个元素时, 步骤如下 :

1.   `add ()` 方法调用 `ensureCapacityInternal ()` 方法, 传入参数为 `size + 1` (即 `minCapacity = size + 1`), 以 **确保列表可以添加新元素**
2.   `ensureCapacityInternal ()` 方法调用 `calculateCapacity ()` 方法, 传入参数为 `minCapacity`, 以 **确定最小需要容量**
     1.   `calculateCapacity ()`  方法中, **检查 `elementData` 是否为 `DEFAULTCAPACITY_EMPTY_ELEMENTDATA` (无参构造时指定 `elementData` 为此空数组)**
          -   如果相等, 则 **证明此时列表为空列表, 返回默认容量大小与传入最小需求容量两者的最大值**
          -   如果不等, 则 **证明此时列表不为空列表, 返回传入的最小需求容量**
3.   确定好真正的最小需求容量 (即 `minCapacity`) 后, 再调用 `ensureExplicitCapacity ()` 方法, 传入参数为 `minCapacity`, 以 **确定是否需要扩容操作**
4.   `ensureExplicitCapacity ()` 方法中, 对比 `minCapacity` 和 `elementData.length` 的大小
     -   如果 `minCapacity > elementData.length`, 则表明 **列表需要扩容, 调用 `grow ()` 方法进行扩容**
     -   如果 `minCapacity <= elementData.length`, 则表明 **列表不需要扩容**



#### grow () 方法

>   `grow ()` 方法源码

```java
/**
 * 能分配的最大数组大小
 */
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

/**
 * 增加容量,以确保它至少可以容纳由最小容量参数指定的元素数。
 * 扩容机制核心方法
 *
 * 用于 ensureExplicitCapacity () 方法
 *
 * @param minCapacity   所需的最小容量
 */
private void grow(int minCapacity) {
	// oldCapacity 为旧容量, newCapacity 为新容量
	int oldCapacity = elementData.length;
    // oldCapacity + (oldCapacity >> 1) = 1.5 倍 oldCapacity
    // oldCapacity >> 1, 将 oldCapacity 右移一位, 相当于 oldCapacity / 2, 比起除法这样效率更高
	int newCapacity = oldCapacity + (oldCapacity >> 1);
    // 如果新容量小于最小需要容量, 则新容量为最小需要容量
	if (newCapacity - minCapacity < 0)
		newCapacity = minCapacity;
    // 如果新容量大于能分配的最大容量
	if (newCapacity - MAX_ARRAY_SIZE > 0)
        // 调用 hugeCapacity () 方法获得一个新容量
        // 如果 minCapacity > MAX_ARRAY_SIZE, 则 newCapacity = Integer.MAX_VALUE
        // 如果 minCapacity < MAX_ARRAY_SIZE, 则 newCapacity = MAX_ARRAY_SIZE
		newCapacity = hugeCapacity(minCapacity);
	// minCapacity is usually close to size, so this is a win:
	elementData = Arrays.copyOf(elementData, newCapacity);
}
```



>   `hugeCapacity ()` 方法源码

```java
/**
 * 比较 minCapacity 和 MAX_ARRAY_SIZE
 *
 * 用于 grow () 方法
 */
private static int hugeCapacity(int minCapacity) {
	if (minCapacity < 0) // overflow
		throw new OutOfMemoryError();
	return (minCapacity > MAX_ARRAY_SIZE) ?
		Integer.MAX_VALUE :
		MAX_ARRAY_SIZE;
}
```



>   分析

`grow ()` 方法分为以下几个步骤 :

1.   获取 **旧列表容量 (`oldCapacity`), 新列表容量 (`newCapacity`)**
     -   旧列表容量 :  `oldCapacity = elementData.length`
     -   新列表容量 : `newCapacity = oldCapacity + (oldCapacity >> 1)`, 即 **新列表容量大小为旧容量列表的 1.5 倍左右 (取决于 `oldCapacity` 的奇偶性)**
2.   对比 **新列表容量 (`newCapacity`) 与 最小需求容量 (`minCapacity`) 的大小**
     -   如果 `newCapacity >= minCapacity`, 则 **证明新列表容量能满足扩容需求, 不需要变化, 进行下一步**
     -   如果 `newCapacity < minCapacity`, 则 **证明新列表容量不能满足扩容需求, 直接将 `newCapacity` 赋值为 `minCapacity`**
3.   对比 **新列表容量 (`newCapacity`) 与 能分配的最大数组大小 (`MAX_ARRAY_SIZE`) 的大小**
     -   如果 `newCapacity > MAX_ARRAY_SIZE`, 则 **证明新列表容量超出了能分配的最大值, 需要调用 `hugeCapacity (minCapacity)` 方法以确定新列表容量的值**
     -   如果 `newCapacity <= MAX_ARRAY_SIZE`, 则 **证明新列表容量未超出能分配的最大值, 不需要变化, 进行下一步**
4.   调用 `Arrays.copyOf ()` 方法扩容数组



`hugeCapacity ()` 方法用于当 `newCapacity > MAX_ARRAY_SIZE` 时, 计算出新的 `newCapacity`

-   如果 `minCapacity < 0`, 则抛 `OOM` 异常
-   如果 `minCapacity > MAX_ARRAY_SIZE`, 则返回 `Integer.MAX_VALUE`
-   如果 `minCapacity < MAX_ARRAY_SIZE`, 则返回 `MAX_ARRAY_SIZE`



#### System.Arraycopy () 方法和 Arrays.copyOf () 方法

在 `ArrayList` 中, 大量的调用了这个两个方法, 包括 `add (int index, E element)`, `toArray ()` 等方法



#####  System.Arraycopy () 方法

>   源码

```java
/*
 * native 方法. 用于复制数组
 *
 * @param      src      源数组
 * @param      srcPos   源数组中的起始位置
 * @param      dest     目标数组
 * @param      destPos  目标数组中的起始位置
 * @param      length   要复制的数组元素的数量
 */
public static native void arraycopy(Object src,  int  srcPos,
                                    Object dest, int destPos,
                                    int length);
```



>   使用场景

```java
/**
 * 在此列表中的指定位置插入指定的元素
 *
 * @param index   要插入指定元素的索引
 * @param element 要插入的元素
 * @throws IndexOutOfBoundsException {@inheritDoc}
 */
public void add(int index, E element) {
    // 对 index 进行界限检查
	rangeCheckForAdd(index);

    // 确保列表的容量能满足需求
	ensureCapacityInternal(size + 1);  // Increments modCount!!
    // 将 index 开始后所有元素后移一个位置
    // 通过调用 System.arrayCopy () 方法实现
    /*
    elementData : 原数组
    index : 源数组中的起始位置
    elementData : 目标数组
    index + 1 : 目标数组中的起始位置
    size - index : 要复制的数组元素的数量
    */
	System.arraycopy(elementData, index, elementData, index + 1,
					 size - index);
    // 插入 element
	elementData[index] = element;
    // size++
	size++;
}
```



##### Arrays.copyOf () 方法

>   源码

```java
/**
 * 复制一个新数组, 可指定复制的长度
 * 放回一个原数组的副本
 *
 * @param original  要复制的数组
 * @param newLength 要返回的副本的长度
 * @return 原始数组的副本，用零截断或填充以获得指定的长度
 */
public static int[] copyOf(int[] original, int newLength) {
    // 申请一个新的数组
    int[] copy = new int[newLength];
    // 调用 System.arraycopy () 方法, 将源数组中的数据进行拷贝, 并返回新的数组
    System.arraycopy(original, 0, copy, 0,
                     Math.min(original.length, newLength));
    return copy;
}
```



>   使用场景

```java
/**
 * 以正确的顺序 (从第一个到最后一个元素) 返回一个包含此列表中所有元素的数组。
 * 返回的数组将是 "安全的", 因为该列表不保留对它的引用 (换句话说,这个方法必须分配一个新的数组)
 * 因此, 调用者可以自由地修改返回的数组. 此方法充当基于阵列和基于集合的 API 之间的桥梁。
 */
public Object[] toArray() {
	return Arrays.copyOf(elementData, size);
}
```



##### 两者的联系与区别

>   联系

`Arrays.copyOf ()` 方法中实际调用了 `System.arraycopy  ()` 方法



>   区别

-   `System.arraycopy ()` 方法 **需要目标数组, 将原数组拷贝到你定义的数组或者原数组里, 而且可以选择拷贝的起点和长度以及放入新数组中的位置**

-   `Arrays.copyof ()` 方法是 **系统自动在内部新建一个数组, 并返回该数组**



>   用途

`System.arraycopy ()` 方法主要是 **复制的时候可自定义程度高**,

`Arrays.copyof ()` 方法主要是 **为了给原数组扩容, 或者快速复制数组**



#### ensureCapacity () 方法

>   源码

```java
/**
 * 如有必要, 增加此 ArrayList 实例的容量, 以确保它至少可以容纳由最小容量参数指定的元素数
 *
 * 用于 DenseIntMapImpl.extend () 方法和大量数据添加时预先确保列表可容纳大量数组 (可减少扩容次数, 提高效率)
 *
 * @param   minCapacity   所需的最小容量
 */
public void ensureCapacity(int minCapacity) {
    // 如果是 true, minExpand = 0
    // 如果是 false, minExpand = DEFAULT_CAPACITY (10)
	int minExpand = (elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA)
		// any size if not default element table
		? 0
		// larger than default for default empty table. It's already
		// supposed to be at default size.
		: DEFAULT_CAPACITY;

    // 如果最小容量大于已有最大容量
	if (minCapacity > minExpand) {
		ensureExplicitCapacity(minCapacity);
	}
}
```



>   用途

用于 `add` 大量数据之前提前扩容列表, 以减少扩容列表的次数, 提高效率
