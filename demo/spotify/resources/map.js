// This file contains all the handling of the CartoDB map //

var MapHandler = new function ()
{
	var id = null;
	var map = null;
	var mapCreationInit = false;
	
	function createMap (mapDependentCallback)
	{
		if (id == null) 
		{
			console.log('ERROR: The map needs to be initialized before it can be updated.');
		}
		
		mapCreationInit = true;
	
		// Create the CartoDB map visualisation.
		// cartodb.createVis(id, 'http://oloflandahl.cartodb.com/api/v1/viz/22447/viz.json', {
		cartodb.createVis(id, 'http://oloflandahl.cartodb.com/api/v2/viz/9a1411bc-bf07-11e3-84c2-0e73339ffa50/viz.json', {
			tiles_loader: false,
			zoomControl: true,
			cartodb_logo: false,
			center: [15, 0],
			zoom: 1
		})
		.done(function(vis, layers) 
		{
			// layer 0 is the base layer, layer 1 is cartodb layer
			layers[1].on('featureOver', function(e, latlng, pos, data) {
				// TODO Do something?
			});
			
			var zoomControl = vis.getOverlay('zoom');
			(zoomControl.$el).css({
				'opacity':'0.7',
				'filter':'alpha(opacity=70)',
				'margin':'5px'
			});
			
			(zoomControl.$el).children().css('margin', '1px');
			
			// Store the map visualisation.
			map = vis;

			if (mapDependentCallback !== undefined)
			{
				// Run the callback dependant on the map object. 
				mapDependentCallback();
			}
		})
		.error(function(err) 
		{
			console.log(err);
		});
	}

	function getAllCodes() 
	{
		return ['AD','AE','AF','AG','AI','AL','AM','AO','AQ','AR','AS','AT','AU','AW','AX','AZ','BA','BB','BD','BE','BF','BG','BH','BI','BJ','BL','BM','BN','BO','BQ','BR','BS','BT','BV','BW','BY','BZ','CA','CC','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO','CR','CU','CV','CW','CX','CY','CZ','DE','DJ','DK','DM','DO','DZ','EC','EE','EG','EH','ER','ES','ET','FI','FJ','FK','FM','FO','FR','GA','GB','GD','GE','GF','GG','GH','GI','GL','GM','GN','GP','GQ','GR','GS','GT','GU','GW','GY','HK','HM','HN','HR','HT','HU','ID','IE','IL','IM','IN','IO','IQ','IR','IS','IT','JE','JM','JO','JP','KE','KG','KH','KI','KM','KN','KP','KR','KW','KY','KZ','LA','LB','LC','LI','LK','LR','LS','LT','LU','LV','LY','MA','MC','MD','ME','MF','MG','MH','MK','ML','MM','MN','MO','MP','MQ','MR','MS','MT','MU','MV','MW','MX','MY','MZ','NA','NC','NE','NF','NG','NI','NL','NO','NP','NR','NU','NZ','OM','PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PW','PY','QA','RE','RO','RS','RU','RW','SA','SB','SC','SD','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','SS','ST','SV','SX','SY','SZ','TC','TD','TF','TG','TH','TJ','TK','TL','TM','TN','TO','TR','TT','TV','TW','TZ','UA','UG','UM','US','UY','UZ','VA','VC','VE','VG','VI','VN','VU','WF','WS','YE','YT','ZA','ZM','ZW'];
	}

	// Build a CartoCSS style string from the defined selection and styles.
	function buildStyle (defaultStyles, selection, selectionStyles) 
	{	
		var style = '{';
		for (var i=0; i<defaultStyles.length; i++) 
		{
			style += defaultStyles[i];
		}
		
		style += selection;
		style += '{';
		for (var i=0; i<selectionStyles.length; i++) 
		{
			style += selectionStyles[i];
		}
		
		style += '}}';
		
		return style;
	}

	// Get CartoCSS selection string for the specified country code.
	function getSingleSelection(code, last) 
	{
		return '[c="' + code + '"]' + (last === false ? ',' : '' );
	}

	// Get CartoCSS selection string for the specified country codes.
	function getSelection(codes) 
	{
		var s = "";
		var noOfCodes = codes.length;
		for (var i=0;i<noOfCodes;i++) 
		{
			s += getSingleSelection(codes[i], i == codes.length-1);
		}
		
		return s;
	}
	
	// Set the CartoCSS style.
	function setStyle (style) 
	{
		if (map !== null) 
		{
			map.getLayers()[1].setCartoCSS('#table_name ' + style);
		}
	}
	
	this.init = function (mapWrapperId) 
	{
		id = mapWrapperId;
	}
	
	this.setZoom = function (zoom) 
	{
		if (id == null) 
		{
			console.log('ERROR: The map has to be initialized before zooming.');
		}
		
		var setCartoDBZoom = function () 
		{
			map.getNativeMap().setZoom(zoom);
		};
		
		if (!mapCreationInit)
		{
			createMap(setCartoDBZoom);
		}
		else if (map !== null) 
		{
			setCartoDBZoom();
		}
	}

	this.update = function (codes) 
	{
		if (id == null) 
		{
			console.log('ERROR: The map has to be initialized before updating.');
		}
		
		var setCartoDBCSS = function () 
		{
			var green = '#28c81e;';
			var grey = '#aaa;';
			
			var defaultStyle = 			
				'marker-opacity:0.7;\
				marker-allow-overlap:true;\
				marker-width:10;\
				marker-line-color:#fff;\
				marker-line-opacity:0.5;';
			
			if (codes.length === 0) 
			{
				// Set all markers to grey.
				setStyle('{marker-fill:' + grey + defaultStyle + '}');
				return;
			}
				
			// IE only supports GET request urls with less than 2048 characters.
			// Invert to minimize the url if necessary.
			var invert = codes.length > 150;
				
			var selection = invert ? 
				getSelection(_.difference(getAllCodes(), codes)) : 
				getSelection(codes);
			
			var selectionFill = 'marker-fill:' + (invert ? grey : green);
			var defaultFill = 'marker-fill:' + (invert ? green : grey);
			
			var style = buildStyle([defaultFill, defaultStyle], selection, [selectionFill]);
			setStyle(style);
		};
		
		if (!mapCreationInit)
		{
			createMap(setCartoDBCSS);
		}
		else if (map !== null) 
		{
			setCartoDBCSS();
		}
	};
};