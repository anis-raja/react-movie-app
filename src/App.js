import React, { useMemo, useRef } from 'react';
import './App.css'
import searchIcon from './search.svg'
import {useState,useEffect} from 'react'
import {Routes, Route, Link, useSearchParams, useNavigate} from 'react-router-dom'
import GetMovies from './GetMovies.js'


const App = () => {
    console.log('<App /> called');
    let navigate = useNavigate();

    // as useEffect(with no dependencies calls one time) can't get updated searchbox value by using "useState", so there "useRef" works
    const inputValueRef = useRef('');
    
    const [searchMovieName, setSearchMovieName] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();    

    const ulrSearchParams = {urlMovieName: searchParams.get('movie'),
        urlPageNo: searchParams.get('page')};
    
    const remember = useMemo(()=>{
        return ulrSearchParams;
    }, [searchParams]);
    
    const handleChange = (e) => {
        setSearchMovieName(e.target.value);
    }

    
    useEffect(() => {
        // document.body.style.backgroundColor = "#212426";

        var keydownHandler = function(event){
            if(event.key==='Enter'){
                navigate(`/?movie=${inputValueRef.current.value}`);
            }
        }
        document.getElementById("serchBox").addEventListener('keydown', keydownHandler, false);

    },[]);

    return (
        <div className='app'>
            <h1>Movies World</h1>
            
            <div className='search'>
                <input
                    id='serchBox'
                    placeholder="search for movies"
                    ref={inputValueRef}
                    value={searchMovieName}
                    onChange={handleChange}
                    >
                </input>
                <Link to={`/?movie=${searchMovieName}`} ><img src={searchIcon} alt='search'></img></Link>   
            </div>
                        
            <Routes>
                <Route path="/" element ={<GetMovies term={remember} />}/>
            </Routes>            
        </div>        
    );
} 
export default App;