function paged_creat(container,user_conf){
	//alert("0");
	var paged_defaults = { 
		data_url: "paged_data.php",	
		start_page: 999,
		num_pages: 999,
		page_direction: -1, // either 1 or -1
		radix: [10,10], // :: array of int
		digit_offset: [1], // :: array of int
		page_size: 30,
		nav_row_lim: 8,
		start_item: 0,
		item_direction: 1, // either 1 or -1
		stream_decoder: JSON.parse, // :: string -> array of (json | string)
		itemizer: function(x){return $("<pre class='paged-item'>"+x+"</pre>")[0];}, // ::  string | json -> DOM
		query_option_signal: constantB(""), // :: Behavior string 
		harness: $("<div class='paged-outmost'>  <div class='paged-display'></div>  <div class='paged-controls'></div>  </div>"), // :: jQuery  // .paged-outmost is not neccesary
		nav_button_maker: function(x){ return $("<a class='paged-nav-button'>"+x+"</a>"); }, // :: string -> jQuery
		page_indicator: function(x,n,ds,radix){ return $("<span>Page "+x+" of "+n+" pages.</span>"); }, //:: string * string->jQuery
		ellipse: "..."
		//nav_layout: function(l,r,x){ return ["<-"].concat().concat(["->"]);}
	};
	// The consistency between stream_decoder and itemizer needs to be maintained by the user

	//alert("1");
	var conf = $.extend(true,{},paged_defaults,user_conf);
	//alert("2");
	var root = conf.harness;
	function dummy_child(x){
		return x.append($("<span></span>")).children()[0];
	}

	var n_digits = 0;
	var digits = [];
	{
		var divisor = undefined;
		for(var x=conf.num_pages;x>0;x=Math.floor(x/divisor)){
			divisor = conf.radix[Math.min(n_digits,conf.radix.length-1)];
			digits[n_digits++] = x % divisor;
		}
	}

	var pageE0 = receiverE(); //break feedback loop
	var pageB0 = startsWith(pageE0,conf.start_page);
	var goto_pageE = receiverE();
	var nav_barB = liftB(
		function(p0){
			var c = conf.nav_button_maker;
			var start = conf.start_page;
			var end = start+conf.page_direction*(conf.num_pages-1);

			function nav_btn(sym,barrier,dest){
				var x = c(sym);
				if(p0!=barrier) x.click(function(){goto_pageE.sendEvent(dest)});
				else x.prop('disabled',true);
				return x;
			}
			var head = nav_btn("|<",start,start);
			var prev = nav_btn("<-",start,p0-conf.page_direction);
			var next = nav_btn("->",end,p0+conf.page_direction);
			var tail = nav_btn(">|",end,end);

			var ds = [];
			var offsets = [];

			{
				var divisor = undefined;
				for(var i=0,x=p0;i<n_digits;x=Math.floor(x/divisor)){
					divisor = conf.radix[Math.min(i,conf.radix.length-1)];
					offsets[i] = conf.digit_offset[Math.min(i,conf.digit_offset.length-1)];
					ds[i++] = x % divisor;
				}
			}

			return $("<div></div>").append([head,prev,conf.page_indicator(p0, conf.num_pages, ds, conf.radix),next,tail])[0];
		},pageB0);
	insertDomB(nav_barB,dummy_child(root.find(".paged-controls")));

	var pageB = startsWith(goto_pageE,conf.start_page);
	var pageE = mergeE(oneE(conf.start_page),changes(pageB));
	mapE(
		function(e){
			pageE0.sendEvent(e);
			return e;
		},pageE); //feedback
	var requestE = mapE(
		function(page){
			var i_start = (page-conf.start_page)*conf.page_direction*conf.item_direction*conf.page_size+conf.start_item;
			var i_end = i_start+(conf.page_size-1)*conf.item_direction; 
			return {
				url: conf.data_url+"?"+"start="+i_start+"&end="+i_end,
				request: 'get',
				response: 'plain',
				async: true
			};
		},pageE);
	var responseE = getWebServiceObjectE(requestE);
	var itemizedE = mapE(function(stream){
		return $("<div></div>").append(map(conf.itemizer,conf.stream_decoder(stream)))[0];
	},responseE);
	insertDomE(itemizedE,dummy_child(root.find(".paged-display")));

	container.append(root);
	//alert("3");	
}

