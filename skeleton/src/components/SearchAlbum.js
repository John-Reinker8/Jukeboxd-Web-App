import React, { useState } from 'react';
import { db } from '../config/firebase'; // Update the path to your firebase config file
import { collection, query, where, getDocs } from 'firebase/firestore';

const SearchAlbum = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('album');
  const [albums, setAlbums] = useState([]);


  const handleSearch = async () => {
    if (!searchTerm) return;

    //const searchTermUpperCase = capitalizeWords(searchTerm);  //capitalizes search entry

    let fieldToSearch
    if (searchBy === 'album') {
      fieldToSearch = "albumName";
    } else if (searchBy === 'artist') {
      fieldToSearch = "artistName";
    }
    const q = query(collection(db, "albums"), where(fieldToSearch, "==", searchTerm));
    const querySnapshot = await getDocs(q);
    const fetchedAlbums = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAlbums(fetchedAlbums);

  };

  /*function capitalizeWords(str) {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });    
  } */


  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={`Search for ${searchBy === 'album' ? 'albums' : 'artists'}...`}
      />
      <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
        <option value = "album">Album</option>
        <option value = "artist">Artist</option>
      </select>
      <button onClick={handleSearch}>Search</button>
      <div>
        {albums.map(album => (
          <div key={album.id}>
            <h3>{album.albumName}</h3>
            <p>Artist: {album.artistName}</p>
            {album.coverUrl && <img src={album.coverUrl} alt="Album Cover" style={{ width: 300, height: 300 }} />}
            <p>Year: {album.releaseYear}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchAlbum;