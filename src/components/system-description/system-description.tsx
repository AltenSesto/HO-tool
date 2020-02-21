import React from 'react';
import Toolbar from './toolbar';
import SystemObject from '../../entities/system-description/system-object';
import Graph from './graph';
import { GraphEntity } from '../../entities/graph/graph-entity';

interface State {
    entities: GraphEntity[]
}

export default class SystemDescription extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            entities: []
        };
        this.addEntity = this.addEntity.bind(this);
        this.updateObject = this.updateObject.bind(this);
        this.deleteEntities = this.deleteEntities.bind(this);
    }

    render() {
        return (
            <React.Fragment>
                <Toolbar objectAdded={this.addEntity}></Toolbar>
                <Graph
                    entities={this.state.entities}
                    connectionCreated={this.addEntity}
                    entitiesDeleted={this.deleteEntities}
                    objectUpdated={this.updateObject}></Graph>
            </React.Fragment>
        );
    }

    private addEntity(entity: GraphEntity) {
        this.setState({
            entities: this.state.entities.concat(entity)
        });
    };

    private updateObject(updatedObj: SystemObject) {
        this.setState({
            entities: this.state.entities.map(e => e.id === updatedObj.id ? updatedObj : e)
        });
    };

    private deleteEntities(ids: string[]) {
        this.setState({
            entities: this.state.entities.filter(e => !ids.some(i => e.id === i))
        });
    }
};
