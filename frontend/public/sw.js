var cacheName = "unc_cache";
var offlineUrl = "./offline.html";

self.addEventListener('install', event=> {
    event.waitUntil(
        caches.open(cacheName).then(cache=> cache.addAll([
            "./logo192.png",
            "./logo512.png",
            "./favicon.ico",
            "./robot.txt",
            "./connected.svg",
            offlineUrl
        ]))

    )
})


self.addEventListener("fetch", event => {

    if(event.request.method === "GET" && event.request.headers.get("accept").includes("text/html")){
        event.respondWith(
            fetch(event.request.url).then(response=>{
                if (!response || response.status !== 200){
                    return caches.match(offlineUrl);
                }
                return response;
            }).catch(error=>{
                return caches.match(offlineUrl)
            })
        )
    } else {
        event.respondWith(fetch(event.request))
    }

})

