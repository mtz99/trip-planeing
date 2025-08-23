import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx';
import NoteApp from './pages/NotesApplet.jsx';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notebook" element={<NoteApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
