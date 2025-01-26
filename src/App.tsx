
import './App.css'
import MultiApiFetch from './components/ArtworkList'
import { Header } from './components/Header'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { SearchApiFetch } from './components/Search'
import { ArtworkDetail } from './components/ArtworkDetails'

function App()  {
  
  return (
    <>
      <div className='body'>
      <Header />
      <Router>
        <Routes>
    <Route path="/" element={<MultiApiFetch />} />
    <Route path="/search-results" element={<SearchApiFetch />} />
    <Route path="/artwork/:artworkId" element={<ArtworkDetail />} />
     </Routes>
    </Router>
      </div>
     
     
    </>
  )
}

export default App
