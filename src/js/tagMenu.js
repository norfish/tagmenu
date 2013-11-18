(function(){
	'use strict';

	function TagMenu (element, options){
		this.element = element;
		this.options = options;
		this.data = {};
		this.init();
	}

	function pageScroll(step, to) {
    	window.scrollBy(0,step); // horizontal and vertical scroll increments
    	//var scrolldelay = setTimeout(pageScroll(),100); // scrolls every 100 milliseconds
    	var ps = setTimeout(function(){
    		pageScroll(step);
		},20);
		if($(document).scrollTop() > to){
			clearTimeout(ps);
		}
	}

	function scrollPage(to){

		var dis = to - $(document).scrollTop();
		var step = dis > 0 ? 20 : -20;
		var time = Math.ceil(dis/20);
		var over = time*step - dis;
		/*while(i<time){
			setTimeout(function(){
				window.scrollBy(0,20); 
			},20);
			i++;
		}*/

		//window.scrollBy(0,over);
		pageScroll(step, to);
		window.scrollBy(0,over);
	}
	
	function stopScroll() {
    	clearTimeout(scrolldelay);
	}

	TagMenu.prototype = {
		init: function(){
			var self = this;
			var menu = self.element.find('.sideCatalog-item');
			var tag = $('.tm-tag');
			self.data.tagpos = [];
			self.data.menu = menu;
			$.each(tag, function(k, item){
				item = $(item);
				self.data.tagpos.push(item.offset().top);
			});

			$.each(menu, function(k, item){
				$(item).data('tag-index', k);
			})
			console.log(self.data);
		},

		// 处理tag内容滚动
		scroll: function(){
			//debugger
			var self = this;
			var active = self.element.find('.highlight');
			var index = active.data('tag-index');
			window.scroll(0, this.data.tagpos[index]);
			return false;
		},

		// 处理menu跟随tag滚动而改变
		activeLink: function(){
			var self = this;
			var pos = $(document).scrollTop();
			var index = self.element.find('.highlight').data('tag-index');
			var tagpos = this.data.tagpos;
			var menuIndex;

			// 预留100像素的边界
			if(pos < tagpos[index] - 100){
				menuIndex = index ? index - 1 : 0; 
			}else if(pos > tagpos[index + 1] - 100){ // index+1 边界
				menuIndex = index + 1;
			}else{
				return;
			}
			var elm = self.element.find('.sideCatalog-item')[menuIndex];
			self.highlight(elm);
		},

		highlight: function(elm){
			$(elm).siblings().removeClass('highlight').end().addClass('highlight');
		}
	}

	$.fn.tagmenu = function(){
		var self = this;
		var tagmenu = new TagMenu(self,{});

		tagmenu.element.on('click', '.sideCatalog-item', function(){
			tagmenu.highlight(this);
			tagmenu.scroll();
		});

		$(document).on('scroll', function(evt){
			tagmenu.activeLink();
		})
	}

	//pageScroll();
	/*$("html, body").animate({scrollTop:2000}, '1000', 'swing', function() { 
	   alert("Finished animating");
	});*/

})(jQuery,window);