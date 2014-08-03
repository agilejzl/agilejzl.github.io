---
layout: post
title: Meta methods in Object
date: 2014-08-03 15:38:00
categories: [newest, ruby]
---


```ruby
# ruby 2.0.0p195
# list some common used meta methods from Object

1. Module.const_get(sym|str, inherit=true) → obj
# define a method for namespace const_get
def clazz_from_str(str)
	str.split('::').inject(Object) { |mod, clazz_name| mod.const_get(clazz_name) }
end
clazz_from_str("File::Constants") # => File::Constants

2. Module.const_defined?(sym|str, inherit=true) → true or false
Module.const_set(:VERSION, 1.0) # => 1.0
Module.const_defined?(:VERSION) # => true
Module.const_get(:VERSION) # => 1.0

3. Object.respond_to?(sym|str, include_all=false) → true or false
Kernel.respond_to? :superclass # => false
BasicObject.respond_to? :superclass # => true

4. Module.module_eval {|| block } → obj
class Thing; end
a = %q{def hello() "Hello there!" end}

Thing.module_eval(a)
puts Thing.new.hello()
# NameError: undefined local variable or method `code' for Thing:Class
Thing.module_eval("invalid code", "dummy", 123)

5. Module.class_eval(string [, filename [, lineno]]) → obj

6.BasicObject.instance_eval {| | block } → obj
class KlassWithSecret
  def initialize; @secret = 99; end
end

k = KlassWithSecret.new
k.instance_variables # => [:@secret] 
k.instance_eval { @secret } # => 99

7. Object.send(sym|str [, args...]) → obj
String.send(:new, 'hello') # => "hello" 

8. Object.singleton_class → class
c1 = String.singleton_class
c2 = String.singleton_class

c1.object_id == c2.object_id # => true
c1.respond_to? :new # => true
c1.new("hello") # => TypeError: can't create instance of singleton class
 
```
