import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Helper from './Helper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonSend from './ButtonSend';
import Autocomplete from '@mui/material/Autocomplete';
import CommandList from './CommandList'


let allIds = [];

axios.get('https://api.coingecko.com/api/v3/coins/list')
.then(res => {
    allIds = res.data.map( (coin) => coin["id"]);
})
.catch((err) => console.log(err))

//On défini les useState pour ensuite changer leurs valeurs plus facilement
function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    // A chaque fois que la dépendence est modifié, le useEffect est appelé
    // Dans ce cas la on récupère la liste des données crypto de l'api.
    useEffect(() => {
        socket.on("receive_message", (newMessage) => {
            setMessageList((oldMsgList) => [...oldMsgList, newMessage]);
            console.log(messageList);
        })
    }, []);

    useEffect(() => {
        if (currentMessage !== null) {
            const splitted = currentMessage.split(" ");
            console.log(allIds[0], allIds[1], allIds[20], allIds[343]);
            console.log(currentMessage);
            if (splitted.length > 1) {
                let contained = allIds.filter(id => id.indexOf(splitted[1]) >= 0);
                console.log(contained);
            }
        }
    }, [currentMessage])

    const callAnyCoinAPI = async (id) => {
        let coin = {}
        console.log(id, allIds.includes(id));
        if (allIds.includes(id)) {
            await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`)
                .then(res => {
                    coin = res.data;
                })
                .catch(error => console.log(error))
        }

        return coin;
    }

    //Fonction qui va regarder si le message contient certain paramètre comme "/"
    //Pour ensuite savoir si l'utilisateur à utiliser la commande "/help" ou bien alors "/bitcoin etc.."
    const sendMessage = async () => {
        if (currentMessage !== "") {
            let messageData = {
                "message": currentMessage,
                "author": username,
                "room": room
            };

            if (currentMessage[0] === "/") {
                console.log("checking msg");
                const command = currentMessage.substring(1).split(' ');

                const id = command[1];
                const cryptoCoin = await callAnyCoinAPI(id);

                messageData.imgCurrency = cryptoCoin.image.small;
                const cryptoData = {
                    id: id,
                    current_price: "The price of " + id + " is " + cryptoCoin.market_data.current_price.chf.toLocaleString('en-US', { maximumFractionDigits: 2 }) + "$",
                    market_cap: "The marketcap of  " + id + " is " + cryptoCoin.market_data.market_cap.chf.toLocaleString('en-US', { maximumFractionDigits: 2 }) + "$",
                    total_volume: "The total volume is " + cryptoCoin.market_data.total_volume.chf.toLocaleString('en-US', { maximumFractionDigits: 2 }) + "$",
                }
                messageData.message = cryptoData[command[0]];
                messageData.author = "Bot";
            }

            //Récupération des données pour les informations de la room, auteur, et heure d'envoi
            messageData["time"] = new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            //On attend que le message soit emit pour charger les données récupèrer avant
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
        }

        setCurrentMessage("");
        setCurrentMessage(null);
    }

    //On return les élément à afficher
    return <div className='chat-window'>
        <div className="chat-header">
            <p><a href=".">Welcome {username} Room : {room}</a></p>
        </div>
        <div className="chat-body">
            {messageList.map((messageContent) => {
                //console.log(messageContent)
                //Si le message à récupèrer une image elle est afficher, sinon l'image n'est pas afficher car elle n'a pas été récupèrer 
                return <div className='message' id={username === messageContent.author ? "you" : messageContent.author === "Bot" ? "bot" : "other"}>
                    <div>
                        <div className='message-content'>
                            <p>{messageContent.message} {messageContent.hasOwnProperty("imgCurrency") ? <img src={messageContent.imgCurrency} alt="crypto-img" height="15px" /> : ""} </p>
                        </div>
                        <div className='message-meta'>
                            <p id="time">{messageContent.time}</p>
                            <p id="author">{username === messageContent.author ? "you" : messageContent.author}</p>
                        </div>
                    </div>
                </div>

            })}
        </div>

        <div className="chat-footer">
            <input name="chatbox" list="command-flavors"
                value={currentMessage}
                onChange={(event) => setCurrentMessage(event.target.value)}
                onKeyPress={ (event) => {
                    if (event.key === "Enter") {
                        sendMessage();
                    }
                }}
            />
            <datalist id="command-flavors">
                {
                    CommandList.map( (command) => {
                        return <option value={command} />;
                    })
                }

            </datalist>
            <Button variant="contained" onClick={() => sendMessage()}> Send </Button>
        </div>
    </div>

}

export default Chat;
