import "./App.css";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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
        convertToChartData(data.scores);
      }
    };

    fetchData();
  }, [selectedWordle]);

  const convertToChartData = (scores) => {
    setScoresData([
      {
        name: "1",
        Count: scores["1"],
      },
      {
        name: "2",
        Count: scores["2"],
      },
      {
        name: "3",
        Count: scores["3"],
      },
      {
        name: "4",
        Count: scores["4"],
      },
      {
        name: "5",
        Count: scores["5"],
      },
      {
        name: "6",
        Count: scores["6"],
      },
    ]);
  };

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column" }}>
      <header className="App-header">WORDLE SCORES PROJECT</header>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          height: "80vh",
          width: "100%",
        }}
      >
        <span className="title">WORDLE {selectedWordle} SCORES</span>
        <ResponsiveContainer height="50%">
          <BarChart width={"100%"} height={300} data={scoresData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip cursor={{ fill: "#121213" }} />
            <Bar dataKey="Count" fill="#538d4e" />
          </BarChart>
        </ResponsiveContainer>
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
