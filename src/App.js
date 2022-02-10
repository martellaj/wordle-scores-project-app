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
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Chip, DialogContent } from "@mui/material";

function App() {
  const [selectedWordle, setSelectedWordle] = useState(getPuzzleNumber());
  const [scoresData, setScoresData] = useState(null);
  const [isAddScoreDialogOpen, setIsAddScoreDialogOpen] = useState(false);

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

  const addScore = (score) => {
    fetch(
      // `http://localhost:3000/addScore/${selectedWordle}/${score}`,
      `https://wordle-scores-project-service.herokuapp.com/addScore/${selectedWordle}/${score}`,
      {
        method: "POST",
      }
    );
  };

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column" }}>
      <header className="App-header">WORDLE SCORES PROJECT</header>
      <div style={{ height: "50px", paddingTop: "12px" }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => setIsAddScoreDialogOpen(true)}
        >
          SUBMIT YOUR SCORE
        </Button>
      </div>
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

      <Dialog
        open={isAddScoreDialogOpen}
        onClose={() => setIsAddScoreDialogOpen(false)}
      >
        <DialogTitle>
          How many guesses did you take to solve today's puzzle?
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Chip label="1" onClick={() => addScore(1)} />
            <Chip label="2" onClick={() => addScore(2)} />
            <Chip label="3" onClick={() => addScore(3)} />
            <Chip label="4" onClick={() => addScore(4)} />
            <Chip label="5" onClick={() => addScore(5)} />
            <Chip label="6" onClick={() => addScore(6)} />
          </div>
        </DialogContent>
      </Dialog>
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
