import React from 'react';
import SystemObject from '../../entities/system-description/system-object';
import Connection from '../../entities/system-description/connection';
import Subsystem from '../../entities/system-description/subsystem';
import MishapVictim from '../../entities/mishap-victim-identification/mishap-victim';
import Graph from './graph';
import { SystemDescriptionEntity } from '../../entities/system-description/system-description-entity';

interface Props {
    system: {
        kinds: SystemObject[];
        roles: SystemObject[];
        relators: SystemObject[];
        systemObjectConnections: Connection[];
        subsystems: Subsystem[];
        mishapVictims: MishapVictim[];
    };
    mishapVictimsUpdated: (items: { mishapVictims: MishapVictim[] }) => void;
}

export default class MishapVictimIdentification extends React.Component<Props> {

    render() {
        return <Graph
            systemDescription={(this.props.system.kinds as SystemDescriptionEntity[])
                .concat(this.props.system.roles)
                .concat(this.props.system.relators)
                .concat(this.props.system.systemObjectConnections)
                .concat(this.props.system.subsystems)}
            mishapVictims={this.props.system.mishapVictims}
            mishapVictimCreated={
                (item) => this.props.mishapVictimsUpdated(
                    { mishapVictims: this.props.system.mishapVictims.concat(item) }
                )}
        />;
    }
}
