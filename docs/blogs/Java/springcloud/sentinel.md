---
title: SpringCloud Alibaba Sentinel
date: 2022-10-30T17:55:28+08:00
sidebar: 'auto'
categories:
- Java
tags:
- Java
- SpringCloud
- SpringCloud Alibaba
- Sentinel
---

# SpringCloud Allibaba

## SpringCloud Alibaba Sentinel 实现熔断与限流



### Sentinel



#### 官网

[github 官网](https://github.com/alibaba/Sentinel)

[github 中文网站](https://github.com/alibaba/Sentinel/wiki/%E4%BB%8B%E7%BB%8D)



#### 是什么

![image-20220125135904674](https://typora-oss.yixihan.chat//img/202210301922556.png)

一句话解释，之前我们讲解过的 Hystrix



>   图解

![image-20220125140056469](https://typora-oss.yixihan.chat//img/202210301922438.png)

#### 下载地址

[下载地址](https://github.com/alibaba/Sentinel/releases)



#### 能干嘛

![image-20220125140113184](https://typora-oss.yixihan.chat//img/202210301922553.png)



#### 怎么玩

[教程](https://spring-cloud-alibaba-group.github.io/github-pages/greenwich/spring-cloud-alibaba.html#_spring_cloud_alibaba_sentinel)



>   服务使用中的各种问题

-   服务雪崩
-   服务降级
-   服务熔断
-   服务限流



### 安装Sentinel控制台



>   sentinel组件由2部分构成

![image-20220125140306685](https://typora-oss.yixihan.chat//img/202210301922342.png)

后台

前台8080



#### 安装步骤

>   下载

[下载地址](https://github.com/alibaba/Sentinel/releases)



>   运行命令

前提 :

-   java 8 环境
-   8080 端口不能被占用



```cmd
java -jar sentinel-dashboard-1.7.0.jar
```



>   访问sentinel管理界面

[sentinel 控制台](http://localhost:8080)



用户名和密码都是 : sentinel



### 初始化演示工程

>   前提准备

启动 nacos 集群 或本地 nacos

[nacos 集群](http://175.24.229.41:8848/nacos/)

[nacos 本地](http://localhost:8848/nacos)



启动 sentinel 

[sentinel 控制台](http://localhost:8080/)



#### 创建测试模块

##### 建 module

module 名 : cloudalibaba-sentinel-service8401



##### 改 POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud-learn</artifactId>
        <groupId>com.yixihan.springcloud</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloudalibaba-sentinel-service8401</artifactId>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <dependencies>
        <!--SpringCloud ailibaba nacos -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!--SpringCloud ailibaba sentinel-datasource-nacos 后续做持久化用到-->
        <dependency>
            <groupId>com.alibaba.csp</groupId>
            <artifactId>sentinel-datasource-nacos</artifactId>
        </dependency>
        <!--SpringCloud ailibaba sentinel -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
        </dependency>
        <!--openfeign-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        <!-- SpringBoot整合Web组件+actuator -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--日常通用jar包配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>4.6.3</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

    </dependencies>

</project>
```



##### 写 YAML

```yaml
server:
  port: 8401

spring:
  application:
    name: cloudalibaba-sentinel-service
  cloud:
    nacos:
      discovery:
        #Nacos服务注册中心地址
        server-addr: 175.24.229.41:8848
    sentinel:
      transport:
        #配置Sentinel dashboard地址
        dashboard: localhost:8080
        #默认8719端口，假如被占用会自动从8719开始依次+1扫描,直至找到未被占用的端口
        port: 8719

management:
  endpoints:
    web:
      exposure:
        include: '*'





```



##### 主启动

```java
package com.yixihan.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @author : yixihan
 * @create : 2022-01-25-14:11
 */
@SpringBootApplication
@EnableDiscoveryClient
public class MainApp8401 {

    public static void main(String[] args) {
        SpringApplication.run (MainApp8401.class, args);
    }
}

```



##### 业务类

```java
package com.yixihan.springcloud.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author : yixihan
 * @create : 2022-01-25-14:11
 */
@RestController
@Slf4j
public class FlowLimitController {

    @GetMapping("/testA")
    public String testA() {
        return "------testA";
    }

    @GetMapping("/testB")
    public String testB() {
        return "------testB";
    }
}

```



#### 测试

启动 8401 微服务



访问 sentinel 控制台

[sentinel 控制台](http://localhost:8080/)

![image-20220125141951184](https://typora-oss.yixihan.chat//img/202210301922530.png)

空空如也，啥都没有

原因 : Sentinel采用的懒加载说明, 只需要访问一次 8401 微服务的接口即可



[接口1](http://localhost:8401/testA)

[接口2](http://localhost:8401/testB)



访问之后再刷新即可看到 8401 微服务

![image-20220125142106999](https://typora-oss.yixihan.chat//img/202210301922062.png)



### 流控规则



#### 基本介绍

![image-20220125142237001](https://typora-oss.yixihan.chat//img/202210301922813.png)



>   进一步解释说明

![image-20220125142252119](https://typora-oss.yixihan.chat//img/202210301922216.png)



#### 流控模式



##### 直接(默认)

###### 是什么

直接->快速失败 为系统默认的流控方式



###### 配置及说明

表示1秒钟内查询1次就是OK，若超过次数1，就直接-快速失败，报默认错误

![image-20220125142418132](https://typora-oss.yixihan.chat//img/202210301922293.png)

![image-20220125142842290](https://typora-oss.yixihan.chat//img/202210301922756.png)



###### 测试

快速点击访问

[testA](http://localhost:8401/testA)

>   结果

![image-20220125142521424](https://typora-oss.yixihan.chat//img/202210301922273.png)



>   思考

直接调用默认报错信息，技术方面OK, but,是否应该有我们自己的后续处理?

类似有个fallback的兜底方法？



###### QPS 和 线程数 的区别

![image-20220125143812513](https://typora-oss.yixihan.chat//img/202210301922310.png)

QPS 类似于银行门

线程数类似于银行服务窗口

![image-20220125143550387](https://typora-oss.yixihan.chat//img/202210301923511.png)



##### 关联

###### 是什么

当关联的资源达到阈值时，就限流自己

当与A关联的资源B达到阀值后，就限流A自己

一句话总结 : B惹事，A挂了



###### 配置

![image-20220125150604291](https://typora-oss.yixihan.chat//img/202210301923483.png)



###### 测试

>   apiPost 模拟并发密集访问testB

http://localhost:8401/testB

![image-20220125150653580](https://typora-oss.yixihan.chat//img/202210301923944.png)



>   运行之后访问 testA

[testA](http://localhost:8401/testA)

![image-20220125144739812](https://typora-oss.yixihan.chat//img/202210301923046.png)

![image-20220125144735571](https://typora-oss.yixihan.chat//img/202210301923561.png)



##### 链路

###### 是什么

多个请求调用了同一个微服务



#### 流控效果

##### 直接->快速失败(默认的流控处理)

直接失败，抛出异常 Blocked by Sentinel (flow limiting)



###### 源码

com.alibaba.csp.sentinel.slots.block.flow.controller.DefaultController



##### 预热

###### 说明

公式：阈值除以coldFactor(默认值为3),经过预热时长后才会达到阈值



###### 官网

[官网](https://github.com/alibaba/Sentinel/wiki/%E6%B5%81%E9%87%8F%E6%8E%A7%E5%88%B6)

![image-20220125153103668](https://typora-oss.yixihan.chat//img/202210301923260.png)

默认coldFactor为3，即请求 QPS 从 threshold / 3 开始，经预热时长逐渐升至设定的 QPS 阈值。

 [限流 冷启动](https://github.com/alibaba/Sentinel/wiki/%E9%99%90%E6%B5%81---%E5%86%B7%E5%90%AF%E5%8A%A8)



###### 源码

com.alibaba.csp.sentinel.slots.block.flow.controller.WarmUpController

![image-20220125153126311](https://typora-oss.yixihan.chat//img/202210301923591.png)



###### WarmUp配置

默认 coldFactor 为 3，即请求QPS从(threshold / 3) 开始，经多少预热时长才逐渐升至设定的 QPS 阈值。

案例，阀值为10+预热时长设置5秒。
系统初始化的阀值为10 / 3 约等于3,即阀值刚开始为3；然后过了5秒后阀值才慢慢升高恢复到10

![image-20220125153251852](https://typora-oss.yixihan.chat//img/202210301923282.png)



###### 测试

多次点击 [testA](http://localhost:8401/testA)

刚开始不行，后续慢慢OK



###### 应用场景

如：秒杀系统在开启的瞬间，会有很多流量上来，很有可能把系统打死，预热方式就是把为了保护系统，可慢慢的把流量放进来，慢慢的把阀值增长到设置的阀值。



##### 排队等待

匀速排队，让请求以均匀的速度通过，阀值类型必须设成QPS，否则无效。

设置含义：/testA每秒1次请求，超过的话就排队等待，等待的超时时间为20000毫秒。



###### 官网

[官网](https://github.com/alibaba/Sentinel/wiki/%E6%B5%81%E9%87%8F%E6%8E%A7%E5%88%B6)



###### 源码

com.alibaba.csp.sentinel.slots.block.flow.controller.RateLimiterController



###### 测试

![image-20220125153635431](https://typora-oss.yixihan.chat//img/202210301923962.png)

![image-20220125153644964](https://typora-oss.yixihan.chat//img/202210301923840.png)



### 降级规则



#### 官网

[官网](https://github.com/alibaba/Sentinel/wiki/%E7%86%94%E6%96%AD%E9%99%8D%E7%BA%A7)



#### 基本介绍

![image-20220125153856069](https://typora-oss.yixihan.chat//img/202210301923439.png)

-   RT（平均响应时间，秒级）
    -   平均响应时间   **超出阈值**  且   **在时间窗口内通过的请求>=5**，两个条件同时满足后触发降级
    -   窗口期过后关闭断路器 
        RT最大4900（更大的需要通过-Dcsp.sentinel.statistic.max.rt=XXXX才能生效）

-   异常比列（秒级）
    -   QPS >= 5 且异常比例（秒级统计）超过阈值时，触发降级；时间窗口结束后，关闭降级

-   异常数（分钟级）
    -   异常数（分钟统计）超过阈值时，触发降级；时间窗口结束后，关闭降级



##### 进一步说明

Sentinel 熔断降级会在调用链路中某个资源出现不稳定状态时（例如调用超时或异常比例升高），对这个资源的调用进行限制，让请求快速失败，避免影响到其它的资源而导致级联错误。

当资源被降级后，在接下来的降级时间窗口之内，对该资源的调用都自动熔断（默认行为是抛出 DegradeException）。



##### Sentinel的断路器是没有半开状态的

半开的状态系统自动去检测是否请求有异常，

没有异常就关闭断路器恢复使用，

有异常则继续打开断路器不可用。

具体可以参考Hystrix



#### 降级策略实战



##### 慢调用比例



###### 是什么

![image-20220126093113514](https://typora-oss.yixihan.chat//img/202210301923324.png)

![image-20220126091513729](https://typora-oss.yixihan.chat//img/202210301926934.png)



###### 测试

>   代码

```java
@GetMapping("/testC")
public String testC() {
    //暂停几秒钟线程
    try { TimeUnit.SECONDS.sleep(1); } catch (InterruptedException e) { e.printStackTrace(); }
    log.info("testC 测试RT");
    return "------testC 测试RT";
}
```



>   配置

![image-20220126093636338](https://typora-oss.yixihan.chat//img/202210301923298.png)

>   Jmeter 压测

![image-20220126093608604](https://typora-oss.yixihan.chat//img/202210301923164.png)

>   结论

按照上述配置，永远一秒钟打进来10个线程（大于5个了）调用testD，我们希望200毫秒处理完本次任务，

如果超过200毫秒还没处理完，在未来1秒钟的时间窗口内，断路器打开(保险丝跳闸)微服务不可用，保险丝跳闸断电了

后续我停止jmeter，没有这么大的访问量了，断路器关闭(保险丝恢复)，微服务恢复OK



##### 异常比例



###### 是什么

![image-20220126091645065](https://typora-oss.yixihan.chat//img/202210301926905.png)

![image-20220126091652627](https://typora-oss.yixihan.chat//img/202210301923917.png)



###### 测试

>   代码

```java
@GetMapping("/testD")
public String testD() {
    log.info("testD 测试 异常比例");
    int age = 10/0;
    return "------testD 测试 异常比例";
}

```



>   配置

![image-20220126093901798](https://typora-oss.yixihan.chat//img/202210301923612.png)



>   Jmeter 压测

![image-20220126094436602](https://typora-oss.yixihan.chat//img/202210301923155.png)



>   结论

按照上述配置，单独访问一次，必然来一次报错一次(int age  = 10/0)，调一次错一次；

![image-20220126091907551](https://typora-oss.yixihan.chat//img/202210301923718.png)

开启jmeter后，直接高并发发送请求，多次调用达到我们的配置条件了。

断路器开启(保险丝跳闸)，微服务不可用了，不再报错error而是服务降级了。



##### 异常数



###### 是什么

![image-20220126091701373](https://typora-oss.yixihan.chat//img/202210301923143.png)

时间窗口一定要大于等于60秒。

![image-20220126091713417](https://typora-oss.yixihan.chat//img/202210301923797.png)



**异常数是按照分钟统计的**



###### 测试

>   代码

```java
@GetMapping("/testE")
public String testE() {
    log.info("testE 测试 异常数");
    int age = 10/0;
    return "------testE 测试 异常数";
}
```



>   配置

![image-20220126094555574](https://typora-oss.yixihan.chat//img/202210301923338.png)



>   结论

[testE](http://localhost:8401/testE)，第一次访问绝对报错，因为除数不能为零，我们看到error窗口，但是达到5次报错后，进入熔断后降级。



### 热点key限流



#### 基本介绍

![image-20220126094840818](https://typora-oss.yixihan.chat//img/202210301923518.png)

>   何为热点

热点即经常访问的数据，很多时候我们希望统计或者限制某个热点数据中访问频次最高的TopN数据，并对其访问进行限流或者其它操作



>   官网

[官网](https://github.com/alibaba/Sentinel/wiki/%E7%83%AD%E7%82%B9%E5%8F%82%E6%95%B0%E9%99%90%E6%B5%81)



>   承上启下复习start

兜底方法分为系统默认和客户自定义，两种

之前的case，限流出问题后，都是用sentinel系统默认的提示：Blocked by Sentinel (flow limiting)

我们能不能自定?类似hystrix，某个方法出问题了，就找对应的兜底降级方法？

结论 : 从 `@HystrixCommand` 到 `@SentinelResource`



#### 实战

##### controller

```java
@GetMapping("/testHotKey")
@SentinelResource(value = "testHotKey",blockHandler = "dealHandler_testHotKey")
public String testHotKey(
    @RequestParam(value = "p1",required = false) String p1,
    @RequestParam(value = "p2",required = false) String p2) {
    return "------testHotKey";
}


public String dealHandler_testHotKey(String p1, String p2, BlockException exception) {
    return "-----dealHandler_testHotKey";
}
```



##### 配置

![image-20220126095644374](https://typora-oss.yixihan.chat//img/202210301923209.png)



>   代码配置一

`@SentinelResource(value = "testHotKey")`

异常打到了前台用户界面看到，不友好



>   代码配置二

`@SentinelResource(value = "testHotKey",blockHandler = "dealHandler_testHotKey")`

方法testHotKey里面第一个参数只要QPS超过每秒1次，马上降级处理

兜底方法用了我们自己定义的, 比较友好



![image-20220126095504327](https://typora-oss.yixihan.chat//img/202210301924280.png)

限流模式只支持QPS模式，固定写死了。（这才叫热点）

@SentinelResource注解的方法参数索引，0代表第一个参数，1代表第二个参数，以此类推

单机阀值以及统计窗口时长表示在此窗口时间超过阀值就限流。

上面的抓图就是第一个参数有值的话，1秒的QPS为1，超过就限流，限流后调用dealHandler_testHotKey支持方法。



##### 测试

[error1](http://localhost:8401/testHotKey?p1=abc)

[error2](http://localhost:8401/testHotKey?p1=abc&p2=33)

[right](http://localhost:8401/testHotKey?p2=abc)

QPS 大于一时则触发热点 key 限流



#### 参数例外项

上述案例演示了第一个参数p1，当QPS超过1秒1次点击后马上被限流



##### 特例情况

>   普通

超过1秒钟一个后，达到阈值1后马上被限流

我们期望p1参数当它是某个特殊值时，它的限流值和平时不一样



>   特例

假如当p1的值等于5时，它的阈值可以达到200



##### 配置

![image-20220126100636873](https://typora-oss.yixihan.chat//img/202210301924294.png)

ps : 添加按钮不能忘



##### 测试

[p1 = 5](http://localhost:8401/testHotKey?p1=5)

[p1 != 5](http://localhost:8401/testHotKey?p1=3)

当p1等于5的时候，阈值变为200

当p1不等于5的时候，阈值就是平常的1



>   前提条件

**热点参数的注意点，参数必须是基本类型或者String**



##### 异常

>   @SentinelResource

处理的是Sentinel控制台配置的违规情况，有blockHandler方法配置的兜底处理；

>   RuntimeException

int age = 10/0,这个是java运行时报出的运行时异常RunTimeException，@SentinelResource不管



>   总结

 @SentinelResource主管配置出错，运行出错该走异常走异常



### 系统规则

#### 是什么

[官网](https://github.com/alibaba/Sentinel/wiki/%E7%B3%BB%E7%BB%9F%E8%87%AA%E9%80%82%E5%BA%94%E9%99%90%E6%B5%81)



#### 各项配置参数说明

![image-20220126100917979](https://typora-oss.yixihan.chat//img/202210301924877.png)

#### 配置全局QPS

![image-20220126102026363](https://typora-oss.yixihan.chat//img/202210301924619.png)



### @SentinelResource



#### 按资源名称限流+后续处理

>   启动 nacos

[nacos 控制台](http://175.24.229.41:8848/nacos/)



>   启动 sentinel

```cmd
java -jar sentinel-dashboard-1.7.0.jar
```

[sentinel 控制台](http://localhost:8080/)



##### Module

更改 module : cloudalibaba-sentinel-service8401



###### POM

```xml
<!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
<dependency>
    <groupId>com.yixihan.springcloud</groupId>
    <artifactId>cloud-api-commons</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```



###### YAML

```yaml
server:
  port: 8401

spring:
  application:
    name: cloudalibaba-sentinel-service
  cloud:
    nacos:
      discovery:
        #Nacos服务注册中心地址
        server-addr: 175.24.229.41:8848
    sentinel:
      transport:
        #配置Sentinel dashboard地址
        dashboard: localhost:8080
        #默认8719端口，假如被占用会自动从8719开始依次+1扫描,直至找到未被占用的端口
        port: 8719

management:
  endpoints:
    web:
      exposure:
        include: '*'

```



###### 业务类

```java
package com.yixihan.springcloud.controller;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.yixihan.springcloud.pojo.CommonResult;
import com.yixihan.springcloud.pojo.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author : yixihan
 * @create : 2022-01-26-12:21
 */
@RestController
@Slf4j
public class RateLimitController {

    @GetMapping("/byResource")
    @SentinelResource(value = "byResource",blockHandler = "handleException")
    public CommonResult byResource() {
        return new CommonResult(200,"按资源名称限流测试OK",new Payment (2021L,"serial001"));
    }

    public CommonResult handleException(BlockException exception) {
        return new CommonResult(444,exception.getClass().getCanonicalName()+"\t 服务不可用");
    }
}

```



###### 主启动

```java
package com.yixihan.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @author : yixihan
 * @create : 2022-01-25-14:11
 */
@SpringBootApplication
@EnableDiscoveryClient
public class MainApp8401 {

    public static void main(String[] args) {
        SpringApplication.run (MainApp8401.class, args);
    }
}

```



##### 配置流控规则

>   配置步骤

![image-20220126122458538](https://typora-oss.yixihan.chat//img/202210301924548.png)



>   图形配置和代码关系

![image-20220126122241184](https://typora-oss.yixihan.chat//img/202210301924927.png)



表示1秒钟内查询次数大于1，就跑到我们自定义的处流，限流



##### 测试

[测试接口](http://localhost:8401/byResource)

1秒钟点击1下，OK

超过上述，疯狂点击，返回了自己定义的限流处理信息，限流发生



##### 额外问题

此时关闭问服务8401看看, Sentinel控制台，流控规则消失了？？？？？

得出 => 这并不是持久的



#### 按照Url地址限流+后续处理

通过访问的URL来限流，会返回Sentinel自带默认的限流处理信息



##### Module

###### 业务类

```java
package com.yixihan.springcloud.controller;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.yixihan.springcloud.pojo.CommonResult;
import com.yixihan.springcloud.pojo.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author : yixihan
 * @create : 2022-01-26-12:21
 */
@RestController
@Slf4j
public class RateLimitController {

    @GetMapping("/byResource")
    @SentinelResource(value = "byResource",blockHandler = "handleException")
    public CommonResult byResource() {
        return new CommonResult(200,"按资源名称限流测试OK",new Payment (2021L,"serial001"));
    }

    public CommonResult handleException(BlockException exception) {
        return new CommonResult(444,exception.getClass().getCanonicalName()+"\t 服务不可用");
    }

    @GetMapping("/rateLimit/byUrl")
    @SentinelResource(value = "byUrl")
    public CommonResult byUrl()
    {
        return new CommonResult(200,"按url限流测试OK",new Payment(2021L,"serial002"));
    }
}

```



##### 配置流控规则

![image-20220126122755768](https://typora-oss.yixihan.chat//img/202210301924580.png)



##### 测试

[测试接口](http://localhost:8401/rateLimit/byUrl)

1秒钟点击1下，OK

超过上述，疯狂点击，返回了默认的限流处理信息，限流发生



#### 上面兜底方案面临的问题

-   系统默认的，没有体现我们自己的业务要求。
-   依照现有条件，我们自定义的处理方法又和业务代码耦合在一块，不直观。
-   每个业务方法都添加一个兜底的，那代码膨胀加剧。
-   全局统一的处理方法没有体现。



#### 客户自定义限流处理逻辑



##### 自定义限流处理类



###### CustomerBlockHandler

```java
package com.yixihan.springcloud.handle;

import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.yixihan.springcloud.pojo.CommonResult;
import org.springframework.stereotype.Component;

/**
 * @author : yixihan
 * @create : 2022-01-26-12:35
 */
@Component
public class CustomerBlockHandler {

    public static CommonResult handleException1(BlockException exception) {
        return new CommonResult(2021,"自定义的限流处理信息......CustomerBlockHandler---1");
    }

    public static CommonResult handleException2(BlockException exception) {
        return new CommonResult(2021,"自定义的限流处理信息......CustomerBlockHandler---2");
    }
}

```



###### RateLimitController

```java
package com.yixihan.springcloud.controller;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.yixihan.springcloud.handle.CustomerBlockHandler;
import com.yixihan.springcloud.pojo.CommonResult;
import com.yixihan.springcloud.pojo.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author : yixihan
 * @create : 2022-01-26-12:21
 */
@RestController
@Slf4j
public class RateLimitController {

    @GetMapping("/byResource")
    @SentinelResource(value = "byResource",blockHandler = "handleException")
    public CommonResult byResource() {
        return new CommonResult(200,"按资源名称限流测试OK",new Payment (2021L,"serial001"));
    }

    public CommonResult handleException(BlockException exception) {
        return new CommonResult(444,exception.getClass().getCanonicalName()+"\t 服务不可用");
    }

    @GetMapping("/rateLimit/byUrl")
    @SentinelResource(value = "byUrl")
    public CommonResult byUrl() {
        return new CommonResult(200,"按url限流测试OK",new Payment(2021L,"serial002"));
    }

    /**
     * 自定义通用的限流处理逻辑，
     *      blockHandlerClass = CustomerBlockHandler.class
     *      blockHandler = handleException2
     *      上述配置：找CustomerBlockHandler类里的handleException2方法进行兜底处理
     * 自定义通用的限流处理逻辑
     */
    @GetMapping("/rateLimit/customerBlockHandler")
    @SentinelResource(value = "customerBlockHandler",
            blockHandlerClass = CustomerBlockHandler.class, blockHandler = "handleException2")
    public CommonResult customerBlockHandler() {
        return new CommonResult(200,"按客户自定义限流处理逻辑", new Payment(2021L,"serial003"));
    }

}

```



##### sentinel 控制台配置

![image-20220126124001436](https://typora-oss.yixihan.chat//img/202210301924416.png)



##### 测试

[测试接口](http://localhost:8401/rateLimit/customerBlockHandler)



##### 进一步说明

![image-20220126123503633](https://typora-oss.yixihan.chat//img/202210301924160.png)



#### 更多注解属性说明

![image-20220126124628307](https://typora-oss.yixihan.chat//img/202210301924213.png)

![image-20220126124411172](https://typora-oss.yixihan.chat//img/202210301924105.png)

所有的代码都要用try-catch-finally方式进行处理



##### Sentinel主要有三个核心Api

-   SphU定义资源
-   Tracer定义统计
-   ContextUtil定义了上下文



### 服务熔断功能

sentinel整合ribbon+openFeign+fallback



#### Ribbon系列

启动nacos和sentinel



##### 提供者9003/9004

###### 建 module

module 名 : 

cloudalibaba-provider-payment9003

cloudalibaba-provider-payment9004



###### 改POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud-learn</artifactId>
        <groupId>com.yixihan.springcloud</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloudalibaba-provider-payment9003</artifactId>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <dependencies>
        <!--SpringCloud ailibaba nacos -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
        <dependency>
            <groupId>com.yixihan.springcloud</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!-- SpringBoot整合Web组件 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--日常通用jar包配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>


</project>
```



###### 写YAML

```yaml
server:
  port: 9003

spring:
  application:
    name: nacos-payment-provider
  cloud:
    nacos:
      discovery:
        server-addr: 175.24.229.41:8848 #配置Nacos地址

management:
  endpoints:
    web:
      exposure:
        include: '*'
```



###### 主启动

```java
package com.yixihan.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @author : yixihan
 * @create : 2022-01-26-12:55
 */
@SpringBootApplication
@EnableDiscoveryClient
public class PaymentMain9003 {

    public static void main(String[] args) {
        SpringApplication.run (PaymentMain9003.class, args);
    }
}

```



###### 业务类

```java
package com.yixihan.springcloud.controller;

import com.yixihan.springcloud.pojo.CommonResult;
import com.yixihan.springcloud.pojo.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

/**
 * @author : yixihan
 * @create : 2022-01-26-12:56
 */
@RestController
@Slf4j
public class PaymentController {

    @Value("${server.port}")
    private String serverPort;

    public static HashMap<Long, Payment> hashMap = new HashMap<> ();

    static {
        hashMap.put(1L,new Payment(1L,"28a8c1e3bc2742d8848569891fb42181"));
        hashMap.put(2L,new Payment(2L,"bba8c1e3bc2742d8848569891ac32182"));
        hashMap.put(3L,new Payment(3L,"6ua8c1e3bc2742d8848569891xt92183"));
    }


    @GetMapping(value = "/paymentSQL/{id}")
    public CommonResult<Payment> paymentSQL(@PathVariable("id") Long id) {
        Payment payment = hashMap.get(id);
        CommonResult<Payment> result = new CommonResult (200,"from mysql,serverPort:  "+serverPort,payment);
        return result;
    }
}

```



##### 消费者 84

###### 建 module

module 名 : cloudalibaba-consumer-nacos-order84



###### 改 POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud-learn</artifactId>
        <groupId>com.yixihan.springcloud</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloudalibaba-consumer-nacos-order84</artifactId>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <dependencies>
        <!--SpringCloud ailibaba nacos -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!--SpringCloud ailibaba sentinel -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
        </dependency>
        <!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
        <dependency>
            <groupId>com.yixihan.springcloud</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!-- SpringBoot整合Web组件 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--日常通用jar包配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>


</project>
```



###### 写 YAML

```yaml
server:
  port: 84


spring:
  application:
    name: nacos-order-consumer
  cloud:
    nacos:
      discovery:
        server-addr: 175.24.229.41:8848
    sentinel:
      transport:
        #配置Sentinel dashboard地址
        dashboard: localhost:8080
        #默认8719端口，假如被占用会自动从8719开始依次+1扫描,直至找到未被占用的端口
        port: 8719


#消费者将要去访问的微服务名称(注册成功进nacos的微服务提供者)
service-url:
  nacos-user-service: http://nacos-payment-provider


```



###### 主启动

```java
package com.yixihan.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @author : yixihan
 * @create : 2022-01-26-13:16
 */
@SpringBootApplication
@EnableDiscoveryClient
public class OrderNacosMain84 {

    public static void main(String[] args) {
        SpringApplication.run (OrderNacosMain84.class, args);
    }
}

```



###### 业务类

>   ApplicationContextConfig

```java
package com.yixihan.springcloud.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * @author : yixihan
 * @create : 2022-01-26-13:16
 */
@Configuration
public class ApplicationContextConfig {

    @Bean
    @LoadBalanced
    public RestTemplate getRestTemplate () {
        return new RestTemplate ();
    }
}

```



##### CircleBreakerController

>   修改后请重启微服务

热部署对java代码级生效及时, 对@SentinelResource注解内属性，有时效果不好



>   目的

fallback管运行异常

blockHandler管配置违规



>   测试地址

[测试接口](http://localhost:84/consumer/fallback/1)



###### 没有任何配置

>   controller

```java
package com.yixihan.springcloud.controller;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.yixihan.springcloud.pojo.CommonResult;
import com.yixihan.springcloud.pojo.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;

/**
 * @author : yixihan
 * @create : 2022-01-26-13:17
 */
@RestController
@Slf4j
public class CircleBreakerController {

    public static final String SERVICE_URL = "http://nacos-payment-provider";

    @Resource
    private RestTemplate restTemplate;

    @RequestMapping("/consumer/fallback/{id}")
	@SentinelResource(value = "fallback") // 没有配置
    exceptionsToIgnore = {IllegalArgumentException.class})
    public CommonResult<Payment> fallback(@PathVariable Long id) {
        CommonResult<Payment> result = restTemplate.getForObject(SERVICE_URL + "/paymentSQL/"+id, CommonResult.class,id);

        if (id == 4) {
            throw new IllegalArgumentException ("IllegalArgumentException,非法参数异常....");
        }else if (result.getData() == null) {
            throw new NullPointerException ("NullPointerException,该ID没有对应记录,空指针异常");
        }

        return result;
    }
}

```



>   sentinel 控制台

无任何配置



>   测试

给客户error页面，不友好



###### 只配置fallback

>   controller

```java
package com.yixihan.springcloud.controller;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.yixihan.springcloud.pojo.CommonResult;
import com.yixihan.springcloud.pojo.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;

/**
 * @author : yixihan
 * @create : 2022-01-26-13:17
 */
@RestController
@Slf4j
public class CircleBreakerController {

    public static final String SERVICE_URL = "http://nacos-payment-provider";

    @Resource
    private RestTemplate restTemplate;

    @RequestMapping("/consumer/fallback/{id}")
	@SentinelResource(value = "fallback", fallback = "handlerFallback") // fallback 只负责业务异常

    exceptionsToIgnore = {IllegalArgumentException.class})
    public CommonResult<Payment> fallback(@PathVariable Long id) {
        CommonResult<Payment> result = restTemplate.getForObject(SERVICE_URL + "/paymentSQL/"+id, CommonResult.class,id);

        if (id == 4) {
            throw new IllegalArgumentException ("IllegalArgumentException,非法参数异常....");
        }else if (result.getData() == null) {
            throw new NullPointerException ("NullPointerException,该ID没有对应记录,空指针异常");
        }

        return result;
    }

    /**
     * fallback
     */
    public CommonResult handlerFallback(@PathVariable  Long id,Throwable e) {
        Payment payment = new Payment(id,"null");
        return new CommonResult<>(444,"兜底异常handlerFallback,exception内容  "+e.getMessage(),payment);
    }
}

```



>   图说

![image-20220126135959348](https://typora-oss.yixihan.chat//img/202210301924110.png)



>   sentinel 控制台

无任何配置



>   测试

![image-20220126134534796](https://typora-oss.yixihan.chat//img/202210301924324.png)

![image-20220126134514248](https://typora-oss.yixihan.chat//img/202210301924637.png)

![image-20220126134523232](https://typora-oss.yixihan.chat//img/202210301924924.png)



###### 只配置blockHandler

>   controller

```java
package com.yixihan.springcloud.controller;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.yixihan.springcloud.pojo.CommonResult;
import com.yixihan.springcloud.pojo.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;

/**
 * @author : yixihan
 * @create : 2022-01-26-13:17
 */
@RestController
@Slf4j
public class CircleBreakerController {

    public static final String SERVICE_URL = "http://nacos-payment-provider";

    @Resource
    private RestTemplate restTemplate;

    @RequestMapping("/consumer/fallback/{id}")
    @SentinelResource(value = "fallback", blockHandler = "blockHandler") // blockHandler 只负责 sentinel 控制台配置违规
    public CommonResult<Payment> fallback(@PathVariable Long id) {
        CommonResult<Payment> result = restTemplate.getForObject(SERVICE_URL + "/paymentSQL/"+id, CommonResult.class,id);

        if (id == 4) {
            throw new IllegalArgumentException ("IllegalArgumentException,非法参数异常....");
        }else if (result.getData() == null) {
            throw new NullPointerException ("NullPointerException,该ID没有对应记录,空指针异常");
        }

        return result;
    }

    /**
     * blockHandler
     */
    public CommonResult blockHandler(@PathVariable  Long id, BlockException blockException) {
        Payment payment = new Payment(id,"null");
        return new CommonResult<>(445,"blockHandler-sentinel限流,无此流水: blockException  "+blockException.getMessage(),payment);
    }
}

```



>   图说

![image-20220126140025038](https://typora-oss.yixihan.chat//img/202210301924685.png)



>   sentinel 控制台

![image-20220126134939072](https://typora-oss.yixihan.chat//img/202210301924999.png)



>   测试

![image-20220126135513386](https://typora-oss.yixihan.chat//img/202210301925948.png)

![image-20220126135531177](https://typora-oss.yixihan.chat//img/202210301925577.png)



###### 配置 fallback 和 blockHandler

>   controller

```java
package com.yixihan.springcloud.controller;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.yixihan.springcloud.pojo.CommonResult;
import com.yixihan.springcloud.pojo.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;

/**
 * @author : yixihan
 * @create : 2022-01-26-13:17
 */
@RestController
@Slf4j
public class CircleBreakerController {

    public static final String SERVICE_URL = "http://nacos-payment-provider";

    @Resource
    private RestTemplate restTemplate;

    @RequestMapping("/consumer/fallback/{id}")
    @SentinelResource(value = "fallback", fallback = "handlerFallback", blockHandler = "blockHandler")
    public CommonResult<Payment> fallback(@PathVariable Long id) {
        CommonResult<Payment> result = restTemplate.getForObject(SERVICE_URL + "/paymentSQL/"+id, CommonResult.class,id);

        if (id == 4) {
            throw new IllegalArgumentException ("IllegalArgumentException,非法参数异常....");
        }else if (result.getData() == null) {
            throw new NullPointerException ("NullPointerException,该ID没有对应记录,空指针异常");
        }

        return result;
    }

    /**
     * fallback
     */
    public CommonResult handlerFallback(@PathVariable  Long id,Throwable e) {
        Payment payment = new Payment(id,"null");
        return new CommonResult<>(444,"兜底异常handlerFallback,exception内容  "+e.getMessage(),payment);
    }

    /**
     * blockHandler
     */
    public CommonResult blockHandler(@PathVariable  Long id, BlockException blockException) {
        Payment payment = new Payment(id,"null");
        return new CommonResult<>(445,"blockHandler-sentinel限流,无此流水: blockException  "+blockException.getMessage(),payment);
    }
}

```



>   图说

![image-20220126140040597](https://typora-oss.yixihan.chat//img/202210301925345.png)



>   sentinel 控制台

![image-20220126135702066](https://typora-oss.yixihan.chat//img/202210301925045.png)



>   测试

![image-20220126135859043](https://typora-oss.yixihan.chat//img/202210301925490.png)

![image-20220126135913309](https://typora-oss.yixihan.chat//img/202210301925767.png)

若 blockHandler 和 fallback 都进行了配置，则被限流降级而抛出 BlockException 时只会进入 blockHandler 处理逻辑。



###### 忽略属性

>   controller

```java
package com.yixihan.springcloud.controller;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.yixihan.springcloud.pojo.CommonResult;
import com.yixihan.springcloud.pojo.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;

/**
 * @author : yixihan
 * @create : 2022-01-26-13:17
 */
@RestController
@Slf4j
public class CircleBreakerController {

    public static final String SERVICE_URL = "http://nacos-payment-provider";

    @Resource
    private RestTemplate restTemplate;

    @RequestMapping("/consumer/fallback/{id}")
    @SentinelResource(value = "fallback", fallback = "handlerFallback", blockHandler = "blockHandler", 
            exceptionsToIgnore = {IllegalArgumentException.class})
    public CommonResult<Payment> fallback(@PathVariable Long id) {
        CommonResult<Payment> result = restTemplate.getForObject(SERVICE_URL + "/paymentSQL/"+id, CommonResult.class,id);

        if (id == 4) {
            throw new IllegalArgumentException ("IllegalArgumentException,非法参数异常....");
        }else if (result.getData() == null) {
            throw new NullPointerException ("NullPointerException,该ID没有对应记录,空指针异常");
        }

        return result;
    }

    /**
     * fallback
     */
    public CommonResult handlerFallback(@PathVariable  Long id,Throwable e) {
        Payment payment = new Payment(id,"null");
        return new CommonResult<>(444,"兜底异常handlerFallback,exception内容  "+e.getMessage(),payment);
    }

    /**
     * blockHandler
     */
    public CommonResult blockHandler(@PathVariable  Long id, BlockException blockException) {
        Payment payment = new Payment(id,"null");
        return new CommonResult<>(445,"blockHandler-sentinel限流,无此流水: blockException  "+blockException.getMessage(),payment);
    }
}

```



>   图说

![image-20220126140128392](https://typora-oss.yixihan.chat//img/202210301925005.png)



>   sentinel 控制台

无



>   测试

![image-20220126140342965](https://typora-oss.yixihan.chat//img/202210301925792.png)



#### Feign系列

修改84模块

84消费者调用提供者9003

Feign组件一般是消费侧



##### POM

ps : 未整合 devtool

原因 : 整合 devtool 会抛 `class org.springframework.cloud.openfeign.HystrixTargeter$$EnhancerBySpringCGLIB$$979eb77 cannot access its superclass org.springframework.cloud.openfeign.HystrixTargeter` 异常

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud-learn</artifactId>
        <groupId>com.yixihan.springcloud</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloudalibaba-consumer-nacos-order84</artifactId>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <dependencies>
        <!--SpringCloud openfeign -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>

        <!--SpringCloud ailibaba nacos -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!--SpringCloud ailibaba sentinel -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
        </dependency>
        <!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
        <dependency>
            <groupId>com.yixihan.springcloud</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!-- SpringBoot整合Web组件 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--日常通用jar包配置-->
<!--        <dependency>-->
<!--            <groupId>org.springframework.boot</groupId>-->
<!--            <artifactId>spring-boot-devtools</artifactId>-->
<!--            <scope>runtime</scope>-->
<!--            <optional>true</optional>-->
<!--        </dependency>-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>


</project>
```



##### YAML

```yaml
server:
  port: 84


spring:
  application:
    name: nacos-order-consumer
  cloud:
    nacos:
      discovery:
        server-addr: 175.24.229.41:8848
    sentinel:
      transport:
        #配置Sentinel dashboard地址
        dashboard: localhost:8080
        #默认8719端口，假如被占用会自动从8719开始依次+1扫描,直至找到未被占用的端口
        port: 8719


#消费者将要去访问的微服务名称(注册成功进nacos的微服务提供者)
service-url:
  nacos-user-service: http://nacos-payment-provider

management:
  endpoints:
    web:
      exposure:
        include: '*'


# 激活Sentinel对Feign的支持
feign:
  sentinel:
    enabled: true

```



##### 主启动

```java
package com.yixihan.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * 使用 fallback 方式是无法获取异常信息的，
 * 如果想要获取异常信息，可以使用 fallbackFactory参数
 * @author : yixihan
 * @create : 2022-01-26-13:16
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class OrderNacosMain84 {

    public static void main(String[] args) {
        SpringApplication.run (OrderNacosMain84.class, args);
    }
}


```



##### 业务类

###### service

>   PaymentService

```java
package com.yixihan.springcloud.service;

import com.yixihan.springcloud.pojo.CommonResult;
import com.yixihan.springcloud.pojo.Payment;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * @author : yixihan
 * @create : 2022-01-26-14:14
 */
@FeignClient(value = "nacos-payment-provider", fallback = PaymentFallbackService.class)//调用中关闭9003服务提供者
public interface PaymentService {

    @GetMapping(value = "/paymentSQL/{id}")
    CommonResult<Payment> paymentSQL(@PathVariable("id") Long id);
}

```



>   PaymentFallbackService

```java
package com.yixihan.springcloud.service;

import com.yixihan.springcloud.pojo.CommonResult;
import com.yixihan.springcloud.pojo.Payment;
import org.springframework.stereotype.Component;

/**
 * @author : yixihan
 * @create : 2022-01-26-14:14
 */
@Component
public class PaymentFallbackService implements PaymentService {

    @Override
    public CommonResult<Payment> paymentSQL(Long id) {
        return new CommonResult<>(44444,"服务降级返回,---PaymentFallbackService",new Payment(id, "errorSerial......"));
    }
}

```



###### controller

```java
//==================OpenFeign
@Resource
private PaymentService paymentService;

@GetMapping(value = "/consumer/openfeign/{id}")
public CommonResult<Payment> paymentSQL(@PathVariable("id") Long id) {
    if(id == 4) {
        throw new RuntimeException("没有该id");
    }
    return paymentService.paymentSQL(id);
}
```



##### 测试

[测试接口](http://localhost:84/consumer/paymentSQL/1)

测试84调用9003，此时故意关闭9003微服务提供者，看84消费侧自动降级，不会被耗死



>   9003 未关闭

![image-20220126162809728](https://typora-oss.yixihan.chat//img/202210301925188.png)



>   9003 已关闭

![image-20220126162828472](https://typora-oss.yixihan.chat//img/202210301925821.png)



#### 熔断框架对比

![image-20220126163329149](https://typora-oss.yixihan.chat//img/202210301925646.png)



### 规则持久化



#### 是什么

一旦我们重启应用，sentinel规则将消失，生产环境需要将配置规则进行持久化



#### 怎么玩

将限流配置规则持久化进Nacos保存，只要刷新8401某个rest地址，sentinel控制台的流控规则就能看到，只要Nacos里面的配置不删除，针对8401上sentinel上的流控规则持续有效



#### 步骤

修改cloudalibaba-sentinel-service8401



##### POM

```xml
 <!--SpringCloud ailibaba sentinel-datasource-nacos -->
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-datasource-nacos</artifactId>
</dependency>
```



##### YAML

```yaml
server:
  port: 8401

spring:
  application:
    name: cloudalibaba-sentinel-service
  cloud:
    nacos:
      discovery:
        #Nacos服务注册中心地址
        server-addr: 175.24.229.41:8848
    sentinel:
      transport:
        #配置Sentinel dashboard地址
        dashboard: localhost:8080
        #默认8719端口，假如被占用会自动从8719开始依次+1扫描,直至找到未被占用的端口
        port: 8719
      datasource:
        ds1:
          nacos:
            server-addr: 175.24.229.41:8848
            dataId: cloudalibaba-sentinel-service
            groupId: DEFAULT_GROUP
            data-type: json
            rule-type: flow

management:
  endpoints:
    web:
      exposure:
        include: '*'

# 添加 OpenFeign 则需删除 devtool 热部署
#feign:
#  sentinel:
#    enabled: true # 激活Sentinel对Feign的支持
```



##### Nacos 业务规则配置

![image-20220126163848819](https://typora-oss.yixihan.chat//img/202210301925673.png)



>   内容解析

-   resource：资源名称；

-   limitApp：来源应用；

-   grade：阈值类型，0表示线程数，1表示QPS；

-   count：单机阈值；

-   strategy：流控模式，0表示直接，1表示关联，2表示链路；

-   controlBehavior：流控效果，0表示快速失败，1表示Warm Up，2表示排队等待；

-   clusterMode：是否集群。





##### 测试

>   启动8401后刷新sentinel发现业务规则有了

![image-20220126164702165](https://typora-oss.yixihan.chat//img/202210301925045.png)



>   快速访问测试接口

[测试接口](http://localhost:8401/rateLimit/byUrl)

![image-20220126164952864](https://typora-oss.yixihan.chat//img/202210301925065.png)



>   停止8401再看sentinel

![image-20220126164648136](https://typora-oss.yixihan.chat//img/202210301925256.png)



>   重新启动8401再看sentinel

乍一看还是没有，稍等一会儿

多次调用 [测试接口](http://localhost:8401/rateLimit/byUrl)

重新配置出现了，持久化验证通过

![image-20220126164702165](https://typora-oss.yixihan.chat//img/202210301925653.png)

