import React, {useState, useRef, useMemo} from 'react';
import MovieCard from './MovieCard'
import Pagination from './Pagination'

const apiUrl = 'https://www.omdbapi.com?apikey=1c16038b'

const GetMovies = ({term})=> {
    console.log('<GetMovies /> called 2-times because of (useState), which allow to render component after get movies data from API');

    const {urlMovieName, urlPageNo} = term;
    const previousMovieName = useRef('');
    const previousPageNo = useRef(-1);    

    const getUrlMovieName = useRef(urlMovieName);
    const getUrlPageNo = useRef(urlPageNo);
    const getTotalResults = useRef(null);

    const movieRef = useRef('');
    const pageRef = useRef(0);
    const shouldPagination = useRef(false);

    getUrlMovieName.current = urlMovieName;
    getUrlPageNo.current = urlPageNo;        

    const [apiData, setApiData] = useState({urlMovieName: urlMovieName, urlPageNo: urlPageNo, movies: "", totalResults: -1, isFetchData: false});
    
    //make sure <Pagination/> should be call if {totalResults > 0} and {urlMovieName} change
    const checkFunction = function (urlmoviename, urlpageno, totalresults){
        let isNameChanged = false;
        let needToPagination = false;
        if(previousMovieName.current !== urlmoviename){            
            previousMovieName.current = urlmoviename;
            isNameChanged = true;
            if(urlpageno===null && totalresults>0){
                needToPagination = true;
            }
        }
        if(previousPageNo.current !== urlpageno){            
            previousPageNo.current = urlpageno;
            if(!needToPagination){
                if(!isNameChanged && totalresults>0){
                    needToPagination = true;
                }
            }
        }
        return needToPagination;
    }

    shouldPagination.current = checkFunction(apiData.urlMovieName, apiData.urlPageNo, apiData.totalResults);

    const searchMovie = async (title, pageNo)=> {
        if(movieRef.current!== urlMovieName || pageRef.current!== urlPageNo){
            try{
                const response = await fetch(`${apiUrl}&s=${title}&page=${pageNo}`);
                const data = await response.json();

                getTotalResults.current = data.totalResults; 

                if(movieRef.current!== urlMovieName || pageRef.current!== urlPageNo){

                }
                movieRef.current = urlMovieName;
                pageRef.current= urlPageNo;
                setApiData({urlMovieName: getUrlMovieName.current, urlPageNo: getUrlPageNo.current, movies: data.Search, totalResults: data.totalResults,  isFetchData: true});            
            }
            catch(err) {
                console.log("<GetMovies />, catch error while fetching movies data from API");
            }

            
        }    
    }

    if(urlMovieName!=null) searchMovie(urlMovieName, urlPageNo);

    //below currentPageMovies will pass to <MovieCard/>
    const currentPageMovies= useMemo(() => {
        return apiData.movies;
    }, [apiData]); 

    //below resultArguments will pass to <pagination/>
    const resultArguments = useMemo(() => {   
        const obj = {urlMovieName: getUrlMovieName.current,
                        urlPageNo: getUrlPageNo.current,
                        totalResults: getTotalResults.current};
        return obj;
    }, [apiData]);
    
    return(
        <>
            { (apiData.isFetchData) ? (
                apiData.movies?.length ?
                (                                     
                    <div className='container'>
                        {currentPageMovies.map((movie,index)=>(
                            <MovieCard key={index} movie={movie}/>
                        ))}
                    </div>
                ): (
                    <div className='empty'>
                        <h2>No Movie Found</h2>
                    </div>
                )  ) : null
            }            
            { apiData.isFetchData ? apiData.movies?.length ?  (<Pagination results = {resultArguments}/>) :null : null}
        </>
    );
}
export default React.memo(GetMovies);