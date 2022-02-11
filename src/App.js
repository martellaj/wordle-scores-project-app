import "./App.css";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  Chip,
  DialogContent,
  IconButton,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const dataCache = {};

function App() {
  const [selectedWordle, setSelectedWordle] = useState(getPuzzleNumber());
  const [scoresData, setScoresData] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  });
  const [isAddScoreDialogOpen, setIsAddScoreDialogOpen] = useState(false);
  const [submittedScore, setSubmittedScore] = useState(getTodayGuess());
  const [error, setError] = useState("");

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  // update page if selected wordle changes
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:3001/getStats/${selectedWordle}`,
        // `https://wordle-scores-project-service.herokuapp.com/getStats/${selectedWordle}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      // if data.wordle exists, then data exists
      if (data.wordle) {
        setError("");
        setScoresData(data.scores);
      } else if (data.error) {
        setScoresData(null);
        setError(data.message || `oops, something's wrong`);
      }
    };

    fetchData();
  }, [selectedWordle]);

  const addScore = (score) => {
    fetch(
      `http://localhost:3001/addScore/${selectedWordle}/${score}`,
      // `https://wordle-scores-project-service.herokuapp.com/addScore/${selectedWordle}/${score}`,
      {
        method: "POST",
      }
    );

    localStorage.setItem(`score-${selectedWordle}`, score);

    setScoresData({
      ...scoresData,
      [score]: scoresData[score] + 1,
    });

    setSubmittedScore(score);
    setIsAddScoreDialogOpen(false);
  };

  let totalCount = 0;
  if (scoresData) {
    Object.values(scoresData).forEach((score) => {
      totalCount += score;
    });
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App" style={{ display: "flex", flexDirection: "column" }}>
        <header className="App-header">WORDLE SCORES PROJECT</header>
        {didUserSubmitScoreToday() ? null : (
          <div style={{ height: "50px", paddingTop: "12px" }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => setIsAddScoreDialogOpen(true)}
            >
              SUBMIT YOUR SCORE
            </Button>
          </div>
        )}
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
          <span className="title" style={{ marginBottom: "0" }}>
            WORDLE {selectedWordle} SCORES
          </span>
          {!error && scoresData && (
            <>
              <div className="title statsStats">
                <span>Total submissions: {totalCount.toLocaleString()}</span>
              </div>

              <GuessDistribution
                scores={scoresData}
                userTodayScore={submittedScore}
              />
            </>
          )}
          {error && (
            <div>
              <span className="title">{error}</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              disabled={selectedWordle <= 235}
              onClick={() => {
                setSelectedWordle(selectedWordle - 1);
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <span
              className="title"
              style={{ margin: "0px 12px", marginBottom: "4px" }}
            >
              {selectedWordle}
            </span>
            <IconButton
              disabled={selectedWordle === getPuzzleNumber()}
              onClick={() => {
                setSelectedWordle(selectedWordle + 1);
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </div>
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
    </ThemeProvider>
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
  const score = localStorage.getItem(`score-${getPuzzleNumber()}`);
  return score ? parseInt(score) : null;
};

const didUserSubmitScoreToday = () => {
  return !!localStorage.getItem(`score-${getPuzzleNumber()}`);
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
            // need to fix this so that it highlights per day
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
