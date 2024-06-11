
import { Routes, Route, useLocation } from 'react-router-dom';
import Mindmap from "./Pages/Mindmap";
import FrontPage from './Pages/Frontpage';
import ExercisePage from './Pages/ExercisePage';
import gothamNarrow from '../assets/Gotham-Narrow-Font-Family/GothamNarrow-Book.otf';
import EndPage from './Pages/EndPage';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Components/Login';
import NavigationButtons from './Components/NavigationButtons';
import ChooseChallengeExercise from './Components/Exercise/ChooseChallenge';
import IdentifyLeveragePointsExercise from './Components/Exercise/IdentifyLeveragePoints';
import RedefineChallengeExercise from './Components/Exercise/RedefineChallenge';
import ValuesExercise from './Components/Exercise/Values';
import FromFutureToPresentExercise from './Components/Exercise/FromFutureToPresent';
import FuturePitchExercise from './Components/Exercise/FuturePitch';
import Logout from './Components/Logout';

const pages = [
  { path: '/', label: 'FrontPage' },
  { path: '/mindmap', label: 'Mindmap' },
  { path: '/exercise/choose-challenge', label: 'Choose Challenge' },
  { path: '/exercise/identify-leverage-points', label: 'Identify Leverage Points' },
  { path: '/exercise/redefine-challenge', label: 'Redefine Challenge' },
  { path: '/exercise/values', label: 'Values' },
  { path: '/exercise/from-future-to-present', label: 'From Future to Present' },
  { path: '/exercise/future-pitch', label: 'Future Pitch' },
  { path: '/endpage', label: 'EndPage' },
];

function App() {
  const myFontFace = `
    @font-face {
      font-family: 'Gotham Narrow';
      src: url(${gothamNarrow}) format('opentype');
      font-weight: normal;
      font-style: normal;
    }
    body {
      font-family: 'Gotham Narrow', sans-serif;
    }
  `;

  const location = useLocation();
  const currentPageIndex = pages.findIndex(page => page.path === location.pathname);

  return (
    <>
      <style>
        {myFontFace}
      </style>
      <NavigationButtons pages={pages} currentPage={currentPageIndex} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<FrontPage />} />
          <Route path="/mindmap" element={<Mindmap />} />
          <Route path="/exercise" element={<ExercisePage />}>
            <Route path="choose-challenge" element={<ChooseChallengeExercise />} />
            <Route path="identify-leverage-points" element={<IdentifyLeveragePointsExercise />} />
            <Route path="redefine-challenge" element={<RedefineChallengeExercise />} />
            <Route path="values" element={<ValuesExercise />} />
            <Route path="from-future-to-present" element={<FromFutureToPresentExercise />} />
            <Route path="future-pitch" element={<FuturePitchExercise />} />
          </Route>
          <Route path="/endpage" element={<EndPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

