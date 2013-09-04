<?php
	

include('key.php');

date_default_timezone_set('UTC');

/*

	Weatherunderground API
	
	free account:
	Calls per minute: 10
	Max daily requests: 500

	URL Format
	http://www.wunderground.com/weather/api/d/docs?d=data/index

	

*/

$locations = array(
	0 => "sanfran",
	1 => "nyc"
);




$today = date("Ymd");
$refresh = false;

const calls_per_minute = 10;
const max_daily_requests = 400; // 500

$max_iterations = max_daily_requests / calls_per_minute; // * 10
$current_requests = 0;

while($current_requests < max_daily_requests) {

	sleep(60);

	// should we try to fetch new data?
	$cached = json_decode(file_get_contents("weather.json"),true);

	if($cached["sanfran"][0]['date'] != $today) {
		$refresh = true;
	} else {
		$refresh = false;
	}

	// $refresh = true;


	// REFRESH ********************************************************

	if($refresh == true) {

		date_default_timezone_set('UTC');

		// get last date
		$length = sizeof($cached["sanfran"]);
		$date = $cached["sanfran"][$length-1]['date'];

		$end_date = date('Ymd',strtotime($lastdate.' +10 days'));

		// Build date array
		while (strtotime($date) <= strtotime($end_date)) {
			$date = date ("Ymd", strtotime("+1 day", strtotime($date)));
			$date_array[] = $date;
		}

		// Set fields to capture
		$fields = array('rain', 'snow', 'fog', 'thunder', 'tornado', 'hail', 'snowfallm', 'meantempm', 'meanwindspdm', 'precipm', 'meanvism');

		// grab 10 days worth of data

		for($i=0; $i<10; $i++) {
			$data[$i]['date'] = $date_array[$i];

			$raw = json_decode(file_get_contents('http://api.wunderground.com/api/'.$key.'/history_'.$date_array[$i].'/q/CA/San_Francisco.json'),true);

			foreach ($fields as $field) {
				$data[$i][$field] = $raw['history']['dailysummary'][0][$field];
			}
		}


		// Add to cached data

		$new["sanfran"] = array_merge($cached["sanfran"], $data);

		// update file
		$fp = fopen('weather.json', 'w');
		fwrite($fp, json_encode($new));
		fclose($fp);

		$current_requests += 10;

		// $timestamp = date('U');

		echo 'updated ('.$current_requests.' requests)'.PHP_EOL;
	}

	// SERVE CACHED ********************************************************

	else {
		echo 'from_cache';
	}

}



?>