---
layout: post
title: Backbone.js通讯录例子
date: 2013-04-15 20:09:00
categories: [newest, frontend]
---

通讯录，一个基于Backbone的经典例子。
查看预览图和下载源代码请移步[ITEYE][page-in-iteye]。

Html代码如下：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Backbone通讯录</title>
  <link rel="stylesheet" href="css/application.css" type="text/css" charset="utf-8">
</head>
<body>
  <header id="header"><h1>Backbone通讯录</h1></header>
  <article id="article"></article>
</body>
  <script src="js/lib/jquery.js" type="text/javascript" charset="utf-8"></script>
  <script src="js/lib/underscore.js" type="text/javascript" charset="utf-8"></script>
  <script src="js/lib/backbone.js" type="text/javascript" charset="utf-8"></script>
  <script src="js/lib/backbone-localstorage.js" type="text/javascript" charset="utf-8"></script>
  <script src="js/application.js" type="text/javascript" charset="utf-8"></script>

  <!-- 联系人 -->
  <script type="text/template" id="tpl-item">
      <%= (name ? name : "<i>无名</i>") %>
  </script>

  <!-- 左边的侧边条，包括联系人列表 -->
  <script type="text/template" id="tpl-sidebar">
    <header>
      <input type="search" placeholder="搜索" results="0" incremental="true" autofocus>
    </header>
    <div class="items"></div>
    <footer>
      <button>新建联系人</button>
    </footer>
  </script>

  <!-- 显示联系人详细信息 -->
  <script type="text/template" id="tpl-show">
    <header>
      <a class="edit">编辑</a>
    </header>
    <div class="content">
      <p><label>姓名：<%= name %></label></p>
      <p><label>邮箱：<%= email %></label></p>
    </div>
  </script>
  
  <!-- 编辑联系人信息 -->
  <script type="text/template" id="tpl-edit">
    <header>
      <a class="save">保存</a>
      <a class="delete">删除</a>
    </header>
    <div class="content">
      <form>
        <label>
          <span>姓名：</span>
          <input type="text" name="name" value="<%= name %>">
        </label>
        <label>
          <span>邮箱：</span>
          <input type="email" name="email" value="<%= email %>">
        </label>  
        <button>保存</button>
      </form>
    </div>
  </script>
</html>
```

Backbone代码如下：

```js
(function($) {
  $(document).ready(function() {
    var Contact = Backbone.Model.extend({
      defaults: {
        name: '',
        email: ''
      },

      validate: function(attrs, options) {
        if (attrs.name == "") {
          return "用户名不能为空！";
        };
      },

      // 用户搜索的辅助方法
      filter: function(query) {
        if (typeof(query) === 'undefined' || query === null || query === '') return true;
        query = query.toLowerCase();
        return this.get('name').toLowerCase().indexOf(query) != -1 || this.get('email').toLowerCase().indexOf(query) != -1;
      }
    });

    var Contacts = Backbone.Collection.extend({
      model: Contact,
      localStorage: new Store('my-contacts')
    });

    // 单个联系人视图
    var ContactItemView = Backbone.View.extend({
      className: 'item',
      template: _.template($('#tpl-item').html()),
      events: {
        'click': 'select'
      },

      initialize: function() {
        _.bindAll(this, 'select');
        this.model.bind('reset', this.render, this);
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
        if (this.model.view) this.model.view.remove();
        this.model.view = this;
      },

      // 渲染联系人
      render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      },

      select: function() {
        appRouter.navigate('contacts/' + this.model.cid, {
          trigger: true
        });
      },

      active: function() {
        this.$el.addClass('active');
      },
      
      deactive: function() {
        this.$el.removeClass('active');
      }
    });

    // 左边的侧边条视图
    var SidebarView = Backbone.View.extend({
      className: 'sidebar',
      template: _.template($('#tpl-sidebar').html()),
      events: {
        'click footer button': 'create',
        'click input': 'filter',
        'keyup input': 'filter'
      },

      initialize: function() {
        _.bindAll(this, 'create', 'filter');
        this.model.bind('reset', this.renderAll, this);
        this.model.bind('add', this.add, this);
        this.model.bind('remove', this.remove, this);
      },

      // 渲染联系人列表
      render: function() {
        $(this.el).html(this.template());
        this.renderAll();
        return this;
      },

      renderAll: function() {
        this.$(".items").empty();
        this.model.each(this.renderOne, this);
        this.filter();
      },

      renderOne: function(contact) {
        var view = new ContactItemView({
          model: contact
        });
        this.$(".items").append(view.render().el);
      },

      create: function() {
        var contact = new Contact();
        this.model.add(contact);
        appRouter.navigate('contacts/' + contact.cid + '/edit', {
          trigger: true
        });
      },

      filter: function() {
        var query = $('input', this.el).val();
        this.model.each(function(contact, element, index, list) {
          contact.view.$el.toggle(contact.filter(query));
        });
        // this.model.last().view.$el.trigger("click")
      },

      active: function(item) {
        if (this.activeItem) this.activeItem.view.deactive();
        this.activeItem = item;
        if (this.activeItem) this.activeItem.view.active();
      },

      add: function(contact) {
        this.renderOne(contact);
      },

      remove: function(contact) {
        console.log(contact);
      }
    });
    // 显示选择的联系人详细信息
    var ShowView = Backbone.View.extend({
      className: 'show',
      template: _.template($('#tpl-show').html()),

      events: {
        'click .edit': 'edit'
      },

      initialize: function() {
        _.bindAll(this, 'edit');
      },

      render: function() {
        if (this.item) this.$el.html(this.template(this.item.toJSON()));
        return this;
      },

      change: function(item) {
        this.item = item;
        this.render();
      },

      edit: function() {
        if (this.item) appRouter.navigate('contacts/' + this.item.cid + '/edit', {
          trigger: true
        });
      }
    });
    
    // 编辑选择的联系人
    var EditView = Backbone.View.extend({
      className: 'edit',
      template: _.template($('#tpl-edit').html()),

      events: {
        'submit form': 'submit',
        'click .save': 'submit',
        'click .delete': 'remove'
      },

      initialize: function() {
        _.bindAll(this, 'submit', 'remove');
      },

      render: function() {
        if (this.item) this.$el.html(this.template(this.item.toJSON()));
        return this;
      },

      change: function(item) {
        this.item = item;
        this.render();
      },

      submit: function() {
        this.item.set(this.form());
        this.item.save();
        appRouter.navigate('contacts/' + this.item.cid, {
          trigger: true
        });
        return false;
      },

      form: function() {
        return {
          name: this.$('form [name="name"]').val(),
          email: this.$('form [name="email"]').val()
        };
      },

      remove: function() {
        this.item.destroy();
        this.item = null;
        appRouter.navigate('', {
          trigger: true
        });
      }
    });

    // 主视图，显示和编辑联系人
    var MainView = Backbone.View.extend({
      className: 'main stack',
      initialize: function() {
        this.editView = new EditView();
        this.showView = new ShowView();
      },

      render: function() {
        this.$el.append(this.showView.render().el);
        this.$el.append(this.editView.render().el);
        return this;
      },

      edit: function(item) {
        this.showView.$el.removeClass('active');
        this.editView.$el.addClass('active');
        this.editView.change(item);
      },

      show: function(item) {
        this.editView.$el.removeClass('active');
        this.showView.$el.addClass('active');
        this.showView.change(item);
      }
    });

    // 整个页面的视图，管理SiderbarView和MainView两个子视图
    var AppView = Backbone.View.extend({
      className: 'contacts',

      initialize: function() {
        this.sidebar = new SidebarView({
          model: this.model
        });
        this.main = new MainView();
        this.vdiv = $('<div />').addClass('vdivide');
        this.model.fetch();
        this.render();
      },

      render: function() {
        this.$el.append(this.sidebar.render().el);
        this.$el.append(this.vdiv);
        this.$el.append(this.main.render().el);
        $('#article').append(this.el);
        return this;
      },

      show: function(item) {
        this.sidebar.active(item);
        this.main.show(item);
      },

      edit: function(item) {
        this.sidebar.active(item);
        this.main.edit(item);
      }
    });

    // 路由
    var AppRouter = Backbone.Router.extend({
      routes: {
        '': 'show',
        'contacts/:id': 'show',
        'contacts/:id/edit': 'edit'
      },

      show: function(id) {
        if (id != undefined) {
          appView.show(this.getContact(id));
        } else {
          appView.show(contacts.first());
        }
      },

      edit: function(id) {
        appView.edit(this.getContact(id));
      },

      getContact: function(id) {
        return contacts.getByCid(id);
      }
    });

    var contacts = new Contacts();
    window.appView = new AppView({
      model: contacts
    });
    window.appRouter = new AppRouter();
    Backbone.history.start();
  });
})(jQuery);
```

[page-in-iteye]: http://z2009zxiaolong.iteye.com/blog/1847833