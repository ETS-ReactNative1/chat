// import { setHelper } from './Chat';

function closeButton() {
    document.getElementsByClassName("helper")[0].style.display = "none";
}

function Helper(state) {

    return (
        <div className="helper">
            //Défini l'état pour fermer la window
            <div><button id="closeListButton" onClick={() => state.hideMe(false)}>X</button></div>
            <div className="listCoins">
                <h3>coinlist :</h3>
                <ul>
                    <li>bitcoin</li>
                    <li>ethereum</li>
                    <li>cardano</li>
                    <li>solana</li>
                    <li>terra</li>
                </ul>
            </div>
            <div className="listCommand">
                <p>use /"coinname" command list down below</p>
                <p>exemple "/bitcoin current_price"</p>
                <h3>Command list</h3>
                <ul>
                    <li>current_price</li>
                    <li>market_cap</li>
                    <li>max_supply</li>
                    <li>total_volume</li>
                </ul>
            </div>
        </div>
    )
}

export default Helper;