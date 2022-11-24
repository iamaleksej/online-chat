import { useState, useCallback, useEffect } from 'react';
import { ContextMenuContext } from './ContextMenu.context';
import './ContextMenu.sass';

export const ContextMenuProvider = ({ children }) => {
   const [contextMenuItems, setContextMenuItems] = useState([]);
   const [position, setPosition] = useState();
   const [isAdmin, setAdmin] = useState(false);



   const setContextMenu = useCallback((items, position) => {
      setContextMenuItems(items);
      setPosition(position);
   }, [])

   const closeContextmenu = useCallback(() => {
      setPosition(undefined)
   }, [])

   useEffect(() => {
      document.body.addEventListener('click', closeContextmenu)

      return () => {
         document.body.removeEventListener('click', closeContextmenu)
      }
   }, [closeContextmenu])

   return (
      <ContextMenuContext.Provider value={{ setContextMenu, setAdmin }}>
         {!!position && (
            <div className="context-menu"
               style={{ left: position[0], top: position[1] }}
            >
               {contextMenuItems.map((item) => (
                  <button
                     disabled={isAdmin}
                     key={item.name}
                     className="context-menu__item"
                     onClick={item.onClick}
                  >
                     {item.name}
                  </button>
               ))}
            </div>
         )}
         {children}
      </ContextMenuContext.Provider >
   )
}