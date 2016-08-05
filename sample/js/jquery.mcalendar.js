/*!
 * jquery.mcalendar.js 0.0.1 - https://github.com/lgcjh0s/mcalendar/blob/master/jquery.mcalendar.js
 * Render Calendar User Interface
 *
 * Copyright (c) 2016 Hongdae Son
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2016/08/01
 **/
(function($) {
	
	var mcalendar = {
		skin: 'default',
		templates: [],
		
		getLastDate: function(year, month) {
      var next = parseInt(month, 10) + 1;
      return new Date(year, next - 1, 0).getDate();
    },
	    
    getMonth: function(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var lastDate = this.getLastDate(year, month);
      var today = null;
      var m = [];
      var index = 0;
	    	
      for (var inx=0; inx<lastDate; inx++) {
        today = new Date(year, month - 1, inx + 1);
        if (inx == 0) index = today.getDay();
        m[index] = today;
        index++;
      }
	    	
      return m;
    },
	    
    getNext: function(current) {
      return new Date(current.getFullYear(), current.getMonth() + 1, 1);
    },
	    
    getPrev: function(current) {
      return new Date(current.getFullYear(), current.getMonth() - 1, 1);
    },
	    
    addFiller: function(value, filler, count) {
      var fillers = '';
      var val = value.toString();
	    	
      if (val.length < count) {
        for (var inx=0; inx<count-val.length; inx++) {
          fillers += filler;
        }
      }
	    	
      return fillers + val;
    },
	    
    format: function(date, format) {
      if (!date || date == '') return '';

      var regEx = new RegExp('(y{0,4})([^yMdHhms]*)(M{0,2})([^yMdHhms]*)(d{0,2})([^yMdHhms]*)');
      var regExArr = regEx.exec(format);
	    	
      var yf = regExArr[1], 
          mf = regExArr[3],
          df = regExArr[5];
      var dmt1 = regExArr[2].toString(),
          dmt2 = regExArr[4].toString();
	    	
      var year = this.addFiller(date.getFullYear(), '0', yf.length),
          month = this.addFiller(date.getMonth() + 1, '0', mf.length),
          day = this.addFiller(date.getDate(), '0', df.length);
	    	
      var f = '';
      if (yf.length > 0) f += year;
      if (dmt1.length > 0) f += dmt1;
      if (mf.length > 0) f+= month;
      if (dmt2.length > 0) f+= dmt2;
      if (df.length > 0) f+= day;
	    	
      return f;
    },
	    
    loadLayout: function(uri, callback) {
      $.get('./skin/' + mcalendar.skin + '/' + uri +'.html', function(data) {
        mcalendar.templates[uri] = data;
        if (callback) callback();
      });
    },
    
    loadCss: function(target) {
			$.get('./skin/' + mcalendar.skin + '/skin.css', function(data) {
				$(target).append('<style type="text/css">' + data + '</style>');
			});
    },
	    
		draw: function(y, m, target, options) {
			
			if (!options) options = {};
			layout = $(this.template['monthly_view']);

			var date = new Date(y, m, 1);
			var month = mcalendar.getMonth(date);
			
			layout.find('.cal_title').text(mcalendar.format(date, 'yyyy.MM'));
			
			var tbody = layout.find('table.tb_cal tbody');
			tbody.empty();
			
			var dailyViewFnc = options.dailyViewFnc;
			var tr = null,
					td = null;
			
			for (var inx=0; inx<month.length; inx++) {
				if (inx % 7 == 0) {
					if (tr != null) tbody.append(tr);
					tr = $('<tr>');
				}
				td = $('<td>');
				
				if (month[inx]) {
					td.addClass('toucheffect');
					td.addClass('cal_box');
					if (dailyViewFnc && typeof dailyViewFnc == 'function') {
						dailyViewFnc(inx, td, month[inx]);
					} else {
						td.html(month[inx].getDate());
					}
				}
				tr.append(td);
			}
			
			if (month.length % 7 > 0) {
				var remain = 7 - (month.length % 7);
				for (var inx=0; inx<remain; inx++) {
					td = $('<td>');
					if (dailyViewFnc && typeof dailyViewFnc == 'function') {
						dailyViewFnc(month.length + inx, td, null);
					} else {
						td.html('');
					}
					tr.append(td);
				}
			}
			tbody.append(tr);
			$(target).append(layout);
		},
	};
	
	$.mcalendar = function() {};
	$.mcalendar.setSkin = function(skin) {
		mcalendar.skin = skin;
	};
	
	jQuery.fn.mcalendar = function(y, m, options) {
		var target = $(this);
		mcalendar.loadCss(target);
		mcalendar.loadLayout('monthly_view', function() {
			mcalendar.draw(y, m, target, options);
		});
	};
}(jQuery));
