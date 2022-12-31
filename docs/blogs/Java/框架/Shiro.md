---
title: Shiro
date: 2022-12-31
sidebar: 'auto'
categories:
- Java
tags:
- Java
- Shiro
---

# Shiro

官网 : https://shiro.apache.org/



## Shiro 介绍

Shiro可以非常容易的开发出足够好的应用，其不仅可以用在JavaSE环境，也可以用在JavaEE环境。Shiro可以帮助我们完成：认证、授权、加密、会话管理、与Web集成、缓存等。这不就是我们想要的嘛，而且Shiro的API也是非常简单；

> 基本功能点

![img](https://typora-oss.yixihan.chat//img/202212311636531.png)

**Authentication**：身份认证/登录，验证用户是不是拥有相应的身份；

**Authorization**：授权，即权限验证，验证某个已认证的用户是否拥有某个权限；即判断用户是否能做事情，常见的如：验证某个用户是否拥有某个角色。或者细粒度的验证某个用户对某个资源是否具有某个权限；

**Session Manager**：会话管理，即用户登录后就是一次会话，在没有退出之前，它的所有信息都在会话中；会话可以是普通JavaSE环境的，也可以是如Web环境的；

**Cryptography**：加密，保护数据的安全性，如密码加密存储到数据库，而不是明文存储；

**Web Support**：Web支持，可以非常容易的集成到Web环境；

**Caching**：缓存，比如用户登录后，其用户信息、拥有的角色/权限不必每次去查，这样可以提高效率；

**Concurrency**：shiro支持多线程应用的并发验证，即如在一个线程中开启另一个线程，能把权限自动传播过去；

**Testing**：提供测试支持；

**Run As**：允许一个用户假装为另一个用户（如果他们允许）的身份进行访问；

**Remember Me**：记住我，这个是非常常见的功能，即一次登录后，下次再来的话不用登录了。



**注 : Shiro不会去维护用户、维护权限；这些需要我们自己去设计/提供；然后通过相应的接口注入给Shiro即可**



### 从外部和内部看Shiro的架构

> 应用程序角度观察如何使用Shiro完成工作

![img](https://typora-oss.yixihan.chat//img/202212311636810.png)

可以看到：应用代码直接交互的对象是Subject，也就是说Shiro的对外API核心就是Subject；其每个API的含义：

**Subject**：主体，代表了当前“用户”，这个用户不一定是一个具体的人，与当前应用交互的任何东西都是Subject，如网络爬虫，机器人等；即一个抽象概念；所有Subject都绑定到SecurityManager，与Subject的所有交互都会委托给SecurityManager；可以把Subject认为是一个门面；SecurityManager才是实际的执行者；

**SecurityManager**：安全管理器；即所有与安全有关的操作都会与SecurityManager交互；且它管理着所有Subject；**可以看出它是Shiro的核心**，它负责与后边介绍的其他组件进行交互，如果学习过SpringMVC，你可以把它看成DispatcherServlet前端控制器；

**Realm**：域，Shiro从从Realm获取安全数据（如用户、角色、权限），就是说SecurityManager要验证用户身份，那么它需要从Realm获取相应的用户进行比较以确定用户身份是否合法；也需要从Realm得到用户相应的角色/权限进行验证用户是否能进行操作；可以把Realm看成DataSource，即安全数据源。

 

也就是说对于我们而言，最简单的一个Shiro应用：

1.  应用代码通过Subject来进行认证和授权，而Subject又委托给SecurityManager；
2.  我们需要给Shiro的SecurityManager注入Realm，从而让SecurityManager能得到合法的用户及其权限进行判断。



**结论 : Shiro不提供维护用户/权限，而是通过Realm让开发人员自己注入**



> 从Shiro内部来看下Shiro的架构

![img](https://typora-oss.yixihan.chat//img/202212311636862.png)

**Subject**：主体，可以看到主体可以是任何可以与应用交互的“用户”；

**SecurityManager**：相当于SpringMVC中的DispatcherServlet或者Struts2中的FilterDispatcher；是Shiro的心脏；所有具体的交互都通过SecurityManager进行控制；它管理着所有Subject、且负责进行认证和授权、及会话、缓存的管理。

**Authenticator**：认证器，负责主体认证的，这是一个扩展点，如果用户觉得Shiro默认的不好，可以自定义实现；其需要认证策略（Authentication Strategy），即什么情况下算用户认证通过了；

**Authrize**：授权器，或者访问控制器，用来决定主体是否有权限进行相应的操作；即控制着用户能访问应用中的哪些功能；

**Realm**：可以有1个或多个Realm，可以认为是安全实体数据源，即用于获取安全实体的；可以是JDBC实现，也可以是LDAP实现，或者内存实现等等；由用户提供；注意：Shiro不知道你的用户/权限存储在哪及以何种格式存储；所以我们一般在应用中都需要实现自己的Realm；

**SessionManager**：如果写过Servlet就应该知道Session的概念，Session呢需要有人去管理它的生命周期，这个组件就是SessionManager；而Shiro并不仅仅可以用在Web环境，也可以用在如普通的JavaSE环境、EJB等环境；所有呢，Shiro就抽象了一个自己的Session来管理主体与应用之间交互的数据；这样的话，比如我们在Web环境用，刚开始是一台Web服务器；接着又上了台EJB服务器；这时想把两台服务器的会话数据放到一个地方，这个时候就可以实现自己的分布式会话（如把数据放到Memcached服务器）；

**SessionDAO**：DAO大家都用过，数据访问对象，用于会话的CRUD，比如我们想把Session保存到数据库，那么可以实现自己的SessionDAO，通过如JDBC写到数据库；比如想把Session放到Memcached中，可以实现自己的Memcached SessionDAO；另外SessionDAO中可以使用Cache进行缓存，以提高性能；

**CacheManager**：缓存控制器，来管理如用户、角色、权限等的缓存的；因为这些数据基本上很少去改变，放到缓存中后可以提高访问的性能

**Cryptography**：密码模块，Shiro提高了一些常见的加密组件用于如密码加密/解密的。



## 身份验证

**身份验证**，即在应用中谁能证明他就是他本人。一般提供如他们的身份ID一些标识信息来表明他就是他本人，如提供身份证，用户名/密码来证明。



在shiro中，用户需要提供principals （身份）和credentials（证明）给shiro，从而应用能验证用户身份：

**principals**：身份，即主体的标识属性，可以是任何东西，如用户名、邮箱等，唯一即可。一个主体可以有多个principals，但只有一个Primary principals，一般是用户名/密码/手机号。

**credentials**：证明/凭证，即只有主体知道的安全值，如密码/数字证书等。



### 测试

user.ini

```ini
[users]
yixihan=123456
zengsitong=qqzst123456789
```

Test.java

```java
@Test
    public void Test1() {

        // 1. 获取 SecurityManager 工厂,此处使用 ini 配置文件初始化 SecurityManager
        Factory<SecurityManager> factory = new IniSecurityManagerFactory("classpath:user.ini");

        // 2. 得到 SecurityManager 实例 并绑定给 SecurityUtils
        SecurityManager securityManager = factory.getInstance();
        SecurityUtils.setSecurityManager(securityManager);

        // 3. 得到 Subject 及创建用户名/密码身份验证 Token（即用户身份/凭证）
        Subject subject = SecurityUtils.getSubject();
        UsernamePasswordToken token = new UsernamePasswordToken("yixihan", "123456");

        try {
            // 4. 登录,即身份验证
            subject.login(token);
            System.out.println("登录成功!");

        // 5. 身份验证失败
        } catch (LockedAccountException e) {
            System.out.println("禁用的帐号!");
        } catch (DisabledAccountException e) {
            System.out.println("锁定的帐号!");
        } catch (UnknownAccountException e) {
            System.out.println("错误的帐号!");            // 无此账号
        } catch (ExcessiveAttemptsException e) {
            System.out.println("登录失败次数过多!");
        } catch (IncorrectCredentialsException e) {     // 密码错误
            System.out.println("错误的凭证!");
        } catch (ExpiredCredentialsException  e) {
            System.out.println("过期的凭证!");
        }

        // 6. 退出
        subject.logout();
    }
```



### 身份验证流程

<img src="https://typora-oss.yixihan.chat//img/202212311636575.png" alt="img"  />

流程如下：

1.  首先调用Subject.login(token)进行登录，其会自动委托给Security Manager，调用之前必须通过SecurityUtils. setSecurityManager()设置；

2.  SecurityManager负责真正的身份验证逻辑；它会委托给Authenticator进行身份验证；

3.  Authenticator才是真正的身份验证者，Shiro API中核心的身份认证入口点，此处可以自定义插入自己的实现；

4.  Authenticator可能会委托给相应的AuthenticationStrategy进行多Realm身份验证，默认ModularRealmAuthenticator会调用AuthenticationStrategy进行多Realm身份验证；

5.  Authenticator会把相应的token传入Realm，从Realm获取身份验证信息，如果没有返回/抛出异常表示身份验证失败了。此处可以配置多个Realm，将按照相应的顺序及策略进行访问。



### Realm

#### Realm介绍

Realm：域，Shiro从从Realm获取安全数据（如用户、角色、权限），就是说SecurityManager要验证用户身份，那么它需要从Realm获取相应的用户进行比较以确定用户身份是否合法；也需要从Realm得到用户相应的角色/权限进行验证用户是否能进行操作；可以把Realm看成DataSource，即安全数据源。



Realm 接口 :

```java
public interface Realm {

    // 返回一个唯一的 Realm 名字
    String getName();		

    // 判断此 Realm 是否支持此 Token
    boolean supports(AuthenticationToken token);

  	// 根据 Token 获取认证信息
    AuthenticationInfo getAuthenticationInfo(AuthenticationToken token) throws AuthenticationException;
}
```



#### 单Realm测试

shiro-realm.ini

```ini
# 声明一个 realm
myRealm01=com.yixihan.config.Realm1.MyRealm01
# 指定 securityManager 的 realms 实现
securityManager.realms=$myRealm01
```

MyRealm01.java

```java
public class MyRealm01 implements Realm {
    @Override
    public String getName() {
        return "MyRealm01";
    }

    @Override
    public boolean supports(AuthenticationToken token) {
        // 仅支持 UsernamePasswordToken 类型的 Token
        return token instanceof UsernamePasswordToken;
    }

    @Override
    public AuthenticationInfo getAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        // 1. 获取用户名和密码
        String username = (String) token.getPrincipal();
        String password = new String((char[]) token.getCredentials());

        // 2. 身份验证
        if (! "yixihan".equals(username)) {
            throw new UnknownAccountException();
        }
        if (! "123456".equals(password)) {
            throw new IncorrectCredentialsException();
        }

        // 3. 如果身份认证验证成功，返回一 个AuthenticationInfo 实现
        System.out.println("getName =>" + getName());
        return new SimpleAuthenticationInfo(username,password,getName());
    }
}
```

Test2.java

```java
@Test
public void Test2() {

    // 1. 获取 SecurityManager 工厂,此处使用 ini 配置文件初始化 SecurityManager
    Factory<SecurityManager> factory = new IniSecurityManagerFactory("classpath:shiro-realm.ini");

    // 2. 得到 SecurityManager 实例 并绑定给 SecurityUtils
    SecurityManager securityManager = factory.getInstance();
    SecurityUtils.setSecurityManager(securityManager);

    // 3. 得到 Subject 及创建用户名/密码身份验证 Token（即用户身份/凭证）
    Subject subject = SecurityUtils.getSubject();
    UsernamePasswordToken token = new UsernamePasswordToken("zengsitong", "qqzst123456789");

    try {
        // 4. 登录,即身份验证
        subject.login(token);
        System.out.println("登录成功!");

        // 5. 身份验证失败
    } catch (LockedAccountException e) {
        System.out.println("禁用的帐号!");
    } catch (DisabledAccountException e) {
        System.out.println("锁定的帐号!");
    } catch (UnknownAccountException e) {
        System.out.println("错误的帐号!");            // 无此账号
    } catch (ExcessiveAttemptsException e) {
        System.out.println("登录失败次数过多!");
    } catch (IncorrectCredentialsException e) {     // 密码错误
        System.out.println("错误的凭证!");
    } catch (ExpiredCredentialsException  e) {
        System.out.println("过期的凭证!");
    }

    // 6. 退出
    subject.logout();
}
```



#### 多Realm测试

shiro-multi-realm.ini

```ini
# 声名多个 realm
MyRealm01 = com.yixihan.config.Realm1.MyRealm01
MyRealm02 = com.yixihan.config.Realm1.MyRealm02

# 指定 securityManager 的 realm 实现
securityManager.realms = $MyRealm01 , $MyRealm02
```

MyRealm02.java

```java
public class MyRealm02 implements Realm {
    @Override
    public String getName() {
        return "MyRealm02";
    }

    @Override
    public boolean supports(AuthenticationToken token) {
        // 仅支持 UsernamePasswordToken 类型的 Token
        return token instanceof UsernamePasswordToken;
    }

    @Override
    public AuthenticationInfo getAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        // 1. 获取用户名和密码
        String username = (String) token.getPrincipal();
        String password = new String((char[]) token.getCredentials());

        // 2. 身份验证
        if (! "zengsitong".equals(username)) {
            throw new UnknownAccountException();
        }
        if (! "qqzst123456789".equals(password)) {
            throw new IncorrectCredentialsException();
        }

        // 3. 如果身份认证验证成功，返回一 个AuthenticationInfo 实现
        System.out.println("getName =>" + getName());
        return new SimpleAuthenticationInfo(username,password,getName());
    }
}
```

Test.java

```java
@Test
public void Test3() {

    // 1. 获取 SecurityManager 工厂,此处使用 ini 配置文件初始化 SecurityManager

    Factory<SecurityManager> factory = new IniSecurityManagerFactory("classpath:shiro-multi-realm.ini");
    // 2. 得到 SecurityManager 实例 并绑定给 SecurityUtils
    SecurityManager securityManager = factory.getInstance();
    SecurityUtils.setSecurityManager(securityManager);

    // 3. 得到 Subject 及创建用户名/密码身份验证 Token（即用户身份/凭证）
    Subject subject = SecurityUtils.getSubject();
    UsernamePasswordToken token = new UsernamePasswordToken("zengsitong", "qqzst123456789");

    try {
        // 4. 登录,即身份验证
        subject.login(token);
        System.out.println("登录成功!");

        // 5. 身份验证失败
    } catch (LockedAccountException e) {
        System.out.println("禁用的帐号!");
    } catch (DisabledAccountException e) {
        System.out.println("锁定的帐号!");
    } catch (UnknownAccountException e) {
        System.out.println("错误的帐号!");            // 无此账号
    } catch (ExcessiveAttemptsException e) {
        System.out.println("登录失败次数过多!");
    } catch (IncorrectCredentialsException e) {     // 密码错误
        System.out.println("错误的凭证!");
    } catch (ExpiredCredentialsException  e) {
        System.out.println("过期的凭证!");
    }

    // 6. 退出
    subject.logout();
}
```



#### shiro默认提供的Realm

![img](https://typora-oss.yixihan.chat//img/202212311636770.png)

**IniRealm**：[users]部分指定用户名/密码及其角色；[roles]部分指定角色即权限信息；

**PropertiesRealm**： user.username=password,role1,role2指定用户名/密码及其角色；role.role1=permission1,permission2指定角色及权限信息；

**JdbcRealm**：通过sql查询相应的信息，如“select password from users where username = ?”获取用户密码，“select password, password_salt from users where username = ?”获取用户密码及盐；“select role_name from user_roles where username = ?”获取用户角色；“select permission from roles_permissions where role_name = ?”获取角色对应的权限信息；也可以调用相应的api进行自定义sql；



#### jdbcRealm测试

shiro-jdbc-realm.ini

```ini
# 引用默认 jdbcRealm
jdbcRealm = org.apache.shiro.realm.jdbc.JdbcRealm

# 数据库配置
dataSource=com.alibaba.druid.pool.DruidDataSource
dataSource.driverClassName=com.mysql.jdbc.Driver
dataSource.url=jdbc:mysql://110.42.138.132:3333/shiro?useSSL=false&useUnicode=true&aharacterEncoding=utf-8&serverTimezone=UTC
dataSource.username=root
dataSource.password=123456

jdbcRealm.dataSource=$dataSource
securityManager.realms=$jdbcRealm
```

shiro.sql

```sql
drop database if exists shiro;
create database shiro;
use shiro;

create table users (
                       id bigint auto_increment,
                       username varchar(100),
                       password varchar(100),
                       password_salt varchar(100),
                       constraint pk_users primary key(id)
) charset=utf8 ENGINE=InnoDB;
create unique index idx_users_username on users(username);

create table user_roles(
                           id bigint auto_increment,
                           username varchar(100),
                           role_name varchar(100),
                           constraint pk_user_roles primary key(id)
) charset=utf8 ENGINE=InnoDB;
create unique index idx_user_roles on user_roles(username, role_name);

create table roles_permissions(
                                  id bigint auto_increment,
                                  role_name varchar(100),
                                  permission varchar(100),
                                  constraint pk_roles_permissions primary key(id)
) charset=utf8 ENGINE=InnoDB;
create unique index idx_roles_permissions on roles_permissions(role_name, permission);

insert into users(username,password)values('zhang','123');
```

Test4.java

```java
@Test
public void Test4() {

    // 1. 获取 SecurityManager 工厂,此处使用 ini 配置文件初始化 SecurityManager
    Factory<SecurityManager> factory = new IniSecurityManagerFactory("classpath:shiro-jdbc-realm.ini");

    // 2. 得到 SecurityManager 实例 并绑定给 SecurityUtils
    SecurityManager securityManager = factory.getInstance();
    SecurityUtils.setSecurityManager(securityManager);

    // 3. 得到 Subject 及创建用户名/密码身份验证 Token（即用户身份/凭证）
    Subject subject = SecurityUtils.getSubject();
    UsernamePasswordToken token = new UsernamePasswordToken("zhang", "123");

    try {
        // 4. 登录,即身份验证
        subject.login(token);
        System.out.println("登录成功!");

        // 5. 身份验证失败
    } catch (LockedAccountException e) {
        System.out.println("禁用的帐号!");
    } catch (DisabledAccountException e) {
        System.out.println("锁定的帐号!");
    } catch (UnknownAccountException e) {
        System.out.println("错误的帐号!");            // 无此账号
    } catch (ExcessiveAttemptsException e) {
        System.out.println("登录失败次数过多!");
    } catch (IncorrectCredentialsException e) {     // 密码错误
        System.out.println("错误的凭证!");
    } catch (ExpiredCredentialsException  e) {
        System.out.println("过期的凭证!");
    }

    // 6. 退出
    subject.logout();
}
```



#### Authenticator 及 AuthenticationStrategy



Authenticator 的职责是验证用户帐号，是Shiro API中身份验证核心的入口点：



接口:

```java
public AuthenticationInfo authenticate(AuthenticationToken authenticationToken) throws AuthenticationException; 
```

如果验证成功，将返回 AuthenticationInfo 验证信息；此信息中包含了身份及凭证；如果验证失败将抛出相应的 AuthenticationException 实现。



SecurityManager 接口继承了 Authenticator ，另外还有一个 ModularRealmAuthenticator 实现，其委托给多个 Realm 进行验证，验证规则通过 AuthenticationStrategy 接口指定，默认提供的实现：

**FirstSuccessfulStrategy**：只要有一个 Realm 验证成功即可，只返回第一个 Realm 身份验证成功的认证信息，其他的忽略；

**AtLeastOneSuccessfulStrategy**：只要有一个 Realm 验证成功即可，和 FirstSuccessfulStrategy 不同，返回所有 Realm 身份验证成功的认证信息；

**AllSuccessfulStrategy**：所有 Realm 验证成功才算成功，且返回所有 Realm 身份验证成功的认证信息，如果有一个失败就失败了。

 

ModularRealmAuthenticator 默认使用 AtLeastOneSuccessfulStrategy 策略。



##### 测试

shiro-authenticator-all-success.ini

```ini
# 指定 securityManager 的 authenticator 实现
authenticator = org.apache.shiro.authc.pam.ModularRealmAuthenticator
securityManager.authenticator = $authenticator

# 指定 securityManager.authenticator 的 authenticationStrategy
allSuccessfulStrategy = org.apache.shiro.authc.pam.AllSuccessfulStrategy
securityManager.authenticator.authenticationStrategy = $allSuccessfulStrategy

MyRealm01=com.yixihan.config.Realm2.MyRealm01
MyRealm02=com.yixihan.config.Realm2.MyRealm02
MyRealm03=com.yixihan.config.Realm2.MyRealm03
securityManager.realms = $MyRealm01, $MyRealm03
```

shiro-authenticator-all-fail.ini

```ini
# 指定 securityManager 的 authenticator 实现
authenticator = org.apache.shiro.authc.pam.ModularRealmAuthenticator
securityManager.authenticator = $authenticator

# 指定 securityManager.authenticator 的 authenticationStrategy
allSuccessfulStrategy = org.apache.shiro.authc.pam.AllSuccessfulStrategy
securityManager.authenticator.authenticationStrategy = $allSuccessfulStrategy

MyRealm01=com.yixihan.config.Realm2.MyRealm01
MyRealm02=com.yixihan.config.Realm2.MyRealm02
MyRealm03=com.yixihan.config.Realm2.MyRealm03
securityManager.realms = $MyRealm01, $MyRealm02
```

MyRealm03.java

```java
package com.yixihan.config.Realm2;

import org.apache.shiro.authc.*;
import org.apache.shiro.realm.Realm;

public class MyRealm03 implements Realm {
    @Override
    public String getName() {
        return "MyRealm03";
    }

    @Override
    public boolean supports(AuthenticationToken token) {
        // 仅支持 UsernamePasswordToken 类型的 Token
        return token instanceof UsernamePasswordToken;
    }

    @Override
    public AuthenticationInfo getAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        // 1. 获取用户名和密码
        String username = (String) token.getPrincipal();
        String password = new String((char[]) token.getCredentials());

        // 2. 身份验证
        if (! "zhang".equals(username)) {
            throw new UnknownAccountException();
        }
        if (! "123".equals(password)) {
            throw new IncorrectCredentialsException();
        }

        // 3. 如果身份认证验证成功，返回一 个AuthenticationInfo 实现
        System.out.println("getName =>" + getName());
        return new SimpleAuthenticationInfo(username + "@163.com",password,getName());
    }
}
```

login.java

```java
public void login (String configFile, String username, String password) {

    // 1. 获取 SecurityManager 工厂,此处使用 ini 配置文件初始化 SecurityManager
    Factory<SecurityManager> factory = new IniSecurityManagerFactory(configFile);

    // 2. 得到 SecurityManager 实例 并绑定给 SecurityUtils
    SecurityManager securityManager = factory.getInstance();
    SecurityUtils.setSecurityManager(securityManager);

    // 3. 得到 Subject 及创建用户名/密码身份验证 Token（即用户身份/凭证）
    Subject subject = SecurityUtils.getSubject();
    UsernamePasswordToken token = new UsernamePasswordToken(username, password);

    try {
        subject.login(token);
    } catch (LockedAccountException e) {
        System.out.println("禁用的帐号!");
    } catch (DisabledAccountException e) {
        System.out.println("锁定的帐号!");
    } catch (UnknownAccountException e) {
        System.out.println("错误的帐号!");            // 无此账号
    } catch (ExcessiveAttemptsException e) {
        System.out.println("登录失败次数过多!");
    } catch (IncorrectCredentialsException e) {     // 密码错误
        System.out.println("错误的凭证!");
    } catch (ExpiredCredentialsException  e) {
        System.out.println("过期的凭证!");
    }
}
```

Test.java

```java
// success 测试
@Test
public void Test5() {
    String username = "zhang";
    String password = "123";

    login("classpath:shiro-authenticator-all-success.ini",username,password);

    Subject subject = SecurityUtils.getSubject();

    PrincipalCollection principalCollection = subject.getPrincipals();
    System.out.println(principalCollection);
}

// fail 测试
@Test
public void Test6() {
    String username = "wang";
    String password = "123";

    login("classpath:shiro-authenticator-all-fail.ini",username,password);

    Subject subject = SecurityUtils.getSubject();

    PrincipalCollection principalCollection = subject.getPrincipals();
    System.out.println(principalCollection);
}
```



AuthenticationStrategy.class

```java
public interface AuthenticationStrategy {

    // 在所有 Realm 验证之前调用
    AuthenticationInfo beforeAllAttempts(Collection<? extends Realm> realms, AuthenticationToken token) throws AuthenticationException;

 	// 在每个 Realm 之前调用   
    AuthenticationInfo beforeAttempt(Realm realm, AuthenticationToken token, AuthenticationInfo aggregate) throws AuthenticationException;

    // 在每个 Realm 之后调用
    AuthenticationInfo afterAttempt(Realm realm, AuthenticationToken token, AuthenticationInfo singleRealmInfo, AuthenticationInfo aggregateInfo, Throwable t)
            throws AuthenticationException;

    // 在所有 Realm 之后调用
    AuthenticationInfo afterAllAttempts(AuthenticationToken token, AuthenticationInfo aggregate) throws AuthenticationException;
}
```

AtLeastTwoAuthenticatorStrategy.java

```java
package com.yixihan.config.AuthenticationStrategy;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.pam.AbstractAuthenticationStrategy;
import org.apache.shiro.realm.Realm;
import org.apache.shiro.util.CollectionUtils;

import java.util.Collection;

public class AtLeastTwoAuthenticatorStrategy extends AbstractAuthenticationStrategy {

    @Override
    public AuthenticationInfo beforeAllAttempts(Collection<? extends Realm> realms, AuthenticationToken token) throws AuthenticationException {
        // 返回一个权限的认证信息
        return new SimpleAuthenticationInfo();
    }

    @Override
    public AuthenticationInfo beforeAttempt(Realm realm, AuthenticationToken token, AuthenticationInfo aggregate) throws AuthenticationException {
        // 返回之前合并的
        return aggregate;
    }

    @Override
    public AuthenticationInfo afterAttempt(Realm realm, AuthenticationToken token, AuthenticationInfo singleRealmInfo, AuthenticationInfo aggregateInfo, Throwable t) throws AuthenticationException {
        AuthenticationInfo info;
        if (singleRealmInfo == null) {
            info = aggregateInfo;
        } else {
            if (aggregateInfo == null) {
                info = singleRealmInfo;
            } else {
                info = merge(singleRealmInfo, aggregateInfo);
            }
        }

        return info;
    }

    @Override
    public AuthenticationInfo afterAllAttempts(AuthenticationToken token, AuthenticationInfo aggregate) throws AuthenticationException {
        if (aggregate == null || CollectionUtils.isEmpty(aggregate.getPrincipals()) || aggregate.getPrincipals().getRealmNames().size() < 2) {
            throw new AuthenticationException("Authentication token of type [" + token.getClass() + "] " +
                    "could not be authenticated by any configured realms.  Please ensure that at least two realm can " +
                    "authenticate these tokens.");
        }

        return aggregate;
    }
}
```

OnlyOneAuthenticatorStrategy.java

```java
package com.yixihan.config.AuthenticationStrategy;


import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.pam.AbstractAuthenticationStrategy;
import org.apache.shiro.realm.Realm;

import java.util.Collection;

public class OnlyOneAuthenticatorStrategy extends AbstractAuthenticationStrategy {

    @Override
    public AuthenticationInfo beforeAllAttempts(Collection<? extends Realm> realms, AuthenticationToken token) throws AuthenticationException {
        // 返回一个权限的认证信息
        return new SimpleAuthenticationInfo();
    }

    @Override
    public AuthenticationInfo beforeAttempt(Realm realm, AuthenticationToken token, AuthenticationInfo aggregate) throws AuthenticationException {
        // 返回之前合并的
        return aggregate;
    }

    @Override
    public AuthenticationInfo afterAttempt(Realm realm, AuthenticationToken token, AuthenticationInfo singleRealmInfo, AuthenticationInfo aggregateInfo, Throwable t) throws AuthenticationException {
        AuthenticationInfo info;
        if (singleRealmInfo == null) {
            info = aggregateInfo;
        } else {
            if (aggregateInfo == null) {
                info = singleRealmInfo;
            } else {
                info = merge(singleRealmInfo, aggregateInfo);
                if(info.getPrincipals().getRealmNames().size() > 1) {
                    System.out.println(info.getPrincipals().getRealmNames());
                    throw new AuthenticationException("Authentication token of type [" + token.getClass() + "] " +
                            "could not be authenticated by any configured realms.  Please ensure that only one realm can " +
                            "authenticate these tokens.");
                }
            }
        }


        return info;
    }

    @Override
    public AuthenticationInfo afterAllAttempts(AuthenticationToken token, AuthenticationInfo aggregate) throws AuthenticationException {
        return aggregate;
    }
}
```



#### AuthenticationInfo

![img](https://typora-oss.yixihan.chat//img/202212311636512.png)



```java
public interface AuthenticationToken extends Serializable {

    // 身份
    Object getPrincipal();

   	// 凭据
    Object getCredentials();

}
```



AuthenticationInfo有两个作用：

1.  如果Realm是AuthenticatingRealm子类，则提供给AuthenticatingRealm内部使用的CredentialsMatcher进行凭据验证；（如果没有继承它需要在自己的Realm中自己实现验证）；

2.  提供给SecurityManager来创建Subject（提供身份信息）；



MergableAuthenticationInfo用于提供在多Realm时合并AuthenticationInfo的功能，主要合并Principal、如果是其他的如credentialsSalt，会用后边的信息覆盖前边的。



Account相当于我们之前的User，SimpleAccount是其一个实现；在IniRealm、PropertiesRealm这种静态创建帐号信息的场景中使用，这些Realm直接继承了SimpleAccountRealm，而SimpleAccountRealm提供了相关的API来动态维护SimpleAccount；即可以通过这些API来动态增删改查SimpleAccount；动态增删改查角色/权限信息。及如果您的帐号不是特别多，可以使用这种方式，具体请参考SimpleAccountRealm Javadoc。



#### AuthorizationInfo

![img](https://typora-oss.yixihan.chat//img/202212311636281.png)

AuthorizationInfo用于聚合授权信息的：

```java
public interface AuthorizationInfo extends Serializable {

    // 获取角色字符串信息 
    Collection<String> getRoles();

    // 获取权限字符串信息
    Collection<String> getStringPermissions();

    // 获取Permission对象信息
    Collection<Permission> getObjectPermissions();
}
```

当我们使用AuthorizingRealm时，如果身份验证成功，在进行授权时就通过doGetAuthorizationInfo方法获取角色/权限信息用于授权验证。

 

Shiro提供了一个实现SimpleAuthorizationInfo，大多数时候使用这个即可



#### Subject

![img](https://typora-oss.yixihan.chat//img/202212311636036.png)

Subject是Shiro的核心对象，基本所有身份验证、授权都是通过Subject完成。

```java
public interface Subject {

	/* 身份信息获取 */
    // Primary Principal
    Object getPrincipal();
    
    // PrincipalCollection
    PrincipalCollection getPrincipals();

   
    /* 权限授权验证 */
    /* isPermitted 进行权限验证，验证后返回 true / false */
    /* checkPermission 验证失败时抛出 AuthorizationException */
    boolean isPermitted(String permission);

    boolean isPermitted(Permission permission);

    boolean[] isPermitted(String... permissions);

    boolean[] isPermitted(List<Permission> permissions);

    boolean isPermittedAll(String... permissions);

    boolean isPermittedAll(Collection<Permission> permissions);

    void checkPermission(String permission) throws AuthorizationException;

    void checkPermission(Permission permission) throws AuthorizationException;

    void checkPermissions(String... permissions) throws AuthorizationException;

    void checkPermissions(Collection<Permission> permissions) throws AuthorizationException;

    
    /* 角色授权验证 */ 
    /* hasRole 进行角色验证，验证后返回 true / false */
    /* checkRole 验证失败时抛出 AuthorizationException 异常 */ 
    boolean hasRole(String roleIdentifier);

    boolean[] hasRoles(List<String> roleIdentifiers);

    boolean hasAllRoles(Collection<String> roleIdentifiers);

    void checkRole(String roleIdentifier) throws AuthorizationException;

    void checkRoles(Collection<String> roleIdentifiers) throws AuthorizationException;

    void checkRoles(String... roleIdentifiers) throws AuthorizationException;

    
    /* 身份验证 */
    /* 通过 login 登录，如果登录失败将抛出相应的 AuthenticationException */
    /* 如果登录成功调用 isAuthenticated 就会返回 true ，即已经通过身份验证 */
    /* 如果 isRemembered 返回 true ，表示是通过记住我功能登录的而不是调用 login 方法登录的。 isAuthenticated / isRemembered 是互斥的，即如果其中一个返回 true ，另一个返回 false */
    void login(AuthenticationToken token) throws AuthenticationException;

    boolean isAuthenticated();

    boolean isRemembered();


    /* 会话 */
    /* 类似于 Web 中的会话。如果登录成功就相当于建立了会话，接着可以使用 getSession 获取 */
    /* 如果 create = false如果没有会话将返回 null ，而 create = true 如果没有会话会强制创建一个。 */
    // 相当于 getSession(true)
    Session getSession();

    Session getSession(boolean create);

    
    /* 退出 */
    void logout();

    
	/* 多线程 */
    /* 实现线程之间的Subject传播，因为Subject是线程绑定的,因此在多线程执行中需要传播到相应的线程才能获取到相应的 Subject */
    /* 方法一 : execute(runnable / callable 实例) 直接调用 */
    /* 方法二 : associateWith(runnable / callable实例) 得到一个包装后的实例 */
    /* 都是通过
    	1、把当前线程的 Subject 绑定过去；
    	2、在线程执行结束后自动释放。
    */
    <V> V execute(Callable<V> callable) throws ExecutionException;

    void execute(Runnable runnable);

    Runnable associateWith(Runnable runnable);

    
    /* RunAs */
    /* RunAs 即实现“允许 A 假设为 B 身份进行访问” */
    /* 通过调用 subject.runAs(b) 进行访问,接着调用 subject.getPrincipals 将获取到 B 的身份,此时调用 isRunAs 将返回 true ,而a的身份需要通过 subject. getPreviousPrincipals 获取；如果不需要 RunAs 了调用 subject. releaseRunAs 即可。 */
    
    void runAs(PrincipalCollection principals) throws NullPointerException, IllegalStateException;

    boolean isRunAs();

    
    PrincipalCollection getPreviousPrincipals();

    
    PrincipalCollection releaseRunAs();
   
}
```



对于Subject我们一般这么使用：

1.  **身份验证（login）**
2.  **授权（hasRole\*/isPermitted\*或checkRole\*/checkPermission\*）**
3.  **将相应的数据存储到会话（Session）**
4.  **切换身份（RunAs）/多线程身份传播**
5.  **退出**



#### PrincipalCollection

![img](https://typora-oss.yixihan.chat//img/202212311636151.png)



因为我们可以在Shiro中同时配置多个Realm，所以呢身份信息可能就有多个；因此其提供了PrincipalCollection用于聚合这些身份信息：



```java
public interface PrincipalCollection extends Iterable, Serializable {

    // 得到主要的身份
    Object getPrimaryPrincipal();

    // 根据身份类型获取第一个 
    <T> T oneByType(Class<T> type);

    // 根据身份类型获取一组
    <T> Collection<T> byType(Class<T> type);

    // 转换为List
    List asList();

    // 转换为Set 
    Set asSet();
 
    // 根据Realm名字获取
    Collection fromRealm(String realmName);

    // 获取所有身份验证通过的Realm名字 
    Set<String> getRealmNames();

    // 判断是否为空
    boolean isEmpty();
}
```

因为PrincipalCollection聚合了多个，此处最需要注意的是getPrimaryPrincipal，如果只有一个Principal那么直接返回即可，如果有多个Principal，则返回第一个（因为内部使用Map存储，所以可以认为是返回任意一个）；oneByType / byType根据凭据的类型返回相应的Principal；fromRealm根据Realm名字（每个Principal都与一个Realm关联）获取相应的Principal。



MutablePrincipalCollection是一个可变的PrincipalCollection接口，即提供了如下可变方法：

```java
public interface MutablePrincipalCollection extends PrincipalCollection {

    // 添加 Realm-Principal 的关联
    void add(Object principal, String realmName);

    // 添加一组 Realm-Principal 的关联
    void addAll(Collection principals, String realmName);

    // 添加PrincipalCollection
    void addAll(PrincipalCollection principals);

    // 清空
    void clear();
}
```



## 权限

### 权限介绍

授权，也叫访问控制，即在应用中控制谁能访问哪些资源（如访问页面/编辑数据/页面操作等）。在授权中需了解的几个关键对象：主体（Subject）、资源（Resource）、权限（Permission）、角色（Role）。



**主体（Subject）**

主体，即访问应用的用户，在Shiro中使用Subject代表该用户。用户只有授权后才允许访问相应的资源。

**资源（Resource）**

在应用中用户可以访问的任何东西，比如访问JSP页面、查看/编辑某些数据、访问某个业务方法、打印文本等等都是资源。用户只要授权后才能访问。

**权限（Permission）**

安全策略中的原子授权单位，通过权限我们可以表示在应用中用户有没有操作某个资源的权力。即权限表示在应用中用户能不能访问某个资源，如：

访问用户列表页面

查看/新增/修改/删除用户数据（即很多时候都是CRUD（增查改删）式权限控制）

打印文档等等。。。

 

如上可以看出，权限代表了用户有没有操作某个资源的权利，即反映在某个资源上的操作允不允许，不反映谁去执行这个操作。所以后续还需要把权限赋予给用户，即定义哪个用户允许在某个资源上做什么操作（权限），Shiro不会去做这件事情，而是由实现人员提供。

 

Shiro支持粗粒度权限（如用户模块的所有权限）和细粒度权限（操作某个用户的权限，即实例级别的），后续部分介绍。

**角色（Role）**

角色代表了操作集合，可以理解为权限的集合，一般情况下我们会赋予用户角色而不是权限，即这样用户可以拥有一组权限，赋予权限时比较方便。典型的如：项目经理、技术总监、CTO、开发工程师等都是角色，不同的角色拥有一组不同的权限。

​	**隐式角色**：即直接通过角色来验证用户有没有操作权限，如在应用中CTO、技术总监、开发工程师可以使用打印机，假设某天不允许开发工程师使用打印机，此时需要从应用中删除相应代码；再如在应用中CTO、技术总监可以查看用户、查看权限；突然有一天不允许技术总监查看用户、查看权限了，需要在相关代码中把技术总监角色从判断逻辑中删除掉；即粒度是以角色为单位进行访问控制的，粒度较粗；如果进行修改可能造成多处代码修改。

​	**显示角色**：在程序中通过权限控制谁能访问某个资源，角色聚合一组权限集合；这样假设哪个角色不能访问某个资源，只需要从角色代表的权限集合中移除即可；无须修改多处代码；即粒度是以资源/实例为单位的；粒度较细。



### 授权方式

> 编程式

```java
Subject subject = SecurityUtils.getSubject();  
if(subject.hasRole(“admin”)) {  
    //有权限  
} else {  
    //无权限  
}   
```



> 注解式

```java
@RequiresRoles("admin")  
public void hello() {  
    //有权限  
}  
```



> JSP/GSP标签

```jsp
<shiro:hasRole name="admin">  
<!— 有权限 —>  
</shiro:hasRole>   
```



没有权限将抛出相应的异常；



### 授权

#### 基于角色的访问控制（隐式角色）

shiro-role.ini

```ini
[users]
# 规则 : 用户名=密码,角色1，角色2
zhang=123,role1,role2
wang=123,role1
```

login.java

```java
public Subject login(String configFile, String username, String password) {

    // 1. 获取 SecurityManager 工厂,此处使用 ini 配置文件初始化 SecurityManager
    Factory<SecurityManager> factory = new IniSecurityManagerFactory(configFile);

    // 2. 得到 SecurityManager 实例 并绑定给 SecurityUtils
    SecurityManager securityManager = factory.getInstance();
    SecurityUtils.setSecurityManager(securityManager);

    // 3. 得到 Subject 及创建用户名/密码身份验证 Token（即用户身份/凭证）
    Subject subject = SecurityUtils.getSubject();
    UsernamePasswordToken token = new UsernamePasswordToken(username, password);

    try {
        subject.login(token);
    } catch (LockedAccountException e) {
        System.out.println("禁用的帐号!");
    } catch (DisabledAccountException e) {
        System.out.println("锁定的帐号!");
    } catch (UnknownAccountException e) {
        System.out.println("错误的帐号!");            // 无此账号
    } catch (ExcessiveAttemptsException e) {
        System.out.println("登录失败次数过多!");
    } catch (IncorrectCredentialsException e) {     // 密码错误
        System.out.println("错误的凭证!");
    } catch (ExpiredCredentialsException e) {
        System.out.println("过期的凭证!");
    }
    return subject;
}
```

Test1.java

```java
@Test
public void Test1() {
    Subject subject = login("classpath:shiro-role.ini", "zhang", "123");

    // 判断拥有角色 : role1
    System.out.println("该角色是否拥有 role1 角色 : " + subject.hasRole("role1"));

    // 判断拥有角色 : role1 role2
    System.out.println("该角色是否拥有 role1 role2 角色 : " + subject.hasAllRoles(Arrays.asList("role1", "role2")));

    // 判断拥有角色 : role1 role2 role3
    boolean[] rs = subject.hasRoles(Arrays.asList("role1","role2","role3"));

    System.out.println("该角色是否拥有 role1 role2 role3 角色 : " + Arrays.toString(rs));

}
```

Test2.java

```java
@Test
public void Test2() {
    Subject subject = login("classpath:shiro-role.ini", "zhang", "123");

    // 判断用户是否拥有某角色,若没有,则抛出异常
    try {
        subject.checkRole("role1");
    } catch (AuthorizationException e) {
        System.out.println("该用户未拥有 role1 角色");
    }

    try {
        subject.checkRoles("role1","role3");
    } catch (AuthorizationException e) {
        System.out.println("该用户未拥有 role1 role3 角色");
    }

    // 获取该 subject 的用户名
    System.out.println(subject.getPrincipal());

    // 判断用户是否拥有某角色,是则为 true , 否则为 false
    System.out.println(Arrays.toString(subject.hasRoles(Arrays.asList("role1", "role2", "role3"))));

    // 获取用户的 session
    System.out.println(subject.getSession());

    // 登出
    subject.logout();

    System.out.println(subject.getPrincipal());
}
```





#### 基于资源的访问控制（显示角色）

shiro-permission.ini

```ini
# 用户-角色
[users]
zhang=123,role1,role2
wang=123,role1

# 角色-权限
[roles]
role1=user:create,user:update
role2=user:create,user:delete
```

Test.java

```java
@Test
public void Test3() {
    Subject subject = login("classpath:shiro-permission.ini", "zhang", "123");

    System.out.println(subject.isPermitted("user:create"));

    System.out.println(Arrays.toString(subject.isPermitted("user:create", "user:update")));

    System.out.println(subject.isPermittedAll("user:create", "user:update", "user:delete"));

    try {
        subject.checkPermission("user:select");
    } catch (AuthorizationException e) {
        System.out.println("该用户没有 user:select 权限");
    }
    
    try {
        subject.checkPermissions("user:delete","user:view");
    } catch (AuthorizationException e) {
        System.out.println("该用户没有 user:delete user:view 权限");
    }
}
```



### Permission

#### 字符串通配符权限

规则：

“资源标识符：操作：对象实例ID” 即对哪个资源的哪个实例可以进行什么操作。

其默认支持通配符权限字符串

- “:”表示资源/操作/实例的分割
- “,”表示操作的分割
- “*”表示任意资源/操作/实例。



##### 单个资源单个权限

java代码

```java
subject.checkPermissions("system:user:update");
```



##### 单个资源多个权限

ini配置文件

```ini
role41=system:user:update,system:user:delete
```

java代码

```java
subject.checkPermissions("system:user:update", "system:user:delete");
```



用户拥有资源“system:user”的“update”和“delete”权限。如上可以简写成：

ini配置文件（表示角色4拥有system:user资源的update和delete权限）  

```java
role42="system:user:update,delete"
```

java代码

```java
subject.checkPermissions("system:user:update,delete");
```

通过“system:user:update,delete”验证"system:user:update, system:user:delete"是没问题的，但是反过来是规则不成立。



##### 单个资源全部权限

ini配置文件

```ini
role51="system:user:create,update,delete,view"
```

java代码

```java
subject.checkPermissions("system:user:create,delete,update:view");
```



用户拥有资源“system:user” 的 “create”、“update”、“delete” 和 “view”所有权限。如上可以简写成：

ini配置文件（表示角色5拥有system:user的所有权限）

```ini
# 写法1
role52=system:user:*
# 写法2
role53=system:user
```

java代码

```java
subject.checkPermissions("system:user:*");
subject.checkPermissions("system:user");
```



##### 所有资源全部权限

ini配置文件

```ini
role61=*:view
```

java代码

```java
subject.checkPermissions("user:view");
```

用户拥有所有资源的“view”所有权限。假设判断的权限是 "system:user:view”，那么需要“role5=*:*:view”这样写才行。



##### 实例级别的权限

###### 单个实例单个权限

ini配置文件

```ini
# 对资源user的1实例拥有view权限
role71=user:view:1
```

java代码

```java
subject.checkPermissions("user:view:1");
```



###### 单个实例多个权限

ini配置文件

```ini
# 对资源user的1实例拥有update、delete权限。
role72="user:update,delete:1"
```

java代码

```java
subject.checkPermissions("user:delete,update:1");
subject.checkPermissions("user:update:1", "user:delete:1");
```



###### 单个实例所有权限

ini配置文件

```ini
# 对资源user的1实例拥有所有权限
role73=user:*:1
```

java代码

```java
subject.checkPermissions("user:update:1", "user:delete:1", "user:view:1");
```



###### 所有实例单个权限

ini配置文件

```ini
# 对资源user的1实例拥有所有权限
role74=user:auth:*
```

java代码

```java
subject.checkPermissions("user:auth:1", "user:auth:2");
```



###### 所有实例所有权限

ini配置文件

```ini
# 对资源user的1实例拥有所有权限
role75=user:*:*
```

java代码

```java
subject.checkPermissions("user:view:1", "user:auth:2");
```



##### Shiro对权限字符串缺失部分的处理

如“user:view”等价于“user:view:*”；而“organization”等价于“organization:*”或者“organization:*:*”。可以这么理解，这种方式实现了前缀匹配。

另外如“user:*”可以匹配如“user:delete”、“user:delete”可以匹配如“user:delete:1”、“user:*:1”可以匹配如 “user:view:1” 、“user”可以匹配“user:view”或“user:view:1”等。即*可以匹配所有，不加*可以进行前缀匹配；但是如“*:view”不能匹配“system:user:view”，需要使用“*:*:view”，即后缀匹配必须指定前缀（多个冒号就需要多个*来匹配）。



##### WildcardPermission

```java
// 如下两种方式是等价的
subject.checkPermission("menu:view:1");
subject.checkPermission(new WildcardPermission("menu:view:1"));
```



##### 性能问题

通配符匹配方式比字符串相等匹配来说是更复杂的，因此需要花费更长时间，但是一般系统的权限不会太多，且可以配合缓存来提供其性能，如果这样性能还达不到要求我们可以实现位操作算法实现性能更好的权限匹配。另外实例级别的权限验证如果数据量太大也不建议使用，可能造成查询权限及匹配变慢。可以考虑比如在sql查询时加上权限字符串之类的方式在查询时就完成了权限匹配。 



### 授权流程

![img](https://typora-oss.yixihan.chat//img/202212311637887.png)



流程如下：

1.  首先调用 Subject.isPermitted / hasRole 接口，其会委托给 SecurityManager ，而 SecurityManager 接着会委托给 Authorizer ；

2.  Authorizer 是真正的授权者，如果我们调用如 isPermitted(“user:view”) ，其首先会通过PermissionResolver 把字符串转换成相应的 Permission 实例；

3.  在进行授权之前，其会调用相应的 Realm 获取 Subject 相应的角色/权限用于匹配传入的角色/权限；

4.  Authorizer 会判断 Realm 的角色/权限是否和传入的匹配，如果有多个 Realm ，会委托给 ModularRealmAuthorizer 进行循环判断，如果匹配如 isPermitted / hasRole 会返回 true ，否则返回 false 表示授权失败。

 

ModularRealmAuthorizer 进行多 Realm 匹配流程：

1.  首先检查相应的 Realm 是否实现了实现了 Authorizer ；

2.  如果实现了 Authorizer ，那么接着调用其相应的 isPermitted / hasRole 接口进行匹配；

3. 如果有一个 Realm 匹配那么将返回 true ，否则返回 false 。

 

如果 Realm 进行授权的话，应该继承 AuthorizingRealm ，其流程是：

1.  如果调用 hasRole ，则直接获取 AuthorizationInfo.getRoles() 与传入的角色比较即可；

2.  首先如果调用如 isPermitted(“user:view”) ，首先通过 PermissionResolver 将权限字符串转换成相应的 Permission 实例，默认使用 WildcardPermissionResolver ，即转换为通配符的 WildcardPermission ；

3.  通过 AuthorizationInfo.getObjectPermissions() 得到 Permission 实例集合；通过 AuthorizationInfo. getStringPermissions() 得到字符串集合并通过 PermissionResolver 解析为 Permission 实例；然后获取用户的角色，并通过 RolePermissionResolver 解析角色对应的权限集合（默认没有实现，可以自己提供）；

4.  接着调用 Permission. implies(Permission p) 逐个与传入的权限比较，如果有匹配的则返回 true ，否则 false 。 



## 编码/加密

### 编码/解码

Shiro提供了base64和16进制字符串编码/解码的API支持，方便一些编码解码操作。Shiro内部的一些数据的存储/表示都使用了base64和16进制字符串。



> base64编码/解码

```java
@Test
public void Test1() {
    String str = "hello";
    String base64Encoded = Base64.encodeToString(str.getBytes());
    String str2 = Base64.decodeToString(base64Encoded);
    System.out.println("str => " + str);
    System.out.println("str2 => " + str2);
    System.out.println("base64Encoded => " + base64Encoded);
}
```

![image-20210908132354283](https://typora-oss.yixihan.chat//img/202212311637573.png)



> 16进制字符串编码/解码操作

```java
@Test
public void Test2() {
    String str = "hello";
    String base64Encoded = Hex.encodeToString(str.getBytes());
    String str2 = new String(Hex.decode(base64Encoded.getBytes()));
    System.out.println("str => " + str);
    System.out.println("str2 => " + str2);
    System.out.println("base64Encoded => " + base64Encoded);
}
```

![image-20210908132411751](https://typora-oss.yixihan.chat//img/202212311637717.png)



还有一个可能经常用到的类CodecSupport，提供了`toBytes(str, "utf-8") `/ `toString(bytes, "utf-8")`用于在byte数组/String之间转换。



### 散列算法

散列算法一般用于生成数据的摘要信息，是一种不可逆的算法，一般适合存储密码之类的数据，常见的散列算法如**MD5**、**SHA**等。一般进行散列时最好提供一个**salt（盐）**，比如加密密码“admin”，产生的散列值是“21232f297a57a5a743894a0e4a801fc3”，可以到一些md5解密网站很容易的通过散列值得到密码“admin”，即如果直接对密码进行散列相对来说破解更容易，此时我们可以加一些只有系统知道的干扰数据，如用户名和ID（即盐）；这样散列的对象是“**密码+用户名+ID**”，这样生成的散列值相对来说更难破解。



> MD5(一次散列)

```java
@Test
public void Test3(){
    String str = "hello";
    String salt = "123";
    String md5 = new Md5Hash(str, salt).toString();//还可以转换为 toBase64()/toHex()
    System.out.println("md5 => " + md5);
}
```

![image-20210908132803338](https://typora-oss.yixihan.chat//img/202212311637019.png)



> MD5(二次散列)

```java
@Test
public void Test4() {
    String str = "hello";
    String salt = "123";
    String md5 = new Md5Hash(str, salt,2).toString();//还可以转换为 toBase64()/toHex()
    System.out.println("md5 => " + md5);
}
```

![image-20210908132748449](https://typora-oss.yixihan.chat//img/202212311637958.png)



> SHA256算法

```java
@Test
public void Test5() {
    String str = "hello";
    String salt = "123";
    String sha1 = new Sha256Hash(str, salt).toString();
    System.out.println("sha1 => " + sha1);
}
```

![image-20210908132932458](https://typora-oss.yixihan.chat//img/202212311637110.png)



> 通用的散列

```java
@Test
public void Test6() {
    String str = "hello";
    String salt = "123";
    //内部使用MessageDigest
    String simpleHash = new SimpleHash("SHA-1", str, salt).toString();
    System.out.println("simpleHash => " + simpleHash);
}
```

![image-20210908133125218](https://typora-oss.yixihan.chat//img/202212311637995.png)

另外还有如SHA1、SHA512算法。



>  HashServe

```java
@Test
    public void Test7() {

        // 1. 创建一个 DefaultHashService ，默认使用 SHA-512 算法
        DefaultHashService hashService = new DefaultHashService(); //默认算法SHA-512

        // 2. 通过 hashAlgorithmName 属性修改算法   (更改不影响生成的值)
        hashService.setHashAlgorithmName("MD5");

        // 3. 通过privateSalt设置一个私盐，其在散列时自动与用户传入的公盐混合产生一个新盐
        hashService.setPrivateSalt(new SimpleByteSource("yixihan")); //私盐，默认无

        // 4. 通过 generatePublicSalt 属性在用户没有传入公盐的情况下是否生成公盐
        hashService.setGeneratePublicSalt(true);//是否生成公盐，默认false

        // 5. 设置 randomNumberGenerator 用于生成公盐
        hashService.setRandomNumberGenerator(new SecureRandomNumberGenerator());//用于生成公盐。默认就这个

        // 6. 设置 hashIterations 属性来修改默认加密迭代次数 (更改不影响生成的值)
        hashService.setHashIterations(2); //生成Hash值的迭代次数

        // 7. 构建一个 HashRequest ，传入算法、数据、公盐、迭代次数
        HashRequest request = new HashRequest.Builder()
                .setAlgorithmName("MD5").setSource(ByteSource.Util.bytes("hello"))
                .setSalt(ByteSource.Util.bytes("123")).setIterations(2).build();

        // 8. 加密
        String hex = hashService.computeHash(request).toHex();
        System.out.println("hex => " + hex);
    }
```

![image-20210908135145415](https://typora-oss.yixihan.chat//img/202212311637584.png)



> SecureRandomNumberGenerator 生成随机数

```java
@Test
public void Test8() {
    SecureRandomNumberGenerator randomNumberGenerator =
            new SecureRandomNumberGenerator();
    randomNumberGenerator.setSeed("123".getBytes());
    String hex = randomNumberGenerator.nextBytes().toHex();
    System.out.println("randomNumberGenerator => " + randomNumberGenerator.nextBytes());
    System.out.println("hex => " + hex);
}
```

![image-20210908135839927](https://typora-oss.yixihan.chat//img/202212311637234.png)



### 加密/解密

Shiro还提供对称式加密/解密算法的支持，如AES、Blowfish等,未查到是否支持非对称加密/解密算法



> ASE

```java
@Test
public void Test9() {
    AesCipherService aesCipherService = new AesCipherService();
    aesCipherService.setKeySize(128); //设置key长度
    //生成key
    Key key = aesCipherService.generateNewKey();
    String text = "hello";
    //加密
    String encryptText = aesCipherService.encrypt(text.getBytes(), key.getEncoded()).toHex();
    //解密
    String text2 = new String(aesCipherService.decrypt(Hex.decode(encryptText), key.getEncoded()).getBytes());

    System.out.println("text => " + text);
    System.out.println("encryptText => " + encryptText);
    System.out.println("text2 => " + text2);
}
```

![image-20210908140753762](https://typora-oss.yixihan.chat//img/202212311637414.png)









### PasswordService / CredentialsMatcher

Shiro提供了PasswordService及CredentialsMatcher用于提供加密密码及验证密码服务。



> PasswordService

```java
public interface PasswordService {
    // 输入明文密码得到密文密码  
    String encryptPassword(Object plaintextPassword) throws IllegalArgumentException;
    // 判断 submittedPlaintext 密码与保存的密码是否匹配
    boolean passwordsMatch(Object submittedPlaintext, String encrypted);
}
```



> CredentialsMatcher

```java
public interface CredentialsMatcher {

  	// 匹配用户输入的 token 的凭证（未加密）与系统提供的凭证（已加密）  
    boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info);

}
```

Shiro默认提供了PasswordService实现DefaultPasswordService；CredentialsMatcher实现PasswordMatcher及HashedCredentialsMatcher（更强大）。



#### DefaultPasswordService配合PasswordMatcher实现简单的密码加密与验证服务

shiro-passwordService.ini

```ini
[main]
# passwordService 使用 DefaultPasswordService ,如果有必要也可以自定义
passwordService=org.apache.shiro.authc.credential.DefaultPasswordService

# hashService 定义散列密码使用的 HashService ,默认使用 DefaultHashService（默认SHA-256算法）
hashService=org.apache.shiro.crypto.hash.DefaultHashService
passwordService.hashService=$hashService

# hashFormat 用于对散列出的值进行格式化,默认使用 Shiro1CryptFormat ,另外提供了 Base64Format 和 HexFormat ,对于有 salt 的密码请自定义实现 ParsableHashFormat 然后把 salt 格式化到散列值中
hashFormat=org.apache.shiro.crypto.hash.format.Shiro1CryptFormat
passwordService.hashFormat=$hashFormat

# hashFormatFactory 用于根据散列值得到散列的密码和 salt ;因为如果使用如 SHA 算法,那么会生成一个 salt ,此 salt 需要保存到散列后的值中以便之后与传入的密码比较时使用;默认使用 DefaultHashFormatFactory
hashFormatFactory=org.apache.shiro.crypto.hash.format.DefaultHashFormatFactory
passwordService.hashFormatFactory=$hashFormatFactory

# passwordMatcher 使用 PasswordMatcher ,其是一个 CredentialsMatcher 实现
passwordMatcher=org.apache.shiro.authc.credential.PasswordMatcher
passwordMatcher.passwordService=$passwordService


# 将 credentialsMatcher 赋值给 myRealm , myRealm 间接继承了 AuthenticatingRealm ,其在调用 getAuthenticationInfo 方法获取到 AuthenticationInfo 信息后,
# 会使用 credentialsMatcher 来验证凭据是否匹配,如果不匹配将抛出 IncorrectCredentialsException 异常
# myRealm 根据自己的位置修改
myRealm=com.yixihan.config.shiro.MyRealm01
myRealm.passwordService=$passwordService
myRealm.credentialsMatcher=$passwordMatcher
securityManager.realms=$myRealm
```

login.java

```java
public Subject login(String configFile, String username, String password) {

    // 1. 获取 SecurityManager 工厂,此处使用 ini 配置文件初始化 SecurityManager
    Factory<SecurityManager> factory = new IniSecurityManagerFactory(configFile);


    // 2. 得到 SecurityManager 实例 并绑定给 SecurityUtils
    SecurityManager securityManager = factory.getInstance();
    SecurityUtils.setSecurityManager(securityManager);

    // 3. 得到 Subject 及创建用户名/密码身份验证 Token（即用户身份/凭证）
    Subject subject = SecurityUtils.getSubject();
    UsernamePasswordToken token = new UsernamePasswordToken(username, password);

    try {
        subject.login(token);
    } catch (LockedAccountException e) {
        System.out.println("禁用的帐号!");
    } catch (DisabledAccountException e) {
        System.out.println("锁定的帐号!");
    } catch (UnknownAccountException e) {
        System.out.println("错误的帐号!");            // 无此账号
    } catch (ExcessiveAttemptsException e) {
        System.out.println("登录失败次数过多!");
    } catch (IncorrectCredentialsException e) {     // 密码错误
        System.out.println("错误的凭证!");
    } catch (ExpiredCredentialsException e) {
        System.out.println("过期的凭证!");
    }
    return subject;
}
```

Test1.java

```java
@Test
public void Test1() {
    Subject subject = login("classpath:shiro-passwordService.ini", "wang", "123");

    System.out.println(subject.getPrincipal());
}
```



#### HashedCredentialsMatcher 实现密码验证服务

Shiro提供了CredentialsMatcher的散列实现HashedCredentialsMatcher，和之前的PasswordMatcher不同的是，它只用于密码验证，且可以提供自己的盐，而不是随机生成盐，且生成密码散列值的算法需要自己写，因为能提供自己的盐。



> 生成密码散列值

GeneratePassword.java

```java
/*如果要写用户模块，需要在新增用户/重置密码时使用如上算法保存密码，将生成的密码及 salt2 存入数据库（因为我们的散列算法是：md5 ( md5 (密码 , username + salt2))）。*/
@Test
public void GeneratePassword() {
    String algorithmName = "md5";
    String username = "liu";
    String password = "123";
    String salt1 = username;
    String salt2 = new SecureRandomNumberGenerator().nextBytes().toHex();
    int hashIterations = 2;

    SimpleHash hash = new SimpleHash(algorithmName, password, salt1 + salt2, hashIterations);
    String encodedPassword = hash.toHex();
    System.out.println(salt2);
    System.out.println(encodedPassword);
}
```

MyRealm02.java

```java
public class MyRealm02 extends AuthorizingRealm {

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        return null;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {

        /*如果采用数据库的话,需要从数据库中获取 username salt2 password ,换而言之,数据库中必须要有这三个字段*/
        String username = "liu"; //用户名及salt1
        String salt2 = "0072273a5d87322163795118fdd7c45e";
        String password = "be320beca57748ab9632c4121ccac0db"; //加密后的密码
        SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(username, password, getName());
        info.setCredentialsSalt(ByteSource.Util.bytes(username+salt2)); //盐是用户名+随机数
        return info;
    }
}
```

shiro-jdbc-passwordservice.ini

```ini
[main]
myRealm=com.github.zhangkaitao.shiro.chapter5.hash.realm.MyRealm

passwordService=org.apache.shiro.authc.credential.DefaultPasswordService
hashService=org.apache.shiro.crypto.hash.DefaultHashService
passwordService.hashService=$hashService
hashFormat=org.apache.shiro.crypto.hash.format.Shiro1CryptFormat
passwordService.hashFormat=$hashFormat
hashFormatFactory=org.apache.shiro.crypto.hash.format.DefaultHashFormatFactory
passwordService.hashFormatFactory=$hashFormatFactory

passwordMatcher=org.apache.shiro.authc.credential.PasswordMatcher
passwordMatcher.passwordService=$passwordService

dataSource=com.alibaba.druid.pool.DruidDataSource
dataSource.driverClassName=com.mysql.jdbc.Driver
dataSource.url=jdbc:mysql://localhost:3306/shiro
dataSource.username=root
#dataSource.password=

jdbcRealm=org.apache.shiro.realm.jdbc.JdbcRealm
jdbcRealm.dataSource=$dataSource
jdbcRealm.permissionsLookupEnabled=true

jdbcRealm.credentialsMatcher=$passwordMatcher
securityManager.realms=$jdbcRealm
```



如果使用JdbcRealm，需要修改获取用户信息（包括盐）,而我们的盐是由username+password_salt组成，所以需要通过如下ini配置修改

shiro-jdbc-hashedCredentialsMatcher.ini

```ini
[main]
credentialsMatcher=org.apache.shiro.authc.credential.HashedCredentialsMatcher
credentialsMatcher.hashAlgorithmName=md5
credentialsMatcher.hashIterations=2
credentialsMatcher.storedCredentialsHexEncoded=true

dataSource=com.alibaba.druid.pool.DruidDataSource
dataSource.driverClassName=com.mysql.jdbc.Driver
dataSource.url=jdbc:mysql://localhost:3306/shiro
dataSource.username=root
#dataSource.password=

jdbcRealm=org.apache.shiro.realm.jdbc.JdbcRealm
jdbcRealm.dataSource=$dataSource
jdbcRealm.permissionsLookupEnabled=true
# saltStyle 表示使用密码+盐的机制，authenticationQuery 第一列是密码，第二列是盐
jdbcRealm.saltStyle=COLUMN
# 通过 authenticationQuery 指定密码及盐查询 SQL 
jdbcRealm.authenticationQuery=select password, concat(username,password_salt) from users where username = ?
jdbcRealm.credentialsMatcher=$credentialsMatcher
securityManager.realms=$jdbcRealm
```

Shiro默认使用了apache commons BeanUtils，默认是不进行Enum类型转型的，此时需要自己注册一个Enum转换器

```java
private class EnumConverter extends AbstractConverter {
        @Override
        protected String convertToString(final Object value) throws Throwable {
            return ((Enum) value).name();
        }
        @Override
        protected Object convertToType(final Class type, final Object value) throws Throwable {
            return Enum.valueOf(type, value.toString());
        }

        @Override
        protected Class getDefaultType() {
            return null;
        }
    }
```



## 拦截器

### 拦截器介绍

![img](https://typora-oss.yixihan.chat//img/202212311637890.png)

> NameableFilter

NameableFilter 给 Filter 起个名字，如果没有设置默认就是 FilterName ,如 authc ...

```java

public interface NamedFilterList extends List<Filter> {

    // 返回分配给此筛选器列表的配置唯一名称
    String getName();

    // 返回一个新的 FilterChain 实例，该实例将首先执行此列表的筛选器（按列表顺序），并以执行给定的 FilterChain 实例结束
    FilterChain proxy(FilterChain filterChain);
}
```



> OncePerRequestFilter

OncePerRequestFilter用于防止多次执行Filter的；也就是说一次请求只会走一次拦截器链；另外提供enabled属性，表示是否开启该拦截器实例，默认enabled=true表示开启，如果不想让某个拦截器工作，可以设置为false即可。

```java
public abstract class OncePerRequestFilter extends NameableFilter {

    // 私有内部日志实例
    private static final Logger log = LoggerFactory.getLogger(OncePerRequestFilter.class);

    // 附加到“已筛选”请求属性的筛选器名称的后缀。
    public static final String ALREADY_FILTERED_SUFFIX = ".FILTERED";

    // 是否开启该拦截器实例,默认开启
    private boolean enabled = true; 

    // 返回该拦截器是否已开启拦截器实例
    public boolean isEnabled() {
        return enabled;
    }

    // 设置是否开启拦截器实例
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
	
    ...
}
```



> ShiroFilter

ShiroFilter是整个Shiro的入口点，用于拦截需要安全控制的请求进行处理

```java
public class ShiroFilter extends AbstractShiroFilter {

    // 初始化拦截器
    @Override
    public void init() throws Exception {
        WebEnvironment env = WebUtils.getRequiredWebEnvironment(getServletContext());

        setSecurityManager(env.getWebSecurityManager());

        FilterChainResolver resolver = env.getFilterChainResolver();
        if (resolver != null) {
            setFilterChainResolver(resolver);
        }
    }
}
```



> AdviceFilter

AdviceFilter提供了AOP风格的支持，类似于SpringMVC中的Interceptor

```java
public abstract class AdviceFilter extends OncePerRequestFilter {

    // 静态记录器仅适用于此类
    private static final Logger log = LoggerFactory.getLogger(AdviceFilter.class);

    // 类似于AOP中的前置增强；在拦截器链执行之前执行；如果返回true则继续拦截器链；否则中断后续的拦截器链的执行直接返回；进行预处理（如基于表单的身份验证、授权）
    protected boolean preHandle(ServletRequest request, ServletResponse response) throws Exception {
        return true;
    }

    // 类似于AOP中的后置返回增强；在拦截器链执行完成后执行；进行后处理（如记录执行时间之类的）
    @SuppressWarnings({"UnusedDeclaration"})
    protected void postHandle(ServletRequest request, ServletResponse response) throws Exception {
    }

    // 类似于AOP中的后置最终增强；即不管有没有异常都会执行；可以进行清理资源（如接触Subject与线程的绑定之类的）
    @SuppressWarnings({"UnusedDeclaration"})
    public void afterCompletion(ServletRequest request, ServletResponse response, Exception exception) throws Exception {
    }

    ...
}
```



> PathMatchingFilter

PathMatchingFilter提供了基于Ant风格的请求路径匹配功能及拦截器参数解析的功能，如“roles[admin,user]”自动根据“，”分割解析到一个路径参数配置并绑定到相应的路径：

```java
public abstract class AccessControlFilter extends PathMatchingFilter {

    // 简单的默认登录 URL , 通过调用 setLoginUrl 方法更改登录 URL
    public static final String DEFAULT_LOGIN_URL = "/login.jsp";

    // GET 方法访问
    public static final String GET_METHOD = "GET";

    // POST 方法访问
    public static final String POST_METHOD = "POST";

    // 用于验证用户的登录 URL ，在需要验证时重定向用户时使用
    private String loginUrl = DEFAULT_LOGIN_URL;

    /// 返回登录界面的 URL
    public String getLoginUrl() {
        return loginUrl;
    }

    // 设置登录界面的 URL
    public void setLoginUrl(String loginUrl) {
        this.loginUrl = loginUrl;
    }

    // 获取 Subject 对象
    protected Subject getSubject(ServletRequest request, ServletResponse response) {
        return SecurityUtils.getSubject();
    }

    // 表示是否允许访问 mappedValue 就是 [urls] 配置中拦截器参数部分，如果允许访问返回 true ，否则 false 
    protected abstract boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception;

    // 表示当访问拒绝时是否已经处理了 如果返回 true 表示需要继续处理 如果返回 false 表示该拦截器实例已经处理了，将直接返回即可。
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception {
        return onAccessDenied(request, response);
    }
    
    protected abstract boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception;

    // onPreHandle 会自动调用这两个方法决定是否继续处理
    public boolean onPreHandle(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception {
        return isAccessAllowed(request, response, mappedValue) || onAccessDenied(request, response, mappedValue);
    }

    // 当前请求是否是登录请求  
    protected boolean isLoginRequest(ServletRequest request, ServletResponse response) {
        return pathsMatch(getLoginUrl(), request);
    }

    // 将当前请求保存起来并重定向到登录页面  
    protected void saveRequestAndRedirectToLogin(ServletRequest request, ServletResponse response) throws IOException {
        saveRequest(request);
        redirectToLogin(request, response);
    }

    // 将请求保存起来，如登录成功后再重定向回该请求 
    protected void saveRequest(ServletRequest request) {
        WebUtils.saveRequest(request);
    }

    // 重定向到登录页面
    protected void redirectToLogin(ServletRequest request, ServletResponse response) throws IOException {
        String loginUrl = getLoginUrl();
        WebUtils.issueRedirect(request, response, loginUrl);
    }

}
```

到此基本的拦截器就完事了，如果我们想进行访问访问的控制就可以继承AccessControlFilter；如果我们要添加一些通用数据我们可以直接继承PathMatchingFilter。



### 拦截器链

Shiro对Servlet容器的FilterChain进行了代理，即ShiroFilter在继续Servlet容器的Filter链的执行之前，通过ProxiedFilterChain对Servlet容器的FilterChain进行了代理；即先走Shiro自己的Filter体系，然后才会委托给Servlet容器的FilterChain进行Servlet容器级别的Filter链执行

Shiro的ProxiedFilterChain执行流程：

1.  先执行Shiro自己的Filter链
2.  再执行Servlet容器的Filter链（即原始的Filter）。

ProxiedFilterChain是通过FilterChainResolver根据配置文件中[urls]部分是否与请求的URL是否匹配解析得到的。 

```java
FilterChain getChain(ServletRequest request, ServletResponse response, FilterChain originalChain);
```

Shiro内部提供了一个路径匹配的FilterChainResolver实现：PathMatchingFilterChainResolver，其根据[urls]中配置的url模式（默认Ant风格）=拦截器链和请求的url是否匹配来解析得到配置的拦截器链的；而PathMatchingFilterChainResolver内部通过FilterChainManager维护着拦截器链，比如DefaultFilterChainManager实现维护着url模式与拦截器链的关系。因此我们可以通过FilterChainManager进行动态动态增加url模式与拦截器链的关系。



DefaultFilterChainManager会默认添加org.apache.shiro.web.filter.mgt.DefaultFilter中声明的拦截器：

```java
public enum DefaultFilter {

    anon(AnonymousFilter.class),
    authc(FormAuthenticationFilter.class),
    authcBasic(BasicHttpAuthenticationFilter.class),
    authcBearer(BearerHttpAuthenticationFilter.class),
    logout(LogoutFilter.class),
    noSessionCreation(NoSessionCreationFilter.class),
    perms(PermissionsAuthorizationFilter.class),
    port(PortFilter.class),
    rest(HttpMethodPermissionFilter.class),
    roles(RolesAuthorizationFilter.class),
    ssl(SslFilter.class),
    user(UserFilter.class),
    invalidRequest(InvalidRequestFilter.class);

    private final Class<? extends Filter> filterClass;

    private DefaultFilter(Class<? extends Filter> filterClass) {
        this.filterClass = filterClass;
    }

    public Filter newInstance() {
        return (Filter) ClassUtils.newInstance(this.filterClass);
    }

    public Class<? extends Filter> getFilterClass() {
        return this.filterClass;
    }

    public static Map<String, Filter> createInstanceMap(FilterConfig config) {
        Map<String, Filter> filters = new LinkedHashMap<String, Filter>(values().length);
        for (DefaultFilter defaultFilter : values()) {
            Filter filter = defaultFilter.newInstance();
            if (config != null) {
                try {
                    filter.init(config);
                } catch (ServletException e) {
                    String msg = "Unable to correctly init default filter instance of type " +
                            filter.getClass().getName();
                    throw new IllegalStateException(msg, e);
                }
            }
            filters.put(defaultFilter.name(), filter);
        }
        return filters;
    }
}
```



如果要注册自定义拦截器，IniSecurityManagerFactory/WebIniSecurityManagerFactory在启动时会自动扫描ini配置文件中的[filters]/[main]部分并注册这些拦截器到DefaultFilterChainManager；且创建相应的url模式与其拦截器关系链。如果使用Spring后续章节会介绍如果注册自定义拦截器。



如果想自定义FilterChainResolver，可以通过实现WebEnvironment接口完成：

```java
public class MyIniWebEnvironment extends IniWebEnvironment {  
    @Override  
    protected FilterChainResolver createFilterChainResolver() {  
        //在此处扩展自己的FilterChainResolver  
        return super.createFilterChainResolver();  
    }  
}   
```



如果想动态实现url-拦截器的注册，就可以通过实现此处的FilterChainResolver来完成，比如：

```java
// 1、创建 FilterChainResolver  
PathMatchingFilterChainResolver filterChainResolver =  
        new PathMatchingFilterChainResolver();  
// 2、创建 FilterChainManager  
DefaultFilterChainManager filterChainManager = new DefaultFilterChainManager();  
// 3、注册 Filter  
for(DefaultFilter filter : DefaultFilter.values()) {  
    filterChainManager.addFilter(  
        filter.name(), (Filter) ClassUtils.newInstance(filter.getFilterClass()));  
}  
// 4、注册 URL-Filter 的映射关系  
filterChainManager.addToChain("/login.jsp", "authc");  
filterChainManager.addToChain("/unauthorized.jsp", "anon");  
filterChainManager.addToChain("/**", "authc");  
filterChainManager.addToChain("/**", "roles", "admin");  
  
// 5、 设置 Filter 的属性  
FormAuthenticationFilter authcFilter =  
         (FormAuthenticationFilter)filterChainManager.getFilter("authc");  
authcFilter.setLoginUrl("/login.jsp");  
RolesAuthorizationFilter rolesFilter =  
          (RolesAuthorizationFilter)filterChainManager.getFilter("roles");  
rolesFilter.setUnauthorizedUrl("/unauthorized.jsp");  
  
filterChainResolver.setFilterChainManager(filterChainManager);  
return filterChainResolver;   
```

此处自己去实现注册filter，及url模式与filter之间的映射关系。可以通过定制FilterChainResolver或FilterChainManager来完成诸如动态URL匹配的实现。



### 自定义拦截器

通过自定义自己的拦截器可以扩展一些功能，诸如动态url-角色/权限访问控制的实现、根据Subject身份信息获取用户信息绑定到Request（即设置通用数据）、验证码验证、在线用户信息的保存等等，因为其本质就是一个Filter；所以Filter能做的它就能做。

#### 扩展OncePerRequestFilter

OncePerRequestFilter保证一次请求只调用一次doFilterInternal，即如内部的forward不会再多执行一次doFilterInternal： 

```java
public class MyOncePerRequestFilter extends OncePerRequestFilter {  
    @Override  
    protected void doFilterInternal(ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException, IOException {  
        System.out.println("=========once per request filter");  
        chain.doFilter(request, response);  
    }  
}   
```

ini配置文件

```ini
[main]  
myFilter1=com.github.zhangkaitao.shiro.chapter8.web.filter.MyOncePerRequestFilter  
#[filters]  
#myFilter1=com.github.zhangkaitao.shiro.chapter8.web.filter.MyOncePerRequestFilter  
[urls]  
/**=myFilter1   
```





#### 扩展AdviceFilter

AdviceFilter提供了AOP的功能，其实现和SpringMVC中的Interceptor思想一样

```java
public class MyAdviceFilter extends AdviceFilter {  
    
    // 进行请求的预处理，然后根据返回值决定是否继续处理（true：继续过滤器链) 可以通过它实现权限控制
    @Override  
    protected boolean preHandle(ServletRequest request, ServletResponse response) throws Exception {  
        System.out.println("====预处理/前置处理");  
        return true;//返回false将中断后续拦截器链的执行  
    }  
    
    // 执行完拦截器链之后正常返回后执行
    @Override  
    protected void postHandle(ServletRequest request, ServletResponse response) throws Exception {  
        System.out.println("====后处理/后置返回处理");  
    }  
    
    // 不管最后有没有异常， afterCompletion 都会执行，完成如清理资源功能
    @Override  
    public void afterCompletion(ServletRequest request, ServletResponse response, Exception exception) throws Exception {  
        System.out.println("====完成处理/后置最终处理");  
    }  
}   
```

ini配置文件

```ini
[filters]  
myFilter1=com.github.zhangkaitao.shiro.chapter8.web.filter.MyOncePerRequestFilter  
myFilter2=com.github.zhangkaitao.shiro.chapter8.web.filter.MyAdviceFilter  
[urls]  
/**=myFilter1,myFilter2  
```



#### PathMatchingFilter

PathMatchingFilter继承了AdviceFilter，提供了url模式过滤的功能，如果需要对指定的请求进行处理，可以扩展PathMatchingFilter： 

```java
public class MyPathMatchingFilter extends PathMatchingFilter {  
    // 如果 url 模式与请求 url 匹配，那么会执行 onPreHandle ，并把该拦截器配置的参数传入。默认什么不处理直接返回 true
    @Override  
    protected boolean onPreHandle(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception {  
       System.out.println("url matches,config is " + Arrays.toString((String[])mappedValue));  
       return true;  
    }  
    
    // 会进行 url 模式与请求 url 进行匹配，如果匹配会调用 onPreHandle ；如果没有配置 url 模式/没有 url 模式匹配，默认直接返回 true
    @Override 
    protected boolean preHandle(ServletRequest request, ServletResponse response) throws Exception {
       System.out.println("url matches,config is " + Arrays.toString((String[])mappedValue));  
       return true; 
    }
}   
```

ini配置文件

```ini
[filters]  
myFilter3=com.github.zhangkaitao.shiro.chapter8.web.filter.MyPathMatchingFilter  
[urls]  
/**= myFilter3[config]  
```



#### 扩展AccessControlFilter

AccessControlFilter继承了PathMatchingFilter，并扩展了了两个方法：

```java
/* 
isAccessAllowed ：即是否允许访问，返回 true 表示允许；
onAccessDenied ：表示访问拒绝时是否自己处理，如果返回 true 表示自己不处理且继续拦截器链执行，返回 false 表示自己已经处理了（比如重定向到另一个页面）。 
*/
public boolean onPreHandle(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception {  
    return isAccessAllowed(request, response, mappedValue)  
     || onAccessDenied(request, response, mappedValue);  
}   
```

ini配置文件

```ini
[filters]  
myFilter4=com.github.zhangkaitao.shiro.chapter8.web.filter.MyAccessControlFilter  
[urls]  
/**=myFilter4  
```



#### 基于表单登录拦截器

基于表单登录的拦截器

```java
public class FormLoginFilter extends PathMatchingFilter {  
    private String loginUrl = "/login.jsp";  
    private String successUrl = "/";  
    @Override  
    protected boolean onPreHandle(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception {  
        if(SecurityUtils.getSubject().isAuthenticated()) {  
            return true;//已经登录过  
        }  
        HttpServletRequest req = (HttpServletRequest) request;  
        HttpServletResponse resp = (HttpServletResponse) response;  
        if(isLoginRequest(req)) {  
            if("post".equalsIgnoreCase(req.getMethod())) {//form表单提交  
                boolean loginSuccess = login(req); //登录  
                if(loginSuccess) {  
                    return redirectToSuccessUrl(req, resp);  
                }  
            }  
            return true;//继续过滤器链  
        } else {//保存当前地址并重定向到登录界面  
            saveRequestAndRedirectToLogin(req, resp);  
            return false;  
        }  
    }  
    private boolean redirectToSuccessUrl(HttpServletRequest req, HttpServletResponse resp) throws IOException {  
        WebUtils.redirectToSavedRequest(req, resp, successUrl);  
        return false;  
    }  
    private void saveRequestAndRedirectToLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {  
        WebUtils.saveRequest(req);  
        WebUtils.issueRedirect(req, resp, loginUrl);  
    }  
  
    private boolean login(HttpServletRequest req) {  
        String username = req.getParameter("username");  
        String password = req.getParameter("password");  
        try {  
            SecurityUtils.getSubject().login(new UsernamePasswordToken(username, password));  
        } catch (Exception e) {  
            req.setAttribute("shiroLoginFailure", e.getClass());  
            return false;  
        }  
        return true;  
    }  
    private boolean isLoginRequest(HttpServletRequest req) {  
        return pathsMatch(loginUrl, WebUtils.getPathWithinApplication(req));  
    }  
}
```

onPreHandle主要流程：

1.  首先判断是否已经登录过了，如果已经登录过了继续拦截器链即可；

2.  如果没有登录，看看是否是登录请求，如果是get方法的登录页面请求，则继续拦截器链（到请求页面），否则如果是get方法的其他页面请求则保存当前请求并重定向到登录页面；

3.  如果是post方法的登录页面表单提交请求，则收集用户名/密码登录即可，如果失败了保存错误消息到“shiroLoginFailure”并返回到登录页面；

4.  如果登录成功了，且之前有保存的请求，则重定向到之前的这个请求，否则到默认的成功页面。

ini配置文件

```ini
[filters]  
formLogin=com.github.zhangkaitao.shiro.chapter8.web.filter.FormLoginFilter  
[urls]  
/test.jsp=formLogin  
/login.jsp=formLogin 
```



#### 任意角色授权拦截器

Shiro提供roles拦截器，其验证用户拥有所有角色，没有提供验证用户拥有任意角色的拦截器

```java
public class AnyRolesFilter extends AccessControlFilter {  
    private String unauthorizedUrl = "/unauthorized.jsp";  
    private String loginUrl = "/login.jsp";  
    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception {  
        String[] roles = (String[])mappedValue;  
        if(roles == null) {  
            return true;//如果没有设置角色参数，默认成功  
        }  
        for(String role : roles) {  
            if(getSubject(request, response).hasRole(role)) {  
                return true;  
            }  
        }  
        return false;//跳到onAccessDenied处理  
    }  
  
    @Override  
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {  
        Subject subject = getSubject(request, response);  
        if (subject.getPrincipal() == null) {//表示没有登录，重定向到登录页面  
            saveRequest(request);  
            WebUtils.issueRedirect(request, response, loginUrl);  
        } else {  
            if (StringUtils.hasText(unauthorizedUrl)) {//如果有未授权页面跳转过去  
                WebUtils.issueRedirect(request, response, unauthorizedUrl);  
            } else {//否则返回401未授权状态码  
                WebUtils.toHttp(response).sendError(HttpServletResponse.SC_UNAUTHORIZED);  
            }  
        }  
        return false;  
    }  
}   
```

流程：

1.  首先判断用户有没有任意角色，如果没有返回false，将到onAccessDenied进行处理；

2.  如果用户没有角色，接着判断用户有没有登录，如果没有登录先重定向到登录；

3.  如果用户没有角色且设置了未授权页面（unauthorizedUrl），那么重定向到未授权页面；否则直接返回401未授权错误码。

ini配置

```ini
[filters]  
anyRoles=com.github.zhangkaitao.shiro.chapter8.web.filter.AnyRolesFilter  
[urls]  
/test.jsp=formLogin,anyRoles[admin,user]  
/login.jsp=formLogin 
```

此处可以继承AuthorizationFilter实现，其提供了授权相关的基础代码。另外可以参考Shiro内嵌的RolesAuthorizationFilter的源码，只是实现hasAllRoles逻辑。



#### 默认拦截器

Shiro内置了很多默认的拦截器，比如身份验证、授权等相关的。默认拦截器可以参考org.apache.shiro.web.filter.mgt.DefaultFilter中的枚举拦截器：



##### 身份验证相关的

> authc

基于表单的拦截器；如“/**=authc”，如果没有登录会跳到相应的登录页面登录；主要属性：usernameParam：表单提交的用户名参数名（ username）；  passwordParam：表单提交的密码参数名（password）； rememberMeParam：表单提交的密码参数名（rememberMe）； loginUrl：登录页面地址（/login.jsp）；successUrl：登录成功后的默认重定向地址； failureKeyAttribute：登录失败后错误信息存储key（shiroLoginFailure）；



> authcBasic

Basic HTTP身份验证拦截器，主要属性： applicationName：弹出登录框显示的信息（application）；



> logout

退出拦截器，主要属性：redirectUrl：退出成功后重定向的地址（/）; 示例 “/logout=logout”



> user

用户拦截器，用户已经身份验证 / 记住我登录的都可；示例 “/**=user”



> anon

匿名拦截器，即不需要登录即可访问；一般用于静态资源过滤；示例 “/static/**=anon”



##### 授权相关的

> roles

角色授权拦截器，验证用户是否拥有所有角色；主要属性： loginUrl：登录页面地址（/login.jsp）；unauthorizedUrl：未授权后重定向的地址；示例 “/admin/**=roles[admin]”



> perms

权限授权拦截器，验证用户是否拥有所有权限；属性和 roles 一样；示例 “/user/**=perms["user:create"]”



> port

端口拦截器，主要属性：port（80）：可以通过的端口；示例 “/test= port[80]”，如果用户访问该页面是非 80，将自动将请求端口改为 80 并重定向到该 80 端口，其他路径 / 参数等都一样



> rest

rest 风格拦截器，自动根据请求方法构建权限字符串（GET=read, POST=create,PUT=update,DELETE=delete,HEAD=read,TRACE=read,OPTIONS=read, MKCOL=create）构建权限字符串；示例 “/users=rest[user]”，会自动拼出“user:read,user:create,user:update,user:delete” 权限字符串进行权限匹配（所有都得匹配，isPermittedAll）；



> ssl

SSL 拦截器，只有请求协议是 https 才能通过；否则自动跳转会 https 端口（443）；其他和 port 拦截器一样；



##### 其他

> noSessionCreation

不创建会话拦截器，调用 subject.getSession(false) 不会有什么问题，但是如果 subject.getSession(true) 将抛出 DisabledSessionException 异常；



这些默认的拦截器会自动注册，可以直接在 ini 配置文件中通过 “拦截器名. 属性” 设置其属性：

```ini
perms.unauthorizedUrl=/unauthorized
```

另外如果某个拦截器不想使用了可以直接通过如下配置直接禁用：

```ini
perms.enabled=false
```



## 记住我功能

Shiro提供了记住我（RememberMe）的功能，比如访问如淘宝等一些网站时，关闭了浏览器下次再打开时还是能记住你是谁，下次访问时无需再登录即可访问，基本流程如下：

1.  首先在登录页面选中RememberMe然后登录成功；如果是浏览器登录，一般会把RememberMe的Cookie写到客户端并保存下来
2.  关闭浏览器再重新打开；会发现浏览器还是记住你的；
3.  访问一般的网页服务器端还是知道你是谁，且能正常访问；
4.  但是比如我们访问淘宝时，如果要查看我的订单或进行支付时，此时还是需要再进行身份认证的，以确保当前用户还是你。



### RememberMe配置

spring-shiro-web.xml

```xml
<!-- 会话Cookie模板 -->  
<!-- maxAge = -1 表示浏览器关闭时失效此 Cookie -->
<bean id="sessionIdCookie" class="org.apache.shiro.web.servlet.SimpleCookie">  
    <constructor-arg value="sid"/>  
    <property name="httpOnly" value="true"/>  
    <property name="maxAge" value="-1"/>  
</bean>  
<!-- 即记住我的 Cookie，保存时长30天 -->
<bean id="rememberMeCookie" class="org.apache.shiro.web.servlet.SimpleCookie">  
    <constructor-arg value="rememberMe"/>  
    <property name="httpOnly" value="true"/>  
    <property name="maxAge" value="2592000"/><!-- 30天 -->  
</bean>   
```



rememberMe管理器，cipherKey是加密rememberMe Cookie的密钥 默认AES算法

```xml
<!-- rememberMe管理器 -->  
<bean id="rememberMeManager"   
class="org.apache.shiro.web.mgt.CookieRememberMeManager">  
    <property name="cipherKey" value="  
#{T(org.apache.shiro.codec.Base64).decode('4AvVhmFLUs0KTA3Kprsdag==')}"/>  
     <property name="cookie" ref="rememberMeCookie"/>  
</bean>   
```



设置securityManager安全管理器的rememberMeManager

```xml
<!-- 安全管理器 -->  
<bean id="securityManager" class="org.apache.shiro.web.mgt.DefaultWebSecurityManager">  
……  
    <property name="rememberMeManager" ref="rememberMeManager"/>  
</bean>   
```



rememberMeParam，即rememberMe请求参数名，请求参数是boolean类型，true表示rememberMe

```xml
<bean id="formAuthenticationFilter"   
class="org.apache.shiro.web.filter.authc.FormAuthenticationFilter">  
    ……  
    <property name="rememberMeParam" value="rememberMe"/>  
</bean>   
```



“/authenticated.jsp = authc”表示访问该地址用户必须身份验证通过（Subject. isAuthenticated()==true）；而“/** = user”表示访问该地址的用户是身份验证通过或RememberMe登录的都可以。

```xml
<bean id="shiroFilter" class="org.apache.shiro.spring.web.ShiroFilterFactoryBean">  
    ……  
    <property name="filterChainDefinitions">  
        <value>  
            /login.jsp = authc  
            /logout = logout  
            /authenticated.jsp = authc  
            /** = user  
        </value>  
    </property>  
</bean>  
```



### 自定义RememberMe

如果要自己做RememeberMe，需要在登录之前这样创建Token：UsernamePasswordToken(用户名，密码，是否记住我)，如：

```java
Subject subject = SecurityUtils.getSubject();  
UsernamePasswordToken token = new UsernamePasswordToken(username, password);  
token.setRememberMe(true);  
subject.login(token);   
```



subject.isAuthenticated() : 表示用户进行了身份验证登录的，即使有Subject.login进行了登录

subject.isRemembered() : 表示用户是通过记住我登录的，此时可能并不是真正的你（如你的朋友使用你的电脑，或者你的cookie被窃取）在访问的

且两者二选一，即subject.isAuthenticated()==true，则subject.isRemembered()==false  反之一样。



另外对于过滤器，一般这样使用：

**访问一般网页**，如个人在主页之类的，我们使用user拦截器即可，user拦截器只要用户登录(isRemembered()==true or isAuthenticated()==true)过即可访问成功；

**访问特殊网页**，如我的订单，提交订单页面，我们使用authc拦截器即可，authc拦截器会判断用户是否是通过Subject.login（isAuthenticated()==true）登录的，如果是才放行，否则会跳转到登录页面叫你重新登录。



## 源码分析



> Realm类

![image-20210914214412617](https://typora-oss.yixihan.chat//img/202212311637453.png)

### 认证:

- 最终执行用户名比较的方法是 SimpleAccountRealm 类中的 doGetAuthenticationInfo 方法

```java
protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        UsernamePasswordToken upToken = (UsernamePasswordToken) token;
        SimpleAccount account = getUser(upToken.getUsername());

        if (account != null) {

            if (account.isLocked()) {
                throw new LockedAccountException("Account [" + account + "] is locked.");
            }
            if (account.isCredentialsExpired()) {
                String msg = "The credentials for account [" + account + "] are expired";
                throw new ExpiredCredentialsException(msg);
            }

        }

        return account;
    }
```



- 最终密码的校验是在 AuthenticatingRealm 类中的 assertCredentialsMatch 方法

```java
    protected void assertCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) throws AuthenticationException {
        CredentialsMatcher cm = getCredentialsMatcher();
        if (cm != null) {
            if (!cm.doCredentialsMatch(token, info)) {
                //not successful - throw an exception to indicate this:
                String msg = "Submitted credentials for token [" + token + "] did not match the expected credentials.";
                throw new IncorrectCredentialsException(msg);
            }
        } else {
            throw new AuthenticationException("A CredentialsMatcher must be configured in order to verify " +
                    "credentials during authentication.  If you do not wish for credentials to be examined, you " +
                    "can configure an " + AllowAllCredentialsMatcher.class.getName() + " instance.");
        }
    }
```



**总结 : **

-  AuthenticatingRealm   **认证 Realm** doGetAuthenticationInfo 
-  AuthorizingRealm        **授权 Realm**  doGetAuthorizationInfo





# JWT

## JWT简介

JSON Web Token (JWT)是一个开放标准(RFC 7519)，它定义了一种紧凑的、自包含的方式，用于作为JSON对象在各方之间安全地传输信息。该信息可以被验证和信任，因为它是数字签名的。



## 使用JWT的场景

下列场景中使用JSON Web Token是很有用的：

- Authorization (授权) : 这是使用JWT的最常见场景。一旦用户登录，后续每个请求都将包含JWT，允许用户访问该令牌允许的路由、服务和资源。单点登录是现在广泛使用的JWT的一个特性，因为它的开销很小，并且可以轻松地跨域使用。
- Information Exchange (信息交换) : 对于安全的在各方之间传输信息而言，JSON Web Tokens无疑是一种很好的方式。因为JWT可以被签名，例如，用公钥/私钥对，你可以确定发送人就是它们所说的那个人。另外，由于签名是使用头和有效负载计算的，您还可以验证内容没有被篡改。



## JWT结构

JSON Web Token由三部分组成，它们之间用圆点(.)连接。这三部分分别是：

- Header (标题)
- Payload (有效载荷)
- Signature (签名)



因此，JWT 通常如下所示 :

`xxxxx.yyyyy.zzzzz`



### Header (标题)

Header 由两部分组成：**令牌的类型 (JWT)**，以及正在使用的**签名算法** (HMAC SHA256 、RSA ...)。



例如 :

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```



然后，这个 JSON 被 **Base64Url** 编码以形成 JWT 的第一部分



### Payload (有效载荷)

令牌的第二部分是负载，其中包含声明。 声明是关于实体（通常是用户）和附加数据的声明。

共有三种类型的声明：

- *注册声明*

- *公共*声明

- *私人*声明。



> 注册声明

这些是一组预定义的声明,这些声明不是强制性的,但是推荐使用

其中一些是 

- **iss** (issuer)
- **exp** (expiration time)
- **sub** (subject)
- **aud** (audience)
- ...



**请注意，声明名称只有三个字符，因为 JWT 是紧凑的**



> *公共*声明

可以随意定义,但是为了避免冲突,应在在 [IANA JSON Web Token Registry](https://www.iana.org/assignments/jwt/jwt.xhtml) 中定义或定义为包含抗冲突命名空间的 URI



> *私人*声明

这些都是使用它们同意并既不是当事人之间建立共享信息的自定义声明 *注册* 或 *公众*  的权利要求。



例子 :

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```



然后对有效负载进行 **Base64Url** 编码以形成 JSON Web 令牌的第二部分。



**请注意，对于已签名的令牌，此信息虽然受到防篡改保护，但任何人都可以读取。除非加密，否则不要将机密信息放在 JWT 的负载或标头元素中。**



### Signature (签名)

要创建签名部分，您必须获取编码的标头、编码的有效载荷、秘密、标头中指定的算法，并对其进行签名。



例子 : 如果要使用 HMAC SHA256 算法，则签名将通过以下方式创建

```json
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```



签名用于验证消息在此过程中没有更改，并且在使用私钥签名的令牌的情况下，它还可以验证 JWT 的发送者是它所说的那个人。



### 结合

输出是三个由点分隔的 Base64-URL 字符串，可以在 HTML 和 HTTP 环境中轻松传递，同时与基于 XML 的标准（如 SAML）相比更加紧凑。



例子 : 

![image-20210914145946574](https://typora-oss.yixihan.chat//img/202212311638009.png)



可以使用 [jwt.io Debugger](https://jwt.io/#debugger-io) 来解码、验证和生成 JWT



## JSON 网络令牌如何工作？

在身份验证中，当用户使用其凭据成功登录时，将返回 JSON Web Token。由于令牌是凭证，因此必须非常小心以防止出现安全问题。通常，您不应将令牌保留的时间超过所需的时间。



[由于缺乏安全性，](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage)您也不[应该在浏览器存储中存储敏感的会话数据](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage)。



每当用户想要访问受保护的路由或资源时，用户代理应该发送 JWT，通常在使用**Bearer**模式的**Authorization**标头中。标题的内容应如下所示 ：

```json
Authorization: Bearer <token>
```



在某些情况下，这可以是无状态授权机制。服务器的受保护路由将检查 `Authorization` 标头中的有效 JWT ，如果存在，则用户将被允许访问受保护的资源。如果 JWT 包含必要的数据，则可能会减少为某些操作查询数据库的需要，尽管情况并非总是如此。

如果令牌在 `Authorization` 标头中发送，跨源资源共享 (CORS) 不会成为问题，因为它不使用 cookie。

下图显示了如何获取 JWT 并将其用于访问 API 或资源：

![](https://typora-oss.yixihan.chat//img/202212311638454.png)

1.  应用程序或客户端向授权服务器请求授权。这是通过不同的授权流程之一执行的。例如，典型的 [OpenID Connect](http://openid.net/connect/) 兼容 Web 应用程序将 `/oauth/authorize` 使用 [授权代码流](http://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth) 通过端点。
2.  当授权被授予时，授权服务器向应用程序返回一个访问令牌。
3.  应用程序使用访问令牌来访问受保护的资源（如 API）。



**请注意，使用签名令牌，令牌中包含的所有信息都会暴露给用户或其他方，即使他们无法更改它。这意味着您不应将秘密信息放入令牌中。**

