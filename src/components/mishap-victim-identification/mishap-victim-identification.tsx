import React from 'react';
import SystemObject from '../../entities/system-description/system-object';
import Connection from '../../entities/system-description/connection';
import Subsystem from '../../entities/system-description/subsystem';
import MishapVictim from '../../entities/mishap-victim-identification/mishap-victim';
import Graph from './graph';
import { SystemDescriptionEntity } from '../../entities/system-description/system-description-entity';

interface Props {
    kinds: SystemObject[];
    roles: SystemObject[];
    relators: SystemObject[];
    systemObjectConnections: Connection[];
    subsystems: Subsystem[];
    mishapVictims: MishapVictim[];
    mishapVictimCreated: (item: MishapVictim) => void;
}

export default class MishapVictimIdentification extends React.Component<Props> {

    render() {
        return <Graph
            systemDescription={(this.props.kinds as SystemDescriptionEntity[])
                .concat(this.props.roles)
                .concat(this.props.relators)
                .concat(this.props.systemObjectConnections)
                .concat(this.props.subsystems)}
            mishapVictims={this.props.mishapVictims}
            mishapVictimCreated={this.props.mishapVictimCreated}
        />;
    }
}
