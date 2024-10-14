import PropTypes from "prop-types";
import './Card.css';

function Card ({album}) {

    const artists = album.artists.map((el)=>{
        return el.name
    });

    let artists_span = '';

    if(artists.length > 2) {
        artists_span = artists[0] + ', ' + artists[1] + ' e outros';
    } else if (artists.length == 2) {
        artists_span = artists[0] + ' e ' + artists[1];
    } else {
        artists_span = artists[0];
    }

    return (
        <div className="card">
            {/* <h1>{album.name} - {artists_span}</h1> */}
            <img src={album.image} alt={album.name}/>

            <p>Você deveria ouvir: </p>
            
            <a href={album.external_url.spotify} target="_blank"> <p className="album">{album.name} - {artists_span}</p> </a>
        </div>
    )
}

Card.propTypes = {
    album: PropTypes.object,
}



export default Card;