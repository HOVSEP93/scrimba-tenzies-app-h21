import React from 'react';
import { nanoid } from 'nanoid';
import { useStopwatch } from 'react-timer-hook';
import Confetti from 'react-confetti';
import Die from './components/Die';
import Timer from './components/Timer';

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [score, setScore] = React.useState(0);
  const stopWatch = useStopwatch({ autoStart: false });
  const [started, setStarted] = React.useState(false);
  const [tenzies, setTenzies] = React.useState(false);

  function allNewDice() {
    let array = new Array();
    for (let i = 0; i < 10; i++) {
      array.push({
        id: nanoid(),
        value: Math.floor(Math.random() * 6) + 1,
        isHeld: false,
      });
    }
    return array;
  }

  function hold(id) {
    if (!started) {
      setStarted(true);
    }
    setDice(prevDice =>
      prevDice.map(die => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map(die => {
    const clickFunc = tenzies ? () => {} : () => hold(die.id);
    return (
      <Die
        key={die.id}
        face={die.value}
        isHeld={tenzies ? true : die.isHeld}
        hold={clickFunc}
      />
    );
  });

  function roll() {
    if (!started) {
      setStarted(true);
    }
    setScore(prevScore => prevScore + 1);
    setDice(prevDice =>
      prevDice.map(die => {
        return die.isHeld
          ? die
          : {
              ...die,
              value: Math.floor(Math.random() * 6) + 1,
            };
      })
    );
  }

  function newGame() {
    setDice(allNewDice());
    setTenzies(false);
    setStarted(false);
    stopWatch.reset(null, false);
    setScore(0);
  }

  React.useEffect(() => {
    if (dice.every(die => die.value === dice[0].value)) {
      setTenzies(true);
      setStarted(false);
      stopWatch.pause();
    }
    if (started && !stopWatch.isRunning) {
      stopWatch.start();
    }
  }, [dice]);

  return (
    <main className="container">
      {tenzies && (
        <Confetti
          width={window.innerWidth - 2}
          height={window.innerHeight - 2}
        />
      )}
      <h1 className="title-text">Tenzies</h1>
      {started || tenzies ? (
        <p className="instruction-text">
          {`Rolls: ${score}`}
          <Timer secs={stopWatch.seconds} mins={stopWatch.minutes} />
        </p>
      ) : (
        <p className="instruction-text">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls ????
        </p>
      )}
      <div className="die-container">{diceElements}</div>
      <button className="roll-btn noselect" onClick={tenzies ? newGame : roll}>
        {tenzies ? 'New Game' : 'Roll'}
      </button>
    </main>
  );
}
