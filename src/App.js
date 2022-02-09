import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [selectedWordle, setSelectedWordle] = useState(getPuzzleNumber());
  const [scoresData, setScoresData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://wordle-scores-project-service.herokuapp.com/getStats/${selectedWordle}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      // if data.wordle exists, then data exists
      if (data.wordle) {
        setScoresData(data);
      }
    };

    fetchData();
  }, [selectedWordle]);

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column" }}>
      <header className="App-header">WORDLE SCORES PROJECT</header>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <span className="title">WORDLE {selectedWordle} SCORES</span>
        <div>{JSON.stringify(scoresData)}</div>
      </div>
    </div>
  );
}

const getPuzzleNumber = (date) => {
  const refDate = new Date(2021, 5, 19, 0, 0, 0, 0);
  const _date = date || new Date();
  const val =
    new Date(_date).setHours(0, 0, 0, 0) - refDate.setHours(0, 0, 0, 0);
  return Math.round(val / 864e5);
};

export default App;
