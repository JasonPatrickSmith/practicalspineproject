import {Link} from "react-router-dom"
import "../styles/Clinical.css"
import { useState, useEffect, useRef } from "react"
import { supabase } from "../supabase"

const Clinical = () => {

    const [recommended, setRecommended] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9])
    const [date, setDate] = useState("1M")
    const [studies, setStudies] = useState([])
    const datesortings = [["1M", 30],["1Y", 365],["5Y", 1825],["10Y", 3650],["30Y", 10950], ["ALL", 100000]]

    // retreiving new data whenever parameters are changed (like given dates, duration, etc)
    useEffect(() => { 
        const fetchStudies = async () => {
          const { data, error } = await supabase
            .from('study_entries')
            .select('*')
    
          if (error) {
            console.error('Error fetching studies:', error)
          } else {
            setStudies(data)
          }
        }
    
        fetchStudies()
      }, [date])
    
    function convertDate(dateStr) {
        const date = new Date(dateStr);

        // short month, full year format
        const options = { year: 'numeric', month: 'short' }; 
        // format date
        const formattedDate = date.toLocaleDateString('en-US', options);

        return formattedDate;
    }

    function convertDuration(dur) {
        const categories = [[4, "Weeks", 1], [51, "Months", 4], [10000, "Years", 52]]
        for (let i = 0; i < categories.length; i++) {
            const cat = categories[i]
            if (dur <= cat[0]) {
                return (Math.floor(dur/cat[2])).toString() + " " + cat[1]
            }
        }
    }

    // for redoing conditions and treatments
    function convertTerms(terms) {
        let returner = ""

        for (let i = 0; i < terms.length; i++) {
            returner += terms[i] + (i < terms.length - 1 ? ", " : "")
        }
        return returner
    }

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
                    <div className="directory">
                        <div className="constants">
                            <div className="constantcard first"></div>
                            {
                                studies.map((info, i) => (
                                    <div className="constantcard card">
                                        <div className="constantmargin">
                                            {/* <div className="approval"></div>     */}
                                            <div className="headertext">
                                                <h1 title={info.Title} className="constanttitle">{info.Title}</h1>
                                                <p title={info.mini_sum} className="constantdesc">{info.mini_sum}</p>
                                                <div className="constanttype">
                                                    <div></div>
                                                    <p>Analysis</p>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="infowrapper">
                            <div className="info">
                                <div className="studycard first">
                                    <div className="writer">Reviewers</div>
                                    <div className="condition">Condition</div>
                                    <div className="treatment">Treatment</div>
                                    <div className="sample">Sample Size</div>
                                    <div className="duration">Duration</div>
                                    <div className="date">Date</div>
                                    <div className="views">Views</div>
                                </div>
                                {
                                    studies.map((info, i) => (
                                        <div className="studycard card">
                                            <div className="writer">
                                                <img>
                                                </img>
                                            </div>
                                            {/* <div className="condition">
                                                <p className="conditiontext">{convertTerms(info.conditions)}</p>
                                                
                                            </div>
                                            <div className="treatment">
                                                <p className="treatmenttext">{convertTerms(info.treatments)}</p>
                                            </div> */}
                                            <div className="condition">
                                                <p className="conditiontext">{info.conditions[0] + "..."}</p>
                                                
                                            </div>
                                            <div className="treatment">
                                                <p className="treatmenttext">{info.treatments[0] + "..."}</p>
                                            </div>
                                            <div className="sample">{info.sample_size}</div>
                                            <div className="duration">{convertDuration(info.Duration)}</div>
                                            <div className="date">{convertDate(info.date)}</div>
                                            <div className="views">{info.views}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Clinical;