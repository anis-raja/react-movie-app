import React from 'react'
import { useEffect, useRef} from 'react';
import { NavLink} from 'react-router-dom'

const Pagination = (props)=>{
    console.log('<pagination /> called');
    let totalPosts = props.results.totalResults;
    let movieName = props.results.urlMovieName;
    let currentPage = props.results.urlPageNo;

    //pagination controlling parameters
    let postsPerPage = 10;  // fixed to 10 in case of "www.omdbapi.com" movie api.
    let maxNoOfButtons = 9;

    let totalNoOfPages = totalPosts%postsPerPage >0 ? (Math.floor(totalPosts/postsPerPage)+1) : Math.floor(totalPosts/postsPerPage);
    let pageNumbersArray=[];
    let isPagination= true;

    const pageRef = useRef(0);
    const loopRef = useRef(0);
    //loopRef is actually useRef(), so instead of using long term "loopRef.current"/"dot operator" use loopFunc() to get vlaue of loopRef.current
    let loopFunc = ()=> {
        return loopRef.current;
    }
    
    //e.g if pageno=12 we get from url, then pagination shows correct series of button from 10,11,12,....
    if(totalPosts>1){
        const pageUrlNo=Math.floor((currentPage-1)/maxNoOfButtons);
        if(loopFunc()!==pageUrlNo && pageUrlNo!==-1 && pageRef.current!==currentPage){
            loopRef.current = pageUrlNo;
        }
        pageRef.current = currentPage;
    }
    
    //this calculate how many remaining posts are there in current page 
    if(totalNoOfPages>0){
        pageNumbersArray =Array.from(Array( (totalNoOfPages>maxNoOfButtons*loopFunc() && totalNoOfPages>maxNoOfButtons*(loopFunc()+1)) ? maxNoOfButtons : (totalNoOfPages-maxNoOfButtons*loopFunc()) ).keys());
    }else {
        isPagination = false;
    }
    
    //reset the loop.current value to 0 if isPagination=false
    if(!isPagination && loopFunc()!==0){
        loopRef.current = 0 ;
    }

    //reset pagination whereever from to page.no 1 if movieName change
    if(currentPage==null) loopRef.current = 0;

    function prevButton(e){
        //because of this, previous series of remaining buttons of pagination will be shown
        loopRef.current-- ;
    }
    function nextButton(e){
        //because of this, next series of remaining buttons of pagination will be shown
        loopRef.current++ ;
    }

    const setUnactiveBtnColor= (color)=>{
        const backColor = color;
        const target = document.querySelectorAll(".paginations");
        for(let i=0; i<pageNumbersArray.length; i++){
            target[i].style.backgroundColor = backColor;
        }
    }

    //set pagination backgroundColor to active button
    function findActiveBtnFromUrl(pgn, color){
        //make first button activeColor if pagenumber is not given/not button clicked
        if(pgn==null){
            const target = document.querySelectorAll(".paginations");
            target[0].style.backgroundColor = color;
        }
        if(pgn>0){
            const remainder = pgn%maxNoOfButtons;
            const target_btn_index_no = remainder===0 ? (maxNoOfButtons-1) : (remainder -1);
            const target = document.querySelectorAll(".paginations");
            target[target_btn_index_no].style.backgroundColor = color;
        }        
    }

    //change color of activebutton to one and unactives all buttons to other color
    useEffect(()=>{
        setUnactiveBtnColor("white");
        findActiveBtnFromUrl(currentPage, "#74beff");
    });
    
    return(
        <>  {isPagination ?
            
            <nav>
            <ul className='pagination navbar'>
                {
                    loopFunc()!==0 ?
                    <li className='page-item'>
                        <NavLink to={`/?movie=${movieName}&page=${(maxNoOfButtons*(loopFunc()))}`} onClick={(e)=>prevButton(e)} className='page-link'>prev</NavLink>
                    </li> : null
                }
                {                    
                    pageNumbersArray.map((number)=>(
                        <li key={number} className='page-item'>
                            <NavLink to={`/?movie=${movieName}&page=${maxNoOfButtons*loopFunc() + (number+1)}`}
                                className='nav-bar-link paginations page-link'>
                                    {maxNoOfButtons*loopFunc() + (number+1)}
                            </NavLink>
                        </li>
                    ))                    
                }
                {
                    ( totalNoOfPages/(loopFunc()+1) ) > maxNoOfButtons ?
                    <li className='page-item'>
                        <NavLink to={`/?movie=${movieName}&page=${(maxNoOfButtons*(loopFunc()+1))+1}`} onClick={(e)=>nextButton(e)} className='page-link'>next</NavLink>
                    </li> : null
                }
                
            </ul>
            </nav> : null
            }
        </>
    );
}
export default React.memo(Pagination);