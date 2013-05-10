
/**
 * @fileoverview ʱ����
 * @module timeline/nav
 * @param
       
 * @return {object}
 **/

 KISSY.add('timeline/nav',function(S,template) {
	var D = S.DOM,
		E = S.Event;

	var SPACE = " ";

	var GLOBAL_API = {
		yearMonthApi:'http://bbs.hitao.com/apps.php?q=tvshow&m=video_years', // ��Ⱦ�Ҳ�������������·�API
		timeLineDataApi:'http://bbs.hitao.com/apps.php?q=tvshow&m=video_group' // �б������е�����API
	};
	var DEFAULT_TPL = {
		yealTpl:'{{#each yearLists as itemYear}}'+ 
					  '<div class="J_Year_Month">'+
					      '<div class="tao-header-title J_Header_Title">'+
						      '<span data-year="{{itemYear.year}}" class="J_Year">{{itemYear.year}}<i>��</i></span>'+
					      '</div>' + 
					      '<div class="tao-dottle-top"></div>' + 
					      '<div class="J_Video_Block"></div>' + 
				      '</div>'+
				  '{{/each}}',
		
		timeLineNav: '{{#each yearLists as itemYear}}'+
					 '<li data-year="{{itemYear.year}}" class="itemList">' + 
					      '<a class="yearlink" href="#">{{itemYear.year}}��</a>' +
						  '<ul class="timelinenav-mpanel"></ul>' +  
					 '</li>' + 
		             '{{/each}}',
		
		monthTpl:	'{{#each yearLists.month as month}}' + 
					 '<li data-year="{{yearLists.year}}" data-month="{{month}}" class="itemHover">' + 
						 '<a class="monthlink" href="#">{{month}}��</a>' +
					  '</li>'+
					'{{/each}}',

		listVideoTpl:   '{{#each dataLists as item}}' + 
						'<div class="tao-video-content">'+
							'<div class="addBlock"></div>' +
							'<div class="left-date" videoMonth="{{item.group_id.substring(4,6)}}">'+
								'<span><i class="J_Month" M_year="item.group_id.substring(0,4)">{{item.group_id.substring(4,6)}}</i>��</span>'+
								'<span><i class="J_Day">{{item.group_id.substring(6,8)}}</i>��</span>'+
							'</div>'+
							'<div class="tao-line"></div>'+
							'<div class="tao-inner-content">'+
								'<div class="tao-inner-block">'+
									'<div class="inner-left">'+
										'<a href="http://bbs.hitao.com/apps.php?q=tvshow&m=detail_new&tid={{item.tid}}" class="alink">'+
											'<img src="{{item.video_pic.replace("/0","/1")}}" alt="">'+
											'<span class="icon-player"></span>'+
										'</a>'+
									'</div>'+
									'<div class="inner-right">'+
										'<p class="inner-date">{{item.group_id.substring(0,4)}}-{{item.group_id.substring(4,6)}}-{{item.group_id.substring(6,8)}}</p>'+
										'<p class="inner-title">' +
											'<a href="http://bbs.hitao.com/apps.php?q=tvshow&m=detail_new&tid={{item.tid}}">{{item.subject}}</a>'+
										'</p>'+
										'<div class="inner-content">{{item.content}}</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						 '</div>' + 
						'{{/each}}'
	};	
	function TimeLine(config,callback) {
		var self = this;

		self.yearMonthApi = config.yearMonthApi || GLOBAL_API.yearMonthApi;

		self.timeLineData = config.timeLineDataApi || GLOBAL_API.timeLineDataApi;

		self.yealTpl = config.yealTpl || DEFAULT_TPL.yealTpl; // �б������ģ��

		self.timeLineNav = config.timeLineNav || DEFAULT_TPL.timeLineNav; //�����������ģ��

		self.childLineNav = (self.timeLineNav == DEFAULT_TPL.timeLineNav) ? '.timelinenav-mpanel' : config.childLineNav;

		self.monthTpl = config.monthTpl || DEFAULT_TPL.monthTpl; // ���������·�ģ��

		self.container = config.container || '.J_Video_Left'; // �б�����

		self.listYear = config.listYear || '.J_Year_Month'; // �б���ĳһ�����

		self.yearNum = config.yearNum || '.J_Year'; //�б���ĳһ������е����� ��2011

		self.yearNumAttr = config.yearNumAttr || 'data-year'; //�б���ĳһ������е����ֵ�����
		
		self.listMonth = config.listMonth || '.J_Month'; //�б���ĳһС���е��·�
			
		self.listYearVideos = config.listYearVideos || '.J_Video_Block'; //�б���ĳһ���������Ƶ
		
		self.timePanel = config.timePanel || '#timelinenavpanel'; // ����������
		
		self.itemYear = config.itemYear || '.itemList'; // ��������ĳһ�����

		self.itemMonth = config.itemMonth || '.itemHover'; // ��������ĳһ���·�

		self.dataMonth = config.dataMonth || 'data-month'; //��������ĳ���·��е�����

		self.highlight = config.highlight || 'highlight'; // ��������

		self.isScroll = config.isScroll || 'isScroll';  // �����������е�����

		self.active = config.active || 'active'; // �����������չ������

		self.modFixed = config.modFixed || 'mod-fixed'; // ������fixed���� �붥������ 

		self.leftDate = config.leftDate || '.left-date';  // �б��е��·�DOM����(������04)

		self.leftDateAttr = config.leftDateAttr || 'videomonth'; //�б��е��·ݵ�����(������04)
		
		self.listVideoTpl = config.listVideoTpl || DEFAULT_TPL.listVideoTpl;
	}
	TimeLine.prototype = {
		init: function(callback) {
			var self = this;

			/*
			 * ��jsonp����
			 * 1. ��Ⱦ�б����������HTML����
			 * 2. �ѿ������ϵ�������ݼ��·ݼ���Ŀ�б��е������Ⱦ����
			 */
			S.jsonp(GLOBAL_API.yearMonthApi + "&timestamp="+S.now(),function(data){
				  if(data.isSuccess) {
				      var yearLists = data.list,
						  yearHTML = "",
						  timeLineHTML = "";
					      self._yearLists = yearLists;
						
					  // ���б������������Ⱦ����
					  D.html(self.container,template(self.yealTpl).render({yearLists:yearLists})); 
					  
					  var recentlyYear = yearLists[0].year;

					  //�ѿ������������Ⱦ����
					  D.html(self.timePanel,template(self.timeLineNav).render({yearLists:yearLists}),false,function(){
						  D.addClass(D.get(self.timePanel +SPACE+ self.itemYear),self.active);
						  D.attr(D.get(self.timePanel +SPACE+ self.itemYear),{"index":"1"});
					  });
					  
					  var timeLineNavs = D.query(self.childLineNav); // �����·ݵ�����
					  for(var j = 0, jlen = yearLists.length; j < jlen; j+=1) {

						  D.html(timeLineNavs[j],template(self.monthTpl).render({yearLists:yearLists[j]}),false,function() {
							  D.addClass(D.get(self.itemMonth),self.highlight);
						  });
					  }
					var itemLists = D.query(self.itemYear),
						headerTitle = D.query(self.yearNum);
					S.each(itemLists,function(item,index){
						var innerIndex;
						   E.on(item,'click',function(e){
							   var target = e.target;
							   e.halt();
							   innerIndex = index;
							   var scrollTimer,
								   DELAY = 0.3;
							   !D.hasClass(KISSY.all(this),self.active) && KISSY.all(this).addClass(self.active).siblings().removeClass(self.active);
							   
							   var curThis = KISSY.all(this);
							   // ɾ����
							   D.hasClass(D.get(self.timePanel),self.isScroll) && D.removeClass(D.get(self.timePanel),self.isScroll);
							   var headerTop = D.offset(headerTitle[index]).top;
							   scrollTimer && scrollTimer.cancel();
							   scrollTimer = S.later(function(){
									KISSY.all("html,body").animate({"scrollTop":headerTop},DELAY,'easeBothStrong',function(){
										D.removeClass(D.query(self.itemMonth),self.highlight);
										!D.hasClass(D.get(self.itemMonth,curThis),self.highlight) && D.addClass(D.get(self.itemMonth,curThis),self.highlight);
										!D.hasClass(D.get(self.timePanel),self.isScroll) && D.addClass(D.get(self.timePanel),self.isScroll);
									});
								},DELAY);
								self._clickMenu(itemLists,innerIndex);
						   });
						   if(innerIndex == "undefined"){
							  innerIndex = 0;
							  self._clickMenu(itemLists,innerIndex);
						   }
					});
					self._query();
				  }
			 });
			 
			 self._inited = true;
			
			// �ص�����
			if(callback && S.isFunction(callback)) {
				callback();
			}
		},
		
		_inited: false,

		_yearLists: undefined,
		
		_videoLists: undefined,
		
		_videoState: false,

		_getData: function(yearLists) {
			return yearLists;
		},
		_getVideoList: function(videoStates) {
			return videoStates;
		},
		_query: function(target) {
			var self = this,
				allYears = D.query(self.listYear);
			S.each(allYears,function(everyYear,index){
				var jyear = D.get(self.yearNum,everyYear),
					jyearAttr = D.attr(jyear,self.yearNumAttr),
					jvideoBlock = D.get(self.listYearVideos,everyYear);
				
				// ��jsonp����
				S.jsonp(GLOBAL_API.timeLineDataApi+"&group="+jyearAttr+"&timestamp="+S.now(),function(data){
						if(data.isSuccess){
							var dataLists = data.list;
							self._videoLists = dataLists;
							self._renderHTML(jvideoBlock,dataLists,index);
						}	
				});
			});
			self._videoState = true;
		},
		_renderHTML: function(jvideoBlock,dataLists,index) {
			var self = this;
			D.html(jvideoBlock,template(self.listVideoTpl).render({dataLists:dataLists}),false,function(){
				var itemLists = D.query(self.itemYear),
					itemHover = D.query(self.itemMonth,itemLists[index]),
					jmonths = D.query(self.listMonth,jvideoBlock[index]),
					headerTitle = D.query(self.yearNum);

				// Ĭ��ʱ�� ��ǰ��� ����·ݸ���
				D.addClass(D.get(self.itemMonth),self.highlight);
				function storage(itemFChar) {				
					for(var i = 0, ilen = itemHover.length; i < ilen; i+=1) {
						 var itemMonth = D.attr(itemHover[i],self.dataMonth);
						 if(itemMonth == itemFChar){
							KISSY.all(itemHover[i]).addClass(self.highlight).siblings().removeClass(self.highlight);
						}
					}
				}
				// 1.�������ȹ��� ���붥�������಻���ʱ�� ʹ�Ҳ�˵��̶��ڶ���20px;
				var timeline = D.offset(self.childLineNav).top,
					scrollTimer2,
					DELAY2 = 100;
				E.on(window,'scroll',function() {
					scrollTimer2 && scrollTimer2.cancel();
					scrollTimer2 = S.later(function(){
						var windowTop = D.offset(window).top;
						if(timeline <=windowTop){
							D.addClass(self.timePanel,self.modFixed);
						}else{
							D.removeClass(self.timePanel,self.modFixed);
						}
					},DELAY2);
					if(D.hasClass(D.get(self.timePanel),self.isScroll)) {
						var wTop = D.offset(window).top;
						/* �б��е���ݺͿ������е�������ʱ�� ����������չ�� */
						for(var m=0,mlen=headerTitle.length; m<mlen; m+=1){
							var headerTop = D.offset(headerTitle[m]).top,
								headAttr = D.attr(headerTitle[m],self.yearNumAttr),
								itemAttr = D.attr(itemLists[m],self.yearNumAttr);
							if(headerTop <= wTop){
								if(headAttr == itemAttr){
									KISSY.all(itemLists[m]).addClass(self.active).siblings().removeClass(self.active);
								}
							}
						}
						/* ���������б�������е��·�ʱ�� ��Ӧ�Ŀ������·�ҲҪ��Ӧ�ı仯(�������) */
						// ��������������������·�ͬʱ�仯 
						for(var nn = 0, nlen = jmonths.length; nn < nlen; nn+=1){
							var jmonthTop = D.offset(jmonths[nn]).top;
							
							if(jmonthTop <= wTop){
								var itemVal = D.html(jmonths[nn]),
								// ת��02 -> 2 
								itemFChar = itemVal.substring(0,1);
								if(itemFChar == "0") {
									itemFChar = itemVal.substring(1,2);
								}else{
									itemFChar = itemVal.substring(0,2);
								}
								storage(itemFChar);
							}
						}
					}
				});
			});
		},
		_clickMenu: function(itemLists,innerIndex){
			var self = this;
			if(innerIndex == "undefined"){
				return;
			}
			// ��������ᵱǰ����е��·�ʱ�� ��������ǰ���·ݵĵط���
		    var itemHovers = D.query(self.itemMonth,KISSY.all(itemLists[innerIndex]));
			S.each(itemHovers,function(itemHover,curIndex){
				E.on(itemHover,'click',function(e){
					e.halt();
					var itemMonth = D.attr(KISSY.all(itemHover),self.dataMonth);
					var tempArr = [],
						scrollTimer,
						DELAY = 0.1;
					var	curMonths = D.query(self.leftDate,D.query(self.listYear)[innerIndex]);
					 // ɾ����
					D.hasClass(D.get(self.timePanel),self.isScroll) && D.removeClass(D.get(self.timePanel),self.isScroll);
					!D.hasClass(KISSY.all(this),self.highlight) && KISSY.all(this).addClass(self.highlight).siblings().removeClass(self.highlight);
					for(var i=0; i<curMonths.length; i+=1){
						var itemVal = D.attr(curMonths[i],self.leftDateAttr);
						// ת��02 -> 2 
						var itemFChar = itemVal.substring(0,1);
						if(itemFChar == "0"){
							itemFChar = itemVal.substring(1,2);
						}else{
							itemFChar = itemVal.substring(0,2);
						}
						tempArr.push(itemFChar);
					}
					for(var j=0; j<tempArr.length; j+=1){
						var tempV = tempArr[j];
						if(itemMonth == tempArr[j]){
							var mtop = D.offset(curMonths[j]).top;
							scrollTimer && scrollTimer.cancel();
							scrollTimer = S.later(function(){
								KISSY.all("html,body").animate({"scrollTop":mtop},DELAY,'easeBothStrong',function(){
									!D.hasClass(D.get(self.timePanel),self.isScroll) && D.addClass(D.get(self.timePanel),self.isScroll);
								});
							},DELAY);
							break; // ��break�ǵ�����������·��ж����ͬ��ʱ�� ֻȡ��һ���·�
						}
					}
				});
			});
		},
		getYearData: function() {
			var self = this;
			if(self._inited){
				return self._getData(self._yearLists);
			}else{
				self.init();
				return self._getData(self._yearLists);
			}
		},
		getVideoData: function() {
			var self = this;
			if(self._videoState){
				return self._getVideoList(self._videoLists);
			}else{
				self.init();
				return self._getVideoList(self._videoLists);
			}
		}
		
	};

	return TimeLine;
 },{requires:['template']});