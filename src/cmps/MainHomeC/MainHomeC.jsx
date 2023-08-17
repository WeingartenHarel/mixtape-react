import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSortedMixes } from '../../store/slices/mixSlice'

import MainHome from '../MainHome/MainHome'
import AppHeader from '../Header/Header';

const MixHomeC = ({ }) => {
    const { mixs } = useSelector((state) => state.mixs)
 
    return (
        <section>
            <AppHeader />
            {mixs && <MainHome mixs={mixs} />}
        </section>
    );
};

export default MixHomeC;

