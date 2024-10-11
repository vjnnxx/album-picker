import PropTypes from "prop-types";
function Card ({album}) {

    const artists = album.artists.map((el)=>{
        return el.name
    });

    return (
        <div className="card">
            <h1>{album.name}</h1>
            <img src={album.image} alt={album.name}/>
        </div>
    )
}

Card.propTypes = {
    album: PropTypes.object,
}



export default Card;