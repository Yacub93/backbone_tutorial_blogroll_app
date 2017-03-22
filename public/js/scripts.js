Backbone.Model.prototype.idAttribute = '_id'; 
//Backbone Model
//Backbone ids format:
//_id


var Blog = Backbone.Model.extend({
	defaults: {
		author: '',
		title: '',
		url: ''

	}

});

//Backbone Collections
//url request from server
var Blogs = Backbone.Collection.
	extend({
		url:'http://localhost:3000/api/blogs' //server URL
	});

// var blog1 = new Blog({
// 	author: 'Yacub',
// 	title: 'Yacubs\'s Blog',
// 	url: 'http://yacubsblog.com'
// });

// var blog2 = new Blog({
// 	author: 'Jamal',
// 	title: 'Jamal\'s Blog',
// 	url: 'http://jamalsblog.co.uk'

// });

//instantiate a Collection
// var blogs = new Blogs([blog1,blog2]);
var blogs = new Blogs();

//Backbone Views

//View 1 - Each indiviual blog we create. - Backbone view for one blog

var BlogView = Backbone.View.extend({
 	model: new Blog(),
 	tagName: 'tr',
 	initialize: function(){
 		this.template = _.template($('.blogs-list-template').html());
 	},
 	//List of Event listeners
 	events: {
 		'click .edit-blog':'edit',
 		'click .update-blog':'update',
 		'click .cancel':'cancel',
 		'click .delete-blog': 'delete'
 	},
 	//if edit-blog button clicked run edit function
 	edit: function(){
 		this.$('.edit-blog,.delete-blog').hide(); //this single record
 		this.$('.update-blog,.cancel').show(); //this single record

 		var author = this.$('.author').html();
 		var title = this.$('.title').html();
 		var url = this.$('.url').html();
 		//create input textbox for edit with value present
 		this.$(".author").html('<input type="text" class="form-control author-update" value="'+ author +'">');
 		this.$(".title").html('<input type="text" class="form-control title-update" value="'+ title +'">');
 		this.$(".url").html('<input type="text" class="form-control url-update" value="'+ url +'">');

 	},
 	update: function(){
 		this.model.set('author', $('.author-update').val());
 		this.model.set('title', $('.title-update').val());
 		this.model.set('url', $('.url-update').val());
 		this.model.save(null,{
 			success: function(response)
 			{
 				console.log('Successfully UPDATED blog with _id: ' 
 					+ response.toJSON()._id);
 			},
 			error: function(response){
 				console.log('Failed to UPDATE blog!');
 			}
 		})
 		// this.model.set({'author':this.$('.author-update').val();
 		// this.model.set({'title':this.$('.title-update').val();
 		// this.model.set({'url':this.$('.url-update').val();

 	},
 	cancel: function(){
 		blogsView.render();
 	},
 	delete: function(){
 		this.model.destroy({
 			success: function(response)
 			{
 				console.log('Successfully DELETED blog with _id: ' +
 						response.toJSON()._id);
 			},
 			error: function(){
 				console.log('Failed to DELETE blog!');
 			}
 		});
 	},

 	render: function(){
 		// this.$el.html(this.template({model: this.model.toJSON()}));
 		this.$el.html(this.template(this.model.toJSON()));﻿
 		return this;
 	}
});


//View 2 - Each single view put in a list. - Backbone view for all blogs

var BlogsView = Backbone.View.extend({
	model: blogs,
	el: $('.blogs-list'),
	initialize: function() {
		var self = this;
		this.model.on('add', this.render, this);
		this.model.on('change', function() {
			setTimeout(function() {
				self.render();
			}, 30);
		},this);
		this.model.on('remove', this.render, this);

		this.model.fetch({
			success: function(response) {
				_.each(response.toJSON(), function(item) {
					console.log('Successfully GOT blog with _id: ' + item._id);
				})
			},
			error: function() {
				console.log('Failed to get blogs!');
			}
		});
	},
	render: function() {
		var self = this;
		this.$el.html('');
		_.each(this.model.toArray(), function(blog) {
			self.$el.append((new BlogView({model: blog})).render().$el);
		});
		return this;
	}
});

var blogsView = new BlogsView();

//once finished loading run
$(document).ready(function(){
	$('.add-blog').on('click', function() {
		var blog = new Blog({
			author:$('.author-input').val(),
			title:$('.title-input').val(),
			url:$('.url-input').val()
		});
		//Clear input fields after add
		$('.author-input,.title-input,.url-input').val('');


		// console.log(blog.toJSON()); //debugging 
		blogs.add(blog);
		blog.save(null, {
			success: function(response) {
				console.log('Successfully SAVED blog with _id: ' + response.toJSON()._id);
			},
			error: function() {
				console.log('Failed to save blog!');
			}
		});
	});
})



