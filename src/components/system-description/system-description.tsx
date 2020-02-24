import React from 'react';
import Toolbar from './toolbar';
import SystemObject from '../../entities/system-description/system-object';
import Graph from './graph';
import { SystemDescriptionEntity } from '../../entities/system-description/system-description-entity';

interface Props {
    entities: SystemDescriptionEntity[];
    entitiesChanged: (entities: SystemDescriptionEntity[]) => void;
}

export default class SystemDescription extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.addEntity = this.addEntity.bind(this);
        this.updateObject = this.updateObject.bind(this);
        this.deleteEntities = this.deleteEntities.bind(this);
    }

    render() {
        return (
            <React.Fragment>
                <Toolbar objectAdded={this.addEntity}></Toolbar>
                <Graph
                    entities={this.props.entities}
                    connectionCreated={this.addEntity}
                    entitiesDeleted={this.deleteEntities}
                    objectUpdated={this.updateObject}></Graph>
            </React.Fragment>
        );
    }

    private addEntity(entity: SystemDescriptionEntity) {
        const entities = this.props.entities.concat(entity);
        this.props.entitiesChanged(entities);
    };

    private updateObject(updatedObj: SystemObject) {
        const entities = this.props.entities.map(e => e.id === updatedObj.id ? updatedObj : e);
        this.props.entitiesChanged(entities);
    };

    private deleteEntities(ids: string[]) {
        const entities = this.props.entities.filter(e => !ids.some(i => e.id === i))
        this.props.entitiesChanged(entities);
    }
};
