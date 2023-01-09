---
title: linux编程环境搭建
date: 2023-01-02
sidebar: 'auto'
sticky: 4
categories:
- 编程环境搭建
tags:
- Java
- Go
- NodeJS
- C
- C++
- Python
- Docker
- Redis
- Nginx
- Git
- RabbitMQ
- Nacos
- Jenkins
- 环境搭建
---


# Linux 开发环境搭建指南

> 前言

本指南所用环境为腾讯云服务器, 操作系统为 `OpenCloudOS`

[腾讯云官网](https://cloud.tencent.com/)

[Debian官网](https://www.debian.org/)

[OpenCloudOS官网](https://www.opencloudos.org/)



## 基础环境设置

### 关闭默认防火墙

Linux 防火墙有多种, 自带的可能是 `ufw` / `iptables` / `Firewall`

若使用的是服务器, 且平台提供防火墙安全组, 可关闭服务器的防火墙, 若没有, 建议保持开启

```shell
# ufw
ufw disable

# Firewall
systemctl disable firewalld

# 关闭防火墙
service iptables stop
```



#### 拓展

> Firewall

```shell
# 查看端口列表
firewall-cmd --permanent --list-port
# 开启端口 永久
firewall-cmd --permanent --zone=public --add-port=8080/tcp
# 开启端口 临时
firewall-cmd --zone=public --add-port=8080/tcp
# 关闭端口 永久
firewall-cmd --permanent --zone=public --remove-port=80/tcp 
# 开启防火墙
systemctl start firewalld.service
# 重启防火墙
systemctl restart firewalld.service

service firewalld restart
firewall-cmd --reload
# 关闭防火墙
systemctl stop firewalld.service
# 查看状态
systemctl status firewalld.service
firewall-cmd --state
# 开机禁用防火墙
systemctl disable firewalld
# 开机启用防火墙
systemctl enable firewalld
```



> ufw

```shell
# 开启端口
ufw allow 22/tcp
ufw allow 22/udp
# 同时开启tcp与udp端口
ufw allow 22
# 删除端口
ufw delete allow 8888
# 开启防火墙
ufw enable
# 关闭防火墙
ufw disable
# 查看状态(也可查看开放的端口列表)
ufw status
```



> iptables

```shell
# 增加一条规则到最后
iptables -A INPUT -i eth0 -p tcp --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT
# 添加一条规则到指定位置
iptables -I INPUT 2 -i eth0 -p tcp --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT 
# 删除一条规则
iptabels -D INPUT 2 
# 修改一条规则
iptables -R INPUT 3 -i eth0 -p tcp --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT
# 删除 iptables 现有规则
iptables –F 
# 查看 iptables 规则
iptables –L(iptables –L –v -n)
# 开启防火墙
service iptables start
# 关闭防火墙
service iptables stop
# 重启防火墙
service iptables restart
# 查看状态(也可查看开放的端口列表)
service iptables status
# 保存 iptables 配置
service iptables save

# Iptables 服务配置文件
/etc/sysconfig/iptables-config
# Iptables 规则保存文件
/etc/sysconfig/iptables
```



### 修改 ssh 登录端口号

> 修改端口号

```shell
vim /etc/ssh/sshd_config
```

![image-20221229194444280](https://typora-oss.yixihan.chat//img/202301051040650.png)



> 重启ssh服务

```shell
systemctl restart sshd

# 不行则试试下面的命令
/etc/init.d/sshd restart
/etc/init.d/ssh restart
```

![image-20221229195218687](https://typora-oss.yixihan.chat//img/202301051040639.png)

没有报错就是生效



### 安装所有开发工具

```shell
# dnf 安装
dnf -y group install "Development Tools"
```





## JDK安装

[Oracle-JDK-官网](https://www.oracle.com/sg/java/)

[Oracle-JDK-下载地址]([Java Downloads | Oracle](https://www.oracle.com/java/technologies/downloads/))

[Oracle-JDK8-下载地址](https://www.oracle.com/java/technologies/javase/javase8u211-later-archive-downloads.html)




> tips

**本教程JDK 安装采用 rpm 方式, 无需配置环境变量**




### 卸载默认 JDK

```shell
# 检测有无默认 JDK
java -version

# 有则卸载
rpm -qa|grep jdk
# xxx => 检测出来的jdk名称
rpm -e --nodeps xxx
```



### 安装 JDK

```shell
rpm -ivh jdk-8u291-linux-x64.rpm
```



### 配置环境变量

```shell
# 安装完成后配置环境变量 文件：/etc/profile
vim /etc/profile
JAVA_HOME=jdk安装位置
CLASSPATH=%JAVA_HOME%/lib:%JAVA_HOME%/jre/lib
PATH=$PATH:$JAVA_HOME/bin:$JAVA_HOME/jre/bin
export PATH CLASSPATH JAVA_HOME

# 保存退出
# 让新增的环境变量生效！
source /etc/profile
```





> 安装 jdk

![image-20230101211124947](https://typora-oss.yixihan.chat//img/202301051040628.png)



> 检测 jdk

![image-20230101211143753](https://typora-oss.yixihan.chat//img/202301051040638.png)



### Docker JDK 构建

#### Dockerfile

```shell
# 基础镜像为 centos
FROM centos
# 维护者 
MAINTAINER yixihan
# 将jdk压缩包添加到容器的 /root 目录，解压后目录名称为jdk1.8.0_211
ADD jdk-8u291-linux-x64.tar.gz /root
# 配置JAVA_HOME环境变量
ENV JAVA_HOME /root/jdk1.8.0_291/
# 将JAVA_HOME/bin 添加至PATH环境变量
ENV PATH $JAVA_HOME/bin:$PATH
# 启动容器执行的命令，仅用于验证安装配置是否正确，生产环境使用需注释后再build
ENTRYPOINT ["java","-version"]
```



## Maven 安装

### 解压

```shell
tar -zxvf apache-maven-3.8.7-bin.tar.gz
mv apache-maven-3.8.7 /opt/
cd /opt/apache-maven-3.8.7/
```



### 配置配置文件

修改配置文件 `settings.xml`

```shell
vim conf/settings.xml
```



> 修改镜像

```xml
<!-- 阿里云maven镜像 -->
<mirror>
    <id>aliyunmaven</id>
    <mirrorOf>*</mirrorOf>
    <name>阿里云公共仓库</name>
    <url>https://maven.aliyun.com/repository/public</url>
</mirror>

```



> 添加仓库

创建文件 `maven-repo`

```xml
<localRepository>/opt/apache-maven-3.8.7/maven-repo</localRepository>
```



### 配置环境变量

```shell
vim /etc/profile

# Maven 环境配置
export PATH=${PATH}:/opt/apache-maven-3.8.7/bin

# 保存
source /etc/profile
```



### 测试是否安装成功

```shell
mvn --version
```

![image-20230106151144731](https://typora-oss.yixihan.chat//img/202301061511836.png)



## GCC & G++ 安装

```shell
# yum 安装
yum -y install gcc
yum -y install gcc-c++
# dnf 安装
dnf -y install gcc-c++ gcc
# apt 安装
```



### 验证是否安装成功

```shell
# 检查版本
gcc -v
g++ -v
```



> 验证是否安装成功

![image-20230101215019551](https://typora-oss.yixihan.chat//img/202301051040637.png)



## Python 3.x 安装

[Python 官网](https://www.python.org/)

[Python 下载地址](https://www.python.org/downloads/)

[Python 文档](https://www.python.org/doc/)



> tips

**本教程采用源码编译安装, 需下载Python-3.x.x.tgz**



### 解压

```shell
tar -zxvf Python-3.10.0.tgz
mv Python-3.10.0 /opt/Python-3.10.0
cd /opt/Python-3.10.0/
```



### 安装模块

```shell
yum install bzip2-devel 
dnf instal bzip2-devel 
```



### 编译安装

```shell
# 默认方式
./configure
# 如果您想要一个所有稳定优化都处于活动状态的发布版本（PGO等）
./configure --enable-optimizations

# 编译&安装
make && make install
```



### 检测是否安装成功

```shell
# 检测安装是否成功
python3 -V
```



> 检测安装是否成功

![image-20230101223958629](https://typora-oss.yixihan.chat//img/202301051040635.png)



### 软件包管理器安装 Python

**通过包管理器安装的py版本一般不太高,需要高版本的建议自己编译安装**

```shell
# dnf
dnf install python3
```





## GoLang 安装

[Go-官网](https://go.dev/)

[Go-下载地址-官网](https://golang.org/dl/)

[Go-下载地址-Google镜像](https://golang.google.cn/dl/)

[Go-文档](https://go.dev/doc/effective_go)



> tips

**下载 go[版本号].linux-amd64.tar.gz**



### 解压

```shell
tar -zxvf go1.18.2.linux-amd64.tar.gz
mv go /opt/go
cd /opt/go
```



### 编辑环境变量

```shell
vim /etc/profile

# go 环境配置
export PATH=$PATH:/opt/go/bin

# 保存
source /etc/profile
```



### 检测是否安装成功

```shell
go version
```



> 检测安装是否成功

![image-20230101224521675](https://typora-oss.yixihan.chat//img/202301051040979.png)



## NodeJS 安装

[NodeJS-官网](https://nodejs.org/zh-cn/)

[NodeJS-下载地址](https://nodejs.org/zh-cn/download/)

[NodeJS-文档](https://nodejs.org/zh-cn/docs/)



> tips

本教程采用源码编译安装

其余安装方法见此处 [菜鸟教程-Node.js 安装配置](https://www.runoob.com/nodejs/nodejs-install-setup.html)



### 解压

```shell
tar -zxvf node-v16.19.0.tar.gz
mv node-v16.19.0 /opt/node-v16.19.0
cd /opt/node-v16.19.0
```



### 编译安装

```shell
./configure --prefix=/usr/local/node/16.19.0
make & make install
```



> ModuleNotFoundError: No module named '_bz2'

```shell
yum install bzip2-devel 
dnf instal bzip2-devel 

# 重新构建 python
/opt/Python-3.10.0
./configure && make && make install
```





### 配置环境变量

```shell
vim /etc/profile

# node 环境变量配置
export NODE_HOME=/usr/local/node/16.19.0
export PATH=$NODE_HOME/bin:$PATH

# 保存
source /etc/profile
```



### 检测是否安装成功

```shell
node -v
```



> 检测是否安装成功

![image-20230102011049056](https://typora-oss.yixihan.chat//img/202301051040016.png)



## Git 安装

```shell
# dnf
dnf install git-core

# yum
yum install curl-devel expat-devel gettext-devel \
  openssl-devel zlib-devel
yum -y install git-core
```



### 检测是否安装成功

> 检测是否安装成功

![image-20230102002249814](https://typora-oss.yixihan.chat//img/202301051040995.png)



### 配置用户名密码

```shell
git config --global user.name yixihan
git config --global user.email yixihan20010617@gmail.com
git config --global --list
```

![image-20230107093611696](https://typora-oss.yixihan.chat//img/202301070936801.png)



### 配置 ssh

```shell
ssh-keygen -t rsa
```

![image-20230107093619393](https://typora-oss.yixihan.chat//img/202301070936469.png)



### 添加 ssh

```shell
cat ~/.ssh/id_rsa.pub
```





## Docker 安装
> tips

**本教程使用 CentOS7 及以上版本**



> 相关网址

[Docker 官网安装手册](https://docs.docker.com/engine/install/)

[Docker 官方文档](https://docs.docker.com/)

[Docker 官网](https://www.docker.com/)



### 检测操作系统版本

**CentOS7 / CentOS8 / 基于 CentOS 的其他 Linux 发行版理论上都可以使用本教程**

```shell
cat /etc/redhat-release
```



> 检测

![image-20230101212420151](https://typora-oss.yixihan.chat//img/202301051040009.png)



### 安装 GCC

> tips

**需要 yum, 且可以联网**

```shell
yum -y install gcc
yum -y install gcc-c++
```



### 卸载旧版本

```shell
yum -y remove docker docker-common docker-selinux docker-engine
# 官网版本
yum remove docker \
docker-client \
docker-client-latest \
docker-common \
docker-latest \
docker-latest-logrotate \
docker-logrotate \
docker-engine 
```



### 安装需要的软件包

```shell
# 正确推荐使用国内的
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
dnf config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```



### 更新yum软件包索引

```shell
# CentOS 7
yum makecache fast
# CentOS 8
dnf makecache
```



### 安装Docker CE

```shell
yum -y install docker-ce docker-ce-cli containerd.io

dnf install docker-ce docker-ce-cli containerd.io --allowerasing
```



### 启动docker

```shell
systemctl start docker

# 设置 docker 开机自启
systemctl enable docker
```



### 测试

```shell
# 获取 docker 版本
docker version

# 运行 docker 容器
docker run hello-world

# 查看 docker 镜像列表
docker images
```



> 获取 docker 版本

![image-20230101213142129](https://typora-oss.yixihan.chat//img/202301051040040.png)



> 运行 docker 容器

![image-20230101213217221](https://typora-oss.yixihan.chat//img/202301051040042.png)



> 查看 docker 镜像列表

![image-20230101213231882](https://typora-oss.yixihan.chat//img/202301051040303.png)



### 配置镜像加速

镜像加速有许多平台可以选择, 随便选一个即可

- 科大镜像：**https://docker.mirrors.ustc.edu.cn/**
- 网易：**https://hub-mirror.c.163.com/**
- 阿里云：**https://<你的ID>.mirror.aliyuncs.com**
- 七牛云加速器：**https://reg-mirror.qiniu.com**

[阿里云镜像获取地址](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)，登录后，左侧菜单选中镜像加速器就可以看到你的专属地址了
![image-20230101213833745](https://typora-oss.yixihan.chat//img/202301051040247.png)



```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://<你的ID>.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```



### 卸载

```shell
# 关闭 docker
systemctl stop docker

# yum 卸载 docker
yum -y remove docker-ce

# 删除 docker 残留文件
rm -rf /var/lib/docker
```



## Redis 安装

### 解压缩

```shell
tar -zxvf redis-6.2.5.tar.gz
mv redis-6.2.5 /opt/redis-6.2.5
cd /opt/redis-6.2.5
```



### 安装 gcc

> tips

Redis 6.x 需要 gcc 版本大于4.9



#### GCC 版本检查

```shell
gcc -v
g++ -v
```



> 版本检查

![image-20230101215019551](https://typora-oss.yixihan.chat//img/202301051040347.png)



#### CentOS 7 安装教程

```shell
#安装gcc
yum install gcc-c++

#redis6.x版本需要升级gcc
#升级gcc
yum -y install centos-release-scl

yum -y install devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils scl enable devtoolset-9 bash

#修改环境变量
echo "source /opt/rh/devtoolset-9/enable" >> /etc/profile

#查看gcc版本
gcc -v
```



#### CentOS 8 安装教程

```shell
# 安装所有开发工具
dnf -y group install "Development Tools"

# 仅安装 gcc
dnf -y install gcc-c++ gcc make
```



### 安装redis

> tips

redis默认安装路径`/usr/local/bin`



```shell
make
make install
```



### 拷贝redis.config文件

```shell
cd /usr/local/bin/
mkdir yconfig
cp /opt/redis-6.2.5/redis.conf yconfig
cd yconfig/
```



### 修改redis配置文件

```shell
vim redis.conf

# daemonize no 改为 yes
daemonize yes

# 修改 Redis 启动端口
port port
pidfile /var/run/redis_port.pid

# 增加登录密码
requirepass your_password
```



### 启动redis

```shell
redis-server yconfig/redis.conf
redis-cli -p port
```



### 设置防火墙

开放Linux防火墙对应端口或服务器安全组对应端口



### reids 详细配置

```shell
#是否在后台执行，yes：后台运行；no：不是后台运行
daemonize yes
 
#是否开启保护模式，默认开启。要是配置里没有指定bind和密码。开启该参数后，redis只会本地进行访问，拒绝外部访问。
protected-mode yes
  
#redis的进程文件
pidfile /var/run/redis/redis-server.pid

#redis监听的端口号。
port 6379
  
#此参数确定了TCP连接中已完成队列(完成三次握手之后)的长度， 当然此值必须不大于Linux系统定义的/proc/sys/net/core/somaxconn值，默认是511，而Linux的默认参数值是128。当系统并发量大并且客户端速度缓慢的时候，可以将这二个参数一起参考设定。该内核参数默认值一般是128，对于负载很大的服务程序来说大大的不够。一般会将它修改为2048或者更大。在/etc/sysctl.conf中添加:net.core.somaxconn = 2048，然后在终端中执行sysctl -p。
tcp-backlog 511
 
#指定 redis 只接收来自于该 IP 地址的请求，如果不进行设置，那么将处理所有请求
#bind 127.0.0.1
bind 0.0.0.0
 
#配置unix socket来让redis支持监听本地连接。
# unixsocket /var/run/redis/redis.sock
 
#配置unix socket使用文件的权限
# unixsocketperm 700
 
# 此参数为设置客户端空闲超过timeout，服务端会断开连接，为0则服务端不会主动断开连接，不能小于0。
timeout 0
 
#tcp keepalive参数。如果设置不为0，就使用配置tcp的SO_KEEPALIVE值，使用keepalive有两个好处:检测挂掉的对端。降低中间设备出问题而导致网络看似连接却已经与对端端口的问题。在Linux内核中，设置了keepalive，redis会定时给对端发送ack。检测到对端关闭需要两倍的设置值。
tcp-keepalive 0

#指定了服务端日志的级别。级别包括：debug（很多信息，方便开发、测试），verbose（许多有用的信息，但是没有debug级别信息多），notice（适当的日志级别，适合生产环境），warn（只有非常重要的信息）
loglevel notice

#指定了记录日志的文件。空字符串的话，日志会打印到标准输出设备。后台运行的redis标准输出是/dev/null。
logfile /var/log/redis/redis-server.log
 
#是否打开记录syslog功能
# syslog-enabled no
 
#syslog的标识符。
# syslog-ident redis
 
#日志的来源、设备
# syslog-facility local0

#数据库的数量，默认使用的数据库是DB 0。可以通过SELECT命令选择一个db
databases 16
 
# redis是基于内存的数据库，可以通过设置该值定期写入磁盘。
# 注释掉“save”这一行配置项就可以让保存数据库功能失效
# 900秒（15分钟）内至少1个key值改变（则进行数据库保存--持久化） 
# 300秒（5分钟）内至少10个key值改变（则进行数据库保存--持久化） 
# 60秒（1分钟）内至少10000个key值改变（则进行数据库保存--持久化）
save 900 1
save 300 10
save 60 10000

#当RDB持久化出现错误后，是否依然进行继续进行工作，yes：不能进行工作，no：可以继续进行工作，可以通过info中的rdb_last_bgsave_status了解RDB持久化是否有错误
stop-writes-on-bgsave-error yes
 
#使用压缩rdb文件，rdb文件压缩使用LZF压缩算法，yes：压缩，但是需要一些cpu的消耗。no：不压缩，需要更多的磁盘空间
rdbcompression yes
 
#是否校验rdb文件。从rdb格式的第五个版本开始，在rdb文件的末尾会带上CRC64的校验和。这跟有利于文件的容错性，但是在保存rdb文件的时候，会有大概10%的性能损耗，所以如果你追求高性能，可以关闭该配置。
rdbchecksum yes
 
#rdb文件的名称
dbfilename dump.rdb
#数据目录，数据库的写入会在这个目录。rdb、aof文件也会写在这个目录
dir /var/lib/redis
 
 
############### 主从复制 ###############

#复制选项，slave复制对应的master。
# slaveof <masterip> <masterport>
 
#如果master设置了requirepass，那么slave要连上master，需要有master的密码才行。masterauth就是用来配置master的密码，这样可以在连上master后进行认证。
# masterauth <master-password>
 
#当从库同主机失去连接或者复制正在进行，从机库有两种运行方式：1) 如果slave-serve-stale-data设置为yes(默认设置)，从库会继续响应客户端的请求。2) 如果slave-serve-stale-data设置为no，除去INFO和SLAVOF命令之外的任何请求都会返回一个错误”SYNC with master in progress”。
slave-serve-stale-data yes
 
#作为从服务器，默认情况下是只读的（yes），可以修改成NO，用于写（不建议）。
slave-read-only yes
 
#是否使用socket方式复制数据。目前redis复制提供两种方式，disk和socket。如果新的slave连上来或者重连的slave无法部分同步，就会执行全量同步，master会生成rdb文件。有2种方式：disk方式是master创建一个新的进程把rdb文件保存到磁盘，再把磁盘上的rdb文件传递给slave。socket是master创建一个新的进程，直接把rdb文件以socket的方式发给slave。disk方式的时候，当一个rdb保存的过程中，多个slave都能共享这个rdb文件。socket的方式就的一个个slave顺序复制。在磁盘速度缓慢，网速快的情况下推荐用socket方式。
repl-diskless-sync no
 
#diskless复制的延迟时间，防止设置为0。一旦复制开始，节点不会再接收新slave的复制请求直到下一个rdb传输。所以最好等待一段时间，等更多的slave连上来。
repl-diskless-sync-delay 5
 
#slave根据指定的时间间隔向服务器发送ping请求。时间间隔可以通过 repl_ping_slave_period 来设置，默认10秒。
# repl-ping-slave-period 10
 
#复制连接超时时间。master和slave都有超时时间的设置。master检测到slave上次发送的时间超过repl-timeout，即认为slave离线，清除该slave信息。slave检测到上次和master交互的时间超过repl-timeout，则认为master离线。需要注意的是repl-timeout需要设置一个比repl-ping-slave-period更大的值，不然会经常检测到超时。
# repl-timeout 60
 
#是否禁止复制tcp链接的tcp nodelay参数，可传递yes或者no。默认是no，即使用tcp nodelay。如果master设置了yes来禁止tcp nodelay设置，在把数据复制给slave的时候，会减少包的数量和更小的网络带宽。但是这也可能带来数据的延迟。默认我们推荐更小的延迟，但是在数据量传输很大的场景下，建议选择yes。
repl-disable-tcp-nodelay no
 
#复制缓冲区大小，这是一个环形复制缓冲区，用来保存最新复制的命令。这样在slave离线的时候，不需要完全复制master的数据，如果可以执行部分同步，只需要把缓冲区的部分数据复制给slave，就能恢复正常复制状态。缓冲区的大小越大，slave离线的时间可以更长，复制缓冲区只有在有slave连接的时候才分配内存。没有slave的一段时间，内存会被释放出来，默认1m。
# repl-backlog-size 5mb
 
#master没有slave一段时间会释放复制缓冲区的内存，repl-backlog-ttl用来设置该时间长度。单位为秒。
# repl-backlog-ttl 3600
 
#当master不可用，Sentinel会根据slave的优先级选举一个master。最低的优先级的slave，当选master。而配置成0，永远不会被选举。
slave-priority 100
#redis提供了可以让master停止写入的方式，如果配置了min-slaves-to-write，健康的slave的个数小于N，mater就禁止写入。master最少得有多少个健康的slave存活才能执行写命令。这个配置虽然不能保证N个slave都一定能接收到master的写操作，但是能避免没有足够健康的slave的时候，master不能写入来避免数据丢失。设置为0是关闭该功能。
# min-slaves-to-write 3
 
#延迟小于min-slaves-max-lag秒的slave才认为是健康的slave。
# min-slaves-max-lag 10
 
# 设置1或另一个设置为0禁用这个特性。
# Setting one or the other to 0 disables the feature.
# By default min-slaves-to-write is set to 0 (feature disabled) and
# min-slaves-max-lag is set to 10.
 
 
############### 安全相关 ###############
 
#requirepass配置可以让用户使用AUTH命令来认证密码，才能使用其他命令。这让redis可以使用在不受信任的网络中。为了保持向后的兼容性，可以注释该命令，因为大部分用户也不需要认证。使用requirepass的时候需要注意，因为redis太快了，每秒可以认证15w次密码，简单的密码很容易被攻破，所以最好使用一个更复杂的密码。注意只有密码没有用户名。
# requirepass foobared
 
#把危险的命令给修改成其他名称。比如CONFIG命令可以重命名为一个很难被猜到的命令，这样用户不能使用，而内部工具还能接着使用。
# rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52
 
#设置成一个空的值，可以禁止一个命令
# rename-command CONFIG ""
 
 
############### 进程限制相关 ###############
 
# 设置能连上redis的最大客户端连接数量。默认是10000个客户端连接。由于redis不区分连接是客户端连接还是内部打开文件或者和slave连接等，所以maxclients最小建议设置到32。如果超过了maxclients，redis会给新的连接发送’max number of clients reached’，并关闭连接。
# maxclients 10000
 
#redis配置的最大内存容量。当内存满了，需要配合maxmemory-policy策略进行处理。注意slave的输出缓冲区是不计算在maxmemory内的。所以为了防止主机内存使用完，建议设置的maxmemory需要更小一些。
# maxmemory <bytes>
 
#内存容量超过maxmemory后的处理策略。
#volatile-lru：利用LRU算法移除设置过过期时间的key。
#volatile-random：随机移除设置过过期时间的key。
#volatile-ttl：移除即将过期的key，根据最近过期时间来删除（辅以TTL）
#allkeys-lru：利用LRU算法移除任何key。
#allkeys-random：随机移除任何key。
#noeviction：不移除任何key，只是返回一个写错误。
#上面的这些驱逐策略，如果redis没有合适的key驱逐，对于写命令，还是会返回错误。redis将不再接收写请求，只接收get请求。写命令包括：set setnx setex append incr decr rpush lpush rpushx lpushx linsert lset rpoplpush sadd sinter sinterstore sunion sunionstore sdiff sdiffstore zadd zincrby zunionstore zinterstore hset hsetnx hmset hincrby incrby decrby getset mset msetnx exec sort。
# maxmemory-policy noeviction
 
#lru检测的样本数。使用lru或者ttl淘汰算法，从需要淘汰的列表中随机选择sample个key，选出闲置时间最长的key移除。
# maxmemory-samples 5
 
 
############### APPEND ONLY 持久化方式 ###############
 
#默认redis使用的是rdb方式持久化，这种方式在许多应用中已经足够用了。但是redis如果中途宕机，会导致可能有几分钟的数据丢失，根据save来策略进行持久化，Append Only File是另一种持久化方式，可以提供更好的持久化特性。Redis会把每次写入的数据在接收后都写入 appendonly.aof 文件，每次启动时Redis都会先把这个文件的数据读入内存里，先忽略RDB文件。
appendonly no
 
#aof文件名
appendfilename "appendonly.aof"
 
#aof持久化策略的配置
#no表示不执行fsync，由操作系统保证数据同步到磁盘，速度最快。
#always表示每次写入都执行fsync，以保证数据同步到磁盘。
#everysec表示每秒执行一次fsync，可能会导致丢失这1s数据。
appendfsync everysec
 
# 在aof重写或者写入rdb文件的时候，会执行大量IO，此时对于everysec和always的aof模式来说，执行fsync会造成阻塞过长时间，no-appendfsync-on-rewrite字段设置为默认设置为no。如果对延迟要求很高的应用，这个字段可以设置为yes，否则还是设置为no，这样对持久化特性来说这是更安全的选择。设置为yes表示rewrite期间对新写操作不fsync,暂时存在内存中,等rewrite完成后再写入，默认为no，建议yes。Linux的默认fsync策略是30秒。可能丢失30秒数据。
no-appendfsync-on-rewrite no
 
#aof自动重写配置。当目前aof文件大小超过上一次重写的aof文件大小的百分之多少进行重写，即当aof文件增长到一定大小的时候Redis能够调用bgrewriteaof对日志文件进行重写。当前AOF文件大小是上次日志重写得到AOF文件大小的二倍（设置为100）时，自动启动新的日志重写过程。
auto-aof-rewrite-percentage 100
#设置允许重写的最小aof文件大小，避免了达到约定百分比但尺寸仍然很小的情况还要重写
auto-aof-rewrite-min-size 64mb 

#aof文件可能在尾部是不完整的，当redis启动的时候，aof文件的数据被载入内存。重启可能发生在redis所在的主机操作系统宕机后，尤其在ext4文件系统没有加上data=ordered选项（redis宕机或者异常终止不会造成尾部不完整现象。）出现这种现象，可以选择让redis退出，或者导入尽可能多的数据。如果选择的是yes，当截断的aof文件被导入的时候，会自动发布一个log给客户端然后load。如果是no，用户必须手动redis-check-aof修复AOF文件才可以。
aof-load-truncated yes
 
 
############### LUA SCRIPTING ###############
 
# 如果达到最大时间限制（毫秒），redis会记个log，然后返回error。当一个脚本超过了最大时限。只有SCRIPT KILL和SHUTDOWN NOSAVE可以用。第一个可以杀没有调write命令的东西。要是已经调用了write，只能用第二个命令杀。
lua-time-limit 5000
 
 
############### 集群相关 ###############
 
#集群开关，默认是不开启集群模式。
# cluster-enabled yes

#集群配置文件的名称，每个节点都有一个集群相关的配置文件，持久化保存集群的信息。这个文件并不需要手动配置，这个配置文件有Redis生成并更新，每个Redis集群节点需要一个单独的配置文件，请确保与实例运行的系统中配置文件名称不冲突
# cluster-config-file nodes-6379.conf
 
#节点互连超时的阀值。集群节点超时毫秒数
# cluster-node-timeout 15000
 
#在进行故障转移的时候，全部slave都会请求申请为master，但是有些slave可能与master断开连接一段时间了，导致数据过于陈旧，这样的slave不应该被提升为master。该参数就是用来判断slave节点与master断线的时间是否过长。判断方法是：
203 #比较slave断开连接的时间和(node-timeout * slave-validity-factor) + repl-ping-slave-period
204 #如果节点超时时间为三十秒, 并且slave-validity-factor为10,假设默认的repl-ping-slave-period是10秒，即如果超过310秒slave将不会尝试进行故障转移 
# cluster-slave-validity-factor 10
 
#master的slave数量大于该值，slave才能迁移到其他孤立master上，如这个参数若被设为2，那么只有当一个主节点拥有2 个可工作的从节点时，它的一个从节点会尝试迁移。
# cluster-migration-barrier 1
 
#默认情况下，集群全部的slot有节点负责，集群状态才为ok，才能提供服务。设置为no，可以在slot没有全部分配的时候提供服务。不建议打开该配置，这样会造成分区的时候，小分区的master一直在接受写请求，而造成很长时间数据不一致。
 
 
############### SLOW LOG 慢查询日志 ###############
 
###slog log是用来记录redis运行中执行比较慢的命令耗时。当命令的执行超过了指定时间，就记录在slow log中，slog log保存在内存中，所以没有IO操作。
#执行时间比slowlog-log-slower-than大的请求记录到slowlog里面，单位是微秒，所以1000000就是1秒。注意，负数时间会禁用慢查询日志，而0则会强制记录所有命令。
slowlog-log-slower-than 10000
 
#慢查询日志长度。当一个新的命令被写进日志的时候，最老的那个记录会被删掉。这个长度没有限制。只要有足够的内存就行。你可以通过 SLOWLOG RESET 来释放内存。
slowlog-max-len 128
 
############### 延迟监控 ###############
#延迟监控功能是用来监控redis中执行比较缓慢的一些操作，用LATENCY打印redis实例在跑命令时的耗时图表。只记录大于等于下边设置的值的操作。0的话，就是关闭监视。默认延迟监控功能是关闭的，如果你需要打开，也可以通过CONFIG SET命令动态设置。
latency-monitor-threshold 0
 
############### EVENT NOTIFICATION 订阅通知 ###############
#键空间通知使得客户端可以通过订阅频道或模式，来接收那些以某种方式改动了 Redis 数据集的事件。因为开启键空间通知功能需要消耗一些 CPU ，所以在默认配置下，该功能处于关闭状态。
#notify-keyspace-events 的参数可以是以下字符的任意组合，它指定了服务器该发送哪些类型的通知：
##K 键空间通知，所有通知以 __keyspace@__ 为前缀
##E 键事件通知，所有通知以 __keyevent@__ 为前缀
##g DEL 、 EXPIRE 、 RENAME 等类型无关的通用命令的通知
##$ 字符串命令的通知
##l 列表命令的通知
##s 集合命令的通知
##h 哈希命令的通知
##z 有序集合命令的通知
##x 过期事件：每当有过期键被删除时发送
##e 驱逐(evict)事件：每当有键因为 maxmemory 政策而被删除时发送
##A 参数 g$lshzxe 的别名
#输入的参数中至少要有一个 K 或者 E，否则的话，不管其余的参数是什么，都不会有任何 通知被分发。详细使用可以参考http://redis.io/topics/notifications
notify-keyspace-events ""
 
############### ADVANCED CONFIG 高级配置 ###############
#数据量小于等于hash-max-ziplist-entries的用ziplist，大于hash-max-ziplist-entries用hash
hash-max-ziplist-entries 512
#value大小小于等于hash-max-ziplist-value的用ziplist，大于hash-max-ziplist-value用hash。
hash-max-ziplist-value 64
 
#数据量小于等于list-max-ziplist-entries用ziplist，大于list-max-ziplist-entries用list。
list-max-ziplist-entries 512
#value大小小于等于list-max-ziplist-value的用ziplist，大于list-max-ziplist-value用list。
list-max-ziplist-value 64
 
#数据量小于等于set-max-intset-entries用iniset，大于set-max-intset-entries用set。
set-max-intset-entries 512
 
#数据量小于等于zset-max-ziplist-entries用ziplist，大于zset-max-ziplist-entries用zset。
zset-max-ziplist-entries 128
#value大小小于等于zset-max-ziplist-value用ziplist，大于zset-max-ziplist-value用zset。
zset-max-ziplist-value 64
 
#value大小小于等于hll-sparse-max-bytes使用稀疏数据结构（sparse），大于hll-sparse-max-bytes使用稠密的数据结构（dense）。一个比16000大的value是几乎没用的，建议的value大概为3000。如果对CPU要求不高，对空间要求较高的，建议设置到10000左右。
hll-sparse-max-bytes 3000
 
#Redis将在每100毫秒时使用1毫秒的CPU时间来对redis的hash表进行重新hash，可以降低内存的使用。当你的使用场景中，有非常严格的实时性需要，不能够接受Redis时不时的对请求有2毫秒的延迟的话，把这项配置为no。如果没有这么严格的实时性要求，可以设置为yes，以便能够尽可能快的释放内存。
activerehashing yes
 
##对客户端输出缓冲进行限制可以强迫那些不从服务器读取数据的客户端断开连接，用来强制关闭传输缓慢的客户端。
#对于normal client，第一个0表示取消hard limit，第二个0和第三个0表示取消soft limit，normal client默认取消限制，因为如果没有寻问，他们是不会接收数据的。
client-output-buffer-limit normal 0 0 0
#对于slave client和MONITER client，如果client-output-buffer一旦超过256mb，又或者超过64mb持续60秒，那么服务器就会立即断开客户端连接。
client-output-buffer-limit slave 256mb 64mb 60
#对于pubsub client，如果client-output-buffer一旦超过32mb，又或者超过8mb持续60秒，那么服务器就会立即断开客户端连接。
client-output-buffer-limit pubsub 32mb 8mb 60
 
#redis执行任务的频率为1s除以hz。
hz 10
 
#在aof重写的时候，如果打开了aof-rewrite-incremental-fsync开关，系统会每32MB执行一次fsync。这对于把文件写入磁盘是有帮助的，可以避免过大的延迟峰值。
aof-rewrite-incremental-fsync yes
```



## Docker 搭建 Redis 集群

### 创建 redis 网卡

```shell
docker network create redis --subnet 172.38.0.0/16
```



> tips

如果报这个错, 是因为重启过防火墙的原因, 重启 `docker` 即可

![image-20230106145119231](https://typora-oss.yixihan.chat//img/202301061451319.png)



> 查看创建的网卡

```shell
docker network ls
```

![image-20230106145204425](https://typora-oss.yixihan.chat//img/202301061452490.png)



### 创建redis服务

> tips

`requirepass your_password` 可选, 为设置密码所用

```shell
for port in $(seq 1 6);
do
mkdir -p /mydata/redis/node-${port}/conf
touch /mydata/redis/node-${port}/conf/redis.conf
cat << EOF >>/mydata/redis/node-${port}/conf/redis.conf
port 6379
bind 0.0.0.0
cluster-enabled yes
cluster-config-file nodes.conf
cluster-announce-ip 172.38.0.1${port}
cluster-announce-port 6379
cluster-announce-bus-port 16379
requirepass your_password
appendonly yes
EOF
done
```



### 启动 redis 容器

```shell
for port in $(seq 1 6);
do
docker run -p 637${port}:6379 -p 1637${port}:16379 --name redis-${port} \
-v /mydata/redis/node-${port}/data:/data \
-v /mydata/redis/node-${port}/conf/redis.conf:/etc/redis/redis.conf \
-d --net redis --ip 172.38.0.1${port} redis:6.2.5 redis-server /etc/redis/redis.conf
done
```

![image-20230106145417508](https://typora-oss.yixihan.chat//img/202301061454598.png)



### 创建 redis 集群

```shell
# 进入 redis-1
docker exec -it redis-1 /bin/bash

# 创建集群
redis-cli --cluster create 172.38.0.11:6379 172.38.0.12:6379 172.38.0.13:6379 172.38.0.14:6379 172.38.0.15:6379 172.38.0.16:6379 --cluster-replicas 1
```

![image-20230106145514029](https://typora-oss.yixihan.chat//img/202301061455309.png)



### 查看集群

```shell
redis-cli -c
cluster nodes
```



![image-20230106145540630](https://typora-oss.yixihan.chat//img/202301061455756.png)



### 常用命令

> 重启服务

```shell
for port in $(seq 1 6);
do
docker restart redis-${port}
done
```





## MySQL 安装

### 数据库安装

#### 下载并安装 MySQL 官方的 Yum Repository

```shell
wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm
```



#### yum 安装 Yum Repository

```shell
yum -y install mysql57-community-release-el7-10.noarch.rpm
```



#### 安装 MySQL 服务器

```shell
yum -y install mysql-community-server
```



#### 检查是否安装成功

```shell
mysql --version
```



> 检查是否安装成功

![image-20230102003955126](https://typora-oss.yixihan.chat//img/202301051040329.png)



#### 坑总结

##### Error: Unable to find a match: mysql-community-server

![image-20230102002707111](https://typora-oss.yixihan.chat//img/202301051040356.png)

```shell
# 解决方法
yum module disable mysql
yum -y install mysql-community-server
```



##### GPG check FAILED

![image-20220303190048146](https://typora-oss.yixihan.chat//img/202301051040351.png)

```shell
# 解决方法
rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
yum -y install mysql-community-server
```



##### file /etc/my.cnf from install of mysql-community-server-5.7.40-1.el7.x86_64 conflicts with file from package mariadb-connector-c-config-3.1.11-2.oc8.1.noarch

![image-20230102003815447](https://typora-oss.yixihan.chat//img/202301051040576.png)

```shell
# 解决方法:删除冲突的包
yum list installed|grep mariadb-connector
yum remove mariadb-connector-c-config.noarch
```



> yum list

![image-20230102003850919](https://typora-oss.yixihan.chat//img/202301051040538.png)



### 数据库配置

> MySQL 常用命令

```shell
# 启动 MySQL
systemctl start mysqld.service

# 重启 MySQL
systemctl restart mysqld.service

# 停止 MySQL
systemctl stop mysqld.service

# 查看 MySQL 运行状态
systemctl status mysqld.service

# 进入数据库
mysql -uroot -p
```



#### 启动 MySQL 服务器

```shell
# 只要不出任何消息就没问题  
systemctl start mysqld.service
```



#### 查看 MySQL 数据库状态

```shell
systemctl status mysqld.service
```

![image-20230102004026602](https://typora-oss.yixihan.chat//img/202301051040629.png)



#### 修改 mysql 配置

```shell
mv /etc/my.cnf /etc/my.cnf.example
vim /etc/my.cnf
```



```shell
[client]
# 端口号
port = 1617
socket = /tmp/mysql.sock
# 默认编码集
default-character-set=utf8mb4

[mysql]
no-auto-rehash
# 默认编码集
default-character-set = utf8mb4


[mysqld]

##############################基础设置#####################################

#Mysql服务的唯一编号 每个mysql服务Id需唯一
server-id = 1

#数据库错误日志文件
log_error = error.log

# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0

pid-file=/var/run/mysqld/mysqld.pid

#服务端口号 默认3306
port = 1617

#mysql安装根目录
basedir = /var/lib/mysql

#mysql数据文件所在位置
datadir = /var/lib/mysql

#临时目录 比如load data infile会用到
tmpdir  = /tmp

#设置socke文件所在目录
socket  = /tmp/mysql.sock
#数据库默认字符集,主流字符集支持一些特殊表情符号（特殊表情符占用4个字节）
character-set-server = utf8mb4

#数据库字符集对应一些排序等规则，注意要和character-set-server对应
collation-server = utf8mb4_general_ci

#设置client连接mysql时的字符集,防止乱码
init_connect=‘SET NAMES utf8mb4‘

#是否对sql语句大小写敏感，1表示不敏感
lower_case_table_names = 1

#最大连接数
max_connections = 400

#最大错误连接数
max_connect_errors = 1000

#TIMESTAMP如果没有显示声明NOT NULL，允许NULL值
explicit_defaults_for_timestamp = true
```



> tips

如果出现 `Job for mysqld.service failed because the control process exited with error code` 错误, 则检查 my.cnf 是否书写正确  





#### 查看 root 密码

```shell
grep "password" /var/log/mysqld.log 
```

![image-20230102004112450](https://typora-oss.yixihan.chat//img/202301051040630.png)





#### 进入数据库

```shell
mysql -uroot -p
```



#### 修改密码

```shell
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new password';
```





#### 检测配置内容

```shell
# 查看端口号是否已被修改 
show global variables like 'port';

# 查看编码集
status
```



> 查看端口号

![image-20230102005108019](https://typora-oss.yixihan.chat//img/202301051040633.png)



> 查看编码集

![image-20230102005144204](https://typora-oss.yixihan.chat//img/202301051040696.png)



#### 开启 MySQL 的全程访问

```shell
grant all privileges on *.* to 'root'@'%' identified by 'password' with grant option;
```



#### 刷新退出

```sql
flush privileges;
exit;
```



#### 设置防火墙

开放Linux防火墙对应端口或服务器安全组对应端口

```shell
# 开启端口 永久
firewall-cmd --permanent --zone=public --add-port=3306/tcp
# 重启防火墙
systemctl restart firewalld.service
```





#### 测试连接

> tips

虚拟机上的 MySQL 连接 DataGrip 时需在高级里设置 `useSSL = FALSE`

![image-20230102005432685](https://typora-oss.yixihan.chat//img/202301051040811.png)



### MySQL 完整配置

> tips

**上述的文件不建议全部拷贝使用，当需要哪块时单独复制是最好的，因为每台服务器的需求都不一样**

```shell
[client]
port = 3306
socket = /tmp/mysql.sock

[mysqld]

###############################基础设置#####################################

#Mysql服务的唯一编号 每个mysql服务Id需唯一
server-id = 1

#服务端口号 默认3306
port = 3306

#mysql安装根目录
basedir = /opt/mysql

#mysql数据文件所在位置
datadir = /opt/mysql/data

#临时目录 比如load data infile会用到
tmpdir  = /tmp

#设置socke文件所在目录
socket  = /tmp/mysql.sock

#主要用于MyISAM存储引擎,如果多台服务器连接一个数据库则建议注释下面内容
skip-external-locking

#只能用IP地址检查客户端的登录，不用主机名
skip_name_resolve = 1

#事务隔离级别，默认为可重复读，mysql默认可重复读级别（此级别下可能参数很多间隙锁，影响性能）
transaction_isolation = READ-COMMITTED

#数据库默认字符集,主流字符集支持一些特殊表情符号（特殊表情符占用4个字节）
character-set-server = utf8mb4

#数据库字符集对应一些排序等规则，注意要和character-set-server对应
collation-server = utf8mb4_general_ci

#设置client连接mysql时的字符集,防止乱码
init_connect=‘SET NAMES utf8mb4‘

#是否对sql语句大小写敏感，1表示不敏感
lower_case_table_names = 1

#最大连接数
max_connections = 400

#最大错误连接数
max_connect_errors = 1000

#TIMESTAMP如果没有显示声明NOT NULL，允许NULL值
explicit_defaults_for_timestamp = true

#SQL数据包发送的大小，如果有BLOB对象建议修改成1G
max_allowed_packet = 128M

#MySQL连接闲置超过一定时间后(单位：秒)将会被强行关闭
#MySQL默认的wait_timeout  值为8个小时, interactive_timeout参数需要同时配置才能生效
interactive_timeout = 1800
wait_timeout = 1800

#内部内存临时表的最大值 ，设置成128M。
#比如大数据量的group by ,order by时可能用到临时表，
#超过了这个值将写入磁盘，系统IO压力增大
tmp_table_size = 134217728
max_heap_table_size = 134217728

#禁用mysql的缓存查询结果集功能
#后期根据业务情况测试决定是否开启
#大部分情况下关闭下面两项
query_cache_size = 0
query_cache_type = 0

#####################用户进程分配到的内存设置BEGIN#############################

##每个session将会分配参数设置的内存大小
#用于表的顺序扫描，读出的数据暂存于read_buffer_size中，当buff满时或读完，将数据返回上层调用者
#一般在128kb ~ 256kb,用于MyISAM
#read_buffer_size = 131072
#用于表的随机读取，当按照一个非索引字段排序读取时会用到，
#一般在128kb ~ 256kb,用于MyISAM
#read_rnd_buffer_size = 262144
#order by或group by时用到

#建议先调整为2M，后期观察调整
sort_buffer_size = 2097152

#一般数据库中没什么大的事务，设成1~2M，默认32kb
binlog_cache_size = 524288

########################用户进程分配到的内存设置END############################

#在MySQL暂时停止响应新请求之前的短时间内多少个请求可以被存在堆栈中
#官方建议back_log = 50 + (max_connections / 5),封顶数为900
back_log = 130

############################日志设置##########################################

#数据库错误日志文件
log_error = error.log

#慢查询sql日志设置
slow_query_log = 1
slow_query_log_file = slow.log

#检查未使用到索引的sql
log_queries_not_using_indexes = 1

#针对log_queries_not_using_indexes开启后，记录慢sql的频次、每分钟记录的条数
log_throttle_queries_not_using_indexes = 5

#作为从库时生效,从库复制中如何有慢sql也将被记录
log_slow_slave_statements = 1

#慢查询执行的秒数，必须达到此值可被记录
long_query_time = 8

#检索的行数必须达到此值才可被记为慢查询
min_examined_row_limit = 100

#mysql binlog日志文件保存的过期时间，过期后自动删除
expire_logs_days = 5

############################主从复制设置#####################################

#开启mysql binlog功能
log-bin=mysql-bin

#binlog记录内容的方式，记录被操作的每一行
binlog_format = ROW

#对于binlog_format = ROW模式时，减少记录日志的内容，只记录受影响的列
binlog_row_image = minimal

#master status and connection information输出到表mysql.slave_master_info中
master_info_repository = TABLE

#the slave‘s position in the relay logs输出到表mysql.slave_relay_log_info中
relay_log_info_repository = TABLE

#作为从库时生效,想进行级联复制，则需要此参数
log_slave_updates

#作为从库时生效,中继日志relay-log可以自我修复
relay_log_recovery = 1

#作为从库时生效,主从复制时忽略的错误
slave_skip_errors = ddl_exist_errors

#####################redo log和binlog的关系设置BEGIN#########################

#(步骤1) prepare dml相关的SQL操作，然后将redo log buff中的缓存持久化到磁盘
#(步骤2)如果前面prepare成功，那么再继续将事务日志持久化到binlog
#(步骤3)如果前面成功，那么在redo log里面写上一个commit记录
#当innodb_flush_log_at_trx_commit和sync_binlog都为1时是最安全的，
#在mysqld服务崩溃或者服务器主机crash的情况下，binary log只有可能丢失最多一个语句或者一个事务。
#但是都设置为1时会导致频繁的io操作，因此该模式也是最慢的一种方式。
#当innodb_flush_log_at_trx_commit设置为0，mysqld进程的崩溃会导致上一秒钟所有事务数据的丢失。
#当innodb_flush_log_at_trx_commit设置为2，只有在操作系统崩溃或者系统掉电的情况下，上一秒钟所有事务数据才可能丢失。

#commit事务时,控制redo log buff持久化磁盘的模式 默认为1
innodb_flush_log_at_trx_commit = 2

#commit事务时,控制写入mysql binlog日志的模式 默认为0
#innodb_flush_log_at_trx_commit和sync_binlog都为1时，mysql最为安全但性能上压力也是最大
sync_binlog = 1

####################redo log和binlog的关系设置END############################

############################Innodb设置#####################################

#数据块的单位8k，默认是16k，16kCPU压力稍小，8k对select的吞吐量大
#innodb_page_size的参数值也影响最大索引长度，8k比16k的最大索引长度小
#innodb_page_size = 8192

#一般设置物理存储的60% ~ 70%
innodb_buffer_pool_size = 1G

#5.7.6之后默认16M
#innodb_log_buffer_size = 16777216

#该参数针对unix、linux，window上直接注释该参数.默认值为NULL
#O_DIRECT减少操作系统级别VFS的缓存和Innodb本身的buffer缓存之间的冲突
innodb_flush_method = O_DIRECT

#此格式支持压缩, 5.7.7之后为默认值
innodb_file_format = Barracuda

#CPU多核处理能力设置，假设CPU是2颗4核的，设置如下
#读多，写少可以设成2:6的比例
innodb_write_io_threads = 4
innodb_read_io_threads = 4

#提高刷新脏页数量和合并插入数量，改善磁盘I/O处理能力
#默认值200（单位：页）
#可根据磁盘近期的IOPS确定该值
innodb_io_capacity = 500

#为了获取被锁定的资源最大等待时间，默认50秒，超过该时间会报如下错误:
# ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
innodb_lock_wait_timeout = 30

#调整buffer pool中最近使用的页读取并dump的百分比,通过设置该参数可以减少转储的page数
innodb_buffer_pool_dump_pct = 40

#设置redoLog文件所在目录, redoLog记录事务具体操作内容
innodb_log_group_home_dir = /opt/mysql/redolog/

#设置undoLog文件所在目录, undoLog用于事务回滚操作
innodb_undo_directory = /opt/mysql/undolog/

#在innodb_log_group_home_dir中的redoLog文件数, redoLog文件内容是循环覆盖写入。
innodb_log_files_in_group = 3

#MySql5.7官方建议尽量设置的大些，可以接近innodb_buffer_pool_size的大小
#之前设置该值较大时可能导致mysql宕机恢复时间过长，现在恢复已经加快很多了
#该值减少脏数据刷新到磁盘的频次
#最大值innodb_log_file_size * innodb_log_files_in_group <= 512GB,单文件<=256GB
innodb_log_file_size = 1024M

#设置undoLog文件所占空间可以回收
#5.7之前的MySql的undoLog文件一直增大无法回收
innodb_undo_log_truncate = 1
innodb_undo_tablespaces = 3
innodb_undo_logs = 128

#5.7.7默认开启该参数 控制单列索引长度最大达到3072
#innodb_large_prefix = 1

#5.7.8默认为4个, Inodb后台清理工作的线程数
#innodb_purge_threads = 4

#通过设置配置参数innodb_thread_concurrency来限制并发线程的数量，
#一旦执行线程的数量达到这个限制，额外的线程在被放置到对队列中之前，会睡眠数微秒，
#可以通过设定参数innodb_thread_sleep_delay来配置睡眠时间
#该值默认为0,在官方doc上，对于innodb_thread_concurrency的使用，也给出了一些建议:
#(1)如果一个工作负载中，并发用户线程的数量小于64，建议设置innodb_thread_concurrency=0；
#(2)如果工作负载一直较为严重甚至偶尔达到顶峰，建议先设置innodb_thread_concurrency=128,
###并通过不断的降低这个参数，96, 80, 64等等，直到发现能够提供最佳性能的线程数
#innodb_thread_concurrency = 0

#强所有发生的死锁错误信息记录到error.log中，之前通过命令行只能查看最近一次死锁信息
innodb_print_all_deadlocks = 1

############################其他设置########################################

[mysqldump]
quick
max_allowed_packet = 128M

[mysql]
no-auto-rehash

[myisamchk]
key_buffer_size = 20M
sort_buffer_size = 256k
read_buffer = 2M
write_buffer = 2M

[mysqlhotcopy]
interactive-timeout

[mysqld_safe]
#增加每个进程的可打开文件数量
open-files-limit = 28192
```



## RabbitMQ 安装

[RabbitMQ-官网](https://www.rabbitmq.com/)

[RabbitMQ-下载地址](https://github.com/rabbitmq/rabbitmq-server/releases)

[erlang-下载地址](https://github.com/rabbitmq/erlang-rpm/releases/)

[RabbitMQ-文档](https://www.rabbitmq.com/documentation.html)



> tips

erlang 不同 centos 版本需选择不同安装包



### 安装 RabbitMQ



#### CentOS 7

```shell
# 安装 erlang
rpm -ivh erlang-23.3.4.10-1.el7.x86_64.rpm

# 安装 socat
yum install socat -y

# 安装 RabbitMQ
rpm -ivh rabbitmq-server-3.9.12-1.el7.noarch.rpm
```

 

#### CentOS 8

```shell
# 安装 erlang
rpm -ivh erlang-24.3.4.5-1.el8.x86_64.rpm

# 安装 socat
dnf install socat -y

# 安装 RabbitMQ
rpm -ivh rabbitmq-server-3.9.12-1.el7.noarch.rpm
```



### RabbitMQ 常用命令

```shell
# 添加开机启动 RabbitMQ 服务
chkconfig rabbitmq-server on
# 启动服务
/sbin/service rabbitmq-server start
# 重启服务
/sbin/service rabbitmq-server restart
# 查看服务状态
/sbin/service rabbitmq-server status
#停止服务(选择执行)
/sbin/service rabbitmq-server stop
# 开启 web 管理插件
rabbitmq-plugins enable rabbitmq_management
```



> 查看服务状态

![image-20230102011704188](https://typora-oss.yixihan.chat//img/202301051040835.png)



### 开启 web 管理插件

```shell
# 开启 web 管理插件
rabbitmq-plugins enable rabbitmq_management

# 防火墙开启端口
# 15672 5672

# 添加账户
# 创建账号
rabbitmqctl add_user user password

# 设置用户角色
rabbitmqctl set_user_tags user administrator

# 设置用户权限
# 格式 set_permissions [-p <vhostpath>] <user> <conf> <write> <read>
rabbitmqctl set_permissions -p "/" user ".*" ".*" ".*"

# 列出当前所有的用户
rabbitmqctl list_users
```



### 安装延时队列插件

[插件下载地址](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases)

```shell
# 进入 RabbitMQ 的安装目录下的 plgins 目录
cd /usr/lib/rabbitmq/lib/rabbitmq_server-3.9.12/plugins/

# 安装插件
rabbitmq-plugins enable rabbitmq_delayed_message_exchange

# 重启 RabbitMQ
systemctl restart rabbitmq-server
```



> 检测插件是否安装成功

![image-20220115101919856](https://typora-oss.yixihan.chat//img/202301051040890.png)



## Nginx 安装

### 环境准备

```shell
# 安装gcc
dnf -y install gcc-c++ gcc make

# 安装 PCRE pcre-devel
dnf install -y pcre pcre-devel

# 安装 zlib
dnf install -y zlib zlib-devel

# 安装 Open SSL
dnf install -y openssl openssl-devel
```



### 安装 pcre

[下载地址](http://downloads.sourceforge.net/project/pcre/pcre/8.35/pcre-8.35.tar.gz)



```shell
# 解压
tar -zxvf pcre-8.35.tar.gz
mv pcre-8.35 /opt/
cd /opt/pcre-8.35/

# 编译安装
./configure && make && make instal

# 查看版本
pcre-config --version
```





### 解压

```shell
tar -zxvf nginx-1.22.1.tar.gz
mv nginx-1.22.1 /opt/
cd /opt/nginx-1.22.1
```



### 编译安装

```shell
./configure \
--prefix=/usr/local/nginx \
--user=yixihan \
--with-http_ssl_module \
--with-http_gzip_static_module \
--http-client-body-temp-path=/usr/local/nginx/tmp/client/ \
--http-proxy-temp-path=/usr/local/nginx/tmp/proxy/ \
--http-fastcgi-temp-path=/usr/local/nginx/tmp/fcgi/ \
--with-poll_module \
--with-file-aio \
--with-http_realip_module \
--with-http_addition_module \
--with-http_addition_module \
--with-http_random_index_module \
--with-http_stub_status_module \
--http-uwsgi-temp-path=/usr/local/nginx/uwsgi_temp \
--http-scgi-temp-path=/usr/local/nginx/scgi_temp \
--with-pcre=/opt/pcre-8.35/ \
--with-stream

make && make install 
```



### 测试是否安装成功

```shell
nginx -V
```



> 测试是否安装成功

![image-20230106122552528](https://typora-oss.yixihan.chat//img/202301061225665.png)



### 常用命令

```shell
# 开启 nginx
systemctl start nginx
# 关闭 nginx
systemctl stop nginx
# 重启 nginx
systemctl restart nginx
# 查看 nginx 状态
systemctl status nginx
```



## Nacos 安装

### 单机安装

#### 解压

```shell
tar -zxvf nacos-server-2.0.4.tar.gz
mv nacos /opt/nacos
cd /opt/nacos/
```



#### 修改启动配置

```shell
cp bin/startup.sh bin/startup.sh.example
vim bin/startup.sh

# 单机运行
set MODE="standalone"

# 修改JVM
if [[ "${MODE}" == "standalone" ]]; then
	# 单机 JVM 内存修改位置
    JAVA_OPT="${JAVA_OPT} -Xms256m -Xmx256m -Xmn128m"
    JAVA_OPT="${JAVA_OPT} -Dnacos.standalone=true"
else
    if [[ "${EMBEDDED_STORAGE}" == "embedded" ]]; then
        JAVA_OPT="${JAVA_OPT} -DembeddedStorage=true"
    fi
    # 集群 JVM 内存修改位置
    JAVA_OPT="${JAVA_OPT} -server -Xms2g -Xmx2g -Xmn1g -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=320m"
    JAVA_OPT="${JAVA_OPT} -XX:-OmitStackTraceInFastThrow -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=${BASE_DIR}/logs/java_heapdump.hprof"
    JAVA_OPT="${JAVA_OPT} -XX:-UseLargePages"

fi
```



> 根据自己的机器配置来

![image-20230102012954254](https://typora-oss.yixihan.chat//img/202301051040928.png)



#### 修改运行配置

```shell
vim conf/application.properties

# 端口号
server.port=23412

# 数据库配置
spring.datasource.platform=mysql
 
db.num=1
db.url.0=jdbc:mysql://localhost:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&serverTimezone=UTC
db.user=root
db.password=123456
```



#### 运行

![image-20230102014651289](https://typora-oss.yixihan.chat//img/202301051040957.png)


### 集群安装

待更新



## Sentinel docker 搭建

[sentinel 下载地址](https://github.com/alibaba/sentinel/releases)



### Dockerfile

```shell
FROM java:8
EXPOSE 8888

ADD *.jar  /app.jar
RUN bash -c 'touch /app.jar' cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
ENTRYPOINT ["java","-jar","/app.jar"]
```



### 打包 Sentinel 镜像

```shell
docker build -t sentinel-dashboard:[TAG] .
```



### 运行 Sentinel 镜像

```shell
docker run -d  -p 8888:8080  --name=sentinel --restart=always sentinel-dashboard:[TAG]
```



```shell
访问地址 : http://host:8888/
用户名: sentinel
密码: sentinel
```





## Jenkins 搭建

本教程采用 `docker` 搭建 `jenkins`， 并将部署的服务运行在宿主机 `docker`上



### docker 运行 Jenkins

```shell
docker run -u root -d -m 1024m \
--restart=always \
-p 8099:8080 -p 50099:50000 --privileged \
-v /var/run/docker.sock:/var/run/docker.sock \
-v $(which docker):/bin/docker \
-v /usr/lib64/libltdl.so.7:/usr/lib/x86_64-linux-gnu/libltdl.so.7 \
-v /home/jenkins:/var/jenkins_home \
-v /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime \
--name jenkins jenkinsci/blueocean
```

> 参数讲解

- -u root : 以宿主机 root 用户的权限运行 Jenkins

- -m 1024m : 限制 Jenkins 内存大小

- --restart=always : 能够使我们在重启 docker 时，自动启动相关容器

- -p 8099:8080 -p 50099:50000 : 对外映射接口

- --privileged : 让 Jenkins 容器中的 root 用户拥有真正的宿主机 root 权限

- -v /var/run/docker.sock:/var/run/docker.sock : 容器中的进程通过它与 docker 守护进程进行通信

- -v $(which docker):/usr/bin/docker : 将宿主机的docker命令挂载到容器中
  $(which docker) 是docker命令所在位置, 一般在/usr/bin/docker,用$(which docker)就行

- /usr/lib64/libltdl.so.7:/usr/lib/x86_64-linux-gnu/libltdl.so.7 : Docker命令执行所依赖的函数库

  centos7 / centos8 中该文件路径为/usr/lib64/libltdl.so.7

  ubuntu中该文件路径为/usr/lib/x86_64-linux-gnu/libltdl.so.7

- /home/jenkins:/var/jenkins_home : `/home/jenkins` 为挂载在宿主机 Jenkins 目录位置

- -v /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime : 挂载宿主机的时区, 让 Jenkins 拥有正确的时间显示



#### 防火墙配置

打开对应端口防火墙



#### 复制一份 maven 到  Jenkins 目录

```shell
cp -r /opt/apache-maven-3.8.7 /home/jenkins
```



![image-20230106152252054](https://typora-oss.yixihan.chat//img/202301061522183.png)





#### 查询 Jenkins 内是否可以执行宿主机中的 docker

```shell
# 进入容器
docker exec -it [容器id/容器name] /bin/bash
docker exec -it jenkins /bin/bash

# 执行命令
docker ps
```



### Jenkins 镜像配置



####  前往 Jenkins 在宿主机挂载的目录

```shell
cd /home/jenkins
```



#### 修改 hudson.model.UpdateCenter.xml 文件

修改为清华源

```shell
vim hudson.model.UpdateCenter.xml

# 修改 sites - site - url
https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json
```



![image-20230105104602442](https://typora-oss.yixihan.chat//img/202301051046519.png)



#### 修改 default.json

要修改的地址有两部分：

- 插件查找搜索地址（*默认为 http://www.google.com/*），我们更换成百度的地址；
- 插件下载地址（*默认为 https://updates.jenkins.io/download*），我们更换成国内镜像地址；

```shell
cd updates

sed -i 's#https://updates.jenkins.io/download#https://mirrors.tuna.tsinghua.edu.cn/jenkins#g' default.json
sed -i 's#http://www.google.com#https://www.baidu.com#g' default.json
```



#### 重启 Jenkins

```shell
docker restart [容器id/容器name]
docker restart jenkins
```



### Jenkins 配置

为方便, Jenkins 自动部署最好使用 gitee (国内服务器, 不用担心网络问题)



#### 初始化 Jenkins

![image-20230106152537105](https://typora-oss.yixihan.chat//img/202301061525358.png)



> 密码获取

```shell
cat /home/jenkins/secrets/initialAdminPassword
```



#### 安装社区推荐插件

![image-20230106152827172](https://typora-oss.yixihan.chat//img/202301061528390.png)



#### 创建管理员

![image-20230106153340176](https://typora-oss.yixihan.chat//img/202301061533417.png)



#### 实例配置

![image-20230106153420752](https://typora-oss.yixihan.chat//img/202301061534982.png)



#### 插件更新

##### 更新插件



##### 下载插件

```shell
# 下载插件列表
gitee
```



##### 坑

插件可能在默认下载或更新之后存在 Jenkins 版本过低而无法加载的问题, 只需要更新 jenkins 即可

若面板没找到自动更新选项,可以手动更新

[Jenkins 下载地址]()

下载之后将这个war包替换容器内的 `/usr/share/jenkins/jenkins.war`



#### 系统配置

##### Maven 配置

系统配置 -> 全局属性



```shell
M2_HOME
/var/jenkins_home/maven-3.8.7
 
PATH+EXTRA
/var/jenkins_home/maven-3.8.7/bin
```



![image-20230105105749453](https://typora-oss.yixihan.chat//img/202301051057649.png)



最后保存即可



##### gitee 配置

系统配置 -> gitee 配置



> 新增仓库

![image-20230105105942540](https://typora-oss.yixihan.chat//img/202301051059652.png)

输入 gitee 链接 : https://gitee.com/xxx/xxx.git

输入 gitee 域名 : https://gitee.com

选择证书令牌



> 配置证书令牌

点击添加

![image-20230105110242969](https://typora-oss.yixihan.chat//img/202301051102049.png)



选择 gitee API 令牌

![image-20230105110423075](https://typora-oss.yixihan.chat//img/202301051104178.png)



获取 gitee API 令牌 : [gitee API 令牌获取地址](https://gitee.com/profile/personal_access_tokens)

获取之后即可添加保存



> 最终配置效果如下

![image-20230105105910099](https://typora-oss.yixihan.chat//img/202301051059219.png)



测试连接可行之后保存即可







### 新增 job - 应用

输入描述, 选择 `gitee` 链接

![image-20230106164113043](https://typora-oss.yixihan.chat//img/202301061641334.png)



#### 源码管理

![image-20230106163941811](https://typora-oss.yixihan.chat//img/202301061639015.png)



> 账号添加

输入账号密码即可

![image-20230106163858778](https://typora-oss.yixihan.chat//img/202301061638011.png)



#### 构建步骤

选择执行 `shell`

![image-20230106164027685](https://typora-oss.yixihan.chat//img/202301061640896.png)



> shell命令



```shell
############################################################################################################
###构建命令
############################################################################################################

echo $JAVA_HOME
echo "=============java变量路径:$JAVA_HOME" 

# 项目路径, 一般是项目名
PROJECT_LOCATION=yibot
# 模块名
PROJECT=YiBot
# 组 ID
GROUP_ID=com.yixihan

############################maven 打包#####################################
# 跳转到源代码目录, 执行 maven 命令 (需更改 maven 路径)
cd /var/jenkins_home/workspace/${PROJECT_LOCATION} && /var/jenkins_home/apache-maven-3.8.7/bin/mvn  clean install -am -pl ${GROUP_ID}:${PROJECT} -Dmaven.test.skip=true
###########################################################################

############################历史镜像,容器处理#################################
# docker 镜像表情按
TAG=`v "+%Y%m%d"`
# docker镜像名称
IMAGE_NAME=$PROJECT
echo "=============查看进程id，然后删除"
#容器id
cid=$(docker ps -a | grep $IMAGE_NAME | awk '{print $1}')
#镜像id
iid=$(docker images | grep $IMAGE_NAME | awk '{print $3}')

# 判断容器 & 镜像是否存在,如果存在则删除

if [ -n "$cid" ]; then
echo "存在容器$IMAGE_NAME，cid=$cid,删除容器。。。"
docker rm -f $cid
else
echo "不存在$IMAGE_NAME容器"
fi

if [ -n "$iid" ]; then
echo "存在镜像$IMAGE_NAME，iid=$iid,删除容器镜像。。。"
docker rmi -f $iid
else
echo "不存在$IMAGE_NAME镜像"
fi 
###########################################################################

############################镜像构建,容器启动#################################
### 构建容器
# 跳转到源代码目录
cd /var/jenkins_home/workspace/${PROJECT_LOCATION}
# docker 镜像构建命令
docker build -t $IMAGE_NAME:$TAG .
echo "=============开始构建镜像$IMAGE_NAME"
echo "当前docker 所有镜像："
docker images
echo "启动容器------->"
# docker 容器启动命令
docker run -p 19999:19999 -d --name $IMAGE_NAME $IMAGE_NAME
echo "启动服务成功"
###########################################################################

echo "查看启动的所有进程：" 
docker ps
```



> 适用于多模块的构建

![image-20230107135211115](https://typora-oss.yixihan.chat//img/202301071352348.png)

```shell
############################################################################################################
###构建命令
############################################################################################################
 
    echo $JAVA_HOME
    echo "=============java变量路径:$JAVA_HOME" 
    # 项目名称, 一般也是项目路径
    PROJECT_LOCATION=yicode
    # 组 ID
    GROUP_ID=com.yixihan
    ##############################打包###########################################
    # 跳转到源代码目录, 执行 maven 命令 (打包) (需更改 maven 路径)
    cd /var/jenkins_home/workspace/${PROJECT_LOCATION}/${PROJECT} && /var/jenkins_home/apache-maven-3.8.7/bin/mvn  clean install -am -pl ${GROUP_ID}:${PROJECT} -Dmaven.test.skip=true
    ############################################################################
    
    #############################删除原有镜像,容器################################
    TAG=`date "+%Y%m%d"`
    IMAGE_NAME=$PROJECT
    echo "=============查看进程id，然后删除"
    #容器id
    cid=$(docker ps -a | grep $IMAGE_NAME | awk '{print $1}')
    #镜像id
    iid=$(docker images | grep $IMAGE_NAME | awk '{print $3}')
    if [ -n "$cid" ]; then
      echo "存在容器$IMAGE_NAME，cid=$cid,删除容器。。。"
      docker rm -f $cid
    else
       echo "不存在$IMAGE_NAME容器"
    fi
    if [ -n "$iid" ]; then
      echo "存在镜像$IMAGE_NAME，iid=$iid,删除容器镜像。。。"
      docker rmi -f $iid
    else
       echo "不存在$IMAGE_NAME镜像"
    fi 
    ############################################################################
 	
    ###############################构建镜像,运行容器###############################
    cd /var/jenkins_home/workspace/${PROJECT_LOCATION}/${PROJECT}
    docker build -t $IMAGE_NAME:$TAG .
    echo "=============开始构建镜像$IMAGE_NAME"
    echo "当前docker 所有镜像："
    docker images
    echo "启动容器------->"
    case $PROJECT in
    	"yicode-gateway")
			docker run -p 11000:11000 -d --restart=always -m 256m -e JAVA_OPTS=’-Xmx256m’ --name $IMAGE_NAME $IMAGE_NAME:$TAG
            ;;
    	"yicode-auth")
			docker run -p 13100:13100 -d --restart=always -m 256m -e JAVA_OPTS=’-Xmx256m’ --name $IMAGE_NAME $IMAGE_NAME:$TAG
            ;;
    	"yicode-user")
         	docker run -p 14100:14100 -d --restart=always -m 256m -e JAVA_OPTS=’-Xmx256m’ --name $IMAGE_NAME $IMAGE_NAME:$TAG
            ;;
		"yicode-user-openapi")
			docker run -p 14200:14200 -d --restart=always -m 256m -e JAVA_OPTS=’-Xmx256m’ --name $IMAGE_NAME $IMAGE_NAME:$TAG
            ;;
    	"yicode-question")
			docker run -p 15100:15100 -d --restart=always -m 256m -e JAVA_OPTS=’-Xmx256m’ --name $IMAGE_NAME $IMAGE_NAME:$TAG
            ;;
    	"yicode-question-openapi")
			docker run -p 15200:15200 -d --restart=always -m 256m -e JAVA_OPTS=’-Xmx256m’ --name $IMAGE_NAME $IMAGE_NAME:$TAG
            ;;
        "yicode-runcode-judge")
			docker run -p 18100:18100 -d --restart=always -m 256m -e JAVA_OPTS=’-Xmx256m’ --name $IMAGE_NAME $IMAGE_NAME:$TAG
            ;;
    	"yicode-runcode-run")
         	docker run -p 18200:18200 -d --restart=always -m 256m -e JAVA_OPTS=’-Xmx256m’ --name $IMAGE_NAME $IMAGE_NAME:$TAG
            ;;
    	"yicode-thirdpart")
			docker run -p 16100:16100 -d --restart=always -m 256m -e JAVA_OPTS=’-Xmx256m’ --name $IMAGE_NAME $IMAGE_NAME:$TAG
            ;;
    	"yicode-thirdpart-openapi")
			docker run -p 16200:16200 -d --restart=always -m 256m -e JAVA_OPTS=’-Xmx256m’ --name $IMAGE_NAME $IMAGE_NAME:$TAG
            ;;
        "yicode-message-producer")
			docker run -p 17100:17100 -d --restart=always -m 256m -e JAVA_OPTS=’-Xmx256m’ --name $IMAGE_NAME $IMAGE_NAME:$TAG
            ;;
    	"yicode-message-consumer")
         	docker run -p 18200:18200 -d --restart=always -m 256m -e JAVA_OPTS=’-Xmx256m’ --name $IMAGE_NAME $IMAGE_NAME:$TAG
            ;;
		*)
            echo "error"
            ;;
        esac    
    echo "启动服务成功"
    ############################################################################
    echo "查看启动的所有进程：" 
    docker ps
```

