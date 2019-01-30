import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import {Spotify} from '../../util/Spotify.js';
import PlaylistSearch from '../PlaylistSearch/PlaylistSearch.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "My Playlist",
      playlistTracks: [],
      playlistsTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let newPlaylist = this.state.playlistTracks;
    if (newPlaylist.find(currentTrack => currentTrack.id === track.id)) {
      return;
    } else {
      newPlaylist.push(track)
      this.setState({ playlistTracks: newPlaylist })
    }
  }

  removeTrack(track) {
    let newPlaylist = this.state.playlistTracks.filter(currentTrack => currentTrack.id !== track.id)
    this.setState({ playlistTracks: newPlaylist})
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name })
  }

  savePlaylist() {
    let trackURI = [];
    this.state.playlistTracks.forEach(track => trackURI.push(track.uri));
    Spotify.savePlaylist(this.state.playlistName, trackURI);
    this.setState({
      playlistName: "My Playlist",
      playlistTracks: []
    });
  }

  search(term) {
    Spotify.search(term).then(results => {
      this.setState({ searchResults: results })
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
            <PlaylistSearch />
        </div>
      </div>
    );
  }
}

export default App;
