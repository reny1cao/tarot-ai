import logo from './logo.svg';
import './App.css';
import Card from './Card';
import Deck from './Deck.tsx'

import styles from './styles.module.css'

function App() {
  return (
    <div className={styles.container}>
      <Deck />
    </div>
  );
}


export default App;
