---
layout: post
title: Html5新特性-Notifications入门
date: 2012-9-03 17:27:00
categories: effect
---

Chrome内置支持Notifications，Firefox需要安装插件（插件下载地址：http://code.google.com/p/ff-html5notifications/）。

注意，必须在服务器中运行才会有桌面通知效果！

一个Notifications使用的小例子，代码如下：

{% highlight ruby %}
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript">
        $(window).load(function(){
            // 检查客户端（一般是浏览器）对Notifications的支持
            //Chrome内置支持，Firefox需要安装插件
            if (window.webkitNotifications) {
                console.log("浏览器支持Notifications！");
                // alert("浏览器支持Notifications！");
            }
            else {
                console.log("浏览器不支持Notifications！");
                // alert("浏览器不支持Notifications！");
            }
        });

        $(document).ready(function(){
            function createNotification(options) {
                if (options.notificationType == 'simple') {
                    // 创建一个文本通知: 
                    return window.webkitNotifications.createNotification(
                        'images/rails.png', // 图标路径 - 可以是相对路径
                        '通知', // 通知的标题
                        '哈哈，你中彩咯！' // 通知的内容
                    );
                }
                else if (options.notificationType == 'html') {
                    // 或者创建一个HTML通知: 
                    return window.webkitNotifications.createHTMLNotification(
                        // HTML路径 - 可以是相对路径
                        'xxx.html'
                    );
                }
            }

            document.querySelector('#show_button').addEventListener('click', function() {
                if (window.webkitNotifications.checkPermission() == 0) {
                    // 0 表示允许Notifications
                    notification = createNotification({notificationType: 'simple'});
                    notification.ondisplay = function() { 
                        console.log("display");
                    };
                    notification.onclose = function() { 
                        console.log("close"); 
                    };
                    notification.show();
                    setTimeout('notification.cancel()', 4000)
                } else {
                    window.webkitNotifications.requestPermission();
                }
            }, false);
        });
    </script>

</head>

<body>
	<button id="show_button" type="button">点我看效果</button>
</body>

</html>
{% endhighlight %}
