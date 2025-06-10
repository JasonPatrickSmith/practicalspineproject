import {Link, useSearchParams, useNavigate} from "react-router-dom"
import "../styles/Studies.css"
import { useState, useEffect, useRef } from "react"
import { supabase } from "../supabase"
import userEvent from "@testing-library/user-event"
import magnifying from "../assets/magnifying-glass-18.png"
import spineicon from "../assets/drop.png"
import bandaidicon from "../assets/first aid.png"
import clock from "../assets/clock.png"
import person from "../assets/person.png"
import calendar from "../assets/calendar.png"
import eye from "../assets/eye.png"
import desc from "../assets/desc.png"

const Clinical = () => {

    const nav = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    

    const [date, setDate] = useState("1M")
    const [studies, setStudies] = useState([])
    const datesortings = [["1M", 30],["1Y", 365],["5Y", 1825],["10Y", 3650],["30Y", 10950], ["ALL", 100000]]
    const [search, setSearch] = useState(searchParams.get("q") || "")

    const[openDesc, setOpenDesc] = useState(-1)
    

    const isfirstrender = useRef(true)

    // search function, runs on new searches
    useEffect(() => {
        if (isfirstrender.current) {
            isfirstrender.current = false; // Skip first run
        return;
        }
    }, [search]);

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
      }, [searchParams])
    
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

    function applySearch(param) {
        if (search.trim() !== "") {
            setSearchParams({ q: search }, { replace: true })
        }
        
    }

    function handleDesc(i) {

        let newopen = openDesc === i ? -1 : i
        
        setOpenDesc(newopen)
    }

    return (
        <div className="mainstudies">
            {/* <h1>All Studies</h1> */}
            <div className="search">

                <div className="searchbar">
                    <img src={magnifying} onClick={applySearch}></img>

                    <input 
                    value={search}
                    className="searchelem" 
                    placeholder="Search Anything" 
                    onChange={(e) => {
                        if (e.target.value !== null) {
                            setSearch(e.target.value)
                        }
                        
                    }
                        
                    } 
                    onKeyDown={
                        (e) => {
                            if (e.key === "Enter") {
                                applySearch()
                            }
                        }
                    } />
                </div>
                
                {/* <div className="filters">

                </div> */}
                
            </div>
            
            <div className="content">
                <div className="cards">
                    {
                        studies.map((info, i) => (
                            


                            <div className="card" onClick={() => {
                                nav(`/studies/${info.id}`)
                            }}>
                            <div className="spacer">
                            <div className="top1">
                                <h1 className="title1">{info.Title}</h1>
                            </div>
                            <div className="tags">
                                
                                <div className="type1">
                                    <div className="dot">
                                        <div className="dotimg"></div>
                                        <div className="text">Analysis</div>
                                    </div>
                                </div>
                                {
                                    info.conditions.map((infoc, j) => (
                                        <div className="type1 c">
                                            <div className="dot c">
                                                <div className="dotimg c"></div>
                                                <div className="text">{infoc}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                                {
                                    info.treatments.map((infot, j) => (
                                        <div className="type1 t">
                                            <div className="dot t">
                                                <div className="dotimg t"></div>
                                                <div className="text">{infot}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            
                            <div className="details">
                                <div className="duration">
                                    <img src={clock}></img>
                                    <p>{convertDuration(info.Duration)}</p>
                                </div>
                                <div className="sample_size">
                                    <img src={person}></img>
                                    <p>{info.sample_size}</p>
                                </div>
                                <div className="date">
                                    <img src={calendar}></img>
                                    <p>{convertDate(info.date)}</p>
                                </div>
                                <div className="views">
                                    <img src={eye}></img>
                                    <p>{info.views}</p>
                                </div>
                            </div>
                            <div className="desc">
                                <div className="lastedited">
                                    <div className="editeddot"></div>
                                    <div className="editedtext">
                                        Last Edited 2d Ago
                                    </div>
                                </div>
                                <div className="expandable" onClick={(e) => {
                                    handleDesc(i)
                                    e.stopPropagation()
                                }}>
                                    <img src={desc}></img>
                                    <div className="desctext">
                                        Description
                                    </div>
                                </div>
                            </div>
                            <div className={`expanddesc ${openDesc === i ? "open1" : "closed1"}`}>
                                {info.mini_sum}
                            </div>
                        </div>
                        
                    </div>
                        ))
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default Clinical;