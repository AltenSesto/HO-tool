import React from 'react';
import Toolbar from './toolbar';
import SystemObject from '../../entities/system-description/system-object';
import Graph from './graph';
import { GraphEntity } from '../../entities/graph/graph-entity';
import { ObjectTypes } from '../../entities/system-description/object-types';

interface Props {
}

interface State {
    entities: GraphEntity[]
}

export default class SystemDescription extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            entities: []
        };
        this.addObject = this.addObject.bind(this);
        this.updateObject = this.updateObject.bind(this);
        this.deleteEntities = this.deleteEntities.bind(this);
    }

    render() {
        return (
            <React.Fragment>
                <Toolbar objectAdded={this.addObject}></Toolbar>
                <Graph entities={this.state.entities} entitiesDeleted={this.deleteEntities} objectUpdated={this.updateObject}></Graph>
            </React.Fragment>
        );
        }

    private addObject(obj: SystemObject) {
        this.setState({
            entities: this.state.entities.concat(obj)
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
