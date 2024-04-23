import { Routes, Route } from 'react-router-dom';
import Mindmap from "./Pages/Mindmap"
import FrontPage from './Pages/Frontpage';
import ExercisePage from './Pages/ExercisePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="/mindmap" element={ <Mindmap />} />
      <Route path="/exercise" element= {<ExercisePage />} />
    </Routes>
  );
}

export default App;

