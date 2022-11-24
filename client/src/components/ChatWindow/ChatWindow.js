import React, { useState, useRef, useEffect } from "react";
import { useContextMenu } from "../../hooks";
import socket from '../../services/socket';

import './ChatWindow.sass';

const ChatWindow = ({ users, messages, userName, roomId, rights, onAddMessage }) => {
   const { setContextMenu, setAdmin } = useContextMenu();
   const [messageValue, setMessageValue] = useState('');
   const messagesRef = useRef(null)

   useEffect(() => {
      rights.map((item, index) => {
         if (userName === item.userName) {
            if (rights[index].rights !== 'admin') {
               setAdmin(true)
            }
         }
      })


      // if (userName === 'admin' || userName === 'moder') {
      //    socket.emit('ROOM:USER_RIGHTS', {
      //       userName,
      //       roomId,
      //       rights: userName
      //    })
      //    setRights({ userName, rights: userName })
      // } else {
      //    socket.emit('ROOM:USER_RIGHTS', {
      //       userName,
      //       roomId,
      //       rights: null
      //    })
      //    setRights({ userName, rights: null })
      // }
   }, [])

   const onSendMessage = () => {

      socket.emit('ROOM:NEW_MESSAGE', {
         userName,
         roomId,
         text: messageValue
      })
      onAddMessage({ userName, text: messageValue })
      setMessageValue('');

   }

   useEffect(() => {
      messagesRef.current.scrollTo(0, 99999)
   }, [messages])

   const handleContextMenu = (e, name) => {
      e.preventDefault();

      const { clientX, clientY } = e;

      setContextMenu([
         {
            name: 'Дать модератора',
            onClick: () => addModerToUser(e, name)
         },
         {
            name: 'Забанить на 15 сек.',
            onClick: () => { }
         },
      ],
         [clientX, clientY])
   }

   // console.log('вне функции        ', rights);
   const addModerToUser = (e, name) => {
      // console.log('внутри функции        ', rights);
      rights.map((item, index) => {
         if (userName === 'admin') {
            if (item.userName === name && item.userName !== userName) {
               rights[index].rights = 'moder';

               socket.emit('ROOM:UPDATE_USER_RIGHTS', {
                  userName: name,
                  roomId,
                  rights: 'moder'
               })
               console.log('moder');
            }
         } else {
            alert('Вы не админ!')
         }
      })
   }

   return (
      <div className="chat-window">
         <div className="chat-window__users">
            <h2 className="chat-window__title-room">Комната: {roomId}</h2>
            <p className="chat-window__quantity-users">Online ({users.length}):</p>
            <ul className="chat-window__users-list">
               {users.map((name, index) => <li key={name + index}
                  // onClick={(e) => addModerToUser(e, name)}
                  onContextMenu={e => handleContextMenu(e, name)}
                  className="chat-window__users-list-item"
               >
                  {name}
               </li>)}
            </ul>
         </div>
         <div className="chat-window__messages-block">
            <div ref={messagesRef} className="chat-window__messages">
               {messages.map((message, index) => (
                  <div key={index} className="chat-window__message">
                     <p className="chat-window__message-text">{message.text}</p>
                     <div className="chat-window__message-user">
                        <span>{message.userName}</span>
                     </div>
                  </div>
               ))}

            </div>
            <form className="form">
               <textarea
                  value={messageValue}
                  onChange={e => setMessageValue(e.target.value)}
                  className="form__text-field"
                  row="3"></textarea>
               <button
                  type="button"
                  className="form__btn"
                  onClick={onSendMessage}>
                  Отправить
               </button>
            </form>
         </div>
      </div>
   )
}

export default ChatWindow;