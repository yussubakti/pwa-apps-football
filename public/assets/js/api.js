const base_url = "https://api.football-data.org/v2/";
const liga = "2014";
const KEY = "8e996a31ed5a412ab9dc6c6dd8b717e7";

const ENDPOINT = `${base_url}competitions/${liga}/standings`;

function status(response) {
    if(response.status !== 200) {
        console.log("Error : " + response.status);

        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

function getAllStanding() {
    if("caches" in window) {
        caches.match(ENDPOINT).then((response) => {
            if(response) {
                response.json().then((data) => {
                    getStanding(data);
                });
            }
        });
    }

    fetch(ENDPOINT, {
        method: "GET",
        headers: {
            "X-Auth-Token": KEY
        }
    })
    .then(status)
    .then(json)
    .then(data => {
        getStanding(data);
    })
    .catch(error);
}

function getStanding(data) {
    let standingHTML = "";
    data.standings[0].table.forEach(standing => {
        standingHTML += `
            <tr>
                <td>${standing.position}</td>
                <td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="${standing.team.name}" style="height: 15px"></td>
                <td>${standing.team.name}</td>
                <td>${standing.playedGames}</td>
                <td>${standing.won}</td>
                <td>${standing.draw}</td>
                <td>${standing.lost}</td>
                <td>${standing.goalDifference}</td>
                <td>${standing.goalsAgainst}</td>
                <td>${standing.goalsFor}</td>
                <td>${standing.points}</td>
            </tr>
        `;
    });

    let tableStandingHTML = `
        <div class="card">
            <table class="responsive-table striped">
                <thead>
                    <tr>
                        <th>Club</th>
                        <th></th>
                        <th></th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GD</th>
                        <th>GA</th>
                        <th>GF</th>
                        <th>Poin</th>
                    </tr>
                </thead>
                <tbody>
                    ${standingHTML}
                </tbody>
            </table>
        </div>
        `;
    document.getElementById("standings").innerHTML = tableStandingHTML;
}

function getSchedule() {
    if("caches" in window) {
        caches.match(`${base_url}/competitions/${liga}/matches?matchday=1`)
        .then((response) => {
            if(response) {
                response.json().then((data) => {
                    schedule(data);
                });
            }
        });
    }

    fetch(`${base_url}/competitions/${liga}/matches?matchday=1`, {
        method: "GET",
        headers: {
            "X-Auth-Token": KEY
        }
    })
    .then(status)
    .then(json)
    .then(data => {
        schedule(data);
    })
    .catch(error);
}

function schedule(data) {
    let match = "";
    data.matches.forEach((team) => {
        match += `
        <div class="col s12 m6">
            <div class="card">
                <div class="col s6 left">
                    <span>${team.status}</span>
                </div>
                <div class="col s6 right">
                    <span>Pertandingan ${team.season.currentMatchday}</span>
                </div>
                <div class="card-content black-text">
                    <div class="row">
                        <div class="col s12">
                            <div class="col s9">
                                <p><strong>${team.homeTeam.name}</strong></p>
                                <p><strong>${team.awayTeam.name}</strong></p>
                            </div>
                            <div class="col s3 right">
                                <p>
                                    <strong>
                                        ${team.score.fullTime.homeTeam === null ? 0 : team.score.fullTime.homeTeam}
                                    </strong>
                                </p>
                                <p>
                                    <strong>
                                        ${team.score.fullTime.awayTeam === null ? 0 : team.score.fullTime.awayTeam}
                                    </strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-action">
                    <span>FT ${moment(team.utcDate).format("DD MMM YYYY")}</span>
                </div>
            </div>
        </div>
        `;
    });
    document.getElementById("match").innerHTML = match;
}

function getTeams() {
    if('caches' in window){
        caches.match(`${base_url}/competitions/${liga}/teams`)
        .then(response => {
            if(response){
                response.json()
                .then(data => {
                    let teamsHTML = '';
                    data.teams.forEach(team => {
                        let urlTeamImage = team.crestUrl.replace(/^http:\/\//i, 'https://');
                        teamsHTML  += `
                        <div class="col s12 m6">
                            <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img src="${urlTeamImage}" height="150px" alt="${team.name}"/>
                                </div>
                                <div class="card-content">
                                    <span class="card-title truncate">${team.name}</span>
                                    <ul>
                                        <li class="collection-item">${team.venue}</li>
                                        <li class="collection-item">${team.shortName} ${team.founded}</li>
                                    </ul>
                                </div>
                                <div className="card-reveal">
                                    <button onclick="insertFavoriteTeam(${team.id},'${urlTeamImage}','${team.name}','${team.venue}','${team.shortName}','${team.founded}')" class="btn btn-large waves-effect btn-block blue darken-4">Add Favorite</button>
                                </div>
                            </div>
                        </div>`;
                    });
                    document.getElementById('teams').innerHTML = teamsHTML;
                });
            }
        });
  
    }
    fetch(`${base_url}/competitions/${liga}/teams`,{
        headers : {
            'X-Auth-Token' : KEY
        }
    })
    .then(status)
    .then(json)
    .then(data => {
        let teamsHTML = '';
        data.teams.forEach(team => {
            let urlTeamImage = team.crestUrl.replace(/^http:\/\//i, 'https://');
            teamsHTML  += `
            <div class="col s12 m6">
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img src="${urlTeamImage}" height="150px" alt="${team.name}"/>
                    </div>
                    <div class="card-content">
                        <span class="card-title truncate">${team.name}</span>
                        <ul>
                            <li class="collection-item">${team.venue}</li>
                            <li class="collection-item">${team.shortName} ${team.founded}</li>
                        </ul>
                    </div>
                    <div className="card-reveal">
                        <button onclick="insertFavoriteTeam(${team.id},'${urlTeamImage}','${team.name}','${team.venue}','${team.shortName}','${team.founded}')" class="btn btn-large waves-effect btn-block blue darken-4">Add Favorite</button>
                    </div>
                </div>
            </div>`;
        });
        document.getElementById('teams').innerHTML = teamsHTML;
    })
    .catch(error);
}

function getFavoriteTeam() {
    getFavoriteTeams().then((teams) => {
        let favoriteTeam = "";
        teams.map(team => {
            favoriteTeam += `
            <div class="col s12 m6">
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img src="${team.logo}" height="150px" alt="${team.name}"/>
                    </div>
                    <div class="card-content">
                        <span class="card-title truncate">${team.name}</span>
                        <ul>
                            <li class="collection-item">${team.venue}</li>
                            <li class="collection-item">${team.shortName} ${team.founded}</li>
                        </ul>
                    </div>
                    <div className="card-reveal">
                        <button onclick="deleteFavoriteTeam(${team.id},'${team.name}')" class="waves-effect waves-light btn red accent-4">DELETE</button>
                    </div>
                </div>
            </div>
            `;
        });
        if (favoriteTeam.length < 1) favoriteTeam = `
        
                    <div class="card blue-grey darken-1">
                        <div class="card-content white-text">
                            <div class="card-title" align="center">Favorite Team</div>
                            <p>No favorite team was selected</p>
                        </div>
                    </div>
                
        `;
        document.getElementById("favorite").innerHTML = favoriteTeam;
    });
}