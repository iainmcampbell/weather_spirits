<?php
	


/*

	Weather Fetcher

	Bulk fetches one year's worth of data for a city,
	from weatherunderground's API.


*/

include('key.php');

date_default_timezone_set('UTC');

/*

	Weatherunderground API
	
	free account:
	Calls per minute: 10
	Max daily requests: 500

	URL Format
	http://www.wunderground.com/weather/api/d/docs?d=data/index
	
	Autocomplete
	http://autocomplete.wunderground.com/aq?query=Query
	
	API History Requests
	http://api.wunderground.com/api/$[api_key]/history_[date]/q/[country]/[city].json	

	http://api.wunderground.com/api/bfdad526f32d9053/history_20130830/q/Canada/Toronto.json

*/

$location_urls = array(
	"Canada/Toronto",
	"Thailand/Bangkok",
	"Israel/Tel_Aviv",
	"UK/London",
	"Finland/Helsinki",
	"Canada/Iqaluit",
	"ZA/Johannesburg",
	"BR/Sao_Paulo",
	"Panama/Panama_City",
	"Egypt/Cairo"
);

$location_names = array(
	"toronto",
	"bangkok",
	"telaviv",
	"london",
	"helsinki",
	"iqaluit",
	"joburg",
	"saopaulo",
	"panama",
	"cairo"
);




$today = date("Ymd");
$refresh = false;

const calls_per_minute = 10;
const max_daily_requests = 490; // 500

$max_iterations = max_daily_requests / calls_per_minute; // * 10
$current_requests = 0;

$fields = array('rain', 'snow', 'fog', 'thunder', 'tornado', 'hail', 'snowfallm', 'meantempm', 'meanwindspdm', 'precipm', 'meanvism');


$cached = json_decode(file_get_contents("helsinki.json"),true);

while($current_requests < max_daily_requests) {

	// get last date

	$length = count($cached["helsinki"]);
	$date = $cached["helsinki"][$length-1]["date"];

	if($date == date('Ymd')) {
		echo 'TODAY';
		break;
	}

	$end_date = date('Ymd',strtotime("+1 day", strtotime($date)));

	echo $date . ' -> ' . $end_date . PHP_EOL;


	// get JSON

	$raw = json_decode(file_get_contents('http://api.wunderground.com/api/'.$key.'/history_'.$end_date.'/q/'.'Finland/Helsinki'.'.json'),true);


	// Fill Fields

	$cached["helsinki"][$length]["date"] = $end_date;

	foreach ($fields as $field) {
		$cached["helsinki"][$length][$field] = $raw["history"]["dailysummary"][0][$field];
	}

	
	// Update File

	$fp = fopen('helsinki.json', 'w');
	fwrite($fp, json_encode($cached));
	fclose($fp);


	// Housekeeping

	$current_requests += 1;

	echo 'updated ('.$current_requests.'/'.max_daily_requests.' requests)'.PHP_EOL;
	sleep(6);

}



?>