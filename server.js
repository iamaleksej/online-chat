const express = require('express');
const cors = require('cors')

const PORT = 8080;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
   cors: {
      origin: "*",
      methods: ["GET", "POST", "OPTIONS"]
   }
});

const dbChat = new Map();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/rooms/:id', (req, res) => {
   const { id: roomId } = req.params;
   const obj = dbChat.has(roomId) ? {
      users: [...dbChat.get(roomId).get('users').values()],
      messages: [...dbChat.get(roomId).get('messages').values()],
      rights: [...dbChat.get(roomId).get('rights').values()]
   }
      : { users: [], messages: [], rights: [] };
   res.json(obj)
})

app.post('/rooms', (req, res) => {
   const { roomId, userName } = req.body;
   if (!dbChat.has(roomId)) {
      dbChat.set(
         roomId,
         new Map([
            ['users', new Map()],
            ['messages', []],
            ['rights', new Map()]
         ]))
   }

   res.send()
})

io.on('connection', socket => {
   socket.on('ROOM:JOIN', ({ roomId, userName }) => {
      socket.join(roomId);
      dbChat.get(roomId).get('users').set(socket.id, userName);
      const users = [...dbChat.get(roomId).get('users').values()];
      socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users);
      console.log(users);
   })

   socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => {
      const obj = {
         userName,
         text,
      };
      dbChat.get(roomId).get('messages').push(obj);
      socket.broadcast.to(roomId).emit('ROOM:NEW_MESSAGE', obj);
   })

   socket.on('ROOM:USER_RIGHTS', ({ roomId, userName, rights }) => {
      const obj = {
         userName,
         rights,
      };
      console.log(obj.userName);
      // dbChat.get(roomId).get('rights').push(obj);

      dbChat.get(roomId).get('rights').set(socket.id, obj);
      const user_rights = [...dbChat.get(roomId).get('rights').values()];
      socket.broadcast.to(roomId).emit('ROOM:USER_RIGHTS', user_rights);
      // console.log(dbChat.get(roomId).get('rights').set(socket.id, user_rights));
   })

   // socket.on('ROOM:UPDATE_USER_RIGHTS', ({ roomId, userName, rights }) => {
   //    const obj = {
   //       userName,
   //       rights,
   //    };
   //    const db_rights = dbChat.get(roomId).get('rights').values();
   //    console.log(db_rights);
   //    for (let elem of db_rights) {
   //       if (elem.userName === obj.userName) {
   //          elem.rights = 'moder'
   //       }
   //    }
   //    const user_rights = [...dbChat.get(roomId).get('rights').values()];
   //    console.log(user_rights);
   //    socket.broadcast.to(roomId).emit('ROOM:UPDATE_USER_RIGHTS', user_rights);
   //    // console.log(dbChat.get(roomId).get('rights'));


   // })


   socket.on('disconnect', () => {
      dbChat.forEach((value, roomId) => {
         if (value.get('users').delete(socket.id)) {
            const users = [...value.get('users').values()];
            socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users);
            console.log(users);
         }
         if (value.get('rights').delete(socket.id)) {
            const user_rights = [...value.get('rights').values()];
            socket.to(roomId).emit('ROOM:USER_RIGHTS', user_rights);
            console.log(user_rights);
         }
      })
   })

   console.log('user connected', socket.id);
})

server.listen(PORT, () => console.log(`server started on port ${PORT}`));