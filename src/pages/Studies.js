import {Link, useSearchParams, useNavigate} from "react-router-dom"
import Fuse from "fuse.js"
import "../styles/Studies.css"
import { useState, useEffect, useRef, useMemo } from "react"
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

const Clinical = ({narrow, setNarrow}) => {
    
    const [alltags, setalltags] = useState([])
    const nav = useNavigate();


    const tagsfuse = new Fuse(alltags, {
        keys: ["Name"],
        threshold: .3,
        ignoreLocation: true
    })


    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("q") || "")

    const [date, setDate] = useState("1M")
    const [studies, setStudies] = useState([])
    const datesortings = [["1M", 30],["1Y", 365],["5Y", 1825],["10Y", 3650],["30Y", 10950], ["ALL", 100000]]
    

    const[openDesc, setOpenDesc] = useState(-1)
    

    const isfirstrender = useRef(true)

    // all actions taken when page first loads
    useEffect(() => {
        const retrievetags = async () => {
            const {data, error} = await supabase
            .from("Tags")
            .select("*")

            if (error) {
                console.error(error)
            } else {
                setalltags(data)
            }
        }

        retrievetags()

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
    
    
    

    function applySearch(param) {
        const updatedParams = new URLSearchParams(searchParams.toString());
        if (search.trim() !== "") {
            updatedParams.set("q", search);
        } else {
            updatedParams.delete("q"); // optional: clear q if empty
        }
        setSearchParams(updatedParams);
        
    }

    function handleDesc(i) {

        let newopen = openDesc === i ? -1 : i
        
        setOpenDesc(newopen)
    }


    // --------------- PARENT TAG LOGIC --------------------
    // selected tags is just getting all the tags from the search param
    function getTags() {
        const origin = searchParams.get("tags")?.split(",")
        if (origin != null) {
            return origin
            .map(w => w
            .split(" ")
            .map(nw => nw.charAt(0).toUpperCase() + nw.slice(1))
            .join(" ")) 
        }
        return null
    }

    // const [selectedTags, setSelectedTags] = useState(getTags() || [])
    const selectedTags = useMemo(() => {
        return getTags() || []
    }, [searchParams])

    function addTag(tag) {
        if (!selectedTags.includes(tag)) {
            const newselected = [...selectedTags, tag]
            const tagparam = new URLSearchParams(searchParams.toString())
            tagparam.set(
                "tags",
                newselected.join(",")
            )
            setSearchParams(tagparam)
        }
    }

    function removeTag(tag) {
        const newselected = selectedTags.filter(t => t !== tag);
        const tagparam = new URLSearchParams(searchParams.toString());

        if (newselected.length > 0) {
            tagparam.set("tags", newselected.join(","));
        } else {
            tagparam.delete("tags"); // optional: clean up if no tags left
        }

        setSearchParams(tagparam);
    }

    // --------------- PARENT TAG LOGIC --------------------

    return (
        <div className="mainstudies">
            
            {!narrow && <Sort alltags={alltags} inline={false} searchParams={searchParams} setSearchParams={setSearchParams} fuse={tagsfuse} addTag={addTag} selectedTags={selectedTags} removeTag={removeTag}/>}
            <div className="rightstudies">
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
                {narrow && <Sort alltags={alltags} inline={true} searchParams={searchParams} setSearchParams={setSearchParams} fuse={tagsfuse} addTag={addTag} selectedTags={selectedTags} removeTag={removeTag}/>}
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
                                    {
                                        info.Tags.map((ninfo, j) => (
                                            <Tag info={ninfo} alltags={alltags} searchtag={false}/>
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
        </div>
    )
}

const Sort = ({inline, searchParams, setSearchParams, alltags={alltags}, fuse, addTag, selectedTags, removeTag}) => {
    
    function extractNames(array, a = false) { // a is the option to sort alphabetically
        // console.log(array)
        let returner = []
        for (let i = 0; i < array.length; i++) {
            if (array[i].Name != "New Tag") {
                returner.push(array[i].Name)
            }
        }
        if (a) {
            returner.sort((a, b) => a.localeCompare(b))
        }

        return returner
    }

    const alphabetically = useMemo(() => extractNames(alltags, true), [alltags]);
    const [tagSearch, setTagSearch] = useState("")
    const [searchResults, setSearchResults] = useState(alphabetically)

    useEffect(() => { // initializing searchResults
        setSearchResults(alphabetically)
    }, [alphabetically])


    useEffect(() => {
        if (tagSearch !== "") {
            setSearchResults(extractNames(fuse.search(tagSearch).map(a => a.item)))
        }
        else { // when query == "" (empty), revert to original list
            setSearchResults(alphabetically)
        }
    }, [tagSearch, selectedTags, alltags]) // Whenever the query changes, update tagsearch


    return (
        <div className={`big ${inline ? "inline" : "out"}`}>
            <div className="tagssection">
                <div className="fulltags">
                    <div className="tagspace">
                        {
                            selectedTags.map((tag, i) => (
                                <Tag info={tag} alltags={alltags} searchtag={false} removeTag={removeTag} sortTag={true}/>
                            ))
                        }
                        <Tag info={"New Tag"} alltags={alltags} searchtag={true} setTagSearch={setTagSearch} searchResults={searchResults} addTag={addTag} selectedTags={selectedTags}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Tag = ({ info, alltags, searchtag, setTagSearch, searchResults, addTag, selectedTags, removeTag, sortTag=false }) => {
    

    function tagColor(name) {
        for (let i = 0; i < alltags.length; i++) {
            if (alltags[i].Name == name) {
                return alltags[i].Color
                break
            }
        }
    }
    const color = tagColor(info) || ""
    
    const [dropdown, setDropdown] = useState(false)

    const displayable = useMemo(() => {
    if (!searchResults) return null;
    return searchResults.filter(tag => !selectedTags.includes(tag));
}, [searchResults, selectedTags]);

    // if (searchResults) {
    //     console.log(displayable)
    // }
    
    
    const [taginput, settaginput] = useState("")

    return (

        <div className="tagsholder" onClick={() => {
            if (sortTag) {
                removeTag(info)
            }
        }}>
            <div className={`type1 ${color}`}>
                <div className={`dot ${color}`}>
                    <div className={`dotimg ${color}`}></div>
                    {searchtag ? (
                        <input
                        className="taginputtext"
                        placeholder={info}
                        value={taginput}
                        onFocus={() => {setDropdown(true)}}
                        onBlur={() => {setDropdown(false)}}
                        onChange={(e) => {
                            // console.log("1")
                            setTagSearch(e.target.value)
                            settaginput(e.target.value)
                        }}
                        />

                    ) : (
                        <div className="text">{info}</div>
                    )}
                    
                </div>
            </div>
            {
                searchtag ? (
                    <div className={`tagsdropdown ${dropdown ? "opend" : "closedd"}`}>
                        <div className="tagscrollwrapper">
                        {
                            displayable.map((tag, i) => (
                                
                                    <div className="tagsscroll" onClick={() => {
                                        addTag(tag) // add tag to list of tags selected (will update state)
                                        settaginput("") // making input blank
                                        setTagSearch("") // setting tag search empty so default (alphabetical) sorting will take over
                                    }}>
                                        <div className={`resultdot ${tagColor(tag)}`}></div>
                                        <div className="searchresult">{tag}</div>
                                    </div>
                            ))
                        }
                        </div>
                    </div>
                ) : (               
                <div></div>
                    )
            }
        </div>
        
    )
    
}



export default Clinical;