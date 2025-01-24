
import './App.css'
import MultiApiFetch from './components/ArtworkList'
import { Header } from './components/Header'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { SearchApiFetch } from './components/Search'

function App()  {
  
  return (
    <>
      <div className='body'>
      <Header />
      <Router>
        <Routes>
    <Route path="/" element={<MultiApiFetch />} />
    <Route path="/search-results" element={<SearchApiFetch />} />
     </Routes>
    </Router>
      </div>
     
     
    </>
  )
}

export default App
