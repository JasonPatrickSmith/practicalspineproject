import {Link} from "react-router-dom"
import "../styles/Clinical.css"
import { useState, useEffect } from "react"
import { supabase } from "../supabase"

const Clinical = () => {

    const [recommended, setRecommended] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9])
    const [date, setDate] = useState("1M")
    const [studies, setStudies] = useState([])

    const datesortings = [["1M", 30],["1Y", 365],["5Y", 1825],["10Y", 3650],["30Y", 10950], ["ALL", 100000]]
    
    useEffect(() => {
        const fetchStudies = async () => {
          const { data, error } = await supabase
            .from('study_entries')
            .select('*')
    
          if (error) {
            console.error('Error fetching studies:', error)
          } else {
            setStudies(data)
            console.log(data)
          }
        }
    
        fetchStudies()
      }, [])

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
                        <div className="datecontainer">
                        {
                            datesortings.map((info, i) => (
                                <div className={`datebutton ${info[0] === date ? "clicked" : ""}`} onClick={() => {
                                    setDate(info[0])
                                }}>
                                    {info[0]}
                                </div>
                            ))
                        }
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Clinical;