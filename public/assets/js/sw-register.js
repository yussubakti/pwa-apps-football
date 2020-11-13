// REGISTER SERVICE WORKER
if("serviceWorker" in navigator) {
    registerServiceWorker();
    requestPermission();
} else {
    console.log("ServiceWorker belum didukung browser ini");
}


function registerServiceWorker() {
    return navigator.serviceWorker.register("service-worker.js").then((registration) => {
        console.log("Pendaftaran ServiceWorker berhasil");
        return registration;
    })
    .catch(() => {
        console.log("Pendaftaran ServiceWorker gagal");
    });
}

function requestPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then((response) => {
            if (response === "denied") {
                console.log("Fitur notifikasi tidak di izinkan.");
                return;
            } else if (response === "default") {
                console.error("Pengguna menutup kotak dialog permintaan ijin.");
                return;
            }

            navigator.serviceWorker.ready.then(() => {
                if ("pushManager" in window) {
                    navigator.serviceWorker.getRegistration().then(function (registration) {
                        registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array("BJ9r7a89iSpX9--3bYCHl8ZQbygto2La5SXckbczUKtI1aRZ8wGdbcU7e8XMLzadwAPWDhsnd5NlQtG_rs0uOZ4"),
                        })
                        .then((subscribe) => {
                            console.log(
                      "Berhasil subscribe dengan endpoint ::",
                      subscribe.endpoint
                    );
                    console.log("Berhasil melakukan subscribe dengan p256dh key: ",btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("p256dh")))));
                    console.log("Berhasil melakukan subscribe dengan auth key: ",btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("auth")))));
                })
                .catch((error) => {
                    console.error("Tidak dapat melakukan subscribe ", error.message);
                });
                });
                }
            });
        });
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
} 