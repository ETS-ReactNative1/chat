import React, { useEffect, useState } from 'react';
import axios from 'axios';

function getValues(command, allCoins) {
    let str = command.substring(1);
    str = str.split('-');
    let cryptoName = str[0];
    let property = str[1];
    let i = 0;
    let imgCurrency = "";
    let value = undefined;

    do {
        if(allCoins[i].name.toLowerCase().toString() == cryptoName.toString() && allCoins[i].hasOwnProperty(property)){
            value = allCoins[i][property];
            imgCurrency = allCoins[i]["image"];
        }
        i++;
    } while (value == undefined);

    return [cryptoName, property, value, imgCurrency];
}

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [allCoins, setAllCoins] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            let messageData = {"message": currentMessage};
            if (currentMessage[0] == "/"){
                console.log("checking msg" + allCoins);
                let values = getValues(currentMessage, allCoins);
                messageData.message = "The " + values[0] + " " + values[1] + " is : " + values[2];
                messageData.imgCurrency = values[3];
            }

            messageData["room"] = room;
            messageData["author"] = username;
            messageData["time"] = new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
        }
    }

    useEffect(() =>  {

        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        })

        axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
            .then(res => {
                console.log(allCoins);
                console.log(res.data);
                setAllCoins(res.data);
                console.log(allCoins);
            })
            .catch(error => console.log(error))

    }, [socket]);

    return <div className='chat-window'>
        <div className="chat-header">
            <p><a href=".">Reload Chat</a></p>
        </div>
        <div className="chat-body">
            {messageList.map((messageContent)=> {
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
            <input  type="text" placeholder="..." onChange={(event) => {
            setCurrentMessage(event.target.value);
        }}
        onKeyPress={(event) => {event.key === "Enter" && sendMessage()}}
        />
            <button onClick={sendMessage}> Send </button>
        </div>

    </div>;
}

export default Chat;
