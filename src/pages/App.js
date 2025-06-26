import '../styles/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState, useRef, useEffect } from "react"
import Navbar from './Navbar'
import Clinical from "./Clinical"
import Studies from "./Studies"
import Paper from "./Paper"
import Shonali from "./Shonali"

function App() {
  const [open, setopen] = useState("true")

  const ref = useRef(null);                        // 1. Create a ref to access the DOM element
      const [narrow, setNarrow] = useState(false); // 2. Track whether width is < 500px
  
      useEffect(() => {
          const el = ref.current;                        // 3. Get the DOM node
          if (!el) return;
  
          const observer = new ResizeObserver(([entry]) => {
              const width = entry.contentRect.width;       // 4. Get the element's rendered width
              setNarrow(width <= 949);                    // 5. Set state if width < 500
          });
  
          observer.observe(el);                          // 6. Start observing the element
  
          return () => observer.disconnect();            // 7. Clean up on unmount
      }, []);
  return (
    <div className='hidescroll formatting'>
        <Navbar open={open} setopen={setopen} />
        <div ref={ref} className={`pagecontent ${open}`}>
          <Routes>
            <Route path='/studies' element={<Studies narrow={narrow} setNarrow={setNarrow} />} />
            <Route path='/clinical' element={<Clinical/>} />
            {/* <Route path='/studies' element={<Clinical/>} /> */}
            <Route path='/clinical/:id' element={<Paper/>}/>
            <Route path='/shonali' element={<Shonali/>}/>
          </Routes>
        </div>
          
        
    </div>
  );
}

export default App;
