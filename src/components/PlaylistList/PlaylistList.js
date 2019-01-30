import React from 'react';
import './PlaylistList.css';



class Song extends React.Component {
  render() {
    return (
      <li>{this.props.song.name} | {this.props.song.artist}</li>
    )
  }
}

class PlaylistList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterSong: 'down'
    }
  }

  render() {
    return (
      <div className='PlaylistCom'>
        <img src={this.props.imgSrc} />
        <h2>{this.props.playlists.name}</h2>
        <ul className='song-list'>
          {this.props.playlists.songs.map(song => {
            return <Song song={song} key={song.id}/>
          })}
        </ul>
      </div>
    )
  }
};


export default PlaylistList;
