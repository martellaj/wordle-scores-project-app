import "./App.css";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Chip, DialogContent } from "@mui/material";

function App() {
  const [selectedWordle, setSelectedWordle] = useState(getPuzzleNumber());
  const [scoresData, setScoresData] = useState(null);
  const [isAddScoreDialogOpen, setIsAddScoreDialogOpen] = useState(false);
  const [submittedScore, setSubmittedScore] = useState(getTodayGuess());

  useEffect(() => {
    const todayGuess = getTodayGuess();
    setSubmittedScore(todayGuess);

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
        setScoresData(data.scores);
      }
    };

    fetchData();
  }, [selectedWordle]);

  const addScore = (score) => {
    fetch(
      // `http://localhost:3000/addScore/${selectedWordle}/${score}`,
      `https://wordle-scores-project-service.herokuapp.com/addScore/${selectedWordle}/${score}`,
      {
        method: "POST",
      }
    );

    localStorage.setItem(`lastSubmittedScore`, getPuzzleNumber());
    localStorage.setItem("score", score);

    setSubmittedScore(score);
    setIsAddScoreDialogOpen(false);
  };

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column" }}>
      <header className="App-header">WORDLE SCORES PROJECT</header>
      <div style={{ height: "50px", paddingTop: "12px" }}>
        {submittedScore > 0 ? (
          <span className="title" style={{ fontSize: "12px" }}>
            Thank you for submitting your score today!
          </span>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={() => setIsAddScoreDialogOpen(true)}
          >
            SUBMIT YOUR SCORE
          </Button>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "flex-start",
          height: "80vh",
          width: "100%",
          paddingTop: "50px",
          alignItems: "center",
        }}
      >
        <span className="title">WORDLE {selectedWordle} SCORES</span>
        <GuessDistribution
          scores={scoresData}
          userTodayScore={submittedScore}
        />
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

const getTodayGuess = () => {
  const _didUserSubmitScoreToday = didUserSubmitScoreToday();

  if (!_didUserSubmitScoreToday) {
    return 0;
  } else {
    const _score = localStorage.getItem("score");
    const score = parseInt(_score || "0");
    return score;
  }
};

const didUserSubmitScoreToday = () => {
  const puzzleNumber = getPuzzleNumber();
  const lastSubmittedScore = parseInt(
    localStorage.getItem(`lastSubmittedScore`) || "0"
  );

  return puzzleNumber === lastSubmittedScore;
};

const GuessDistribution = (props) => {
  const { scores, userTodayScore } = props;

  if (!scores) {
    return null;
  }

  let totalCount = 0;
  Object.values(scores).forEach((score) => {
    totalCount += score;
  });

  return (
    <div style={{ width: "80%" }}>
      <Guess
        guess={1}
        count={scores["1"]}
        totalCount={totalCount}
        userTodayScore={userTodayScore}
      />
      <Guess
        guess={2}
        count={scores["2"]}
        totalCount={totalCount}
        userTodayScore={userTodayScore}
      />
      <Guess
        guess={3}
        count={scores["3"]}
        totalCount={totalCount}
        userTodayScore={userTodayScore}
      />
      <Guess
        guess={4}
        count={scores["4"]}
        totalCount={totalCount}
        userTodayScore={userTodayScore}
      />
      <Guess
        guess={5}
        count={scores["5"]}
        totalCount={totalCount}
        userTodayScore={userTodayScore}
      />
      <Guess
        guess={6}
        count={scores["6"]}
        totalCount={totalCount}
        userTodayScore={userTodayScore}
      />
    </div>
  );
};

const Guess = (props) => {
  const { guess, count, totalCount, userTodayScore } = props;

  return (
    <div className="graph-container">
      <div className="guess">{guess}</div>
      <div className="graph">
        <div
          className={`graph-bar align-right ${
            userTodayScore === guess ? "highlight" : ""
          }`}
          style={{ width: `${(count / totalCount) * 100}%` }}
        >
          <div className="num-guesses">{count}</div>
        </div>
      </div>
    </div>
  );
};

export default App;
