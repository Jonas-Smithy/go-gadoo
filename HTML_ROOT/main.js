(function() {
	'use strict';

	window.addEventListener('load', init, false);

	function init() {
		var container = document.getElementById('game-screen');
		if (container === null) {
			console.error('Game containing dom element missing')
			return;
		}

		var game = new Game(container);
		game.init().start();
	}

	function Game(_container) {
		var eventLoop = new EventLoop(),
			renderer = new THREE.WebGLRenderer( { antialias: true } ),
			camera = new THREE.PerspectiveCamera(45, _container.clientWidth / _container.clientHeight, 1, 2000);

		return {
			init : init,
			start : start
		};

		function init() {
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize(_container.clientWidth,_container.clientHeight);
			renderer.setClearColor(0x87CEEB), 1;	
			window.addEventListener('resize', onWindowResize, false);
			_container.appendChild(renderer.domElement);
			return this;
		}
		
		function onWindowResize() {
			camera.aspect = _container.clientWidth/_container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(_container.clientWidth,_container.clientHeight);
		}


		function start() {
			var connection = new ConnectionHandler('localhost:8080', '/ws'),
				scene = new THREE.Scene();
			
			var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
			directionalLight.position.set( 0, 1, 1 ).normalize();
			scene.add( directionalLight );
			
			var geom = new THREE.PlaneBufferGeometry( 32, 32);
			geom.rotateX( - Math.PI / 2 );
			//var vertices = geom.attributes.position.array;
			//for (var n = 1; n < vertices.length; n+=3) {
				//vertices[n] = (n / vertices.length) * 5;
			//}
			geom.computeFaceNormals();
			geom.computeVertexNormals();
			
			var m = new THREE.Mesh(geom, new THREE.MeshLambertMaterial( {wireframe: false, color: 0x00FF00 } ) );
			scene.add(m);
			
			m = new THREE.Mesh( new THREE.CircleBufferGeometry( 64, 64), new THREE.MeshBasicMaterial( { color: 0x006994 } ) );
			m.rotateX( - Math.PI / 2 );
			m.position.y = -1;
			scene.add(m);
			
			var currentTime = Infinity,
				dt = 0;
			window.requestAnimationFrame(function animate(timestamp) {
				window.requestAnimationFrame(animate);
				
				dt = (timestamp - currentTime) / 1000;
				currentTime = timestamp
				if (dt < 0) {
					dt = 0;
				}
				
				camera.position.set(Math.sin(currentTime / 1000) * 20, 8 + Math.sin(currentTime / 1000) * 2, Math.cos(currentTime / 1000) * 20);
				camera.lookAt(scene.position);
				
				renderer.render(scene, camera);
			});
		}
	}

	function EventLoop() {
		var events = [];

		return {};
	}

	function ConnectionHandler(_domain, _path) {
		var ws = CreateWebSocket(_domain, _path);

		return {};

		function CreateWebSocket(_domain, _path) {
			var ws = new WebSocket('ws://' + _domain + _path);
			ws.addEventListener('open', function () {ws.send(JSON.stringify([{Type: "Login", Data:{Name: "aaaaaaa"}}]));});
			ws.addEventListener('message', console.log.bind(console));
			ws.addEventListener('close', console.log.bind(console));
			ws.addEventListener('error', console.log.bind(console));
			return ws;
		}
	}

	function InputHandler() {
		return {};
	}
}());