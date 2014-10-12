<?php

// Enter the path that the oauth library is in relation to the php file
require_once('lib/OAuth.php');

// Set your OAuth credentials here  
// These credentials can be obtained from the 'Manage API Access' page in the
// developers documentation (http://www.yelp.com/developers)
$CONSUMER_KEY = "H8b63Rvr6L93hv-6Qx7U6A";
$CONSUMER_SECRET = "IkEoEPNkL2aZV3BH59k0yXrcvRY";
$TOKEN = "zFix4Yz0FOO5b0L228DLd_NGAJKA2ynn";
$TOKEN_SECRET = "YtpgvU1v7EIfULxBy3mXej_Tsbk";
$API_HOST = 'api.yelp.com';

// These are default values for getting search results
$DEFAULT_TERM = 'restaurants';
$DEFAULT_LOCATION = 'New York, NY';
$DEFAULT_LIMIT = 10;
$DEFAULT_RADIUS = 400;

// These are limiations for numeric values
$RADIUS_MIN = 400;
$RADIUS_MAX = 10000;
$SEARCH_MAX = 20;
$SEARCH_MIN = 1;

$SEARCH_PATH = '/v2/search/';
$BUSINESS_PATH = '/v2/business/';

/** 
 * Makes a request to the Yelp API and returns the response
 * 
 * @param    $host    The domain host of the API 
 * @param    $path    The path of the APi after the domain
 * @return   The JSON response from the request      
 */
function request($host, $path) {
    $unsigned_url = "http://" . $host . $path;

    // Token object built using the OAuth library
    $token = new OAuthToken($GLOBALS['TOKEN'], $GLOBALS['TOKEN_SECRET']);

    // Consumer object built using the OAuth library
    $consumer = new OAuthConsumer($GLOBALS['CONSUMER_KEY'], $GLOBALS['CONSUMER_SECRET']);

    // Yelp uses HMAC SHA1 encoding
    $signature_method = new OAuthSignatureMethod_HMAC_SHA1();

    $oauthrequest = OAuthRequest::from_consumer_and_token(
        $consumer, 
        $token, 
        'GET', 
        $unsigned_url
    );
    
    // Sign the request
    $oauthrequest->sign_request($signature_method, $consumer, $token);
    
    // Get the signed URL
    $signed_url = $oauthrequest->to_url();
    
    // Send Yelp API Call
    $ch = curl_init($signed_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);

    $data = curl_exec($ch);
    curl_close($ch);
    
    return $data;
}

/**
 * Query the Search API by given options
 * 
 * @param    $opt   The array of options passed to the API
 * @return   The JSON response from the request 
 */
function get_search_results($opt) {
    $url_params = array();
    
    $url_params['term'] = $opt["term"];

    if(isset($opt["location"])) {
        $url_params["location"] = $opt["location"];
    }
    else {
        $url_params["ll"] = $opt["latitude"] . "," . $opt["longitude"];
    }

    $url_params["radius_filter"] = $opt["radius"];
    $url_params["limit"] = $opt["limit"];

    $search_path = $GLOBALS['SEARCH_PATH'] . "?" . http_build_query($url_params);

    return request($GLOBALS['API_HOST'], $search_path);
}

function make_search_result_blocks($response) {
  $result = json_decode($response, true);
  $businesses = $result["businesses"];
  $blk = '';

  for($i=0 ; $i<count($businesses) ; $i++) {
    $b = $businesses[$i];

    $categories = "";
    for($c=0 ; $c<count($b["categories"]) ; $c++) 
      $categories .= $b["categories"][$c][0] . ",<br/>";
    $categories = substr($categories, 0, -6);

    $addresses = "";
    for($a=0 ; $a<count($b["location"]["display_address"]) ; $a++)
      $addresses .= $b["location"]["display_address"][$a] . "<br/>";

      $blk = 
'<div class="output_controls">
  <div class="id" style="display:none;">' . $b["id"] . '</div>
  <div class="storeName">' . $b["name"] . '</div>
  <div class="divide_panel">
      <div class="output_left_panel">
        <div class="rating"><img src="' . $b["rating_img_url"] . '"></div>
        <div class="categories">' . $categories . '</div>
      </div>
      <div class="output_right_panel">
        <div class="address">' . $addresses . '</div>
      </div>
    </div>
    <div class="output_buttons pull-right">
      <button class="btn btn-sm btn-primary">See Detail</button>
      <button class="btn btn-sm btn-primary">Choose</button>
    </div>
  </div>
</div>';

      $b["html"] = $blk;
      $businesses[$i] = $b;
  }

  return $businesses;
}

/**
 * Get optins from request
 *
 * @return  An associative array of options
 */
function get_options() {
    if($term = $_GET["term"] != "")
        $term = $_GET["term"];
    else
        $term = $GLOBALS["DEFAULT_TERM"];
        
    if(isset($_GET["location"])) {
        $location = $_GET["location"];
    }
    else if(isset($_GET["latitude"]) && isset($_GET["longitude"])) {
        $latitude = $_GET["latitude"];
        $longitude = $_GET["longitude"];
    }
    else
        $location = $GLOBALS["DEFAULT_LOCATION"];

    if(isset($_GET["limit"]))
        $limit = $_GET["limit"];
    else
        $limit = $GLOBALS["DEFAULT_LIMIT"];

    if(isset($_GET["radius"]))
        $radius = $_GET["radius"];
    else
        $radius = $GLOBALS["DEFAULT_RADIUS"];

    // Put options into an object
    $opt = array(
        "term"=>$term,
        "limit"=>$limit,
        "radius"=>$radius
    );

    if(isset($location)) {
      $opt["location"] = $location;
    }
    else {
      $opt["latitude"] = $latitude;
      $opt["longitude"] = $longitude;
    }

    return $opt;
}

/**
 * Query the Business API by business_id
 * 
 * @param    $business_id    The ID of the business to query
 * @return   The JSON response from the request 
 */
function get_business($business_id) {
    $business_path = $GLOBALS['BUSINESS_PATH'] . $business_id;
    
    return request($GLOBALS['API_HOST'], $business_path);
}

/**
 * User input is handled here 
 */

$ajaxStep = $_GET["ajaxStep"];

if($ajaxStep == "search") {
    $options = get_options();
    $result = get_search_results($options);
    $result = make_search_result_blocks($result);
    
    echo json_encode($result);
}
else if($ajaxStep == "business") {
    $id = $_GET["id"];
    $result = get_business($id);

    echo $result;
}
?>