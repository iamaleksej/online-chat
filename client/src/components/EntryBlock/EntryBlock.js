import React, { useState } from "react";
import socket from '../../services/socket';
import axios from 'axios';
import './EntryBlock.sass';



const EntryBlock = ({ onLogin, setRights, rights }) => {
   const [roomId, setRoomId] = useState('');
   const [userName, setUserName] = useState('');

   const onEnter = async () => {
      if (!userName || !roomId) {
         return alert('Поле не может быть пустым')
      }
      const obj = {
         userName,
         roomId,
         rights
      }
      await axios.post('/rooms', obj)
      onLogin(obj);
   }


   return (
      <div className="entry-block">
         <input
            className="entry-block__input entry-block__item"
            type="text"
            placeholder="Номер комнаты чата"
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
         />
         <input
            className="entry-block__input entry-block__item"
            type="text"
            placeholder="Имя"
            value={userName}
            onChange={e => setUserName(e.target.value)}
         />
         <button
            className="entry-block__btn entry-block__item"
            type="button"
            onClick={onEnter}>
            Войти
         </button>
      </div>
   )
}

export default EntryBlock;