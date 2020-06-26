import cytoscape, { Core, ElementDefinition } from 'cytoscape';
import { SystemDescription } from '../system-model';
import GraphElementsFactory from './graph-elements-factory';

export class HeadlessGraph {

    private readonly _cy: Core;

    public get cy(): Core {
        return this._cy;
    };

    constructor(system: SystemDescription) {
        const elements = new GraphElementsFactory().mapSystemDescription(system) as ElementDefinition[];
        this._cy = cytoscape({ elements, headless: true });
    }
};
