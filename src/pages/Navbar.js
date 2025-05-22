import { Link, useNavigate } from "react-router-dom"
import "../styles/Navbar.css"
import { useState } from "react"

const Navbar = () => {

    const [selected, setSelected] = useState("0")
    const [hovering, sethovering] = useState("0")
    const buttons = [["Dashboard", "/home"], ["Articles", "/articles"], ["Studies", "/clinical"], ["About", "/about"], ["Settings", "/settings"]]
    const nav = useNavigate();

    return (
        <div className="navspacer">
            <div className="mainNav1">
                <div className='logospace'>

                </div>
                <div className="sections">
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

            {/* <div className="navbox left">

            </div>
            <div className="navbox mid">
                {
                    buttons.map((info) => ( // info = one array in the buttons array. info[0] is text, info[1] is a link
                        <div onClick={() => {
                            setSelected(info[0])
                            nav(info[1])
                            }} onMouseEnter={() => sethovering(info[0])} onMouseLeave={() => sethovering("")} className="pageselector">
                            <h1 className={`${selected === info[0] ? "active" : (hovering === info[0] ? "hovering" : "")}`}>{info[0]}</h1>
                        </div>
                    ))
                }
            </div>
            <div className="navbox right">

            </div> */}
            </div>
        </div>
        
    )   
}

export default Navbar;