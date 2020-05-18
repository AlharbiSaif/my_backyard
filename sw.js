'use strict';

const PREFIX = 'My Backyard';
const HASH = '0a2b8979'; // Computed at build time.
const OFFLINE_CACHE = `${PREFIX}-${HASH}`;

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(OFFLINE_CACHE).then(function(cache) {
			
			
			
			return cache.addAll([
				'./',
				"./index.html",
				"./index.js",
				"./img/icon.png",
				"./img/title.png",
				"./style.css",
				"./img/flowers.svg",
				"./img/reminders.svg",
				"./img/shopping.svg",
				"./img/weather.svg",
				"./img/wildlife.svg",
				"./img/arrowright.svg",
				"./manifest.json",
				"./jquery-3.4.1.js",
				"./shopping/shopping.html",
				"./shopping/shopping.js",
				"./reminders/reminders.html",
				"./reminders/reminders.js",
				"./css/themes/Try1.css",
				"./css/themes/jquery.mobile.icons.min.css",
				"./jquery.mobile-1.4.5.min.js",
				"./jquery-1.11.1.min.js",
				"./jquery.mobile.structure-1.4.5.min.css",
				"./jquery.mobile-1.4.5.min.map",
				"./css/themes/images/ajax-loader.gif",
				"./weather/weather.html",
               			"./weather/weather.js",
                                "./weather/weather.css"	
			]);
		})
	);
});

self.addEventListener('activate', function(event) {
	// Delete old asset caches.
	event.waitUntil(
		caches.keys().then(function(keys) {
			return Promise.all(
				keys.map(function(key) {
					if (
						key != OFFLINE_CACHE &&
						key.startsWith(`${PREFIX}-`)
					) {
						return caches.delete(key);
					}
				})
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	if (event.request.mode == 'navigate') {
		console.log('Handling fetch event for', event.request.url);
		console.log(event.request);
		event.respondWith(
			fetch(event.request).catch(function(exception) {
				console.error(
					'Fetch failed; returning offline page instead.',
					exception
				);
				return caches.open(OFFLINE_CACHE).then(function(cache) {
					return cache.match('/');
				});
			})
		);
	} else {
		event.respondWith(
			caches.match(event.request).then(function(response) {
				return response || fetch(event.request);
			})
		);
	}

});

//Saif 

self.addEventListener('activate', function(event) {
	// Delete old asset caches.
	event.waitUntil(
		self.clients.claim()
	);
});

//it is a middleware, when browser fetches resources, it always happens via this function
self.addEventListener('fetch', function(event) {
		event.respondWith(
			caches.match(event.request).then(function(response) {
				return response || fetch(event.request)
					.catch(er => {
						console.log(er)
					});
			})
		);
});
