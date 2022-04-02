import './App.css';
import io from 'socket.io-client'
import  { useState } from "react";
import Chat from './Chat';

//Création du websocket
const socket = io.connect("http://localhost:3001");



function App() {
  //Définition des useState
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  //Fonction pour se connecter à une room
  const joinRoom = () => {
    if (username !== "" && room !== "" ) {

      socket.emit("join_room", room);
      setShowChat(true);
      console.log(`${username}, ${room}`);
    
    } 
  };
//Return du éléments html comme le container du JoinChat, username etc
  return (
    <div className="App">
      {!showChat ? (
      <div className="joinChatContainer">
      <h1>The Crypto Chat</h1>
      <h3>Join a Chat</h3>
      <input type="text" placeholder="Your Username"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <input type="text" placeholder="Room ID ex: crypto"
        onChange={(event) => {
          setRoom(event.target.value);
        }} />
      <button onClick={joinRoom}>Join the Room</button>
      </div>
      )
: (
        <Chat socket={socket} username={username} room={room}/> 
)
      }
    </div>
  );

}
export default App;
