import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const AlbumDetails = () => {
  const { id } = useParams();
  const album = useSelector(state => 
    state.albums.list.find(a => a.id === parseInt(id))
  );

  if (!album) return <div>Album not found</div>;

  return (
    <div className="album-details">
      <h2>{album.title}</h2>
      <p>Catalog Number: {album.catalogNumber}</p>
      <p>Release Date: {new Date(album.releaseDate).toLocaleDateString()}</p>
      {album.ensemble && <p>Ensemble: {album.ensemble.name}</p>}
      
      <h3>Tracks</h3>
      <ul>
        {album.tracks?.map(track => (
          <li key={track.id}>
            {track.position}. {track.recording.composition.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumDetails;