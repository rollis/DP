
<%
	/**
 * Copyright (c) 2000-2013 Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */
%>

<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet"%>

<portlet:defineObjects />

<style type="text/css">
@import '/PlanningMap-portlet/css/venuecell.css';
</style>

<script src="/PlanningMap-portlet/js/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="/PlanningMap-portlet/js/mustache.js"></script>

<script src="/PlanningMap-portlet/js/three.min.js"></script>
<script src="/PlanningMap-portlet/js/Color.js"></script>
<script type="text/javascript"
	src="http://maps.googleapis.com/maps/api/js?key=AIzaSyBhzZJIOGZWs2Jes80c5Oxy6zA-kqhuEQQ"></script>
<script src="/PlanningMap-portlet/js/map.js"></script>

<%
	System.out.println(renderRequest.getParameter("method"));
%>
<script>
	var map = new Map($("#map")[0]);
</script>


<body>
	<script>
		$(document).ready(function() {
			console.log("ready!");
			// // http://stackoverflow.com/questions/18281183/jquery-cross-domain-request-to-get-json-response-without-callback
			// // http://stackoverflow.com/questions/24528211/refused-to-execute-script-from-because-its-mime-type-application-json-is
			// $.ajax({
			//     url: 'http://172.31.178.185:8080/PlanningMap-portlet/sample.json',
			//     dataType: 'jsonp',
			//     jsonp: 'callback',
			//     success: render
			//     // crossDomain: true,
			//     // jsonpCallback: 'render'
			// });
			$.getJSON('/PlanningMap-portlet/html/sample.json',render);
		});

		function render(jsondata) {
			if (!jsondata.Error) {
				$.getJSON('/PlanningMap-portlet/html/venuecell.mustache',function(data){
					var template=JSON.parse(data);
					var html = Mustache.to_html(template, jsondata);
					$('#venue-list').html(html);
				});
				
			} else {
				alert(json.Message);
			}
		};
	</script>


	<div class="venue-list-wrapper">
		<li class="venue-cell">
			<div class="venue-picture">
				<div class="photo-box pb-60s">
					<a class="title" data-json="url" href="/biz/lot-2-brooklyn-2">
						<img alt="Lot 2" class="photo-box-img" data-json="image_url"
						height="60"
						src="http://s3-media4.fl.yelpcdn.com/bphoto/XOFZkosCdjfNwJ9-p0g9MA/60s.jpg"
						width="60">
					</a>
				</div>
			</div>
			<div class="media-story">
				<div class="media-title">
					<span class="indexed-biz-name">5. <a class="biz-name"
						data-json="url" href="/biz/lot-2-brooklyn-2"
						data-hovercard-id="GcLhUflOx5HJqiXLAEkjNg">Lot 2</a>
					</span>
				</div>
				<div class="media-body">
					<div class="biz-rating biz-rating-medium clearfix">
						<div class="rating">
							<i class="star-img stars_4_half" title="4.5 star rating"> <img
								alt="4.5 star rating" data-json="rating_img_url"
								class="offscreen" height="303"
								src="http://s3-media3.fl.yelpcdn.com/assets/2/www/img/c2252a4cd43e/ico/stars/v2/stars_map.png"
								width="84">
							</i>
						</div>
						<span class="review-count rating-qualifier"> 171 reviews </span>
					</div>
					<div class="media-block clearfix display-table">
						<div class="media-avatar">
							<div class="photo-box pb-30s">
								<a data-json=""
									href="http://www.yelp.com/user_details?userid=rcHpDipSli8f-Bp5LctxYg">
									<img alt="Andrew S." class="photo-box-img" height="30"
									src="http://s3-media4.fl.yelpcdn.com/photo/wYM2iVtIal76lJiH97kw2Q/30s.jpg"
									width="30"> <!-- Yelp API business response does not have data for rating snippet user details.-->
								</a>
							</div>
						</div>
						<div class="media-story display-table-cell">
							<div class="ie-tablecell-hack" data-json="snippet_text">
								I highly recommend <span class="highlighted">Sunday
									Supper</span>, which has a $30 adult prix fixe (3...
							</div>
						</div>
					</div>
				</div>
			</div>
		</li>



		<ul id="venue-list">
			<script id="venue-cell-template" type="text/template">
        {{#businesses}}
        <li class="venue-cell">
            <div class="venue-picture">
                <div class="photo-box pb-60s">
                    <a class="title" data-json="url" href="{{url}}">
                        <img alt="Lot 2" class="photo-box-img" data-json="image_url" height="60" src="{{image_url}}" width="60">
                    </a>
                </div>
            </div>
            <div class="media-story">
                <div class="media-title">
                    <span class="indexed-biz-name">5.     <a class="biz-name" data-json="url" href="{{url}}" data-hovercard-id="GcLhUflOx5HJqiXLAEkjNg">Lot 2</a>
                    </span>
                </div>
                <div class="media-body">
                    <div class="biz-rating biz-rating-medium clearfix">
                        <div class="rating">
                            <i class="star-img stars_4_half" title="4.5 star rating">
                                <img alt="4.5 star rating" data-json="rating_img_url" class="offscreen" height="303" src="{{rating_img_url}}" width="84">
                            </i>
                        </div>
                        <span class="review-count rating-qualifier">
                            171 reviews
                        </span>
                    </div>
                    <div class="media-block clearfix display-table">
                        <div class="media-avatar">
                            <div class="photo-box pb-30s">
                                <a data-json="" href="http://www.yelp.com/user_details?userid=rcHpDipSli8f-Bp5LctxYg">
                                    <img alt="Andrew S." class="photo-box-img" height="30" src="http://s3-media4.fl.yelpcdn.com/photo/wYM2iVtIal76lJiH97kw2Q/30s.jpg" width="30"> <!-- Yelp API business response does not have data for rating snippet user details.-->
                                </a>
                            </div>
                        </div>
                        <div class="media-story display-table-cell">
                            <div class="ie-tablecell-hack" data-json="snippet_text">
                                {{snippet_text}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
        {{/businesses}}
    </script>
		</ul>
	</div>
</body>