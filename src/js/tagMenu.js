(function(){
	'use strict';

	var menuScroll = false;

	//私有属性
	function TagMenu (element, options){
		this.element = element;
		this.options = options;
		this.data = {};
		this.init();
	}

	//使用动画滚动浏览器滚动条
	function scrollToElement( target ) {
	    var topoffset = 0;
	    var speed = 400;
	    var destination = $( target ).offset().top - topoffset;
	    $( 'html:not(:animated),body:not(:animated)' ).animate( { scrollTop: destination}, speed, function(){
	        window.location.hash = $(target).attr('name');
	        menuScroll = false;
	    });
	    return false;
	}

	// 原型属性及方法
	TagMenu.prototype = {

		// 初始化
		init: function(){
			var self = this;
			self.data.tag = $('.tm-tag'),
			self.data.tagpos = [],
			self.data.menu = self.element.find('.tm-menu');

			$.each(self.data.tag, function(k, item){
				item = $(item);
				self.data.tagpos.push(item.offset().top);
			});

			$.each(self.data.menu, function(k, item){
				$(item).data('tag-index', k);
			})
			console.log(self.data);
		},

		// 处理tag内容滚动
		scroll: function(){
			var self = this,
				active = self.element.find('.highlight'),
				index = active.data('tag-index'),
				activetag = self.data.tag[index];
			setTimeout(function(){
				menuScroll = true;
				scrollToElement(activetag);
			},0);
			return false;
		},

		// menu跟随tag滚动而改变
		activeLink: function(){
			var menuIndex,
				self = this,
				tagpos = this.data.tagpos,
				pos = $(document).scrollTop(),
				index = self.element.find('.highlight').data('tag-index');

			// 预留100像素的边界
			if(pos < tagpos[index] - 100){
				index = index ? index - 1 : 0; 
			}else if(pos > tagpos[index + 1] - 100){ // index+1 边界
				index = index + 1;
			}else{
				return;
			}
			var elm = self.element.find('.tm-menu')[index];
			self.highlight(elm);
		},

		highlight: function(elm){
			elm = $(elm);
			if(!elm.hasClass('highlight')){
				elm.siblings().removeClass('highlight').end().addClass('highlight');
			}
		}
	}

	//jquery plugin
	$.fn.tagmenu = function(){
		var self = this;
		var tagmenu = new TagMenu(self,{});

		tagmenu.element.on('click', '.tm-menu', function(){
			tagmenu.highlight(this);
			tagmenu.scroll();
		});

		$(document).on('scroll', function(evt){
			if(!menuScroll){
				tagmenu.activeLink();
			}
		})
	}

})(jQuery,window);