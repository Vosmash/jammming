import React from 'react';
import './PlaylistSearch.css'
import PlaylistList from '../PlaylistList/PlaylistList.js';
import { Spotify } from '../../util/Spotify.js';

let fakePlaylists = [
{
  id: '1',
  imgSrc: './MikaCartoonMotion.jpg',
  name: 'Jelly Bean',
  songs: [
    { id: '1', name: 'Grace Kelly', artist: 'Mika'},
    { id: '2', name: 'Big Girls', artist: 'Mika'},
    { id: '3', name: 'Sugar', artist: 'Maroon 5'},
    { id: '4', name: 'Girls Like You', artist: 'Maroon 5'}
  ]
},
{
  id: '2',
  imgSrc: './Maroon_5_-_V_(Official_Album_Cover).png',
  name: 'Test',
  songs: [
    { id: '5', name: 'Sugar', artist: 'Maroon 5'},
    { id: '6', name: 'Girls Like You', artist: 'Maroon 5'},
    { id: '7', name: 'Grace Kelly', artist: 'Mika'},
    { id: '8', name: 'Down', artist: 'Sean Paul'}
  ]
},
{
  id: '3',
  imgSrc: './MikaCartoonMotion.jpg',
  name: 'Car Music',
  songs: [
    { id: '9', name: 'Big Girls', artist: 'Mika'},
    { id: '10', name: 'Grace Kelly', artist: 'Mika'},
    { id: '11', name: 'Sugar', artist: 'Maroon 5'},
    { id: '12', name: 'Girls Like You', artist: 'Maroon 5'}
  ]
},
{
  id: '4',
  imgSrc: './Maroon_5_-_V_(Official_Album_Cover).png',
  name: 'Workout Music',
  songs: [
    { id: '13', name: 'Girls Like You', artist: 'Maroon 5'},
    { id: '14', name: 'Sugar', artist: 'Maroon 5'},
    { id: '15', name: 'Big Girls', artist: 'Mika'},
    { id: '16', name: 'Grace Kelly', artist: 'Mika'}
  ]
},
{
  id: '5',
  imgSrc: './Maroon_5_-_V_(Official_Album_Cover).png',
  name: 'Car Pool Music',
  songs: [
    { id: '17', name: 'Girls Like You', artist: 'Maroon 5'},
    { id: '18', name: 'Sugar', artist: 'Maroon 5'},
    { id: '19', name: 'Down', artist: 'Sean Paul'},
    { id: '20', name: 'EveryBody', artist: 'BackStreet Boys'}
  ]
},
{
  id: '6',
  imgSrc: './Maroon_5_-_V_(Official_Album_Cover).png',
  name: 'Shower Music',
  songs: [
    { id: '21', name: 'Girls Like You', artist: 'Maroon 5'},
    { id: '22', name: 'Sugar', artist: 'Maroon 5'},
    { id: '23', name: 'Big Girls', artist: 'Mika'},
    { id: '24', name: 'Everybody', artist: 'Backstreet Boys'}
  ]
}
]


class PlaylistSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlists: [
        {
          id: '',
          imgSrc: '',
          name: '',
          songs: [
            {
              name: '',
              artist: ''
            }
          ]
        }
      ],
      filter: ''
  }

  this.handleSongChange = this.handleSongChange.bind(this);
  }

  handleSongChange(e) {
    this.setState({ filter: e.target.value})
  }

  componentDidMount() {
      let accessToken = Spotify.getAccessToken();
      fetch(`https://api.spotify.com/v1/me/playlists`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        let playlists = jsonResponse.items
        let trackDataPromises = playlists.map(playlist => {
          let responsePromise = fetch(playlist.tracks.href, {
            headers: { Authorization: `Bearer ${accessToken}`}
          })
          let trackDataPromise = responsePromise.then(response => {
            return response.json()
          })
          return trackDataPromise
        })
        let allTracksDatasPromises = Promise.all(trackDataPromises)
        let playlistsPromise = allTracksDatasPromises.then(trackDatas => {
          trackDatas.forEach((trackData, i) => {
            playlists[i].trackDatas = trackData.items.map(item => item.track)
          })
          return playlists
        })
       return playlistsPromise
      }).then(playlists => {
        let usersPlaylists = playlists.map(playlist => ({
            id: playlist.id,
            name: playlist.name,
            imgSrc: playlist.images[0].url,
            songs: playlist.trackDatas.map(song => ({
              name: song.name,
              artist: song.artists[0].name
            }))
          }))
        return usersPlaylists
      }).then(playlists => {
        this.setState({ playlists: playlists })
      })
  }

  render() {
    return (
      <div className='PlaylistSearch'>
        <div className='inputs'>
          <input placeholder='Song search' onKeyUp={this.handleSongChange}/>
        </div>
          <div className='PlaylistList'>
            {this.state.playlists.filter(playlist =>{
              for (var i = 0; i < playlist.songs.length; i++) {
              if (playlist.songs[i].name.toLowerCase().includes(this.state.filter.toLowerCase())) {
                return playlist
              }}
            }).map(playlists => {
           return <PlaylistList playlists={playlists} key={playlists.id} songFilter={this.state.songFilter}/>
          })}
        </div>
      </div>
    )
  }
};

export default PlaylistSearch;
