document.addEventListener("DOMContentLoaded", function() {
    // Activate sidebar nav
    const elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    loadNav();

    function loadNav() {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState === 4) {
                if(this.status != 200) return;
                
                // muat daftar tautan menu
                document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
                    elm.innerHTML = xhttp.responseText;
                });

                // Daftarkan event listener untuk setiap tautan menu
                document.querySelectorAll(".sidenav a, .topnav a").forEach(function(elm) {
                    elm.addEventListener("click", function(event) {
                        // Tutup sidenav
                        var sidenav = document.querySelector(".sidenav");
                        M.Sidenav.getInstance(sidenav).close();

                        // Muat konten halaman yang dipanggil
                        page = event.target.getAttribute("href").substr(1);
                        loadPage(page);
                    });
                });
            }
        };
        xhttp.open("GET", "/views/nav.html", true);
        xhttp.send();
    }

    // Load Page content
    let page = window.location.hash.substr(1);
    if(page === "") page = "home";
    loadPage(page);

    function loadPage(page) {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState === 4) {
                const content = document.querySelector("#body-content");
                if(this.status == 200) {
                    content.innerHTML = xhttp.responseText;
                    if(page === "home") {
                        getAllStanding();
                    } else if(page === "schedule") {
                        getSchedule();
                    } else if(page === "team") {
                        getTeams();
                        window.insertFavoriteTeam = insertFavoriteTeam;
                    } else if (page === "favorites") {
                        getFavoriteTeam();
                    }
                } else if(this.status == 404) {
                    content.innerHTML = `<p>Halaman tidak ditemukan.</p>`;
                } else {
                    content.innerHTML = `<p>Ups... halaman tidak dapat diakses</p>`;
                }
            }
        };
        xhttp.open("GET", `/views/pages/${page}.html`, true);
        xhttp.send();
    }
});