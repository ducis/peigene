$(document).ready(function(){
	paged_creat($(".paged-test"),{
		nav_button_maker: function(x){
			return $("<input type='button' value='"+x+"'>");
		}
	});
	paged_creat($(".paged-test"),{start_page:1,num_pages:88,page_direction:1,page_size:8});
	paged_creat($(".paged-test"),{start_item:9999999,item_direction:-1,page_size:12});
	paged_creat($(".paged-test"),{
		itemizer: function(x){return $("<div class='paged-item' style='display:inline-block'>"
			+"<img src='"+(x%7)+".gif'>" + "<div>" + x + "</div>"
			+"</div>")[0];} ,
		harness: $("<div class='paged-outmost' style='width:830px'> <div class='paged-controls'></div> <div class='paged-display'></div> </div>"),
		num_pages:7,
		start_page:1,
		page_direction:1,
		item_direction:-1,
		start_item:999
	});
});
