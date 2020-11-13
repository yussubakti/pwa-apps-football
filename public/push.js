var webPush = require("web-push");

const vapidKeys = {
    publicKey: "BJ9r7a89iSpX9--3bYCHl8ZQbygto2La5SXckbczUKtI1aRZ8wGdbcU7e8XMLzadwAPWDhsnd5NlQtG_rs0uOZ4",
    privateKey: "dK4M_omOcsphnmIoNLtVhuqhdf3k_2BMtRc3kdWBNpU"
};

webPush.setVapidDetails(
    'mailto:yussubakti@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/eG2sWKoCvGg:APA91bGV_4rVUmXzjoQ0gMa-lmso9CBo69Vpm01V2OUnPg3XjXRuLKTCmCFfgOj5T3HvOlF_QssqGsoYKbyacg9WqrX0THDEufSpFw7jdOtKTHVSbj7U4aW7feBk9Fk6DMJ6tMkaO0X5",
    "keys": {
        "p256dh": "BDGFPREjhx6TCbed3Pjn5fTN4AI2u1B9TKsqKC0CfEGXfL7w1UYEus1ARpxyTOYpzVdu9nzxbKh4xXqW4xjBzaw=",
        "auth": "HCcFPpbCD6eUXVq7j+US0Q=="
    }
};

let payload = 'Welcome to Laliga web notification';

let options = {
    gcmAPIKey: "28687324410",
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);