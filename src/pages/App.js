import '../styles/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar'
import Clinical from "./Clinical"
import Paper from "./Paper"

function App() {
  return (
    <div className='hidescroll formatting'>
        <Navbar/>
        <div className='pagecontent'>
          <Routes>
            <Route path='/clinical' element={<Clinical/>} />
            <Route path='/clinical/:id' element={<Paper/>}/>
          </Routes>
        </div>
          
        
    </div>
  );
}

export default App;
