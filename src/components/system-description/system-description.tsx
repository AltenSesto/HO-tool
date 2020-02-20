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
            entities: [
                {id: 'node1', type:ObjectTypes.kind, name:'node1', posX: 100, posY: 100},
                {id: 'link', source:'node2', target:'node1'},
                {id: 'node2', type:ObjectTypes.role, name:'node2', posX: 200, posY: 200},
                {id: 'link1', source:'node2', target:'node3'},
                {id: 'node3', type:ObjectTypes.role, name:'node3', posX: 300, posY: 200},
            ]
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
