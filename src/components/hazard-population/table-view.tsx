import React from 'react';

import Hazard from '../../entities/hazard-population/hazard';
import HazardsTable from './hazards-table';

interface Props {
    hazards: Hazard[];
}

const TableView: React.FC<Props> = (props: Props) => {

    return (
        <React.Fragment>
            <HazardsTable
                hazards={props.hazards}
                hazardDeleted={() => { }}
            />
        </React.Fragment>
    );
};

export default TableView;
