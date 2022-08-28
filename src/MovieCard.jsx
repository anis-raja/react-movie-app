import React from 'react';
import notAvailableImage from './notAvailable.jpg';

const MovieCard= ({movie})=>{
    console.log('<MovieCard /> called, maximum 10 times as (omdbapi) sends 10posts/pge')
    return(
        <div className='movie'>
            <div>
                <p>{movie.Year}</p>
            </div>
            <div>
                <img src={movie.Poster !== 'N/A' ? movie.Poster : notAvailableImage} alt={movie.Title} ></img>
            </div>
            <div>
                <span>{movie.Type}</span>
                <h3>{movie.Title}</h3>
            </div>
        </div>
    )
}
export default React.memo(MovieCard);