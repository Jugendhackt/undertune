const clientId = '24f00698dcae49cd995ddef49ece84fa';
const clientSecret = '225654b38fe940009eb38e5ddf4bc106';
let accessToken = '';

var input = document.getElementById("artistInput");
input.addEventListener("keypress", function(event) {
    if (event.key==="Enter") {
        event.preventDefault();
        document.getElementById("searchButton").click();
    }
})



function searchArtist() {

    const artistInput = document.getElementById('artistInput');
    const artistName = artistInput.value;

                  const ul = document.getElementById('list');
                 ul.append(Object.assign(document.createElement('li'), 
                  {textContent: artistName}));
    

    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    })
        .then(response => response.json())
        .then(data => {
            accessToken = data.access_token;
            const query = encodeURIComponent(artistName);
            const url = `https://api.spotify.com/v1/search?q=${query}&type=artist`;

            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })

                .then(response => response.json())
                .then(data => {

                    const bestMatch = data.artists.items[0];
                    const bestMatchId = bestMatch.id;

                    const relatedArtistsUrl = `https://api.spotify.com/v1/artists/${bestMatchId}/related-artists`;
                    fetch(relatedArtistsUrl, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            const resultDiv = document.getElementById('result');
                            resultDiv.innerHTML = `<h1>Similar Artists:</h1>`;

                            const relatedArtists = data.artists;
                            relatedArtists.sort((a, b) => a.popularity - b.popularity);
                            for (let i = 0; i < relatedArtists.length; i++) {
                                const artist = relatedArtists[i];
                                resultDiv.innerHTML += `<h2>${artist.name}</h2>
                                            <p>Popularity: ${artist.popularity}</p>
                                            <p>Genres: ${artist.genres.join(', ')}</p>
                                            <p><a href="${"https://open.spotify.com/intl-de/artist/" + artist.id}">Spotify Link</a></p>`;
                            }
                        })
                        .catch(error => {
                            0;
                            console.error('Error:', error);
                        });
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}