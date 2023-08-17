import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HeroSection from '../HeroSection/HeroSection';
import MixListHome from '../MixListHome/MixListHome';
import MixListHomeTop from '../MixListHomeTop/MixListHomeTop';
import MixListHomeUser from '../MixListHomeUser/MixListHomeUser';
import MixPreview from '../MixPreview/MixPreview';
import { setSortedMixes , setMixUser } from '../../store/slices/mixSlice';


const MixHome = ({ mixs }) => {
    const dispatch = useDispatch();
    const { genres } = useSelector((state) => state.mixs);
    const { topMixes } = useSelector((state) => state.mixs);
    const { mixsUser } = useSelector((state) => state.mixs);
    const { loggedInUser } = useSelector((state) => state.user);

    const [ref, setRef] = useState()

    useEffect(() => {
        dispatch(setSortedMixes());
    }, [mixs]);

    useEffect(() => {
        if (!loggedInUser || !mixs) return
        dispatch(setMixUser(loggedInUser));
    }, [mixs , loggedInUser]);
    
    const emitScrollMeTo = (refName) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section>
            <div className="mix-home">
                <HeroSection emitScrollMeTo={emitScrollMeTo} />
                {loggedInUser && mixsUser && <MixListHomeUser topMixes={mixsUser} setRef={setRef}/>}
                <MixListHomeTop topMixes={topMixes} setRef={setRef} />
                {genres && mixs && (
                    <ul className="mixes-list-ul">
                        {genres.map((genre, index) => (
                            <li key={index} className="mixes-list-li">
                                <MixListHome genre={genre} mixs={mixs} topMixes={topMixes} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* Replace MixFooter with the actual component */}
            {/* <MixFooter /> */}
        </section>
    );
};

export default MixHome;

