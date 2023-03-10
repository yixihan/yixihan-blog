---
title: windows编程环境搭建
date: 2022-12-31
sidebar: 'auto'
sticky: 3
categories:
- 编程环境搭建
tags:
- Java
- Go
- Vue
- C
- 环境搭建
---

## Java 环境安装

### JDK 安装

#### 下载 jdk

[oralce jdk 下载](https://www.oracle.com/java/technologies/javase/javase8u211-later-archive-downloads.html)



#### 安装 JDK

> 无脑下一步就行

![image-20221102212918499](https://typora-oss.yixihan.chat//img/202211241709256.png)

> 记住 jdk 安在哪了

![image-20221102212946776](https://typora-oss.yixihan.chat//img/202211241709226.png)

> 安装完成

![image-20221102213051866](https://typora-oss.yixihan.chat//img/202211241709234.png)



#### 配置环境变量

> ps : 最好配置在系统变量下面

> 进入高级系统设置

![image-20221102213139974](https://typora-oss.yixihan.chat//img/202211241709240.png)

> 选择环境变量

![image-20221102213201179](https://typora-oss.yixihan.chat//img/202211241709238.png)



##### 配置 JAVA_HOME

> 系统变量 -> 新建

![image-20221102213356802](https://typora-oss.yixihan.chat//img/202211241710912.png)

```shell
# JAVA_HOME 为 JDK 的安装位置
JAVA_HOME
C:\Program Files\Java\jdk1.8.0_291
```



##### 配置 CLASSPath

> 系统变量 -> 新建

![image-20221102213552439](https://typora-oss.yixihan.chat//img/202211241710919.png)

```shell
CLASSPath
%JAVA_HOME%\lib;
```



##### 配置 Path

> 系统变量 -> Path -> 编辑 -> 新建

![image-20221102213852104](https://typora-oss.yixihan.chat//img/202211241710927.png)

```shell
# 可将其移动到最前面
%JAVA_HOME%\bin
C:\Program Files\Java\jdk1.8.0_291\bin
```



#### 检测 JDK 是否安装成功

> win + r -> cmd

![image-20221102214002927](https://typora-oss.yixihan.chat//img/202211241710929.png)

```shell
java -version
```



### Maven 安装

#### Maven 相关网址

[Maven官网](http://maven.apache.org/)

[Maven仓库](https://mvnrepository.com/)

[Maven下载镜像(多版本可选)](https://dlcdn.apache.org/maven/)



#### Maven 下载

> 建议下载 3.6+ 的版本

![image-20221102215029241](https://typora-oss.yixihan.chat//img/202211241710923.png)



#### 配置环境变量

##### 配置 M2_HOME

> 系统变量 -> 新建

![image-20221102215142739](https://typora-oss.yixihan.chat//img/202211241710904.png)

```shell
# maven 解压地址
M2_HOME
D:\environment\apache-maven-3.8.1
```



##### 配置 MAVEN_HOME

> 系统变量 -> 新建

![image-20221102215252815](https://typora-oss.yixihan.chat//img/202211241710340.png)

```shell
# maven 解压地址
MAVEN_HOME
D:\environment\apache-maven-3.8.1
```



##### 配置 Path

> 系统变量 -> Path -> 编辑 -> 新建

![image-20221102215428635](https://typora-oss.yixihan.chat//img/202211241710329.png)

```shell
%MAVEN_HOME%\bin
D:\environment\apache-maven-3.8.1\bin
```



#### 更改 Maven 设置

##### 打开 conf 目录下的 setting.xml 文件

> 新增阿里云镜像, 用于下载资源

![image-20221102220009331](https://typora-oss.yixihan.chat//img/202211241710344.png)

```xml
<!-- 阿里云maven镜像 -->
<mirror>
    <id>aliyunmaven</id>
    <mirrorOf>*</mirrorOf>
    <name>阿里云公共仓库</name>
    <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```



#### 新建 maven-repo 文件夹

> 用于存放资源

![image-20221102220103196](https://typora-oss.yixihan.chat//img/202211241710358.png)



#### 安装 maven

> win + r -> cmd

![image-20221102220219552](https://typora-oss.yixihan.chat//img/202211241710352.png)

```shell
# 记得保存环境变量配置
mvn -version
```



### Tomcat 安装

#### Tomcat 相关网站

[Tomcat 官网](https://tomcat.apache.org/)

[Tomcat 下载镜像(多版本下载)](https://dlcdn.apache.org/tomcat/)



#### Tomcat 下载

> 建议下载 9+ 版本

![image-20221102220717364](https://typora-oss.yixihan.chat//img/202211241710360.png)



#### 配置环境变量

##### 配置 TOMCAT_HOME

> 系统变量 -> 新建

![image-20221102220918950](https://typora-oss.yixihan.chat//img/202211241710706.png)

```shell
# Tomcat 解压地址
TOMCAT_HOME
D:\environment\apache-tomcat-9.0.43
```



##### 配置 CATALINA_HOME

> 系统变量 -> 新建

![image-20221102220941344](https://typora-oss.yixihan.chat//img/202211241710709.png)

```shell
# Tomcat 解压地址
CATALINA_HOME
D:\environment\apache-tomcat-9.0.43
```



##### 配置 Path

> 系统变量 -> Path -> 编辑 -> 新建

![image-20221102221029683](https://typora-oss.yixihan.chat//img/202211241710723.png)

```shell
D:\environment\apache-maven-3.8.1\bin
%CATALINA_HOME%\bin
```



##### 配置 CLASSPath

> 系统变量 -> CLASSPath -> 后面追加

![image-20221102221110539](https://typora-oss.yixihan.chat//img/202211241710707.png)

```shell
CLASSPath
%CATALINA_HOME%\lib\servlet-api.jar;
```



#### 安装 Tomcat

> win + r -> cmd

![image-20221102221229144](https://typora-oss.yixihan.chat//img/202211241710702.png)

```shell
service install Tomcat9
```



#### 测试 Tomcat

> 资源管理器 -> 搜索 %TOMCAT_HOME%/bin/startup.bat -> enter

```shell
%TOMCAT_HOME%/bin/startup.bat
```

![image-20221102222524558](https://typora-oss.yixihan.chat//img/202211241710717.png)

> Tomcat 启动成功

![image-20221102222107606](https://typora-oss.yixihan.chat//img/202211241710111.png)

> [测试网址](http://localhost:8080/)

![img](https://typora-oss.yixihan.chat//img/202211241710108.png)



#### 修复乱码问题

##### logging.properties

> 资源管理器 -> 搜索 %TOMCAT_HOME%\conf\logging.properties -> enter

```shell
%TOMCAT_HOME%/conf/logging.properties
```

![image-20221102222547923](https://typora-oss.yixihan.chat//img/202211241710129.png)

1. ctrl + f 打开查找页面, tab 切换为替换![image-20221102222746676](https://typora-oss.yixihan.chat//img/202211241710124.png)
2. 搜索 `UTF-8`, 替换为 `GBK`![image-20221102222815486](https://typora-oss.yixihan.chat//img/202211241710140.png)
3. 全部替换![image-20221102222838533](https://typora-oss.yixihan.chat//img/202211241710131.png)
4. 保存关闭



##### service.xml

资源管理器 -> 搜索 %TOMCAT_HOME%\conf\server.xml -> enter

```shell
%TOMCAT_HOME%\conf\server.xml
```

![image-20221102223030197](https://typora-oss.yixihan.chat//img/202211241710472.png)

> 修改

![image-20221102223229345](https://typora-oss.yixihan.chat//img/202211241710496.png)

```xml
<Connector port="8080" protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443" 
           URIEncoding="UTF-8"/>
```



##### 测试

```shell
%TOMCAT_HOME%/bin/startup.bat
```

![image-20221102223313114](https://typora-oss.yixihan.chat//img/202211241710561.png)



### Navicat 安装

#### Navicat 相关网址

[Navicat 官网](https://navicat.com.cn/)

[Navicat 下载地址](http://www.navicat.com.cn/download/navicat-premium)

[Navicat 学习版下载教程&地址](http://www.navicat.com.cn/download/navicat-premium)



#### Navicat 下载

> ps : 学习版记得断网

> 无脑下一步就行

![image-20221102223959022](https://typora-oss.yixihan.chat//img/202211241710558.png)

> 安装成功

![image-20221102224030804](https://typora-oss.yixihan.chat//img/202211241710555.png)



#### 注册

##### 打开注册机

> ps : 关闭杀毒软件

![image-20221102224115061](https://typora-oss.yixihan.chat//img/202211241710569.png)



##### Pactch 选择

> 选择正确的版本

![image-20221102224158590](https://typora-oss.yixihan.chat//img/202211241710825.png)



##### Pathch

> 出现此弹窗表示成功

![image-20221102224240166](https://typora-oss.yixihan.chat//img/202211241710976.png)



##### License. Product and Language

> 保持默认不变即可

![image-20221102224304850](https://typora-oss.yixihan.chat//img/202211241710931.png)



##### Resale License

> 保持默认不变即可

![image-20221102224347973](https://typora-oss.yixihan.chat//img/202211241710978.png)



##### Keygen / Offline Activation

> 点击 `Generate`, 即可生成许可证密钥

![image-20221102224433827](https://typora-oss.yixihan.chat//img/202211241710937.png)



##### 打开 Navicat, 注册

![image-20221102224532426](https://typora-oss.yixihan.chat//img/202211241710971.png)



##### 粘贴许可证密钥

![image-20221102224645385](https://typora-oss.yixihan.chat//img/202211241710080.png)



##### 点击激活

![image-20221102224706342](https://typora-oss.yixihan.chat//img/202211241710317.png)



##### 点击手动激活

![image-20221102224725997](https://typora-oss.yixihan.chat//img/202211241710315.png)



##### 复制请求码

![image-20221102224817916](https://typora-oss.yixihan.chat//img/202211241710313.png)



##### 粘贴到注册机, 注册

![image-20221102224848435](https://typora-oss.yixihan.chat//img/202211241710401.png)



##### 将激活码复制到 Navicat

> 这是自动的

![image-20221102224931608](https://typora-oss.yixihan.chat//img/202211241710405.png)



##### 激活

![image-20221102224942992](https://typora-oss.yixihan.chat//img/202211241710532.png)



##### 激活成功

![image-20221102225004290](https://typora-oss.yixihan.chat//img/202211241710809.png)

![image-20221102225216697](https://typora-oss.yixihan.chat//img/202211241710798.png)



#### 连接数据库

##### 新建连接

![image-20221102225445809](https://typora-oss.yixihan.chat//img/202211241710806.png)



##### 设置连接属性

![image-20221102225644274](https://typora-oss.yixihan.chat//img/202211241710815.png)



##### 测试连接

![image-20221102225632076](https://typora-oss.yixihan.chat//img/202211241710812.png)

![image-20221102225654455](https://typora-oss.yixihan.chat//img/202211241710867.png)



##### 保存连接

![image-20221102225718555](https://typora-oss.yixihan.chat//img/202211241710163.png)



### 通过 Navicat 找回 MySQL 密码

#### 方式一

##### 点击文件, 选择导出连接

![image-20221102230002049](https://typora-oss.yixihan.chat//img/202211241710166.png)



##### 勾选导出密码

![image-20221102230021358](https://typora-oss.yixihan.chat//img/202211241710174.png)



##### 打开导出文件, 找到 password

![image-20221102230103967](https://typora-oss.yixihan.chat//img/202211241710233.png)



##### 解析 password

```php
<?php
namespace FatSmallTools;
class NavicatPassword
{
    protected $version = 0;
    protected $aesKey = 'libcckeylibcckey';
    protected $aesIv = 'libcciv libcciv ';
    protected $blowString = '3DC5CA39';
    protected $blowKey = null;
    protected $blowIv = null;
    public function __construct($version = 12)
    {
        $this->version = $version;
        $this->blowKey = sha1('3DC5CA39', true);
        $this->blowIv = hex2bin('d9c7c3c8870d64bd');
    }
    public function encrypt($string)
    {
        $result = FALSE;
        switch ($this->version) {
            case 11:
                $result = $this->encryptEleven($string);
                break;
            case 12:
                $result = $this->encryptTwelve($string);
                break;
            default:
                break;
        }
        return $result;
    }
    protected function encryptEleven($string)
    {
        $round = intval(floor(strlen($string) / 8));
        $leftLength = strlen($string) % 8;
        $result = '';
        $currentVector = $this->blowIv;
        for ($i = 0; $i < $round; $i++) {
            $temp = $this->encryptBlock($this->xorBytes(substr($string, 8 * $i, 8), $currentVector));
            $currentVector = $this->xorBytes($currentVector, $temp);
            $result .= $temp;
        }
        if ($leftLength) {
            $currentVector = $this->encryptBlock($currentVector);
            $result .= $this->xorBytes(substr($string, 8 * $i, $leftLength), $currentVector);
        }

        return strtoupper(bin2hex($result));

    }

    protected function encryptBlock($block)
    {
        return openssl_encrypt($block, 'BF-ECB', $this->blowKey, OPENSSL_RAW_DATA|OPENSSL_NO_PADDING); 
    }

    protected function decryptBlock($block)
    {
        return openssl_decrypt($block, 'BF-ECB', $this->blowKey, OPENSSL_RAW_DATA|OPENSSL_NO_PADDING); 
    }

    protected function xorBytes($str1, $str2)
    {
        $result = '';
        for ($i = 0; $i < strlen($str1); $i++) {
            $result .= chr(ord($str1[$i]) ^ ord($str2[$i]));
        }
        return $result;
    }

    protected function encryptTwelve($string)
    {
        $result = openssl_encrypt($string, 'AES-128-CBC', $this->aesKey, OPENSSL_RAW_DATA, $this->aesIv);
        return strtoupper(bin2hex($result));
    }
    
    public function decrypt($string)
    {
        $result = FALSE;
        switch ($this->version) {
            case 11:
                $result = $this->decryptEleven($string);
                break;
            case 12:
                $result = $this->decryptTwelve($string);
                break;
            default:
                break;
        }
        return $result;
    }
    
    protected function decryptEleven($upperString)
    {
        $string = hex2bin(strtolower($upperString));
        $round = intval(floor(strlen($string) / 8));
        $leftLength = strlen($string) % 8;
        $result = '';
        $currentVector = $this->blowIv;
        for ($i = 0; $i < $round; $i++) {
            $encryptedBlock = substr($string, 8 * $i, 8);
            $temp = $this->xorBytes($this->decryptBlock($encryptedBlock), $currentVector);
            $currentVector = $this->xorBytes($currentVector, $encryptedBlock);
            $result .= $temp;
        }
        if ($leftLength) {
            $currentVector = $this->encryptBlock($currentVector);
            $result .= $this->xorBytes(substr($string, 8 * $i, $leftLength), $currentVector);
        }
        return $result;
    }

    

    protected function decryptTwelve($upperString)
    {
        $string = hex2bin(strtolower($upperString));
        return openssl_decrypt($string, 'AES-128-CBC', $this->aesKey, OPENSSL_RAW_DATA, $this->aesIv);
    }
}

 

use FatSmallTools\NavicatPassword;
 
//需要指定版本，11或12

//$navicatPassword = new NavicatPassword(12);

$navicatPassword = new NavicatPassword(11);

 

//解密
$decode = $navicatPassword->decrypt('A260FAB705BFD9DA6B4E41686A31');
echo $decode."\n";
```

使用 php 代码解密密码, 代码最后一段把括号内那段字符改成密码

![image-20221102231227860](https://typora-oss.yixihan.chat//img/202211241710229.png)



#### 方法二 (推荐)

##### 连接数据库, 点击用户,

远程服务器选择 root@% 用户

本地服务器选择 root@localhost 用户

![image-20221102231334512](https://typora-oss.yixihan.chat//img/202211241710292.png)



##### 修改密码即可

![image-20221102231425475](https://typora-oss.yixihan.chat//img/202211241710591.png)



### Idea 安装

> 除了以下页面建议这样勾选, 其他无脑下一步即可

![image-20221102232129871](https://typora-oss.yixihan.chat//img/202211241710552.png)



### Git 安装

#### Git 相关网址

[Git 官网](https://git-scm.com/)

[Git 淘宝镜像](https://registry.npmmirror.com/binary.html?path=git-for-windows/)



#### Git 下载

无脑下一步即可



#### Git 配置

##### 配置用户名密码

![image-20221102234512855](https://typora-oss.yixihan.chat//img/202211241710604.png)

```shell
git config --global user.name "zengsitong"
git config --global user.email zengsitong@newhope.cn
git config --global --list
```



#### 配置 ssh

##### 生成 ssh 密钥

> 无脑 enter 就行

![image-20221102234946507](https://typora-oss.yixihan.chat//img/202211241710646.png)

```shell
ssh-keygen -t rsa
```



##### 查看 ssh 公钥

![image-20221102235326148](https://typora-oss.yixihan.chat//img/202211241710619.png)



##### 添加ssh密钥

![image-20221102234835776](https://typora-oss.yixihan.chat//img/202211241710645.png)

![image-20221102235413959](https://typora-oss.yixihan.chat//img/202211241710941.png)



## 前端环境搭建

### Node.js 安装

#### Node.js 相关网址

[Node.js 官网](https://nodejs.org/en/)

[Node.js 下载地址](https://nodejs.org/dist/)



#### Node.js 下载&安装

> 无脑下一步即可

![image-20221103104455862](https://typora-oss.yixihan.chat//img/202211241710936.png)

> 安装完成

![image-20221103104602240](https://typora-oss.yixihan.chat//img/202211241710931.png)





#### 测试是否安装成功

![image-20221103104635248](https://typora-oss.yixihan.chat//img/202211241710966.png)

```shell
node -v
npm -v
```



#### 安装淘宝镜像 cnpm

![image-20221103104858917](https://typora-oss.yixihan.chat//img/202211241710960.png)

```shell
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

> 测试安装是否成功

![image-20221103105122303](https://typora-oss.yixihan.chat//img/202211241710972.png)

```shell
cnpm -v
```



### Vue.js 安装

#### 安装 Vue.js

![image-20221103105227349](https://typora-oss.yixihan.chat//img/202211241710311.png)

```shell
npm install vue -g
```



#### 安装 Webpack

![image-20221103105716190](https://typora-oss.yixihan.chat//img/202211241710318.png)

```shell
npm install webpack -g
npm install --global webpack-cli
```

> 测试是否安装成功

![image-20221103105734324](https://typora-oss.yixihan.chat//img/202211241710325.png)

```shell
webpack -v
```



#### 安装 Vue-cli

##### 3.0+ 版本安装 (推荐)

![image-20221103110048420](https://typora-oss.yixihan.chat//img/202211241710357.png)

```shell
npm install -g @vue/cli
```

> 测试是否安装成功

```shell
vue -V
```

> 卸载 3.0+ 版本 vue-cli

```shell
npm uninstall -g @vue/cli 
```



##### 2.0 版本安装 (不推荐)

```shell
npm install -g vue-cli 
```

> 测试是否安装成功

```shell
vue -V
```

> 卸载 2.0 版本 vue-cli

```shell
npm uninstall vue-cli -g
```



### Vue 项目创建

> ps : vue-cli 为 3.0+ 版本

#### 创建项目

![image-20221103112057572](https://typora-oss.yixihan.chat//img/202211241710351.png)

```shell
vue create [项目名]
```



#### 选择 Vue 版本

![image-20221103112127076](https://typora-oss.yixihan.chat//img/202211241710363.png)



#### 创建成功

![image-20221103112153158](https://typora-oss.yixihan.chat//img/202211241710670.png)

![image-20221103112211848](https://typora-oss.yixihan.chat//img/202211241710642.png)

#### 运行项目

![image-20221103112232205](https://typora-oss.yixihan.chat//img/202211241710679.png)

```shell
cd [项目名]
npm run serve
```

![image-20221103112259169](https://typora-oss.yixihan.chat//img/202211241710726.png)



#### 访问

![image-20221103112317973](https://typora-oss.yixihan.chat//img/202211241710748.png)



### Vue 自定义创建属性

#### 选择第三个

![image-20221103112439028](https://typora-oss.yixihan.chat//img/202211241710880.png)



#### 自定义项目所需的功能

![image-20221103112631860](https://typora-oss.yixihan.chat//img/202211241710004.png)

- Bable 基础编译器 ☑️
- TypeScirpt 使用TypeScript
- Progressive Web App(PWA) Support 渐进式web应用
- Router 路由管理器 ☑️
- Vuex 项目状态管理 ☑️
- Css Pre-processors Css预处理器 ☑️
- Linter / Formatter 代码风格检查和格式化 ☑️
- Unit Testing 单元测试
- E2E testing 端对端测试



#### 自定义 vue 版本

![image-20221103113443521](https://typora-oss.yixihan.chat//img/202211241710091.png)



#### 自定义模式 (history / hash)

![image-20221103112947019](https://typora-oss.yixihan.chat//img/202211241710089.png)



#### 自定义预处理器

![image-20221103113020258](https://typora-oss.yixihan.chat//img/202211241710189.png)

> ps : 根据自己喜好选择

- Sass/SCSS （with dart-sass）☑️
- Less
- Stylus



#### 自定义 eslink 模式

![image-20221103113120109](https://typora-oss.yixihan.chat//img/202211241710234.png)

> ps : 根据自己喜好选择

- ESLint with error prevention only ☑️
- ESLint + Airbnb config
- ESLint + Standard config
- ESLint + Prettier



#### 触发 eslink 机制

![image-20221103113223682](https://typora-oss.yixihan.chat//img/202211241710273.png)

- Lint on save 保存时检查 ☑️
- Lint and fix on commit 提交到远程时检查



#### 自定义 eslink 配置文件位置

![image-20221103113256479](https://typora-oss.yixihan.chat//img/202211241710394.png)

- In dedicated config files 配置文件放入独立文件中 ☑️
- In package Json 配置文件放入package.json中



#### 保存预设

![image-20221103113318355](https://typora-oss.yixihan.chat//img/202211241710392.png)



#### 设置预设名

![image-20221103113347692](https://typora-oss.yixihan.chat//img/202211241710443.png)



### vs code 安装

[vs code 官网](https://code.visualstudio.com/)

[vs code 下载地址](https://code.visualstudio.com/Download)



#### vs code 下载&安装

![image-20221103110402515](https://typora-oss.yixihan.chat//img/202211241710465.png)

![image-20221103110412218](https://typora-oss.yixihan.chat//img/202211241710551.png)



#### vs code 搭建前端环境

##### 安装如下插件

1. **Chinese（Simplified）language** 简体中文插件
2. **One Monokai Theme** 界面主题
3. **Settings Sync** 环境配置同步
4. **TODO Highlight** 待办高亮
5. **Open in Browser** 快速在浏览器打开
6. **Auto Rename Tag** 自动重命名配对的 `HTML / XML` 标记
7. **Auto Close Tag** 输入完整左标签后，结束标签将被自动插入
8. **CSS Peek** 追踪至样式表中 `CSS` 类和 `id` 定义的地方
9. **JavaScript (ES6) code snippets** 用于 `Vscode` 编辑器的 `ES6` 语法的 `JavaScript` 代码片段
10. **Vetur** `vue`开发必备, 可以格式化`.vue`文件, 由官方维护
11. **Vue 2 Snippets** 将 `Vue 2` 代码片段和语法突出显示添加到 `Visual Studio` 代码中
12. **WakaTime** 统计开发时间和效率
13. **ESLint** 代码规范
14. **Prettier** 目前 `Web` 开发中最受欢迎的代码格式化程序。它就能够自动应用 `Prettier`，并将整个 `JS` 和 `CSS` 文档快速格式化为统一的代码样式。
15. **Editor Config** 可以让团队开发时统一约定好一种规范，这个主流的编辑器都支持
16. **Markdown** 如果你经常使用 `Markdown` 的话，还可以使用安装`markdownlint` 和 `Markdown All in One` 这两个插件，前者可以约束编写的格式，后者提供方便的键盘快捷方式，目录，自动预览等
17. **npm Intellisense** 用于在导入语句中自动完成npm模块。
18. **Live Sass Compiler** 它可以将 `SASS /SCSS` 文件实时编译为 `CSS` 文件，并在浏览器中展示已编译样式的实时预览
19. **JavaScript Debugger** 通过这个插件，开发者可以直接在 `VS Code` 中进行以上测试和调试代码
20. **Beautify** 它同Prettier十分类似，是一种出色的代码格式化扩展插件。可以用它格式化以 `JavaScript`，`JSON`，`CSS`，`Sass` 和 `HTML`编写的代码。
21. **Live Server** 开启一个本地开发服务器，为静态网页和动态网页提供服务。使用编辑器中的 `go-live` 按钮，开发者可以立即把代码放到服务器上，该扩展插件还支持实时刷新页面
22. **Project Manager** 多项目管理。
23. **Auto Import** 自动导入包
24. **Bracket Pair Colorizer** 为代码中的首尾括号添上一抹亮色
25. **GitLens** 能增强 `Visual Studio` 代码中内置的 `Git` 功能
26. **Material Icon Theme** 对当前流行语言和后缀名进行单独匹配好看又丰富的图标
27. **vscode-element-helper** 一款针对 `Element` 的 `VSCode` 插件



#### vs code 自定义 vue 模板

> ctrl + p -> 搜索 vue.json

![image-20221103124846805](https://typora-oss.yixihan.chat//img/202211241710664.png)

> 添加如下代码

```json
{
    "Print to console": {
        "prefix": "vue",
        "body": [
            "<template>",
            "  <div>\n",
            "  </div>",
            "</template>\n",
            "<script>",
            "export default {",
            "  name: 'vueTemplate',",
            "  data() {",
            "    return {\n",
            "    }",
            "  },",
            "  methods: {\n",
            "  },",
            "  components: {\n",
            "  }",
            "}",
            "</script>\n",
            "<style scoped>\n",
            "</style>",
            "$2"
        ],
        "description": "创建一个自定义的vue组件代码块"
    }
}
```



## Go 环境搭建

[Go 官网](https://go.dev/)

[Go 下载](https://go.dev/)

[Go 下载官方镜像](https://golang.google.cn/dl/)

[Go 指南](https://tour.go-zh.org/welcome/1)

> ps : win 建议下载可执行文件版 (*.msi)



### Go 下载&安装

> 无脑下一步即可

![image-20221103134447935](https://typora-oss.yixihan.chat//img/202211241710702.png)

> 安装完成

![image-20221103134558631](https://typora-oss.yixihan.chat//img/202211241710722.png)

> 检测是否安装成功

![image-20221103135218732](https://typora-oss.yixihan.chat//img/202211241710726.png)

```shell
go version
```



### 配置环境变量

修改 GOPROXY

```shell
go env -w GOPROXY=https://goproxy.cn,direct
```





## c (win) 环境搭建

[教程](https://discourse.gohugo.io/t/gcc-compiler-required-to-build-hugo-from-source-on-windows/41370)
