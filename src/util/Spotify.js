const clientID = '061f2a636fbf4af3a1b5ffc8db23d8bb';
const redirectURI = "http://localhost:3000/";
let accessToken = null;

const Spotify = {
  getAccessToken() {
    const tokenFound = window.location.href.match(/access_token=([^&]*)/);
    let expiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if(accessToken !== null) {
      return accessToken
    } else if (tokenFound && expiresIn) {
      accessToken = tokenFound[1];
      expiresIn = Number(expiresIn[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const url =`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
      window.location = url
    }
},

  search(term) {
    Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }))
        }
      )
  },

  savePlaylist(playlistName, trackURIs) {
    Spotify.getAccessToken();
    const endpoint = 'https://api.spotify.com/v1/me'

    fetch(endpoint, { headers: {Authorization: `Bearer ${accessToken}`} }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      let userID = jsonResponse.id
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: playlistName })
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        let playlistID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
          method: "POST",
          headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
          body: JSON.stringify({ uris: trackURIs })
          })
      })
    });
  }
}

export default Spotify
