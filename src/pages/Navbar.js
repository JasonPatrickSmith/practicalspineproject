import { Link, useNavigate } from "react-router-dom"
import "../styles/Navbar.css"
import { useState } from "react"

const Navbar = () => {

    const [selected, setSelected] = useState("")
    const [hovering, sethovering] = useState("")
    const [open, setopen] = useState("true")
    const buttons = [["Dashboard", "/home"], ["Articles", "/articles"], ["Studies", "/clinical"], ["About", "/about"], ["Settings", "/settings"]]
    const nav = useNavigate();

    return (
        <div className={`navspacer ${open}`}>
            <div className={`mainNav1 ${open}`}>
                <div className='logospace'>

                </div>
                <div className="sections">
                    <div className="open" onClick={() => {
                        setopen(open === "true" ? "false" : "true")
                    }}>
                        <div className="lines">
                            <div className="one"></div>
                            <div className="two"></div>
                        </div>
                    </div>
                {
                    buttons.map((info) => ( // info = one array in the buttons array. info[0] is text, info[1] is a link
                        <div onClick={() => {
                            setSelected(info[0])
                            nav(info[1])
                            }} onMouseEnter={() => sethovering(info[0])} onMouseLeave={() => sethovering("")} className={`pageselector ${selected === info[0]  ? "active" : (hovering === info[0] ? "hovering" : "")}`}>
                            <div className="selectorimg"></div>
                            <h1 className={`selectortext ${selected === info[0]  ? "active" : (hovering === info[0] ? "hovering" : "")}`}>{info[0]}</h1>
                        </div>
                    ))
                }
                </div>
            </div>
        </div>
        
    )   
}

export default Navbar;