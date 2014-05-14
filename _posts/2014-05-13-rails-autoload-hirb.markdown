---
layout: post
title: Rails项目自动Hirb.enable
date: 2014-05-13 21:48:00
categories: [newest, ruby]
---

在Rails项目中Hirb是经常使用的，然而每次都要手动'Hirb.enable'，敲多了自然就烦了。  
遵循懒人原则以及DRY原则 —— Why not do less and effect more! Don't Repeat yourself!   
在home目录下添加.irbrc文件，运行交互环境(比如irb、rails c等)时会自动运行，内容如下：  

{% highlight ruby %}
puts "Welcome, #{ENV['USER']}!"  
def class_exists?(str)
  klass = str.split('::').inject(Object) do |mod, class_name|
    mod.const_get(class_name)
  end
  klass.is_a?(Object)
rescue NameError
  false
end  
if class_exists?("Rails")
  require 'hirb'
  # Hirb.disable
  Hirb.enable
end
{% endhighlight %}