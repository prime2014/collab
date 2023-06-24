var cacheName = "helloWorld";


self.addEventListener('install', event=> {
    event.waitUntil(
        caches.open(cacheName)
    )
})


self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
            })
    )
})
