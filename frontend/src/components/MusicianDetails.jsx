import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const MusicianDetails = () => {
  const { id } = useParams();
  const musician = useSelector(state => 
    state.musicians.list.find(m => m.id === parseInt(id))
  );

  if (!musician) return <div>Musician not found</div>;

  return (
    <div className="musician-details">
      <h2>{musician.name}</h2>
      <p>Country: {musician.country}</p>
      {musician.birthDate && (
        <p>Birth Date: {new Date(musician.birthDate).toLocaleDateString()}</p>
      )}
      <p>Bio: {musician.bio || 'No biography available'}</p>
      
      <h3>Ensembles</h3>
      <ul>
        {musician.ensembles?.map(ensemble => (
          <li key={ensemble.id}>
            {ensemble.ensemble.name} ({ensemble.role})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicianDetails;