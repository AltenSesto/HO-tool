import React, { useState } from 'react';
import GraphView from './graph-view';
import { TableChart, BubbleChart } from '@material-ui/icons';
import TableView from './table-view';
import { SystemDescription } from '../../entities/system-model';
import Role from '../../entities/system-description/role';
import CornerFab from '../shared/corner-fab';

interface Props {
    system: SystemDescription;
    possibleHarmsUpdated: (roles: { roles: Role[] }) => void;
}

const MishapVictimIdentification: React.FC<Props> = (props: Props) => {
    const [isGraphView, setIsGraphView] = useState(true);

    const updateHarms = (role: Role) => {
        const updatedRoles = props.system.roles.map(e => e.id === role.id ? role : e);
        props.possibleHarmsUpdated({ roles: updatedRoles });
    };

    if (isGraphView) {
        return (
            <React.Fragment>
                <CornerFab onClick={() => setIsGraphView(false)} >
                    <TableChart />
                    Table View
                </CornerFab>
                <GraphView
                    systemDescription={props.system}
                    possibleHarmsUpdated={updateHarms}
                />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <CornerFab onClick={() => setIsGraphView(true)} >
                <BubbleChart />
                Graph View
            </CornerFab>
            <TableView
                roles={props.system.roles}
                possibleHarmsUpdated={updateHarms}
            />
        </React.Fragment>
    );
}

export default MishapVictimIdentification;
