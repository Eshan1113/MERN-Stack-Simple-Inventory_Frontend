import React, { useRef } from 'react';
import AddItem from './components/AddItem';
import ItemList from './components/ItemList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const itemListRef = useRef();

  const handleItemAdded = () => {
    if (itemListRef.current) {
      itemListRef.current.fetchItems();
    }
  };

  return (
    <div>
      <AddItem onItemAdded={handleItemAdded} />
      <ItemList ref={itemListRef} />
    </div>
  );
}

export default App;