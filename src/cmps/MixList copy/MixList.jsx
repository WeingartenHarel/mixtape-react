import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MixPreview from '../MixPreview/MixPreview';
import { setGenreToDisplay, setCurrentMix } from '../../store/slices/mixSlice'
// import ListGenresCarusselv from './list-genres-carusselv.cmp.vue';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const MixList = ({ mixs }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { genreToDisplay } = useSelector(state => state.mixs);
    const { genres } = useSelector(state => state.mixs);
    const [filteredMixes, setFilteredMixes] = useState(null);
    const [filterBySongName, setFilterBySongName] = useState('');

    useEffect(() => {
        if (!mixs) return;
        let mixsCopy = [...mixs];
        let resultByGenre
        if (genreToDisplay !== 'all') {
            resultByGenre = mixsCopy.filter(mix => mix.genre.toLowerCase() === genreToDisplay)
        } else {
            resultByGenre = mixsCopy
        }
        const resultByGenreAndSong = resultByGenre.filter(mix => {
            return mix.songs.some(song => {
                return song.title.toLowerCase().includes(filterBySongName.toLowerCase())
            })
        })
        setFilteredMixes(resultByGenreAndSong)
    }, [mixs, filterBySongName, genreToDisplay]);

    const setGenreShowAll = () => {
        dispatch(setGenreToDisplay('all'))
    };

    const onSetGenre = (genre) => {
        dispatch(setGenreToDisplay(genre))
    };

    const handleSelectMix = (mix) => {
        dispatch(setCurrentMix(mix))
        navigate("/mix");
    };


    return (
        <section className="mix-list-page container">
            <div className="input-list flex">
                <input
                    type="text"
                    value={filterBySongName}
                    onChange={(e) => setFilterBySongName(e.target.value)}
                    placeholder="Search MIX by song..."
                />
                <span><i className="fas fa-search"></i></span>
                <FontAwesomeIcon icon={['fas', 'fa-search']} />

            </div>
            <nav className="nav-genres">
                <ul className="mixes-nav-ul">
                    <li className="mix-link-all" onClick={setGenreShowAll}>All mixes</li>
                    {/* <div className="list-genres-carussel"></div> */}
                    {genres && genres.map(genre => {
                        return <li className="mix-link" onClick={() => onSetGenre(genre)}>{genre}</li>
                    })}

                </ul>

                {/*  */}
                {/* <ListGenresCarusselv
                    className="list-genres-carussel"
                    setGenre={onSetGenre}
                /> */}
            </nav>
            {
                filteredMixes && <ul className="ul-mixes">
                    {filteredMixes.map(mix => (
                        <li onClick={() => handleSelectMix(mix)} className="mix" key={mix._id}>
                            <MixPreview mix={mix} />
                        </li>
                    ))}
                </ul>
            }
        </section >
    );
};

export default MixList;
