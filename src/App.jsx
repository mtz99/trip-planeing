import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx';
import NoteApp from './pages/NotesApplet.jsx';
import MessageComponent from './components/MessageComponent.jsx';


function App() {

  return (
    <div className = "App">
        <header className="App-header">
            <MessageComponent />
        </header>
    </div>
    /*<BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes" element={<NoteApp />} />
      </Routes>
    </BrowserRouter>*/
  )
}

export default App
