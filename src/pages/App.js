import '../styles/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from "react"
import Navbar from './Navbar'
import Clinical from "./Clinical"
import Studies from "./Studies"
import Paper from "./Paper"

function App() {
  const [open, setopen] = useState("true")
  return (
    <div className='hidescroll formatting'>
        <Navbar open={open} setopen={setopen} />
        <div className={`pagecontent ${open}`}>
          <Routes>
            <Route path='/studies' element={<Studies/>} />
            <Route path='/clinical/:id' element={<Paper/>}/>
          </Routes>
        </div>
          
        
    </div>
  );
}

export default App;
