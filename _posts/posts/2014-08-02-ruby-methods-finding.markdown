---
layout: post
title: Methods finding in Ruby
date: 2014-08-02 22:22:22
categories: [newest, ruby]
---


```ruby
# ruby 2.0.0p195
# Firstly see a photo
```html
<img src="/assets/img/methods_finding.jpg" alt="methods_finding">
```
```

```ruby
# take String for example
String.ancestors => [String, Comparable(Module), Object, Kernel(Module), BasicObject]
String << Object include Comparable
          Object << BasicObject include Kernel
                    BasicObject << nil
        
### line seperator ###

Module.class => Class
Class.class => Class
# instance_variables placed in Object, but method definition placed in Class

1.(Class)BasicObject(95) << nil
  # the parent class of all classes in Ruby
  class_methods(87):
  instance_methods(8-0(from super)=8): [:==, :equal?, :!, :!=, :instance_eval, :instance_exec, :__send__, :__id__]

2.(Module)Kernel(151)
  # included by class Object
  class_methods(105): 
  instance_methods(46-0=46): 
    [:nil?, :===, :=~, :!~, :eql?, :hash, :<=>, :class, :singleton_class, :clone, :dup, :taint, :tainted?, :untaint, :untrust, :untrusted?, :trust, :freeze, :frozen?, :to_s, :inspect, :methods, :singleton_methods, :protected_methods, :private_methods, :public_methods, :instance_variables, :instance_variable_get, :instance_variable_set, :instance_variable_defined?, :remove_instance_variable, :instance_of?, :kind_of?, :is_a?, :tap, :send, :public_send, :respond_to?, :extend, :display, :method, :public_method, :define_singleton_method, :object_id, :to_enum, :enum_for] 

3.(Class)Object(95) << BasicObject include Kernel
  # the default root of all Ruby objects
  class_methods(41):
  instance_methods(54-8-46=0): [BasicObject.instance_methods(8), Kernel.instance_methods(46)] 

### line seperator ###

4.(Class)Module(96) << Object
  # a collection of methods and constants
  # Module.methods.delete_if {|m| Module.instance_methods.include? m}
  class_methods(4): [:nesting, :allocate, :new, :superclass]

  instance_methods(92-48=44): 
    [BasicObject.instance_methods(8), Kernel.instance_methods(46), :<, :<=, :>, :>=, :included_modules, :include?, :name, :ancestors, :instance_methods, :public_instance_methods, :protected_instance_methods, :private_instance_methods, :constants, :const_get, :const_set, :const_defined?, :const_missing, :class_variables, :remove_class_variable, :class_variable_get, :class_variable_set, :class_variable_defined?, :public_constant, :private_constant, :module_exec, :class_exec, :module_eval, :class_eval, :method_defined?, :public_method_defined?, :private_method_defined?, :protected_method_defined?, :public_class_method, :private_class_method, :autoload, :autoload?, :instance_method, :public_instance_method]
  instance_methods(redefined): [:freeze, :===, :==, :<=>, :to_s, :inspect]

5.(Class)Class(96) << Module
  # first-class objects---each is an instance of class Class
  class_methods(1): [:nesting]
  instance_methods(95-92=3): [Module.instance_methods(92), :allocate, :new, :superclass]

### line seperator ###

oims = Object.instance_methods
mims = Module.instance_methods
mims_false = mims.delete_if {|m| oims.include? m }

# 38 instance_methods from self, but Module.instance_methods(false).count=44, 
# so count 6 instance_methods from Obejct redefined (8 + 46 + 44 - 92 = 6)
mims = Module.instance_methods
mims_redefined = mims.delete_if {|m| mims_false.include? m } 

# finnaly, why Module inherited Object but different with Object?

```
