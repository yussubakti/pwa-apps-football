const idbPromised = idb.open("laliga", 1, (upgradeDB) => {
    if(!upgradeDB.objectStoreNames.contains("teams")) {
        upgradeDB.createObjectStore("teams");
    }
});

const getFavoriteTeams = () => {
    return idbPromised.then(database => {
        let transaction = database.transaction("teams", `readonly`);
        return transaction.objectStore("teams").getAll();
    });
};

const insertFavoriteTeam = (id, logo, name, venue, shortName, founded) => {
    // let confirm = window.confirm(`Are you sure want add ${name} to Favorite ?`);
    let confirm = M.toast-action(`Are you sure want add ${name} to Favorite ?`);
    let item = {
        id: id,
        logo: logo,
        name: name,
        venue: venue,
        shortName: shortName,
        founded: founded,
        created: new Date().getTime()
    };

    if(confirm){
        idbPromised.then(database => {
            let transaction = database.transaction('teams', 'readwrite');
            transaction.objectStore('teams').put(item, id);
            return transaction;
        })
        .then(transaction => {
            if (transaction.complete) {
                alert(`Favorite team ${name} successfully added.`);
                pushNotification('Add Favorite Team', `${name} successfully added to your favorite.`);
          }
        })
        .catch(() => console.log("Failed add favorite team"));
      }
};

const deleteFavoriteTeam = (id, name) => {
    let confirm = window.confirm(`Are you sure want to delete ${name} from favorite ?`)
  
    if(confirm){
        idbPromised.then(db => {
            let transaction = db.transaction('teams', 'readwrite');
            transaction.objectStore('teams').delete(id);
            return transaction;
        })
        .then(transaction => {
            if (transaction.complete) {
                alert(`Team favorite ${name} berhasil di hapus.`);
                pushNotification('Delete Favorite Team', `${name} successfully deleted from favorite.`);
        }
      }).catch(() => console.log("Failed to delete team."));
    }
  };

const pushNotification = (title, message) => {
    const options = {
        body: message,
    };
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(register => {
            register.showNotification(title, options);
        });
    } else {
        console.error('Notification not allowed');
    }
};