---
title: SpringCloud Alibaba Nacos
date: 2022-10-30T17:55:28+08:00
sidebar: 'auto'
categories:
- Java
tags:
- Java
- SpringCloud
- SpringCloud Alibaba
- Nacos
---


# SpringCloud Allibaba



## 入门简介



### why 会出现 SpringCloud alibaba



#### Spring Cloud Netflix项目进入维护模式

[官网博客](https://spring.io/blog/2018/12/12/spring-cloud-greenwich-rc1-available-now)

![image-20220124094710732](https://typora-oss.yixihan.chat//img/202210301916072.png)



#### Spring Cloud Netflix Projects Entering Maintenance Mode



##### 什么是维护模式

![image-20220124094801231](https://typora-oss.yixihan.chat//img/202210301917313.png)

将模块置于维护模式，意味着 Spring Cloud 团队将不会再向模块添加新功能。

我们将修复 block 级别的 bug 以及安全问题，我们也会考虑并审查社区的小型 pull request。



##### 进入维护模式意味着什么呢？

>   Spring Cloud Netflix 将不再开发新的组件

我们都知道Spring Cloud 版本迭代算是比较快的，因而出现了很多重大ISSUE都还来不及Fix就又推另一个Release了。进入维护模式意思就是目前一直以后一段时间Spring Cloud Netflix提供的服务和功能就这么多了，不在开发新的组件和功能了。以后将以维护和Merge分支Full Request为主



>   新组件功能将以其他替代平代替的方式实现

![image-20220124094847669](https://typora-oss.yixihan.chat//img/202210301917465.png)



### SpringCloud alibaba带来了什么



#### 是什么

 [官网](https://github.com/alibaba/spring-cloud-alibaba/blob/master/README-zh.md)



诞生：2018.10.31，Spring Cloud Alibaba 正式入驻了 Spring Cloud 官方孵化器，并在 Maven 中央库发布了第一个版本。

![image-20220124095017130](https://typora-oss.yixihan.chat//img/202210301917286.png)



#### 能干嘛

服务限流降级：默认支持 Servlet、Feign、RestTemplate、Dubbo 和 RocketMQ 限流降级功能的接入，可以在运行时通过控制台实时修改限流降级规则，还支持查看限流降级 Metrics 监控。

服务注册与发现：适配 Spring Cloud 服务注册与发现标准，默认集成了 Ribbon 的支持。

分布式配置管理：支持分布式系统中的外部化配置，配置更改时自动刷新。

消息驱动能力：基于 Spring Cloud Stream 为微服务应用构建消息驱动能力。

阿里云对象存储：阿里云提供的海量、安全、低成本、高可靠的云存储服务。支持在任何应用、任何时间、任何地点存储和访问任意类型的数据。

分布式任务调度：提供秒级、精准、高可靠、高可用的定时（基于 Cron 表达式）任务调度服务。同时提供分布式的任务执行模型，如网格任务。网格任务支持海量子任务均匀分配到所有 Worker（schedulerx-client）上执行。



#### 下载地址

[下载地址](https://github.com/alibaba/spring-cloud-alibaba/blob/master/README-zh.md)



#### 怎么玩

![image-20220124095132211](https://typora-oss.yixihan.chat//img/202210301917683.png)



#### SpringCloud alibaba学习资料获取

>   官网

[官网](https://spring.io/projects/spring-cloud-alibaba#overview)



>   英文

[github 文档](https://github.com/alibaba/spring-cloud-alibaba)

[spring 官网文档](https://spring-cloud-alibaba-group.github.io/github-pages/greenwich/spring-cloud-alibaba.html)



>   中文

[中文文档](https://github.com/alibaba/spring-cloud-alibaba/blob/master/README-zh.md)



## SpringCloud Alibaba Nacos服务注册和配置中心



### Nacos简介



#### Nacos 是什么

一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。

Nacos: Dynamic Naming and Configuration Service

**Nacos就是注册中心 + 配置中心的组合**

Nacos = Eureka+Config +Bus



#### 能干嘛

-   替代Eureka做服务注册中心
-   替代Config做服务配置中心



#### 去哪下

[github 官网](https://github.com/alibaba/Nacos)

[官网文档 - 中文](https://nacos.io/zh-cn/index.html)

[官方文档 - 英文](https://spring-cloud-alibaba-group.github.io/github-pages/greenwich/spring-cloud-alibaba.html#_spring_cloud_alibaba_nacos_discovery)



#### 各种注册中心比较

![image-20220124101943279](https://typora-oss.yixihan.chat//img/202210301917337.png)

据说 Nacos 在阿里巴巴内部有超过 10 万的实例运行，已经过了类似双十一等各种大型流量的考验



### 安装并运行Nacos

ps : 本地Java8+Maven环境已经OK



>   下载地址

[github](https://github.com/alibaba/nacos/releases)



>   解压运行

用 nodepad++ 打开 bin 目录下的 startup.cmd, 将 `MODE` 修改为 `standalone`

```cmd
set MODE="standalone"
```



![image-20220124104622105](https://typora-oss.yixihan.chat//img/202210301917469.png)



>   双击启动

命令运行成功后直接访问

[nacos 控制台](http://localhost:8848/nacos)

账号密码 都是 nacos

![image-20220124104825473](https://typora-oss.yixihan.chat//img/202210301918995.png)



### Nacos作为服务注册中心演示



#### 官网文档

[spring 文档](https://spring-cloud-alibaba-group.github.io/github-pages/greenwich/spring-cloud-alibaba.html#_spring_cloud_alibaba_nacos_config)



#### 基于Nacos的服务提供者



##### 建 module

module 名 : cloudalibaba-provider-payment9001



##### 改 POM

>   父 POM

```xml
<!-- spring cloud alibaba 2.2.7.RELEASE -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alibaba-dependencies</artifactId>
    <version>2.2.7.RELEASE</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```



>   模块 POM

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

    <artifactId>cloudalibaba-provider-payment9002</artifactId>

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



##### 写 YAML

```yaml
server:
  port: 9001

spring:
  application:
    name: nacos-payment-provider
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #配置Nacos地址

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
 * @create : 2022-01-24-11:21
 */
@SpringBootApplication
@EnableDiscoveryClient
public class PaymentMain9001 {

    public static void main(String[] args) {
        SpringApplication.run (PaymentMain9001.class, args);
    }
}

```



##### 业务类

```java
package com.yixihan.springcloud.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author : yixihan
 * @create : 2022-01-24-11:22
 */
@RestController
public class PaymentController {

    @Value ("${server.port}")
    private String serverPort;

    @GetMapping(value = "/payment/nacos/{id}")
    public String getPayment(@PathVariable("id") Integer id)
    {
        return "nacos registry, serverPort: "+ serverPort+"\t id"+id;
    }
}

```



##### 测试

[测试接口](http://localhost:9001/payment/nacos/1)

[nacos 控制台](http://localhost:8848/nacos)



>   nacos 控制台

![image-20220124114502039](https://typora-oss.yixihan.chat//img/202210301918060.png)



>   接口

![image-20220124114512159](https://typora-oss.yixihan.chat//img/202210301918017.png)



##### 参照 9001 构建 9002

新建cloudalibaba-provider-payment9002

其余省略



或者取巧不想新建重复体力劳动，直接拷贝虚拟端口映射

![image-20220124114641403](https://typora-oss.yixihan.chat//img/202210301918487.png)

![image-20220124114728253](https://typora-oss.yixihan.chat//img/202210301918809.png)

![image-20220124114744229](https://typora-oss.yixihan.chat//img/202210301918258.png)



#### 基于Nacos的服务消费者



##### 建 module

module 名 : cloudalibaba-consumer-nacos-order83



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

    <artifactId>cloudalibaba-consumer-nacos-order83</artifactId>

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



>   为什么nacos支持负载均衡

![image-20220124130438121](https://typora-oss.yixihan.chat//img/202210301918745.png)



##### 写 YAML

```yaml
server:
  port: 83


spring:
  application:
    name: nacos-order-consumer
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848


#消费者将要去访问的微服务名称(注册成功进nacos的微服务提供者)
service-url:
  nacos-user-service: http://nacos-payment-provider


```



##### 主启动

```java
package com.yixihan.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @author : yixihan
 * @create : 2022-01-24-12:47
 */
@SpringBootApplication
@EnableDiscoveryClient
public class OrderNacosMain83 {

    public static void main(String[] args) {
        SpringApplication.run (OrderNacosMain83.class, args);
    }
}

```



##### 业务类

>   config

```java
package com.yixihan.springcloud.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * @author : yixihan
 * @create : 2022-01-24-12:47
 */
@Configuration
public class ApplicationContextBean {

    @Bean
    @LoadBalanced
    public RestTemplate getRestTemplate () {
        return new RestTemplate ();
    }
}

```



>   controller

```java
package com.yixihan.springcloud.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;

/**
 * @author : yixihan
 * @create : 2022-01-24-12:48
 */
@RestController
@Slf4j
public class OrderNacosController {

    @Resource
    private RestTemplate restTemplate;

    @Value("${service-url.nacos-user-service}")
    private String serverURL;

    @GetMapping("/consumer/payment/nacos/{id}")
    public String paymentInfo(@PathVariable("id") Long id) {
        return restTemplate.getForObject(serverURL+"/payment/nacos/"+id,String.class);
    }

}

```



##### 测试

[测试接口](http://localhost:83/consumer/payment/nacos/3)

[nacos 控制台](http://localhost:8848/nacos/)



>   nacos 控制台

![image-20220124125548892](https://typora-oss.yixihan.chat//img/202210301918099.png)



>   测试接口

![image-20220124125621363](https://typora-oss.yixihan.chat//img/202210301918391.png)

![image-20220124125638143](https://typora-oss.yixihan.chat//img/202210301918302.png)

![image-20220124125632008](https://typora-oss.yixihan.chat//img/202210301918330.png)



#### 服务注册中心对比



##### nacos 全景图

![image-20220124125708212](https://typora-oss.yixihan.chat//img/202210301918602.png)



##### nacos 和 CAP

![image-20220124125756140](https://typora-oss.yixihan.chat//img/202210301918956.png)

![image-20220124125807346](https://typora-oss.yixihan.chat//img/202210301918048.png)



##### Nacos 切换

**Nacos 支持AP和CP模式的切换**

**C是所有节点在同一时间看到的数据是一致的；而A的定义是所有的请求都会收到响应。**



>   何时选择使用何种模式？

一般来说，如果不需要存储服务级别的信息且服务实例是通过nacos-client注册，并能够保持心跳上报，那么就可以选择AP模式。当前主流的服务如 Spring cloud 和 Dubbo 服务，都适用于AP模式，AP模式为了服务的可能性而减弱了一致性，因此AP模式下只支持注册临时实例。

如果需要在服务级别编辑或者存储配置信息，那么 CP 是必须，K8S服务和DNS服务则适用于CP模式。

CP模式下则支持注册持久化实例，此时则是以 Raft 协议为集群运行模式，该模式下注册实例之前必须先注册服务，如果服务不存在，则会返回错误。



>   切换命令

```cmd
curl -X PUT '$NACOS_SERVER:8848/nacos/v1/ns/operator/switches?entry=serverMode&value=CP'
```



### Nacos作为服务配置中心演示



#### Nacos作为配置中心-基础配置



##### 建 module

module 名 : cloudalibaba-config-nacos-client3377



##### 改 POM

```xml
```



##### 写 YAML

>   bootstrap

```yaml
# nacos配置
server:
  port: 3377

spring:
  application:
    name: nacos-config-client
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #Nacos服务注册中心地址
      config:
        server-addr: localhost:8848 #Nacos作为配置中心地址
        file-extension: yaml #指定yaml格式的配置


  # ${spring.application.name}-${spring.profile.active}.${spring.cloud.nacos.config.file-extension}
  # nacos-config-client-dev.yaml
```



>   application

```yaml
spring:
  profiles:
    active: dev # 表示开发环境

```



>   why配置两个

Nacos同springcloud-config一样，在项目初始化时，要保证先从配置中心进行配置拉取，拉取配置之后，才能保证项目的正常启动。

springboot中配置文件的加载是存在优先级顺序的，bootstrap优先级高于application



##### 主启动

```java
package com.yixihan.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @author : yixihan
 * @create : 2022-01-24-13:06
 */
@SpringBootApplication
@EnableDiscoveryClient
public class NacosConfigClientMain3377 {

    public static void main(String[] args) {
        SpringApplication.run (NacosConfigClientMain3377.class, args);
    }
}

```



##### 业务类

```java
package com.yixihan.springcloud.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author : yixihan
 * @create : 2022-01-24-13:07
 */
@RestController
@Slf4j
@RefreshScope //在控制器类加入@RefreshScope注解使当前类下的配置支持Nacos的动态刷新功能。
public class ConfigClientController {

    @Value("${config.info}")
    private String configInfo;

    @GetMapping("/config/info")
    public String getConfigInfo() {
        return configInfo;
    }

}

```



>   @RefreshScope

![image-20220124132207521](https://typora-oss.yixihan.chat//img/202210301919138.png)



##### 在Nacos中添加配置信息

>   Nacos中的匹配规则

[官网信息](https://nacos.io/zh-cn/docs/quick-start-spring-cloud.html)

![image-20220124131021536](https://typora-oss.yixihan.chat//img/202210301919756.png)



>   最后公式：

```
${spring.application.name}-${spring.profiles.active}.${spring.cloud.nacos.config.file-extension}

spring.application.name 为微服务名, 默认为prefix
spring.profile.active 即为当前环境对应的 profile，可以通过配置项 spring.profile.active 来配置。
file-exetension 为配置内容的数据格式，可以通过配置项 spring.cloud.nacos.config.file-extension 来配置
```



>   小总结

![image-20220124132343881](https://typora-oss.yixihan.chat//img/202210301919812.png)



>   实操

新增配置

![新增配置](https://typora-oss.yixihan.chat//img/202210301919493.png)

Data ID 为最后推出来的文件名

![image-20220124132642355](https://typora-oss.yixihan.chat//img/202210301919799.png)



>   历史配置

Nacos会记录配置文件的历史版本默认保留30天，此外还有一键回滚功能，回滚操作将会触发配置更新



回滚

![image-20220124132813457](https://typora-oss.yixihan.chat//img/202210301919301.png)



##### 测试

ps : nacos 自带动态刷新

[测试接口](http://localhost:3377/config/info)

[nacos 控制台](http://localhost:8848/nacos/)



![image-20220124132026731](https://typora-oss.yixihan.chat//img/202210301919796.png)

![image-20220124131510379](https://typora-oss.yixihan.chat//img/202210301919392.png)







![image-20220124132052483](https://typora-oss.yixihan.chat//img/202210301919292.png)

![image-20220124131757215](https://typora-oss.yixihan.chat//img/202210301919823.png)







#### Nacos作为配置中心-分类配置



##### 问题 - 多环境多项目管理

>   问题1：

实际开发中，通常一个系统会准备

dev开发环境

test测试环境

prod生产环境。

如何保证指定环境启动时服务能正确读取到Nacos上相应环境的配置文件呢？



>   问题 2 :

一个大型分布式微服务系统会有很多微服务子项目，每个微服务项目又都会有相应的开发环境、测试环境、预发环境、正式环境......

那怎么对这些微服务配置进行管理呢？



##### Nacos的图形化管理界面

>   配置管理

![image-20220124133156122](https://typora-oss.yixihan.chat//img/202210301919379.png)



>   命名空间

![image-20220124133221255](https://typora-oss.yixihan.chat//img/202210301919710.png)



##### Namespace+Group+Data ID三者关系？为什么这么设计？

>   是什么

类似Java里面的package名和类名

最外层的namespace是可以用于区分部署环境的，Group和DataID逻辑上区分两个目标对象。



>   三者情况

![image-20220124133255088](https://typora-oss.yixihan.chat//img/202210301919324.png)



>   默认情况

Namespace=public，Group=DEFAULT_GROUP, 默认Cluster是DEFAULT



Nacos默认的命名空间是public，Namespace主要用来实现隔离。

比方说我们现在有三个环境：开发、测试、生产环境，我们就可以创建三个Namespace，不同的Namespace之间是隔离的。

Group默认是DEFAULT_GROUP，Group可以把不同的微服务划分到同一个分组里面去

Service就是微服务；一个Service可以包含多个Cluster（集群），Nacos默认Cluster是DEFAULT，Cluster是对指定微服务的一个虚拟划分。

比方说为了容灾，将Service微服务分别部署在了杭州机房和广州机房，这时就可以给杭州机房的Service微服务起一个集群名称（HZ），给广州机房的Service微服务起一个集群名称（GZ），还可以尽量让同一个机房的微服务互相调用，以提升性能。

最后是Instance，就是微服务的实例。



##### DataID方案

指定spring.profile.active和配置文件的DataID来使不同环境下读取不同的配置

默认空间+默认分组+新建dev和test两个DataID



>   新建dev配置DataID

![image-20220124134354110](https://typora-oss.yixihan.chat//img/202210301919479.png)



>   新建test配置DataID

![image-20220124134413908](https://typora-oss.yixihan.chat//img/202210301919768.png)



>   通过spring.profile.active属性就能进行多环境下配置文件的读取

![image-20220124134434850](https://typora-oss.yixihan.chat//img/202210301919483.png)



>   测试

[测试 url](http://localhost:3377/config/info)

active = test

![image-20220124133822926](https://typora-oss.yixihan.chat//img/202210301919766.png)



active = dev

![image-20220124133859277](https://typora-oss.yixihan.chat//img/202210301919023.png)



##### Group方案

通过Group实现环境区分



>   新建 Group

![image-20220124135205278](https://typora-oss.yixihan.chat//img/202210301919257.png)



>   配置如图

![image-20220124135127155](https://typora-oss.yixihan.chat//img/202210301920231.png)



>   bootstrap+application

application

![image-20220124135228714](https://typora-oss.yixihan.chat//img/202210301920444.png)



bootstrap

![image-20220124135242877](https://typora-oss.yixihan.chat//img/202210301920346.png)



>   测试

[测试 url](http://localhost:3377/config/info)

group = TEST_GROUP

![image-20220124135005473](https://typora-oss.yixihan.chat//img/202210301920157.png)

![image-20220124135019859](https://typora-oss.yixihan.chat//img/202210301920715.png)



group = DEV_GROUP

![image-20220124135041036](https://typora-oss.yixihan.chat//img/202210301920449.png)

![image-20220124135054352](https://typora-oss.yixihan.chat//img/202210301920612.png)



##### Namespace方案

>   新建dev/test的Namespace

![image-20220124140458880](https://typora-oss.yixihan.chat//img/202210301920769.png)



>   回到服务管理-服务列表查看

![image-20220124140546529](https://typora-oss.yixihan.chat//img/202210301920266.png)

![image-20220124140621834](https://typora-oss.yixihan.chat//img/202210301920571.png)



>   按照域名配置填写

![image-20220124140650917](https://typora-oss.yixihan.chat//img/202210301920934.png)



>   bootstarp 和 application

bootstrap

```yaml
# nacos配置
server:
  port: 3377

spring:
  application:
    name: nacos-config-client
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #Nacos服务注册中心地址
      config:
        server-addr: localhost:8848 #Nacos作为配置中心地址
        file-extension: yaml #指定yaml格式的配置
        group: DEV_GROUP
        namespace: f1201f94-dace-4d11-987b-41d53d01e2d6

  # ${spring.application.name}-${spring.profile.active}.${spring.cloud.nacos.config.file-extension}
  # nacos-config-client-dev.yaml
```



application

```yaml
spring:
  profiles:
#    active: test # 表示测试环境
    active: dev # 表示开发环境
#    active: info # 表示开发环境

```



>   测试

![image-20220124140304590](https://typora-oss.yixihan.chat//img/202210301920219.png)



### Nacos集群和持久化配置（重要）



#### 官网说明

[官网](https://nacos.io/zh-cn/docs/cluster-mode-quick-start.html)



>   官网架构图

![image-20220124140833332](https://typora-oss.yixihan.chat//img/202210301920320.png)



>   真实情况

![image-20220124140843811](https://typora-oss.yixihan.chat//img/202210301920708.png)



##### 说明

默认Nacos使用嵌入式数据库实现数据的存储。所以，如果启动多个默认配置下的Nacos节点，数据存储是存在一致性问题的。

为了解决这个问题，Nacos采用了**集中式存储的方式来支持集群化部署，目前只支持MySQL的存储。**

![image-20220124140927780](https://typora-oss.yixihan.chat//img/202210301921294.png)

![image-20220124140952896](https://typora-oss.yixihan.chat//img/202210301921665.png)

按照上述，我们需要mysql数据库



>   官网说明

[官网说明](https://nacos.io/zh-cn/docs/deployment.html)



#### Nacos持久化配置解释



##### Nacos默认自带的是嵌入式数据库derby

[github 源码](https://github.com/alibaba/nacos/blob/develop/config/pom.xml)



##### derby到mysql切换配置步骤

>   在 `nacos\conf` 目录下找到sql脚本

![image-20220124142342297](https://typora-oss.yixihan.chat//img/202210301921463.png)





>   在nacos\conf目录下找到application.properties

![image-20220124142413918](https://typora-oss.yixihan.chat//img/202210301921149.png)



最后添加内容

```properties
spring.datasource.platform=mysql
 
db.num=1
db.url.0=jdbc:mysql://localhost:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&serverTimezone=UTC
db.user=root
db.password=123456

```



>   重新启动并访问 nacos

[nacos 控制台](http://localhost:8848/nacos)



>   新建配置文件

![image-20220124144036413](https://typora-oss.yixihan.chat//img/202210301921448.png)



>   mysql 数据库查看

![image-20220124143924641](https://typora-oss.yixihan.chat//img/202210301921798.png)



#### Linux版Nacos+MySQL生产环境配置

预计需要，1个Nginx+3个nacos注册中心+1个mysql



##### Nacos下载Linux版

![image-20220124144127195](https://typora-oss.yixihan.chat//img/202210301921688.png)



[下载地址](https://github.com/alibaba/nacos/releases)

下载后解压安装至 `/opt/nacos/nacos1`



#### 集群配置步骤(重点)

##### Linux服务器上mysql数据库配置

使用 Navicat 连接云服务器 mysql, 建立 `nacos_config` 数据库

![image-20220125103545537](https://typora-oss.yixihan.chat//img/202210301921786.png)

使用 `/opt/nacos/nacos1/conf` 目录下的 nacos-mysql.sql 文件建表

![image-20220125103824732](https://typora-oss.yixihan.chat//img/202210301921691.png)

![image-20220125103718179](https://typora-oss.yixihan.chat//img/202210301921483.png)



##### application.properties 配置

在 `/opt/nacos/nacos1/conf` 下操作

![image-20220125103838092](https://typora-oss.yixihan.chat//img/202210301921367.png)

application.properties 自带备份文件 application.properties.example, 不需要额外备份

```shell
cd /opt/nacos/nacos1/conf

# 编辑 application.properties
vim application.properties

# 修改内容如下
#*************** Config Module Related Configurations ***************#
### If use MySQL as datasource:
spring.datasource.platform=mysql

### Count of DB:
db.num=1

### Connect URL of DB:
db.url.0=jdbc:mysql://127.0.0.1:1617/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user.0=username
db.password.0=password

```



![image-20220125103950999](https://typora-oss.yixihan.chat//img/202210301921588.png)



##### Linux服务器上nacos的集群配置cluster.conf

在 `/opt/nacos/nacos1/conf` 下操作

![image-20220125104155352](https://typora-oss.yixihan.chat//img/202210301921804.png)

```shell
cd /opt/nacos/nacos1/conf

# 备份cluster.conf 文件
cp cluster.conf.example cluster.conf

# 查看内网 IP
hostname -I

# 编辑 cluster.conf
vim cluster.conf

# 添加内容如下
# 内网IP : 端口号
10.0.4.12:3333
10.0.4.12:4444
10.0.4.12:5555

```



![image-20220125104255030](https://typora-oss.yixihan.chat//img/202210301921074.png)

![image-20220125104313447](https://typora-oss.yixihan.chat//img/202210301921356.png)



##### 编辑Nacos的启动脚本startup.sh，使它能够接受不同的启动端口

在 `/opt/nacos/nacos1/bin` 下操作

![image-20220125104538905](https://typora-oss.yixihan.chat//img/202210301921658.png)



```shell
cd /opt/nacos/nacos1/bin

# 备份 startup.sh
cp startup.sh startup.sh.example

# 修改内容之一, 增加端口选择 -y
while getopts ":m:f:s:c:p:y:" opt
do
    case $opt in
        m)
            MODE=$OPTARG;;
        f)
            FUNCTION_MODE=$OPTARG;;
        s)
            SERVER=$OPTARG;;
        c)
            MEMBER_LIST=$OPTARG;;
        p)
            EMBEDDED_STORAGE=$OPTARG;;
        y)
            PORT=$OPTARG;;
        ?)
        echo "Unknown parameter"
        exit 1;;
    esac
done

# 修改内容之二 修改jvm 可选
# 修改 内存大小, 根据自己机器性能选择性修改

# 修改内容之三
# start
echo "$JAVA $JAVA_OPT_EXT_FIX ${JAVA_OPT}" > ${BASE_DIR}/logs/start.out 2>&1 &

if [[ "$JAVA_OPT_EXT_FIX" == "" ]]; then
  nohup "$JAVA" -Dserver.port=${PORT} ${JAVA_OPT} nacos.nacos >> ${BASE_DIR}/logs/start.out 2>&1 &
else
  nohup "$JAVA" -Dserver.port=${PORT} "$JAVA_OPT_EXT_FIX" ${JAVA_OPT} nacos.nacos >> ${BASE_DIR}/logs/start.out 2>&1 &
fi

echo "nacos is starting，you can check the ${BASE_DIR}/logs/start.out"

```



修改内容之一

![image-20220125105152707](https://typora-oss.yixihan.chat//img/202210301921169.png)



修改内容之二

![image-20220125105250920](https://typora-oss.yixihan.chat//img/202210301921961.png)



修改内容之三

![image-20220125104902679](https://typora-oss.yixihan.chat//img/202210301921030.png)



###### 全部配置

```sh
#!/bin/bash

# Copyright 1999-2018 Alibaba Group Holding Ltd.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

cygwin=false
darwin=false
os400=false
case "`uname`" in
CYGWIN*) cygwin=true;;
Darwin*) darwin=true;;
OS400*) os400=true;;
esac
error_exit ()
{
    echo "ERROR: $1 !!"
    exit 1
}
[ ! -e "$JAVA_HOME/bin/java" ] && JAVA_HOME=$HOME/jdk/java
[ ! -e "$JAVA_HOME/bin/java" ] && JAVA_HOME=/usr/java
[ ! -e "$JAVA_HOME/bin/java" ] && JAVA_HOME=/opt/taobao/java
[ ! -e "$JAVA_HOME/bin/java" ] && unset JAVA_HOME

if [ -z "$JAVA_HOME" ]; then
  if $darwin; then

    if [ -x '/usr/libexec/java_home' ] ; then
      export JAVA_HOME=`/usr/libexec/java_home`

    elif [ -d "/System/Library/Frameworks/JavaVM.framework/Versions/CurrentJDK/Home" ]; then
      export JAVA_HOME="/System/Library/Frameworks/JavaVM.framework/Versions/CurrentJDK/Home"
    fi
  else
    JAVA_PATH=`dirname $(readlink -f $(which javac))`
    if [ "x$JAVA_PATH" != "x" ]; then
      export JAVA_HOME=`dirname $JAVA_PATH 2>/dev/null`
    fi
  fi
  if [ -z "$JAVA_HOME" ]; then
        error_exit "Please set the JAVA_HOME variable in your environment, We need java(x64)! jdk8 or later is better!"
  fi
fi

export SERVER="nacos-server"
export MODE="cluster"
export FUNCTION_MODE="all"
export MEMBER_LIST=""
export EMBEDDED_STORAGE=""
while getopts ":m:f:s:c:p:y:" opt
do
    case $opt in
        m)
            MODE=$OPTARG;;
        f)
            FUNCTION_MODE=$OPTARG;;
        s)
            SERVER=$OPTARG;;
        c)
            MEMBER_LIST=$OPTARG;;
        p)
            EMBEDDED_STORAGE=$OPTARG;;
	y)
	    PORT=$OPTARG;;
        ?)
        echo "Unknown parameter"
        exit 1;;
    esac
done

export JAVA_HOME
export JAVA="$JAVA_HOME/bin/java"
export BASE_DIR=`cd $(dirname $0)/..; pwd`
export CUSTOM_SEARCH_LOCATIONS=file:${BASE_DIR}/conf/

#===========================================================================================
# JVM Configuration
#===========================================================================================
if [[ "${MODE}" == "standalone" ]]; then
    JAVA_OPT="${JAVA_OPT} -Xms512m -Xmx512m -Xmn256m"
    JAVA_OPT="${JAVA_OPT} -Dnacos.standalone=true"
else
    if [[ "${EMBEDDED_STORAGE}" == "embedded" ]]; then
        JAVA_OPT="${JAVA_OPT} -DembeddedStorage=true"
    fi
    JAVA_OPT="${JAVA_OPT} -server -Xms512m -Xmx512m -Xmn512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=320m"
    JAVA_OPT="${JAVA_OPT} -XX:-OmitStackTraceInFastThrow -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=${BASE_DIR}/logs/java_heapdump.hprof"
    JAVA_OPT="${JAVA_OPT} -XX:-UseLargePages"

fi

if [[ "${FUNCTION_MODE}" == "config" ]]; then
    JAVA_OPT="${JAVA_OPT} -Dnacos.functionMode=config"
elif [[ "${FUNCTION_MODE}" == "naming" ]]; then
    JAVA_OPT="${JAVA_OPT} -Dnacos.functionMode=naming"
fi

JAVA_OPT="${JAVA_OPT} -Dnacos.member.list=${MEMBER_LIST}"

JAVA_MAJOR_VERSION=$($JAVA -version 2>&1 | sed -E -n 's/.* version "([0-9]*).*$/\1/p')
if [[ "$JAVA_MAJOR_VERSION" -ge "9" ]] ; then
  JAVA_OPT="${JAVA_OPT} -Xlog:gc*:file=${BASE_DIR}/logs/nacos_gc.log:time,tags:filecount=10,filesize=102400"
else
  JAVA_OPT_EXT_FIX="-Djava.ext.dirs=${JAVA_HOME}/jre/lib/ext:${JAVA_HOME}/lib/ext"
  JAVA_OPT="${JAVA_OPT} -Xloggc:${BASE_DIR}/logs/nacos_gc.log -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=100M"
fi

JAVA_OPT="${JAVA_OPT} -Dloader.path=${BASE_DIR}/plugins/health,${BASE_DIR}/plugins/cmdb,${BASE_DIR}/plugins/selector"
JAVA_OPT="${JAVA_OPT} -Dnacos.home=${BASE_DIR}"
JAVA_OPT="${JAVA_OPT} -jar ${BASE_DIR}/target/${SERVER}.jar"
JAVA_OPT="${JAVA_OPT} ${JAVA_OPT_EXT}"
JAVA_OPT="${JAVA_OPT} --spring.config.additional-location=${CUSTOM_SEARCH_LOCATIONS}"
JAVA_OPT="${JAVA_OPT} --logging.config=${BASE_DIR}/conf/nacos-logback.xml"
JAVA_OPT="${JAVA_OPT} --server.max-http-header-size=524288"

if [ ! -d "${BASE_DIR}/logs" ]; then
  mkdir ${BASE_DIR}/logs
fi

echo "$JAVA $JAVA_OPT_EXT_FIX ${JAVA_OPT}"

if [[ "${MODE}" == "standalone" ]]; then
    echo "nacos is starting with standalone"
else
    echo "nacos is starting with cluster"
fi

# check the start.out log output file
if [ ! -f "${BASE_DIR}/logs/start.out" ]; then
  touch "${BASE_DIR}/logs/start.out"
fi
# start
echo "$JAVA $JAVA_OPT_EXT_FIX ${JAVA_OPT}" > ${BASE_DIR}/logs/start.out 2>&1 &

if [[ "$JAVA_OPT_EXT_FIX" == "" ]]; then
  nohup "$JAVA" -Dserver.port=${PORT} ${JAVA_OPT} nacos.nacos >> ${BASE_DIR}/logs/start.out 2>&1 &
else
  nohup "$JAVA" -Dserver.port=${PORT} "$JAVA_OPT_EXT_FIX" ${JAVA_OPT} nacos.nacos >> ${BASE_DIR}/logs/start.out 2>&1 &
fi

echo "nacos is starting，you can check the ${BASE_DIR}/logs/start.out"

```



##### 复制三份 nacos 文件

```shell
cd /opt/nacos
cp -r nacos1 nacos2
cp -r nacos2 nacos3
```



##### Nginx的配置，由它作为负载均衡器



>   查看 nginx 是否有 stream 模块

```shell
cd /usr/local/nginx/sbin
./nginx -V
```



![image-20220125110020060](https://typora-oss.yixihan.chat//img/202210301921085.png)

若没有 stream 模块则需要安装

###### nginx 需要安装 stream 模块

>   备份原来的 nginx 目录

```shell
cd /usr/local/
cp -r nginx/ nginx-noStream/
```



![image-20220125105933450](https://typora-oss.yixihan.chat//img/202210301921506.png)



转到 nginx 安装目录 `/opt/nginx-1.20.1/`

```shell
cd /opt/nginx-1.20.1/

# 下载 stream 模块
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module --with-stream

# 安装
make && make install

# 查看是否安装完成
cd /usr/local/nginx/sbin
./nginx -V
```



![image-20220125110020060](https://typora-oss.yixihan.chat//img/202210301922012.png)



###### 修改nginx的配置文件

在 `/usr/local/nginx/conf` 目录下操作

```shell
cd /usr/local/nginx/conf

vim nginx.conf

# http 均衡负载 写在 http 模块最后面
upstream nacos-server {
        server 10.0.4.12:3333;
        server 10.0.4.12:4444;
        server 10.0.4.12:5555;
}
server {
	listen 8848;
	location / {
	proxy_pass http://nacos-server/;
}

# tcp 转发 写在 http 模块外面
stream {
    upstream NACOS_ADDR_9848 {
        server 10.0.4.12:4333;
        server 10.0.4.12:5444;
        server 10.0.4.12:6555;
    }

    server {
        listen 9848 so_keepalive=on;
        proxy_connect_timeout 3s;
        proxy_pass NACOS_ADDR_9848;
        tcp_nodelay on;
        proxy_buffer_size 32k;
    }
}

```



![image-20220125110523478](https://typora-oss.yixihan.chat//img/202210301922340.png)



###### 完整配置

```shell

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    #upstream NACOS {
    #    server 127.0.0.1:3333 max_fails=3 fail_timeout=5s;
    #    server 127.0.0.1:4444 max_fails=3 fail_timeout=5s;
    #    server 127.0.0.1:5555 max_fails=3 fail_timeout=5s;
    #}

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
            #proxy_pass http://NACOS;
	    #proxy_connect_timeout 75;
            #proxy_read_timeout 400;
            #proxy_send_timeout 400;
            #client_max_body_size 100m;
            #proxy_set_header Host $host;
            #proxy_set_header X-Real-IP $remote_addr;
            #proxy_set_header X-Forwarded-For $remote_addr;
     	}	

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}
    upstream nacos-server {
        server 10.0.4.12:3333;
        server 10.0.4.12:4444;
        server 10.0.4.12:5555;
    }
    server {
        listen 8848;
        location / {
            proxy_pass http://nacos-server/;
        }
    }
}

stream {
    upstream NACOS_ADDR_9848 {
	server 10.0.4.12:4333;
	server 10.0.4.12:5444;
	server 10.0.4.12:6555;
    }

    server {
	listen 9848 so_keepalive=on;
	proxy_connect_timeout 3s; 
	proxy_pass NACOS_ADDR_9848;
	tcp_nodelay on;
	proxy_buffer_size 32k;
    }
}


```



##### 启动 nacos 集群

```shell
# 启动 MySQL
systemctl start mysqld.service

# 启动 nacos
cd /opt/nacos

./nacos1/bin/startup.sh -y 3333
./nacos2/bin/startup.sh -y 4444
./nacos3/bin/startup.sh -y 5555

# 启动 nginx
cd /usr/local/nginx/sbin
./nginx
```



##### 测试

>   访问 nacos 控制台

[nacos 控制台](http://175.24.229.41:8848/nacos)

![image-20220125110855829](https://typora-oss.yixihan.chat//img/202210301922514.png)



>   新建一个配置测试

![image-20220125110929604](https://typora-oss.yixihan.chat//img/202210301922770.png)

![image-20220125111013074](https://typora-oss.yixihan.chat//img/202210301922121.png)



>   将微服务注册进 nacos 集群

yaml 配置 - 客户端

```yaml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: 175.24.229.41:8848
```



yaml 配置 - 配置端

```yaml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: 175.24.229.41:8848 #Nacos服务注册中心地址
      config:
        server-addr: 175.24.229.41:8848 #Nacos作为配置中心地址
        file-extension: yaml #指定yaml格式的配置
```



![image-20220125111148204](https://typora-oss.yixihan.chat//img/202210301922205.png)



#### 高可用小总结

![image-20220125111214063](https://typora-oss.yixihan.chat//img/202210301922179.png)




