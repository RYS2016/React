import { useState } from "react";

export default function Player({initialName, symbol, isActive}){
    const [playerName, setPlayerName] = useState(initialName)
    const [isEditing, setIsEditing] = useState(false);

    function handleEditClick(){
        //setIsEditing(isEditing ? false : true); //making sure we are switching the value
        // or setIsEditing(!isEditing);
        //or even better way:
        //when updating a state of that state, you should pass a function 
        //to your state updating a funtion. This f will automatically be calles by React 
        //and will recieve the guaranteed latest state value
        setIsEditing((editing) => !editing)
    }
    function handleChange(event){
        setPlayerName(event.target.value);
    }

    let editablePlayerName = <span className="player-name">{playerName}</span>;
    //let btnCaption = 'Edit' or use ternary expression

    if(isEditing){
        editablePlayerName = <input type="text" required value={playerName} onChange={handleChange}/>
        //btnCaption="Save"
    }

    return (
        <li className={isActive ? 'active' : undefined}>
          <span className="player">
            {editablePlayerName}
            <span className="player-symbol">{symbol}</span>
          </span>
          <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
        </li>
    )
}