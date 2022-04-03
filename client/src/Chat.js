import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Helper from './Helper';



//On récupère les données choisi grâce à une sélection
function getPrice(command, allCoins) {
    let str = command.substring(1);
    str = str.split(' ');
    let cryptoName = str[0];
    let property = str[1];
    let imgCurrency = "";
    let value = undefined;
//on map pour chercher l'élément qu'on désire afficher et son image
    allCoins.map(element => {
        if(element.name.toLowerCase().toString() === cryptoName.toString() && element.hasOwnProperty(property)){
            value = element[property];
            imgCurrency = element["image"];
        }
    });
// On return le nom de la crypto, la propriété, la valeur et l'image
    return [cryptoName, property, value, imgCurrency];
}


//On défini les useState pour ensuite changer leurs valeurs plus facilement
function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [allCoins, setAllCoins] = useState([]);
    const [helper, setHelper] = useState(false);
//Les messages sont updates de oldMessageList à newMessages.
    socket.on("receive_message", (newMessage) => {
        setMessageList((oldMsgList) => [...oldMsgList, newMessage]);
    })

    // A chaque fois que la dépendence est modifié, le useEffect est appelé
    // Dans ce cas la on récupère la liste des données crypto de l'api.
    useEffect(() =>  {
        axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
        .then(res => {
            setAllCoins(res.data);
            console.log(allCoins);
        })
        .catch(error => console.log(error))
    }, [messageList]);


//Fonction qui va regarder si le message contient certain paramètre comme "/"
//Pour ensuite savoir si l'utilisateur à utiliser la commande "/help" ou bien alors "/bitcoin etc.."
    const sendMessage = async () => {
        if (currentMessage !== "") {

            let messageData = {"message": currentMessage};
            if (currentMessage === "/help") {
                setHelper(true)
            } else if (currentMessage[0] == "/"){
                console.log("checking msg" + allCoins);
                let values = getPrice(currentMessage, allCoins);
                messageData.message = "The " + values[0] + " " + values[1] + " is : " + values[2];
                messageData.imgCurrency = values[3];
            }
            //Récupération des données pour les informations de la room, auteur, et heure d'envoi
            messageData["room"] = room;
            messageData["author"] = username;
            messageData["time"] = new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            //On attend que le message soit emit pour charger les données récupèrer avant
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
        }
    }


    //On return les élément à afficher
    return <div className='chat-window'>
        <div className="chat-header">
            <p><a href=".">Welcome {username} Room : {room}</a></p>
        </div>
        <div className="chat-body">
            {messageList.map((messageContent)=> {
                //Si le message à récupèrer une image elle est afficher, sinon l'image n'est pas afficher car elle n'a pas été récupèrer 
                return <div className='message' id={username === messageContent.author ? "you" : "other"}>
                    <div>
                        
                        <div className='message-content'>
                            <p>{messageContent.message} {messageContent.hasOwnProperty("imgCurrency") ? <img src={messageContent.imgCurrency} height="15px"/> : ""} </p>
                        </div>
                        <div className='message-meta'>
                            <p id="time">{messageContent.time}</p>
                            <p id="author">{messageContent.author}</p>
                        </div>
                    </div>
                </div>
            })}
        </div>
        <div className="chat-footer">
            <input
                type="text" placeholder="..." onChange={(event) => {
                    setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                    if (event.key === "Enter") {
                        sendMessage()
                    }
                }}
            />
            <button onClick={sendMessage}> Send </button>
        </div>
        <div>
            /help to get command list
            {helper ? < Helper hideMe={setHelper}/> : ""}
        </div>
    </div>
    
}

export default Chat;
