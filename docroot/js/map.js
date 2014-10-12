var camera, scene, renderer, centerPoint, map;
var mousedown = false;
var lastpoint = null;
var RAD_TO_DEG = Math.PI / 180;

mousedownEvent = function(e) {
    mousedown = true;
};

mouseupEvent = function(e) {
    mousedown = false;
    lastpoint = null;
};

mousemoveEvent = function(e) {
    if (mousedown) {
        lastpoint = lastpoint || {x: e.x, y: e.y};
        map.drag(e);
    }
};

Map.prototype.drag = function(e) {
    console.log(lastpoint.x - e.x, lastpoint.y - e.y);
    move = {x: lastpoint.x - e.x, y: lastpoint.y - e.y};
    console.log(move);
    camera.position.x += move.x * map.zoom;
    camera.position.y -= move.y * map.zoom;
    renderer.render(scene, camera);
    lastpoint = {x: e.x, y: e.y};

//    camera.lookAt()
};

function Map(el) {
    this.trip = [];
    map = this;
    this.data = new Data();
    this.zoom = 16;
    var el = el;
    var self = this;

    init();

    function init() {
            map.setCenter(40.502865299999996, -74.4519497);
    var p = map.centerPoint;
    //$("#map").append("<img class='tile' src='http://c.tiles.mapbox.com/v3/osmbuildings.gm744p3p/16/"+parseInt(p.x)+"/"+parseInt(p.y)+".png'></img");

    var count = 0;
    for (var i = -2; i < 3; i++) {
        for (var j = -2; j < 3; j++) {
            $.get('http://data.osmbuildings.org/0.2/rkc8ywdl/tile/16/' + (parseInt(p.x) + i) + '/' + (parseInt(p.y) + j) + '.json', function(res) {
                map.data.setItems(res.features);
                count++;
                if (count === 25) {
                    map.render();
                }
            });

        }
    }


        el.addEventListener('mousedown', mousedownEvent);
        el.addEventListener('mouseup', mouseupEvent);
        el.addEventListener('mousemove', mousemoveEvent);
//        el.onmousedown = mouseClickEventListener;
//        el.onmousemove = mouseMoveEventListener;

        centerPoint = self.project(40.502865299999996, -74.4519497);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff);

        el.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);

        camera.position.x = centerPoint.x * 512;
        camera.position.y = centerPoint.y * 512;
        camera.position.z = 1000;


        scene = new THREE.Scene();

        var light = new THREE.AmbientLight(0xdddddd);
        scene.add(light);

        var light1 = new THREE.DirectionalLight(0xff0000, .2);
        light1.position.set(1, -1, 10);
        scene.add(light1);

        var light2 = new THREE.DirectionalLight(0x00ff00, .2);
        light2.position.set(-1, 1, 10);
        scene.add(light2);

        var light3 = new THREE.DirectionalLight(0x0000ff, .2);
        light3.position.set(1, 1, 10);
        scene.add(light3);

        camera.lookAt(new THREE.Vector3(centerPoint.x * 512, centerPoint.y * 512, 0));
        pos = self.moveCurrentLocation();
    }

//    animate();

    function animate() {
        requestAnimationFrame(animate);
//        self.camera.position.z--;
        camera.rotateOnAxis(new THREE.Vector3(0, 0, 1), .001);
        renderer.render(scene, camera);
    }
}

mouseMoveEventListener = function(event) {
    var planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    var mv = new THREE.Vector3(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5);
    var projector = new THREE.Projector();
    var raycaster = projector.pickingRay(mv, camera);
    var pos = raycaster.ray.intersectPlane(planeZ);
    console.log(pos);
//    pos = map.unproject(pos.x, pos.y);
//    console.log(pos);
//    console.log("x: " + pos.x + ", y: " + pos.y);
};

mouseClickEventListener = function(event) {
    var vector = new THREE.Vector3(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5);

    var projector = new THREE.Projector();
    projector.unprojectVector(vector, camera);
    var dir = vector.sub(camera.position).normalize();

    var distance = -camera.position.z / dir.z;

    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    map.addPoint(pos);

    var latlng = map.unproject(pos.x, pos.y);
    map.trip.push(latlng);

    if (map.trip.length > 1) {
        var tripCount = map.trip.length;
        directionsService = new google.maps.DirectionsService();
        var request = map.makeRequest(map.trip[tripCount - 2].lat, map.trip[tripCount - 2].lng, map.trip[tripCount - 1].lat, map.trip[tripCount - 1].lng);
        directionsService.route(request, function(result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                var material = new THREE.LineBasicMaterial({color: 0xF2B035, linewidth: 5});
                var geometry = new THREE.Geometry();
                result.routes[0].overview_path.forEach(function(item) {
                    var projectedPoint = map.project(item.k, item.B);
                    geometry.vertices.push(new THREE.Vector3(projectedPoint.x * 512, projectedPoint.y * 512, 1));
                });
                var line = new THREE.Line(geometry, material);
                scene.add(line);
                renderer.render(scene, camera);
            }
        });
        console.log(map.trip);
    }
};

Map.prototype.makeRequest = function(start_lat, start_long, end_lat, end_long) {
    var start = new google.maps.LatLng(start_lat, start_long);
    var end = new google.maps.LatLng(end_lat, end_long);
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };

    return request;
};

Map.prototype.addPoint = function(point) {
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 100, 100), new THREE.MeshBasicMaterial({color: 0x281125}));
    sphere.position.x = point.x;
    sphere.position.y = point.y;
    sphere.position.z = 20;
    console.log(sphere.position);
    scene.add(sphere);
    renderer.render(scene, camera);
};

Map.prototype.loadImage = function() {

};

Map.prototype.setCenter = function(lat, lng) {
    this.centerPoint = this.project(lat, lng);
};

Map.prototype.moveCurrentLocation = function(callback) {
    navigator.geolocation.getCurrentPosition(function(pos) {
        map.trip.push({lat: pos.coords.latitude, lng: pos.coords.longitude});
    });
};

Map.prototype.render = function() {
    var self = this;
    for (var key in this.data.items) {
        var item = this.data.items[key];
        if (item.geometry.type === "Polygon") {
            var coordinates = item.geometry.coordinates[0];
            var height = typeof item.properties.height === "undefined" ? 20 : item.properties.height;
            var length = coordinates.length;
            var color = parseColor(item.properties.color || "#D5C4B2").toString();
            var roofColor = parseColor(item.properties.roofColor || "#D5C4B2").toString();
            var geometry = new THREE.Geometry();
            item.geometry.coordinates[0].forEach(function(vertex) {
                var projectPoint = self.project(vertex[1], vertex[0]);
                geometry.vertices.push(new THREE.Vector3(projectPoint.x * 512, projectPoint.y * 512, 0));
                geometry.vertices.push(new THREE.Vector3(projectPoint.x * 512, projectPoint.y * 512, height));
            });

            for (var i = 0; i < length; i++) {
                var face1 = new THREE.Face3(i * 2, (i * 2 + 1) % (length * 2), (i * 2 + 2) % (length * 2));
                var face2 = new THREE.Face3((i * 2 + 1) % (length * 2), (i * 2 + 3) % (length * 2), (i * 2 + 2) % (length * 2));
                var face3 = new THREE.Face3(i * 2, (i * 2 + 2) % (length * 2), (i * 2 + 1) % (length * 2));
                var face4 = new THREE.Face3((i * 2 + 1) % (length * 2), (i * 2 + 2) % (length * 2), (i * 2 + 3) % (length * 2));
                face1.color = new THREE.Color(color);
                face2.color = new THREE.Color(color);
                face3.color = new THREE.Color(color);
                face4.color = new THREE.Color(color);
                var d = new THREE.Vector3();
                var a = geometry.vertices[(i * 2 + 1) % (length * 2)];
                var b = geometry.vertices[(i * 2 + 2) % (length * 2)];
                var c = geometry.vertices[(i * 2 + 3) % (length * 2)];
                d.crossVectors(a.clone().sub(b), b.clone().sub(c)).normalize();
                face1.normal = d;
                face3.normal = d;
                d.crossVectors(c.clone().sub(b), b.clone().sub(a)).normalize();
                face2.normal = d;
                face4.normal = d;

                geometry.faces.push(face1);
                geometry.faces.push(face2);
                geometry.faces.push(face3);
                geometry.faces.push(face4);

                if (i * 2 + 5 < length * 2) {
                    var face5 = new THREE.Face3(1, i * 2 + 5, i * 2 + 3);
                    var face6 = new THREE.Face3(1, i * 2 + 3, i * 2 + 5);
                    face5.color = new THREE.Color(roofColor);
                    face6.color = new THREE.Color(roofColor);

                    var a = geometry.vertices[1];
                    var b = geometry.vertices[i * 2 + 5];
                    var c = geometry.vertices[i * 2 + 3];
                    var d = new THREE.Vector3();
                    d.crossVectors(a.clone().sub(b), b.clone().sub(c)).normalize();
                    face5.normal = d;
                    d.crossVectors(c.clone().sub(b), b.clone().sub(a)).normalize();
                    face6.normal = d;
                    geometry.faces.push(face5);
                    geometry.faces.push(face6);
                }
            }

            geometry.computeBoundingSphere();

            var material = new THREE.MeshLambertMaterial({vertexColors: THREE.FaceColors});
            var mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            /*
             if (typeof item.properties.height === "undefined") {
             var coordinates = item.geometry.coordinates[0];
             var length = coordinates.length;
             var geometry = new THREE.Geometry();
             coordinates.forEach(function(vertex) {
             var projectPoint = self.project(vertex[1], vertex[0]);
             geometry.vertices.push(new THREE.Vector3(projectPoint.x * 512, projectPoint.y * 512, 1));
             });
             
             for (var i = 2; i < length; i++) {
             var face = new THREE.Face3(0, i - 1, i - 2);
             geometry.faces.push(face);
             var face = new THREE.Face3(0, i - 2, i - 1);
             geometry.faces.push(face);
             }
             geometry.computeBoundingSphere();
             var material = new THREE.MeshBasicMaterial({color: 0xD5C4B2, linewidth: 5});
             
             var mesh = new THREE.Mesh(geometry, material);
             scene.add(mesh);
             } else {
             var coordinates = item.geometry.coordinates[0];
             var height = item.properties.height;
             var length = coordinates.length;
             var color = parseColor(item.properties.color || "#D5C4B2").toString();
             var roofColor = parseColor(item.properties.roofColor || "#D5C4B2").toString();
             var geometry = new THREE.Geometry();
             item.geometry.coordinates[0].forEach(function(vertex) {
             var projectPoint = self.project(vertex[1], vertex[0]);
             geometry.vertices.push(new THREE.Vector3(projectPoint.x * 512, projectPoint.y * 512, 0));
             geometry.vertices.push(new THREE.Vector3(projectPoint.x * 512, projectPoint.y * 512, height));
             });
             
             for (var i = 0; i < length; i++) {
             var face1 = new THREE.Face3(i * 2, (i * 2 + 1) % (length * 2), (i * 2 + 2) % (length * 2));
             var face2 = new THREE.Face3((i * 2 + 1) % (length * 2), (i * 2 + 3) % (length * 2), (i * 2 + 2) % (length * 2));
             var face3 = new THREE.Face3(i * 2, (i * 2 + 2) % (length * 2), (i * 2 + 1) % (length * 2));
             var face4 = new THREE.Face3((i * 2 + 1) % (length * 2), (i * 2 + 2) % (length * 2), (i * 2 + 3) % (length * 2));
             face1.color = new THREE.Color(color);
             face2.color = new THREE.Color(color);
             face3.color = new THREE.Color(color);
             face4.color = new THREE.Color(color);
             var d = new THREE.Vector3();
             var a = geometry.vertices[(i * 2 + 1) % (length * 2)];
             var b = geometry.vertices[(i * 2 + 2) % (length * 2)];
             var c = geometry.vertices[(i * 2 + 3) % (length * 2)];
             d.crossVectors(a.clone().sub(b), b.clone().sub(c)).normalize();
             face1.normal = d;
             face3.normal = d;
             d.crossVectors(c.clone().sub(b), b.clone().sub(a)).normalize();
             face2.normal = d;
             face4.normal = d;
             
             geometry.faces.push(face1);
             geometry.faces.push(face2);
             geometry.faces.push(face3);
             geometry.faces.push(face4);
             
             if (i * 2 + 5 < length * 2) {
             var face5 = new THREE.Face3(1, i * 2 + 5, i * 2 + 3);
             var face6 = new THREE.Face3(1, i * 2 + 3, i * 2 + 5);
             face5.color = new THREE.Color(roofColor);
             face6.color = new THREE.Color(roofColor);
             
             var a = geometry.vertices[1];
             var b = geometry.vertices[i * 2 + 5];
             var c = geometry.vertices[i * 2 + 3];
             var d = new THREE.Vector3();
             d.crossVectors(a.clone().sub(b), b.clone().sub(c)).normalize();
             face5.normal = d;
             d.crossVectors(c.clone().sub(b), b.clone().sub(a)).normalize();
             face6.normal = d;
             geometry.faces.push(face5);
             geometry.faces.push(face6);
             }
             }
             
             geometry.computeBoundingSphere();
             
             var material = new THREE.MeshLambertMaterial({vertexColors: THREE.FaceColors});
             var mesh = new THREE.Mesh(geometry, material);
             scene.add(mesh);
             }*/
        } else {
            console.log(item);
        }
    }
    renderer.render(scene, camera);
};

Map.prototype.project = function(lat, lng, zoom) {
    lat = lat || 40.75831;
    lng = lng || -73.99151;
    zoom = zoom || 16;
    var d = RAD_TO_DEG,
            max = 85.0511287798,
            lat1 = Math.max(Math.min(max, lat), -max),
            x = lng * d,
            y = lat1 * d;

    y = Math.log(Math.tan((Math.PI / 4) + (y / 2)));

    var scale = Math.pow(2, zoom);

    var transform = {_a: 0.15915494309189535, _b: 0.5, _c: -0.15915494309189535, _d: 0.5};
    var point = {};
    point.x = scale * (transform._a * x + transform._b);
    point.y = scale * (transform._c * y + transform._d);

    return point;
};

Map.prototype.unproject = function(x, y, zoom) {
    zoom = zoom || 16;
    x /= 512;
    y /= 512;
    var scale = Math.pow(2, zoom);
    var transform = {_a: 0.15915494309189535, _b: 0.5, _c: -0.15915494309189535, _d: 0.5};
    x = (x / scale - transform._b) / transform._a;
    y = (y / scale - transform._d) / transform._c;

    lng = x / RAD_TO_DEG;
    lat = (2 * Math.atan(Math.exp(y)) - (Math.PI / 2)) / RAD_TO_DEG;

    return {lat: lat, lng: lng};
};

function Data() {
    this.items = {};
}

Data.prototype.setItems = function(items) {
    var self = this;
    if (items.constructor === Array) {
        items.forEach(function(item) {
            if (typeof self.items[item.id] === "undefined") {
                self.items[item.id] = item;
            }
        });
    }
};