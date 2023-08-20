import { useState } from 'react';
import './App.css';
import Card from './components/Card.jsx'
import PlayButton from './components/PlayButton.jsx'


const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const kortti= (index) => ({
  image: 'http://placekitten.com/120/100?image=' + index,
  ominaisuudet: [
    { name: 'paino', value: getRandomInt(3, 20) },
    { name: 'söpöys', value: getRandomInt(1, 200)},
    { name: 'nopeus', value: getRandomInt(5, 40) },
  ],
  // Luodaan id, koska React vaatii korttipakkalistaan key-propin
  id: crypto.randomUUID(),
});

// Luodaan 16 kortin pakka
const korttipakka = Array(16).fill(null).map((_, index) => kortti(index));
const puolivali = Math.ceil(korttipakka.length / 2);

function jaaKortit() {
  shuffle(korttipakka);
  return {
    pelaaja: korttipakka.slice(0, puolivali),
    vastustaja: korttipakka.slice(puolivali),
  };
}

function shuffle(array) {
  // Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// const pelaajan_kortti = korttipakka[0];
// const vastustajan_kortti = korttipakka[8];

export default function App() {
  const [kortit, setCards] = useState(jaaKortit);
  const [result, setResult] = useState('');
  const [valittuOminaisuus, setSelected] = useState(0);

  const [gameState, setGameState] = useState('play');

  if(gameState === 'play' && (!kortit.vastustaja.length || !kortit.pelaaja.length)) {
    setGameState('game over');
  }

  function compareCards() {
    // Pick the first stat of both cards
    const playerStat = kortit.pelaaja[0].ominaisuudet[valittuOminaisuus];
    const opponentStat = kortit.vastustaja[0].ominaisuudet[valittuOminaisuus];
    // Create a variable to hold the result
    // Compare the values of both stats and set the result
    if (playerStat.value === opponentStat.value) setResult('tasapeli');
    else if (playerStat.value > opponentStat.value) setResult('voitto');
    else setResult('häviö');
    // Finally, log the result
    //Tämä näyttää vielä vanhan resultin, koska function suorittaminen on kesken
    console.log(result);
    setGameState('result');
  }

  function nextRound() {
    setCards(korttipakka => {
      const pelatutKortit = [{...korttipakka.pelaaja[0]}, {...korttipakka.vastustaja[0]}];
      const pelaajanKortit = korttipakka.pelaaja.slice(1);
      const vastustajanKortit = korttipakka.vastustaja.slice(1);
      if (result === 'tasapeli') {
        // Remove the first card of both players
        return {
          pelaaja: pelaajanKortit,
          vastustaja: vastustajanKortit,
        };
      }
      if (result === 'voitto') {
        // Give player the opponent's card
        return {
          pelaaja: [...pelaajanKortit, ...pelatutKortit],
          vastustaja: vastustajanKortit,
        };
      }
      if (result === 'häviö') {
        // Give opponent the player's card
        return {
          pelaaja: pelaajanKortit,
          vastustaja: [...vastustajanKortit, ...pelatutKortit],
        };
      }
      console.log(korttipakka);
      // If the result does not match previous cases
      return korttipakka;
    });
    setGameState('play');
    setResult('');
  }

  function restartGame() {
    setCards(jaaKortit);
    setResult('');
    setGameState('play');
  }

  function selectOminaisuus(index) {
    console.log(index);
    setSelected(index);
  }

  return (
    <>
      <h1>Kissakorttipeli</h1>
      <div className='pelialue'>
        <div className="hand pelaaja">
          <h2>omat kortit</h2>
          <ul className="korttirivi">
            {kortit.pelaaja.map((pelaajanKortti, index) => (
              <li className="korttirivi-kortti pelaaja" key={pelaajanKortti.id}>
                <Card 
                  card={index === 0 ? pelaajanKortti : null}
                  selected={valittuOminaisuus}
                  handleSelect={statIndex => selectOminaisuus(statIndex)} />
              </li>
            ))}
          </ul>
        </div>
        <div className="center-area">
        <p>{result || 'press the button'}</p>
        {
          gameState === 'play' ? (
            <PlayButton text={'Play'} handleClick={compareCards} />
          ) : gameState === 'game over' ? (
            <PlayButton text={'Restart'} handleClick={restartGame} />
          ) : (
            <PlayButton text={'Next'} handleClick={nextRound} />
          )
        }
        {gameState === 'game over' && (
          <p>Game over!</p>
          )}
        </div>
        <div className="hand">
          <h2>vastustajan kortit</h2>
          <ul className="korttirivi vastustaja">
            {kortit.vastustaja.map((vastustajanKortti, index) => (
              <li className="korttirivi-kortti vastustaja" key={vastustajanKortti.id}>
                <Card card={result && index === 0 ? vastustajanKortti : null} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      
      
    </>
  );
}