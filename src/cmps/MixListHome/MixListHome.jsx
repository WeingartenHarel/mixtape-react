import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    generatePath,
    useLocation,
    useNavigate
} from "react-router-dom";

import { setGenreToDisplay, setCurrentMix } from '../../store/slices/mixSlice'

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import MixPreview from '../MixPreview/MixPreview';

const MixListHome = ({ genre, mixs, topMixes }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [mixsFiltered, setMixsFiltered] = useState(null);
    let settings = {
        "lazyLoad": "ondemand",
        "dots": true,
        "infinite": false,
        "speed": 500,
        "slidesToShow": 4,
        "slidesToScroll": 4,
        "initialSlide": 0,
        responsive: [
            {
              breakpoint: 780,
              settings: { slidesToShow: 1, slidesToScroll: 1, infinite: false }
            },
            {
              breakpoint: 950,
              settings: { slidesToShow: 2, slidesToScroll: 2, infinite: false }
            },
            {
              breakpoint: 1024,
              settings: { slidesToShow: 3, slidesToScroll: 3, infinite: false }
            },
            {
              breakpoint: 1224,
              settings: { slidesToShow: 3, slidesToScroll: 3, infinite: false }
            }
          ]
    };

    useEffect(() => {
        let mixsCopy = [...mixs]
        let result = mixsCopy.filter((mix) => {
            return mix.genre.toLowerCase() === genre.toLowerCase();
        });
        setMixsFiltered(result)
    }, [genre]);

    const handleSelectMix = (mix) => {
        dispatch(setCurrentMix(mix))
        const path = generatePath(`/mix?mixId=${mix._id}`);
        navigate(path);
    };

    return (
        <section className="mix-list-home container">
            {mixsFiltered && (
                <div>
                    <nav className="nav-genres">
                        <ul className="mixes-list-ul">
                            <div>
                                <h2 className="mix-link">{genre}</h2>
                                <Slider {...settings}>
                                    {mixsFiltered.map((mix) => (
                                        <div onClick={() => handleSelectMix(mix)} key={mix._id}>
                                            <MixPreview mix={mix} />
                                        </div>
                                    ))}
                                </Slider>
                            </div>

                        </ul>
                    </nav>

                </div>
            )}
        </section>
    );
};

export default MixListHome;