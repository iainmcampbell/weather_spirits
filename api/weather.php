<?php
	

include('key.php');

/*
	Calls per minute: 10
	Max daily requests: 500
*/

$locations = array(
	0 => "sanfran",
	1 => "nyc"
);




$today = date("Ymd");
$refresh = false;

$max_requests = 50;
$current_requests = 0;

// $timestamp = date('U');

while($current_requests < $max_requests) {


	// // has it been 60 seconds?
	// $temp_timestamp = date('U');

	// while($temp_timestamp < $timestamp+70) {
	// 	sleep(10);
	// 	$temp_timestamp = date('U');
	// }


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
		
		echo 'updated ('.$current_requests.' requests)';
	}

	// SERVE CACHED ********************************************************

	else {
		echo 'from_cache';
	}

}



?>