import GraphElementsFactory from "./graph-elements-factory";
import PossibleHarm from "../mishap-victim-identification/possible-harm";
import { GraphElement, SystemObjectData, ConnectionData } from "./graph-element";
import { ObjectTypes } from "../system-description/object-types";

export default class GraphElementsFactoryMishapVictims extends GraphElementsFactory {
    private _possibleHarms: PossibleHarm[];

    constructor(possibleHarms: PossibleHarm[]) {
        super();
        this._possibleHarms = possibleHarms;
    }

    hookSystemObject(element: GraphElement<SystemObjectData>) {
        if (element.data.systemObject.type !== ObjectTypes.role) {
            element.classes = [element.data.systemObject.type.toString(), 'faded'];
        } else if (this._possibleHarms.some(e => e.roleId === element.data.systemObject.id)) {
            element.classes = ['mishap-victim'];
        }
        return element;
    }

    hookConnection(element: GraphElement<ConnectionData>) {
        const classes = ['faded'];
        if (element.data.connection.isOriented) {
            classes.push('arrow-edge');
        }
        element.classes = classes;
        return element;
    }
}
