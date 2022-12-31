---
title: Mybatis-Plus
date: 2022-12-31
sidebar: 'auto'
categories:
- Java
tags:
- Java
- Mybatis
---

# Mybatis-Plus



## 快速入门



maven依赖

```xml
<!-- https://mvnrepository.com/artifact/com.baomidou/mybatis-plus-boot-starter -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.0.5</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

注意点:尽量不要同时导入mybatis和mybatis-plus依赖 



### 配置:

```yaml
# DataSource Config
spring:
  datasource:
    username: root
    password: Theyear123
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/mybatis_plus?useSSL=false&useUnicode=true&aharacterEncoding=utf-8&serverTimezone=UTC
```



User.java

```java
package com.yixihan.mybatis_plus01hello.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Long id;
    private String name;
    private Integer age;
    private String email;
}
```



UserMapper.java

```java
package com.yixihan.mybatis_plus01hello.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yixihan.mybatis_plus01hello.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

//在对应的 mapper 上面集成基本的类 BaseMapper
@Mapper
@Repository
public interface UserMapper extends BaseMapper<User> {
    //所有的CRUD都已经编写完成了
    //不需要向以前那样的配置一大堆文件了
}
```



Application.java

```java
package com.yixihan.mybatis_plus01hello;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.yixihan.mybatis_plus01hello")
public class MybatisPlus01HelloApplication {

    public static void main(String[] args) {
        SpringApplication.run(MybatisPlus01HelloApplication.class, args);
    }

}
```



Tests.java

```java
package com.yixihan.mybatis_plus01hello;

import com.yixihan.mybatis_plus01hello.mapper.UserMapper;
import com.yixihan.mybatis_plus01hello.pojo.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class MybatisPlus01HelloApplicationTests {

    //继承了 BaseMapper ,所有的方法都来自父类, 我们也可以编写自己的扩展方法
    @Autowired
    private UserMapper mapper;

    @Test
    void contextLoads() {

        //参数是一个 Wrapper 条件构造器 不用就写 null
        List<User> userList = mapper.selectList(null);

        userList.forEach(System.out::println);

    }

}
```



## 日记配置



```properties
logging.level.com.yixihan.mybatis_plus01hello.mapper=debug
```



或者



```yaml
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```



## CRUD扩展



### 插入



```java
@Test
public void insert() {
    User user = new User();


    user.setName("曾思彤");
    user.setAge(18);
    user.setEmail("3113788997@qq.com");

    mapper.insert(user);
}
```

#### 主键自增



配置ID自增操作:

1. 实例类上加注解`@TableId(type = IdType.AUTO)`
2. 数据库字段要为自增



其他原码

```java
public enum IdType {
    /**
     * 数据库ID自增
     */
    AUTO(0),
    /**
     * 该类型为未设置主键类型
     */
    NONE(1),
    /**
     * 用户输入ID
     * 该类型可以通过自己注册自动填充插件进行填充
     */
    INPUT(2),

    /* 以下3种类型、只有当插入对象ID 为空，才自动填充。 */
    /**
     * 全局唯一ID (idWorker)
     */
    ID_WORKER(3),
    /**
     * 全局唯一ID (UUID)
     */
    UUID(4),
    /**
     * 字符串全局唯一ID (idWorker 的字符串表示)
     */
    ID_WORKER_STR(5);
```





### 更新

```java
@Test
public void updateUser() {
    User user = new User();

    user.setId(8L);
    user.setEmail("2535774265@qq.com");

    //参数是对象
    mapper.updateById(user);
}
```



#### 自动填充

1. 数据库不设置默认值 根据当前时间戳更新等设置

2. 实体类上加注解

   ```java
   //字段添加 填充内容
   @TableField(fill = FieldFill.INSERT)
   private Date creatTime;
   @TableField(fill = FieldFill.INSERT_UPDATE)
   private Date updateTime;
   ```

   3.编写处理器来处理

   ```java
   package com.yixihan.mybatis_plus01hello.handler;
   
   import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
   import lombok.extern.slf4j.Slf4j;
   import org.apache.ibatis.reflection.MetaObject;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.stereotype.Component;
   
   import java.util.Date;
   
   @Slf4j
   //不要忘了这个注解
   @Component
   public class MyMetaObjectHandler implements MetaObjectHandler {
       //插入时候的填充策略
       @Override
       public void insertFill(MetaObject metaObject) {
           log.info("start insert fill...");
           //default MetaObjectHandler setFieldValByName(String fieldName, Object fieldVal, MetaObject metaObject)
           this.setFieldValByName("creatTime", new Date(), metaObject);
           this.setFieldValByName("updateTime", new Date(), metaObject);
           log.info("insert success");
       }
   
       //更新时候的填充策略
       @Override
       public void updateFill(MetaObject metaObject) {
           log.info("start update fill...");
           //default MetaObjectHandler setFieldValByName(String fieldName, Object fieldVal, MetaObject metaObject)
           this.setFieldValByName("updateTime", new Date(), metaObject);
           log.info("update success");
   
       }
   }
   ```



### 乐观锁

> 乐观锁:总是认为不会出现问题,无论干什么都不会上锁,如果出现了问题,再次更新值测试
>
> 悲观锁:总是认为总会出现问题,无论干什么都会上锁,再去操作

乐观锁实现方式：

> - 取出记录时，获取当前version
> - 更新时，带上这个version
> - 执行更新时， set version = newVersion where version = oldVersion
> - 如果version不对，就更新失败

```sql
乐观锁:1.先查询,获得版本号 version = 1

---A
update user set name = 'yixihan',version = version + 1
where id = 2 and version = 1
---B B 线程抢先完成 这个时候 version = 2, 会导致 A 线程修改失败
update user set name = 'yixihan',version = version + 1
where id = 2 and version = 1
```



> ​	测试

1. 更新数据库表

数据库表新增 `version` 列



2. 修改实体类

```java
//乐观锁 version 注解
@Version
private Integer version;
```



3. 注册组件

```java
package com.yixihan.mybatis_plus01hello.config;

import com.baomidou.mybatisplus.extension.plugins.OptimisticLockerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@MapperScan("com.yixihan.mybatis_plus01hello")
@EnableTransactionManagement
public class MybatisPlusConfig {

    //注册乐观锁插件
    @Bean
    public OptimisticLockerInterceptor optimisticLockerInterceptor() {
        return new OptimisticLockerInterceptor();
    }
}
```



测试代码

```java
//测试乐观锁 成功
@Test
public void test1() {

    //查询用户信息
    User user = mapper.selectById(1L);

    //修改用户信息
    user.setName("yixihan");
    user.setEmail("3113788997@qq.com");

    //执行更新操作
    mapper.updateById(user);
}


//测试乐观锁 失败 多线程下

@Test
public void test2() {

    /*线程1*/
    //查询用户信息
    User user1 = mapper.selectById(1L);

    //修改用户信息
    user1.setName("yixihan111");
    user1.setEmail("3113788997@qq.com");

    /*模拟另外一个线程执行了插队操作*/
    User user2 = mapper.selectById(1L);
    user2.setName("yixihan2222");
    user2.setEmail("3113788997@qq.com");
    mapper.updateById(user2);

    //执行更新操作
    //自旋锁来尝试多次提交
    mapper.updateById(user1);       //如果没有乐观锁,就会覆盖插队线程的值
}
```



### 查询

```java
//测试查询
@Test
public void testQueryById() {
    User user = mapper.selectById(1L);

    System.out.println(user);
}

//测试批量查询
@Test
public void testQueryByBatchIds() {
    List<User> user = mapper.selectBatchIds(Arrays.asList(1,2,3));

    user.forEach(System.out::println);
}

//测试条件查询 使用 map 操作
@Test
public void testQueryByMap() {
    HashMap<String, Object> map = new HashMap<>();

    map.put("age", 18);

    List<User> users = mapper.selectByMap(map);

    users.forEach(System.out::println);
}
```



#### 分页查询

> ​	使用sql原生分页查询 limit

```sql
SELECT * FROM `user` LIMIT 1,5

SELECT * FROM `user` WHERE age = 18 LIMIT 1,3
```



> ​	使用第三方插件:PageHelper

官网地址:https://pagehelper.github.io/



> ​	使用MP自带的分页插件

1. 配置拦截器

```java
// 配置分页插件
@Bean
public PaginationInterceptor paginationInterceptor() {
    return new PaginationInterceptor();
}
```

2. 直接使用 page 对象即可

```java
//测试分页查询
@Test
public void testPage() {

    //参数一:当前页
    //参数二:页面大小
    Page<User> page = new Page<>(2,5);

    mapper.selectPage(page,null);

    page.getRecords().forEach(System.out::println);

}
```



### 删除操作

基本删除操作

```java
//测试删除
@Test
public void testDeleteById() {
    mapper.deleteById(1419446855594430467L);
}

//批量删除 通过ID
@Test
public void testBatchIds() {
    mapper.deleteBatchIds(Arrays.asList(6,8));
}

//条件删除 通过map
@Test
public void testDeleteByMap() {

    HashMap<String, Object> map = new HashMap<>();

    map.put("age", 18);

    mapper.deleteByMap(map);
}
```



#### 逻辑删除

> ​	物理删除:从数据库中直接移除 
>
> ​	逻辑删除:在数据库中没有移除,而是通过变量让他失效  deleted=0=>deleted=1

逻辑删除乐意防止数据丢失,类似回收站

1. 在数据库中新增列

增加 `deleted` 列



2. 更改实体类

```java
//逻辑删除
@TableLogic
private Integer deleted;
```



3. 配置组件

```java
//逻辑删除组件
@Bean
public ISqlInjector sqlInjector() {
    return new LogicSqlInjector();
}
```

```yaml
mybatis:
  global-config:
    db-config:
      logic-delete-field: deleted  # 全局逻辑删除的实体字段名(since 3.3.0,配置后可以忽略不配置步骤2)
      logic-delete-value: 1 # 逻辑已删除值(默认为 1)
      logic-not-delete-value: 0 # 逻辑未删除值(默认为 0)
```



### 性能分析插件

1. 导入插件

```java
//sql 执行效率插件
@Bean
@Profile({"test","dev"})	//设置 dev test 环境开启,保证效率
public PerformanceInterceptor performanceInterceptor() {
    PerformanceInterceptor paginationInterceptor = new PerformanceInterceptor();

    //ms 设置 sql 执行的最大时间,如果超过了则不执行
    paginationInterceptor.setMaxTime(100);
    //设置格式化
    paginationInterceptor.setFormat(true);
    return paginationInterceptor;
}
```

配置环境

```java
spring:
  profiles:
    active: dev
```



### 条件构造器 Wrapper



测试代码:

```java
package com.yixihan.mybatis_plus01hello;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.yixihan.mybatis_plus01hello.mapper.UserMapper;
import com.yixihan.mybatis_plus01hello.pojo.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

@SpringBootTest
public class WrapperTest {

    @Autowired
    private UserMapper mapper;

    @Test
    public void contextLoads() {
        //查询 name 且 email 不为空, age > 18 岁的用户

        QueryWrapper<User> wrapper = new QueryWrapper<>();

        wrapper
                .isNotNull("name")
                .isNotNull("email")
                .ge("age", 18);

        List<User> userList = mapper.selectList(wrapper);

        userList.forEach(System.out::println);
    }

    @Test
    public void contextLoads2() {
        //查询 名字为 Billie 的

        QueryWrapper<User> wrapper = new QueryWrapper<>();

        wrapper.eq("name", "Billie");

        //查询一个数据 ,如果多个的话,用List/Map
        User user = mapper.selectOne(wrapper);

        System.out.println(user);
    }

    @Test
    public void contextLoads3() {
        //查询 年龄在 20-30 之间的用户

        QueryWrapper<User> wrapper = new QueryWrapper<>();

        wrapper.between("age", 20, 30);

        //查询一个数据 ,如果多个的话,用List/Map
        Integer count = mapper.selectCount(wrapper);

        System.out.println(count);
    }

    //模糊查询
    @Test
    public void contextLoads4() {
        //左和右, 代表 % 在哪边

        QueryWrapper<User> wrapper = new QueryWrapper<>();

        wrapper
                .notLike("name", "小")
                .likeRight("email","t");

        List<Map<String, Object>> maps = mapper.selectMaps(wrapper);

        maps.forEach(System.out::println);
    }

    //内嵌查询
    @Test
    public void contextLoads5() {
        //ID 在子查询中查询出来
        QueryWrapper<User> wrapper = new QueryWrapper<>();

        wrapper.inSql("id", "select id from user where id < 4");

        List<Object> objects = mapper.selectObjs(wrapper);

        objects.forEach(System.out::println);
    }

    //查询排序
    @Test
    public void contextLoads6() {
        //通过 ID 进行排序
        QueryWrapper<User> wrapper = new QueryWrapper<>();

        wrapper.orderByDesc("id");

        List<User> userList = mapper.selectList(wrapper);

        userList.forEach(System.out::println);
    }


}
```



### 代码自动生成器

AutoGenerator 是 MyBatis-Plus 的代码生成器，通过 AutoGenerator 可以快速生成 Entity、Mapper、Mapper XML、Service、Controller 等各个模块的代码，极大的提升了开发效率。

```java
package com.yixihan;
import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.PackageConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.po.TableFill;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import java.util.ArrayList;

// 代码自动生成器
public class autoCode {

    public static void main(String[] args) {
        // 需要构建一个 代码自动生成器 对象
        AutoGenerator mpg = new AutoGenerator();

        // 配置策略
        // 1、全局配置
        GlobalConfig gc = new GlobalConfig();
        String projectPath = System.getProperty("user.dir");
        gc.setOutputDir(projectPath+"/src/main/java");
        gc.setAuthor("易曦翰");
        gc.setOpen(false);
        gc.setFileOverride(false); // 是否覆盖
        gc.setServiceName("%sService"); // 去Service的I前缀
        gc.setIdType(IdType.ID_WORKER);
        gc.setDateType(DateType.ONLY_DATE);
        gc.setSwagger2(true);
        mpg.setGlobalConfig(gc);

        //2、设置数据源
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl("jdbc:mysql://localhost:3306/mybatis_plus?useSSL=false&useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8");
        dsc.setDriverName("com.mysql.cj.jdbc.Driver");
        dsc.setUsername("root");
        dsc.setPassword("Theyear123");
        dsc.setDbType(DbType.MYSQL);
        mpg.setDataSource(dsc);

        //3、包的配置
        PackageConfig pc = new PackageConfig();
        pc.setModuleName("User");
        pc.setParent("com.yixihan");
        pc.setEntity("entity");
        pc.setMapper("mapper");
        pc.setService("service");
        pc.setController("controller");
        mpg.setPackageInfo(pc);

        //4、策略配置
        StrategyConfig strategy = new StrategyConfig();
        strategy.setInclude("user"); // 设置要映射的表名
        strategy.setNaming(NamingStrategy.underline_to_camel);
        strategy.setColumnNaming(NamingStrategy.underline_to_camel);
        strategy.setEntityLombokModel(true); // 自动lombok；
        strategy.setLogicDeleteFieldName("deleted");

        // 自动填充配置
        TableFill gmtCreate = new TableFill("gmt_create", FieldFill.INSERT);
        TableFill gmtModified = new TableFill("gmt_modified", FieldFill.INSERT_UPDATE);
        ArrayList<TableFill> tableFills = new ArrayList<>();
        tableFills.add(gmtCreate);
        tableFills.add(gmtModified);
        strategy.setTableFillList(tableFills);

        // 乐观锁
        strategy.setVersionFieldName("version");
        strategy.setRestControllerStyle(true);
        strategy.setControllerMappingHyphenStyle(true); //localhost:8080/hello_id_2
        mpg.setStrategy(strategy);
        mpg.execute(); //执行
    }
}

```



需导入依赖

```xml
<!-- https://mvnrepository.com/artifact/com.baomidou/mybatis-plus-boot-starter -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.0.5</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.apache.velocity/velocity-engine-core -->
<dependency>
    <groupId>org.apache.velocity</groupId>
    <artifactId>velocity-engine-core</artifactId>
    <version>2.0</version>
</dependency>
<!-- https://mvnrepository.com/artifact/io.springfox/springfox-swagger-ui -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>
<!-- https://mvnrepository.com/artifact/io.swagger/swagger-annotations -->
<dependency>
    <groupId>io.swagger</groupId>
    <artifactId>swagger-annotations</artifactId>
    <version>1.6.2</version>
</dependency>
```

