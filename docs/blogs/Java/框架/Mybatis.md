---
title: Mybatis
date: 2022-12-31
sidebar: 'auto'
categories:
- Java
tags:
- Java
- Mybatis
---

# 1、Mybatis



Mybatis官网：https://mybatis.org/mybatis-3/index.html

Mybatis-Spring官网：https://mybatis.org/spring/index.html

Mybatis Plus官网：https://mp.baomidou.com/



## 1.1、mybatis安装

新建一个Maven项目，导入mybatis包即可

```xml
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
</dependency>
<!--mybatis-->
<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.7</version>
</dependency>
<!--mysql驱动-->
<!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.23</version>
</dependency>
<!--slf4j-->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.8.0-beta4</version>
</dependency>
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>1.8.0-beta4</version>
</dependency>
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>

<!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.20</version>
</dependency>

<!-- ehcache缓存 -->
<!-- https://mvnrepository.com/artifact/org.mybatis.caches/mybatis-ehcache -->
<dependency>
    <groupId>org.mybatis.caches</groupId>
    <artifactId>mybatis-ehcache</artifactId>
    <version>1.2.1</version>
</dependency>
```

## 1.2、mybatisConfig.xml设置

```xml
<?xml version="1.0" encoding="UTF8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<!--configuration核心配置文件-->
<configuration>

    <!--引入外部配置文件-->
    <properties resource="db.properties">
        <!--可以在此增加一些属性配置
        如果两个文件有同一个字段，优先使用外部配置文件-->
    </properties>

    <!--设置-->
    <settings>
        <setting name="logImpl" value="LOG4J2"/>
    </settings>

    <!--可以给实体类起别名-->
    <typeAliases>
        <!--实体类多选择-->
        <package name="com.yixihan.pojo"/>
        <!--实体类少选择-->
        <!--<typeAlias type="com.yixihan.pojo.User" alias="User"/>-->
    </typeAliases>

    <environments default="development">
        <environment id="development">
            <!--事务管理-->
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>

    <!--每个Mapper.xml都需要在Mybatis核心配置文件中注册-->
    <mappers>
        <!--方式一
        推荐使用-->

        <mapper resource="com/yixihan/dao/UserMapper.xml"/>

        <!--方式二
        接口和他的Mapper配置文件必须同名
        接口和他的Mapper配置文件必须在同一包下-->

        <!--<mapper class="com.yixihan.dao.UserMapper"/>-->

        <!--方式三
        接口和他的Mapper配置文件必须同名
        接口和他的Mapper配置文件必须在同一包下-->

        <!--<package name="com.yixihan.dao"/>-->
    </mappers>

</configuration>
```

## 1.3、db.properties设置

```properties
driver = com.mysql.cj.jdbc.Driver
url = jdbc:mysql://localhost:3306/mybatis?useSSL=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC
username = root
password = Theyear123
```

## 1.4、log4j.properties设置

```properties
#将等级为DEBUG的日志信息输出到console和file这两个目的地，console和file的定义在下面的代码
log4j.rootLogger=DEBUG,console,file

#控制台输出的相关设置
log4j.appender.console = org.apache.log4j.ConsoleAppender
log4j.appender.console.Target = System.out
log4j.appender.console.Threshold=DEBUG
log4j.appender.console.layout = org.apache.log4j.PatternLayout
log4j.appender.console.layout.ConversionPattern=[%c]-%m%n

#文件输出的相关设置
log4j.appender.file = org.apache.log4j.RollingFileAppender
log4j.appender.file.File=./log/yixihan.log
log4j.appender.file.MaxFileSize=10mb
log4j.appender.file.Threshold=DEBUG
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.file.layout.ConversionPattern=[%p][%d{yy-MM-dd}][%c]%m%n

#日志输出级别
log4j.logger.org.mybatis=DEBUG
log4j.logger.java.sql=DEBUG
log4j.logger.java.sql.Statement=DEBUG
log4j.logger.java.sql.ResultSet=DEBUG
log4j.logger.java.sql.PreparedStatement=DEBUG

# 输出消息编码
log4j.appender.Console.encoding=UTF-8
```

## 1.5、Mybatis.java

```java
package com.yixihan.utils;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

//sqlSessionFactory --> sqlSession
public class MybatisUtils {
    private static  SqlSessionFactory sqlSessionFactory;

    static {
        try{
            //使用Mybatis第一步
            //获取sqlSessionFactory对象
            String resource = "mybatisconfig.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        }catch (IOException e) {
            e.printStackTrace();
        }
    }

    //既然有了SqlSessionFactory,顾名思义，我们就可以从中获得SqlSession的实例了
    //SqlSession完全包含了面向数据库执行SQL命令所需的所以方法
    public static SqlSession getSqlSession () {
        /*自动提交事务*/
        return sqlSessionFactory.openSession(true);
    }
```

## 1.6、Mapper.xml

```xml
<?xml version="1.0" encoding="UTF8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--namespace=绑定一个对应的Dao/Mapper接口-->
<mapper namespace="com.yixihan.dao.UserMapper">
    
</mapper>
```



## 1.7、简单CRUD

### 1.7.1、利用Mapper.xml开发



User.java

```java
package com.yixihan.pojo;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

//实体类
@Data
@AllArgsConstructor
@NoArgsConstructor

public class User {
    private int id;                 //id
    private String name;            //名字
    private String pwd;             //密码


}
```



UserMaper.java

```java
package com.yixihan.dao;

import com.yixihan.pojo.User;

import java.util.List;
import java.util.Map;

public interface UserMapper {
    //查询全部用户
    List<User> GetUserList ();

    //根据ID查询用户
    User GetUserByID (int id);

    //模糊查询
    List<User> GetUserLike(String value);

    //添加用户
    int addUser (User user);

    //利用map添加用户
    int addUser2 (Map<String, Object> map);

    //修改用户
    int updateUser (User user);

    //利用map修改用户
    int updateUser2 (Map<String, Object> map);

    //删除用户
    int deleteUser (int id);
}

```



UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--namespace=绑定一个对应的Dao/Mapper接口-->
<mapper namespace="com.yixihan.dao.UserMapper">

    <!--select查询语句-->

    <!--
    id:对应的namespace中的方法名
    resultType:SQL语句执行的返回值
    parameterType:参数类型
    -->

    <!--无条件查找-->
    <select id="GetUserList" resultType="com.yixihan.pojo.User">
        select *
        from mybatis.user
    </select>

    <!--按ID查找-->
    <select id="GetUserByID" resultType="com.yixihan.pojo.User" parameterType="int">
        select *
        from mybatis.user
        where id = #{id}
    </select>

    <!--模糊查询-->
    <select id="GetUserLike" resultType="com.yixihan.pojo.User">
        select *
        from user
        where  user.name like #{value}
    </select>

    <!--插入-->
    <insert id="addUser" parameterType="com.yixihan.pojo.User">
        insert into  `user`(`user`.id,`user`.`name`,`user`.pwd) value (#{id},#{name},#{pwd});
    </insert>

    <!--利用map插入-->
    <!--
    对象中的属性，可以直接取出来
    传递map的key
    -->
    <insert id="addUser2" parameterType="map">
        insert into  `user`(`user`.id,`user`.`name`,`user`.pwd) value (#{userid},#{username},#{userpassword});
    </insert>

    <!--更新-->
    <update id="updateUser" parameterType="com.yixihan.pojo.User">
        update mybatis.user
        set user.name = #{name}, user.pwd = #{pwd}
        where user.id = #{id};
    </update>

    <!--利用map更新-->
    <update id="updateUser2" parameterType="map">
        update mybatis.user
        set user.pwd = #{password}
        where user.id = #{id};
    </update>

    <!--删除-->
    <delete id="deleteUser" parameterType="int" >
        delete from mybatis.user
        where user.id = #{id}
    </delete>

</mapper>
```

### 1.7.2、结果集映射



User.java

同上



UserMapper.java

```java
package com.yixihan.dao;

import com.yixihan.pojo.User;

import java.util.List;
import java.util.Map;

public interface UserMapper {
    //查询全部用户
    List<User> GetUserList ();

    List<User> GetUserByLimit (Map<String, Object> map);

}
```



UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--namespace=绑定一个对应的Dao/Mapper接口-->
<mapper namespace="com.yixihan.dao.UserMapper">
    <!--select查询语句-->
    <!--
    id:对应的namespace中的方法名
    resultType:SQL语句执行的返回值
    parameterType:参数类型-->

    <!--无条件查找-->
    <select id="GetUserList" resultType="user">
        select *
        from mybatis.user
    </select>

    <!--结果集映射-->
    <resultMap id="UserMap" type="user">

        <!--column数据库中的字段，property实体类中的属性-->
        <result column="id" property="id"/>
        <result column="name" property="name"/>
        <result column="pwd" property="pwd"/>
    </resultMap>

    <!--按ID查找-->
    <select id="GetUserByID" resultMap="UserMap" parameterType="int">
        select *
        from mybatis.user
        where id = #{id}
    </select>

    <select id="GetUserByLimit" resultType="user" parameterType="map">
        select *
        from mybatis.user limit #{startIndex}, #{pageSize}
    </select>

</mapper>
```

### 1.7.3、利用注解开发(仅适用于简单的CRUD)



四种语句的注解

​	@Select

​	@Insert

​	@Update

​	@Delete

注意：使用简单类型时，最好加上注解@Param("id")



User.java

同上



UserMapper.java

```java
package com.yixihan.dao;

import com.yixihan.pojo.User;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

public interface UserMapper {

    @Select("select * from user")
    List<User> getUsers ();

    //方法存在多个参数时，所有的参数前面必须加上@Param("id")注解，即使只有一个参数，也建议加上
    @Select("select * from user where id = #{id} and name = #{name}")
    User getUserByID1 (@Param("id") int id, @Param("name") String name);

    @Select("select * from user where id = #{id}")
    User getUserByID2 (@Param("id") int id);

    @Insert("insert into user(id,name,pwd) values (#{id},#{name},#{password})")
    int addUser (User user);

    @Update("update user set user.pwd = #{pwd} where user.id = #{id}")
    int updateUser (Map<String, Object> map);

    @Delete("delete from user where id = #{id}")
    int deleteUser (@Param("id") int id);

}

```

## 1.8、多对一



Student.java

```java
package com.yixihan.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    private int id;
    private String name;

    //学生需要关联一个老师
    private Teacher teacher;
}
```



Teacher.java

```java
package com.yixihan.pojo;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {
    private int id;
    private String name;
}
```



StudentMapper.java

```java
package com.yixihan.dao;

import com.yixihan.pojo.Student;

import java.util.List;

public interface StudentMapper {

    //查询所有的学生信息以及对应的老师信息
    List<Student> getStudent1 ();


    List<Student> getStudent2 ();
}
```



StudentMapper.xml

```xml
<?xml version="1.0" encoding="UTF8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--configuration核心配置文件-->
<mapper namespace="com.yixihan.dao.StudentMapper">

    <!--方法一：按照查询嵌套处理
    思路:
        1.查询所有的学生信息
        2.根据查询出来的学生tid，寻找对应的老师

        子查询
        -->


    <select id="getStudent1" resultMap="StudentTeacher1">
        select *
        from mybatis.student
    </select>

    <resultMap id="StudentTeacher1" type="student">
        <result property="id" column="id"/>
        <result property="name" column="name"/>

        <!--复杂的属性，需要单独处理
            对象：association
            集合：collection
            -->

        <association property="teacher" column="tid" javaType="teacher" select="getTeacher"/>

    </resultMap>

    <select id="getTeacher" resultType="teacher">
        select *
        from mybatis.teacher
        where id = #{id}
    </select>



    <!--=====================================================================================-->



    <!--方法二：按照结果嵌套处理
       联表查询
       -->

    <select id="getStudent2" resultMap="StudentTeacher2">
        select student.id as sid,student.name as sname,mybatis.teacher.name as tname
        from mybatis.teacher,mybatis.student
        where teacher.id=student.tid
    </select>

    <resultMap id="StudentTeacher2" type="student">
        <result property="id" column="sid"/>
        <result property="name" column="sname"/>
        <association property="teacher" javaType="teacher">
            <result property="name" column="tname"/>
        </association>
    </resultMap>
</mapper>
```



## 1.9、一对多



Student.java 和 Teacher.java

同上



TeacherMapper.java

```java
package com.yixihan.dao;

import com.yixihan.pojo.Teacher;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface TeacherMapper {

    /*@Select("select * from teacher")*/
    List<Teacher> getTeacher1 ();

    List<Teacher> getTeacher2 ();

}
```



TeacherMapper.xml

```xml
<?xml version="1.0" encoding="UTF8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--configuration核心配置文件-->
<mapper namespace="com.yixihan.dao.TeacherMapper">

    <!--按结果嵌套查询-->
    <select id="getTeacher1" resultMap="TS1">
        select teacher.id as tid,teacher.name as tname,student.id as sid,student.name as sname,student.tid as tid
        from mybatis.teacher,mybatis.student
        where student.tid=teacher.id;
    </select>

    <resultMap id="TS1" type="teacher">
        <result property="id" column="tid"/>
        <result property="name" column="tname"/>

        <!--复杂的属性，我们需要单独处理
        对象 ： association
        集合 ： collection
        javaType="" 指定属性的类型
        集合中的泛型信息，使用ofType获取
        -->
        <collection property="studentList" ofType="student">
            <result property="id" column="sid"/>
            <result property="name" column="sname"/>
            <result property="tid" column="tid"/>
        </collection>
    </resultMap>


    <!--=============================================================================================-->


    <select id="getTeacher2" resultMap="TS2">
        select *
        from mybatis.teacher
    </select>

    <resultMap id="TS2" type="teacher">
        <result property="id" column="id"/>
        <result property="name" column="name"/>
        <collection property="studentList" ofType="student" javaType="ArrayList" select="getUserByTID" column="id"/>
    </resultMap>

    <select id="getUserByTID" resultType="student">
        select *
        from mybatis.student
        where student.tid = #{tid}
    </select>
</mapper>
```



## 1.10动态SQL



主要掌握

if

where/set

即可



Blog.java

```java
package com.yixihan.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class Blog {
    private String id;
    private String title;
    private String author;
    private Date createTime ;    //属性名和字段名不一致
    private int views;
}
```



BlogMapper.java

```java
package com.yixihan.dao;

import com.yixihan.pojo.Blog;

import java.util.List;
import java.util.Map;

public interface BlogMapper {

    //插入数据
    int addBook (Blog blog);

    //查询博客
    List<Blog> queryBlogIF (Map <String, Object> map) ;


    List<Blog> queryBlogChoose (Map <String, Object> map) ;


    //查询第1-2-3号记录的博客
    List<Blog> queryBlogForeach (Map map);


    //更新
    int updateBolg (Map map);
}
```



BlogMapper.xml

```xml
<?xml version="1.0" encoding="UTF8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--configuration核心配置文件-->
<mapper namespace="com.yixihan.dao.BlogMapper">

    <sql id="if_TAC">
        <if test="title != null">
            and title = #{title}
        </if>
        <if test="author != null">
            and author = #{author}
        </if>
        <if test="createTime != null">
            and creat_time = #{createTime}
        </if>
    </sql>
    

    <insert id="addBook" parameterType="blog">
        insert into mybatis.blog (id, title, author, creat_time, views)
        value (#{id}, #{title}, #{author}, #{createTime}, #{views})
    </insert>

    <select id="queryBlogIF" resultType="blog" parameterType="map">
        select *
        from mybatis.blog
        <where>
            <include refid="if_TAC"/>
        </where>
    </select>

    <select id="queryBlogChoose" parameterType="map" resultType="blog">
        select *
        from mybatis.blog
        <where>
            <choose>
                <when test="title != null">
                    title = #{title}
                </when>
                <when test="author != null">
                    and author = #{author}
                </when>
                <when test="views != null">
                    and views = #{views}
                </when>
                <otherwise>
                </otherwise>
            </choose>
        </where>
    </select>

    <update id="updateBolg" parameterType="map">
        update mybatis.blog
        <set>
            <if test="title != null">
                title = #{title},
            </if>
            <if test="author != null">
                author = #{author},
            </if>
            <if test="createTime != null">
                creat_time = #{createTime},
            </if>
            <if test="views != null">
                views = #{views},
            </if>
        </set>
            where id = #{id}
    </update>

    <!--
    select * from mybatis.blog where (id=1 or id=2 or id=3)

    现在传递一个万能的map，这个map中可以存在一个集合
    foreach：
        collection：传进来的参数（集合）
        item：遍历出来的名字
        open：开始符号
        close：结尾符号
        separator：中间的分隔符
    -->
    <select id="queryBlogForeach" parameterType="map" resultType="blog">
        select *
        from mybatis.blog
        <where>
            <foreach collection="ids" item="id" open="and (" close=")" separator="or">
                id = #{id}
            </foreach>
        </where>
    </select>
</mapper>
```





### 1.10.1、关于sql语句使用示例

可以减少重复sql语句

```xml
<sql id="if_TAC">
    <if test="title != null">
        and title = #{title}
    </if>
    <if test="author != null">
        and author = #{author}
    </if>
    <if test="createTime != null">
        and creat_time = #{createTime}
    </if>
</sql>


<insert id="addBook" parameterType="blog">
    insert into mybatis.blog (id, title, author, creat_time, views)
    value (#{id}, #{title}, #{author}, #{createTime}, #{views})
</insert>

<select id="queryBlogIF" resultType="blog" parameterType="map">
    select *
    from mybatis.blog
    <where>
        <include refid="if_TAC"/>
    </where>
</select>
```

