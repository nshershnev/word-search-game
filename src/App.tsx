import { Fragment, useCallback, useEffect, useState } from 'react';
import gameLevels from './game-levels.json';
import PlayingField from './components/PlayingField';
import SearchWords from './components/SearchWords';
import './App.css';

const App = (): React.ReactElement => {
  const [levels] = useState<Array<Level>>(gameLevels);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [isGameOver, setGameOver] = useState<boolean>(false);

  const handleLevelChange = useCallback(() => {
    setCurrentLevel(prevCurrentValue => ++prevCurrentValue);
  }, [setCurrentLevel]);

  const handleWordFound = useCallback((lastWordSelection) => {
    setFoundWords(prevFoundWords => [...prevFoundWords, lastWordSelection]);
  }, [setFoundWords]);

  useEffect(() => {
    setFoundWords([]);

    if (currentLevel === levels.length) {
      setGameOver(true);
    }
  }, [currentLevel, levels]);

  return (
    <div className="app">
      <header className="app__header">
        <h1>Wordsearch</h1>
      </header>
      <main className={`app__content ${isGameOver ? 'app__game-over' : ''}`}>
        {isGameOver && <p>Game Over</p>}
        {!isGameOver &&
          <Fragment>
            <PlayingField
              onWordFound={handleWordFound}
              level={levels[currentLevel]}
              onLevelChange={handleLevelChange}
            />
            <SearchWords
              foundWords={foundWords}
              level={levels[currentLevel]}
            />
          </Fragment>
        }
      </main>
      <footer className="app__footer">Coding challenge to implement Wordseach game</footer>
    </div>
  );
}

export default App;
