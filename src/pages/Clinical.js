import {Link} from "react-router-dom"
import "../styles/Clinical.css"
import { useState } from "react"

const Clinical = () => {

    const [recommended, setRecommended] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9])

    return (
        <div className="hidescroll mainclin">
            <div className="recommended">
                <h1 className="rectitle">Recommended</h1>
                <div className="scrollcontain">
                    <div className="fadeleft"></div>
                    <div className="reccontent">
                        {
                            recommended.map((info, i) => (
                                <div className={`reccard ${i === 0 ? "firstrec" : ""}`}>

                                </div>
                            ))
                        }

                    </div>
                    <div className="faderight"></div>
                </div>
                
            </div>
            <div className="browser">
                <h1 className="browsetitle">All Studies</h1>
                <div className="searcher">
                    <div className="sorting">
                        <div className="datecontainer"></div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Clinical;