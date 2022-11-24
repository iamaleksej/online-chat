import React, { useReducer, useEffect } from "react";
import EntryBlock from "../EntryBlock";
import reducer from '../../reducer';
import socket from '../../services/socket';
import axios from "axios";
import './App.sass';
import ChatWindow from "../ChatWindow";
import { ContextMenuProvider } from "../../context";



const App = () => {
   const [state, dispatch] = useReducer(reducer, {
      isEntry: false,
      userName: null,
      roomId: null,
      users: [],
      messages: [],
      rights: []
   })
   const { isEntry, userName, roomId } = state;

   const onLogin = async obj => {
      const { userName, roomId } = obj
      dispatch({
         type: 'IS_ENTRY',
         payload: obj
      })
      socket.emit('ROOM:JOIN', obj);

      if (userName === 'admin' || userName === 'moder') {
         socket.emit('ROOM:USER_RIGHTS', {
            userName,
            roomId,
            rights: userName
         })
         setRights({ userName, rights: userName })
      } else {
         socket.emit('ROOM:USER_RIGHTS', {
            userName,
            roomId,
            rights: null
         })
         setRights({ userName, rights: null })
      }

      const { data } = await axios.get(`/rooms/${obj.roomId}`);

      dispatch({
         type: 'SET_DATA',
         payload: data,
      })

   }

   // useEffect(() => {
   //    if (isEntry) {
   //       if (userName === 'admin' || userName === 'moder') {
   //          socket.emit('ROOM:USER_RIGHTS', {
   //             userName,
   //             roomId,
   //             rights: userName
   //          })
   //          setRights({ userName, rights: userName })
   //       } else {
   //          socket.emit('ROOM:USER_RIGHTS', {
   //             userName,
   //             roomId,
   //             rights: null
   //          })
   //          setRights({ userName, rights: null })
   //       }
   //    }
   //    console.log('asd');
   // }, [isEntry])
   const setUsers = (users) => {
      dispatch({
         type: 'SET_USERS',
         payload: users
      })
   }

   const addMessage = (message) => {
      dispatch({
         type: 'NEW_MESSAGE',
         payload: message
      })
   }
   const setRights = (rights) => {
      dispatch({
         type: 'USER_RIGHTS',
         payload: rights
      })
   }


   useEffect(() => {
      socket.on('ROOM:SET_USERS', setUsers)
      socket.on('ROOM:USER_RIGHTS', setRights)
      socket.on('ROOM:NEW_MESSAGE', addMessage)
   }, [])


   window.socket = socket;

   console.log(state);
   return (
      <ContextMenuProvider>
         {!state.isEntry
            ? <EntryBlock onLogin={onLogin} rights={state.rights} />
            : <ChatWindow {...state} onAddMessage={addMessage} />
         }
      </ContextMenuProvider>
   )
}

export default App;