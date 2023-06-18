const clientId = '';
const clientSecret = '';
let accessToken = '';

const searchArtist = () => {
    const artistInput = document.getElementById('artistInput');
    const artistName = artistInput.value;

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

        fetch (url, {
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
            //console.log(bestMatchId)
            .then(response => response.json())
            .then (data => {
                const resultDiv = document.getElementById('result');
                resultDiv.innerHTML = `<h1>Similar Artists:</h1>`;

                const relatedArtists = data.artists;
                relatedArtists.sort((a, b) => a.popularity - b.popularity);
                for (let i = 0; i < relatedArtists.length; i++) {
                    const artist = relatedArtists[i];
                    resultDiv.innerHTML += `<h2>${artist.name}</h2>
                                            <p>Popularity: ${artist.popularity}</p>
                                            <p>Genres: ${artist.genres.join(', ')}</p>`;
                }
            })
            .catch(error => {
                0
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
};