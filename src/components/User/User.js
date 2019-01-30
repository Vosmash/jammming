import React from 'react';
import './User.css';
import Spotify from '../../util/Spotify.js';


class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: 'Username'
    }
  }

  render() {
    return (
      <div className='user'>
       <img /> 
       <div className='info'>
         <h2>{this.state.username}</h2>
         <div className='buttons'>
           <a onClick={Spotify.getPlaylists()}>LOG IN</a>
           <a>LOG OUT</a>
         </div>
      </div>
      </div>
    )
  }
}

export default User;
