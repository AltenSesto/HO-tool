import React from 'react';
import Hazard from '../../entities/hazard-population/hazard';

interface Props {
    hazard: Hazard;
}

const HazardId: React.FC<Props> = (props) => {

    return (
        <React.Fragment>H{props.hazard.id}</React.Fragment>
    );
};

export default HazardId;
