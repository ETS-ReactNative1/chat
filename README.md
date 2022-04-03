# Crypto Chat 
## Description :
This project is about making a "Minimum Viable Product" of a web app made in React, the idea was to connect 2 users in a selected room and they would be able
to use certain command included in the chat to get access of certain crypto data provided by Coingecko. I used libraries such Axios, nodemon and Node.js.
Some of the challenges I faced was making rooms and connecting users together, I've never used API calls before so it was new technology for me. 
I hope in the future to implement more features like having private rooms and user logins. A better UI too.
## How to run the project : 
1. git clone the repo
2. npm install (this will install the dependencies), (make sure axios is installed too and react)
3. cd server && npm start (this will make the node.js server run)
4. cd client && npm start (in another console) (this will start the react project)
5. at this point a localhost will be launched and everything should be running.
## How to use the project :
Once you enter your username and a room you would like to join it will seem like a normal chat window but you should write "/help" and it will open up
a tiny window under the chat with some commands avaible. You can write for example "/bitcoin current_price" that will write up the bitcoin current price in
the window chat. 
For all the commands you can check out this link : https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false
and make your command look like this : /"coinName" *whats written in blue* in the url of coingecko like "total_volume" // "circulating_supply" etc..








## Logbook : 

Mon journal de bord: 
Quelques difficultés que j'ai dabord rencontré était apprivoisé react et ces différentes manières d'écrire les components. le JSX était particulier,
j'ai du broder pour que certaine function marche comme celle ou l'on récupère les données de l'api. Faire la liste de commande pour que la function reconnaisse 
quand on écrit le symbole "/". Ensuite viens le fait d'utiliser un websocket pour connecter les users entre eux. J'ai eu des difficultés avec des class CSS qui
ne veulent pas s'executer comme le scroll qui marche une 1 fois sur 10. (A fix). J'ai découvert pleins de nouvelles technologies web intéressante que je 
réutiliserai par la suite. J'aime beaucoup le react native. Je voulais fournir un début d'application avec une fonctionalité intéressante et je trouve que 
l'idée d'implémenter le prix directement dans le chat est plutot intéressant bien que surement deja présent sur des app comme discord. 


###Errors not fixed :
in the file client/src/chat.js comment line 38-39, this is not the useEffect for recover message but to recover the data from the API !!!
