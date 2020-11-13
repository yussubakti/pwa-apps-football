importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
    console.log(`Workbox loaded successfully`);
} else {
    console.log(`Workbox failed to load`);
}

workbox.precaching.precacheAndRoute([
    { url: "/", revision: '1'},
    { url: "/index.html", revision: '1' },
    { url: "/manifest.json", revision: '1'},
    { url: "/package-lock.json", revision: '1'},
    { url: "/push.js", revision: '1'},
    { url: "/service-worker.js", revision: '1'},

    { url: "/assets/css/materialize.css", revision: '1'},
    { url: "/assets/css/materialize.min.css", revision: '1'},
    
    { url: "/assets/images/icon.png", revision: '1' },
    { url: "/assets/images/laliga180.png", revision: '1' },
    { url: "/assets/images/laliga511.png", revision: '1' },

    { url: "/assets/js/api.js", revision: '1' },
    { url: "/assets/js/database.js", revision: '1' },
    { url: "/assets/js/idb.js", revision: '1' },
    { url: "/assets/js/materialize.js", revision: '1' },
    { url: "/assets/js/materialize.min.js", revision: '1' },
    { url: "/assets/js/moment.js", revision: '1' },
    { url: "/assets/js/nav.js", revision: '1' },
    { url: "/assets/js/sw-register.js", revision: '1' },

    { url: "/views/nav.html", revision: '1' },
    { url: "/views/pages/favorites.html", revision: '1' },
    { url: "/views/pages/home.html", revision: '1' },
    { url: "/views/pages/schedule.html", revision: '1' },
    { url: "/views/pages/team.html", revision: '1' },

    { url: "https://fonts.googleapis.com/icon?family=Material+Icons", revision: '1'},
    { url: "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2", revision: '1'}
]);

workbox.routing.registerRoute(
    new RegExp('/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'pages'
    })
);

workbox.routing.registerRoute(
    new RegExp(`https://api.football-data.org/v2/`),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'base_url'
    })
);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSecond: 1 * 24 * 60 * 60
            })
        ]
    })
);

self.addEventListener("push", (event) => {
    let body;
    if(event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }

    let options = {
        body: body,
        icon: "./assets/images/icon.png",
        vibration: [100, 50, 100],
        data: {
            datOfArrival: Date.now(),
            primaryKey: 1
        },
    };
    
    event.waitUntil(
        self.registration.showNotification("Push Notification", options)
    );
});