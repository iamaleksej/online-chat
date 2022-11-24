export default (state, action) => {
   switch (action.type) {
      case 'IS_ENTRY':
         return {
            ...state,
            isEntry: true,
            userName: action.payload.userName,
            roomId: action.payload.roomId,
            // rights: action.payload.rights,
         }
      case 'SET_DATA':
         return {
            ...state,
            users: action.payload.users,
            messages: action.payload.messages,
            rights: action.payload.rights
         }
      case 'SET_USERS':
         return {
            ...state,
            users: action.payload
         }
      case 'USER_RIGHTS':
         return {
            ...state,
            rights: action.payload
         }
      case 'NEW_MESSAGE':
         return {
            ...state,
            messages: [...state.messages, action.payload]
         }
      default:
         return state;
   }
}