

var api = {

	APPID : 'JeUY3lLV34G.XLEqv9Yqy35XkHWeyV3CLaHqt3YpTiYUAAe_G3UcF_eawAj9SoerTcwGckPdV5EuDQ3H7tk-',
	DEG : 'c',
	lat : '',
	lon : '',

	locSuccess : function(position){
		console.log(position)

		api.lat = position.coords.latitude;
	    api.lon = position.coords.longitude;

		
	},

	locError : function(){
		switch(error.code) {
	        case error.TIMEOUT:
	            showError("A timeout occured! Please try again!");
	            break;
	        case error.POSITION_UNAVAILABLE:
	            showError('We can\'t detect your location. Sorry!');
	            break;
	        case error.PERMISSION_DENIED:
	            showError('Please allow geolocation access for this to work.');
	            break;
	        case error.UNKNOWN_ERROR:
	            showError('An unknown error occured!');
	            break;
	    }
	},

	init : function(){

		// Get user location
		if(Modernizr.geolocation) {
			navigator.geolocation.getCurrentPosition(api.locSuccess, api.locError);
		} else {
			console.error('Your browser does not support geolocation.')
		}


	},





}