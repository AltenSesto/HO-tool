import React, { useState } from 'react';
import Hazard from '../../../entities/hazard-population/hazard';
import HazardsList from './hazards-list';
import ExpansionGraph from './expansion-graph';

const OchStep2: React.FC = () => {

    const [selectedHazard, setSelectedHazard] = useState<Hazard | null>(null);

    if (selectedHazard) {
        return <ExpansionGraph onClose={() => setSelectedHazard(null)} />
    }

    return <HazardsList hazardSelected={setSelectedHazard} />;
};

export default OchStep2;
