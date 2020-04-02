import GraphElementsFactory from "./graph-elements-factory";
import { GraphElement, SystemObjectData, ConnectionData } from "./graph-element";
import { isRole } from "../system-description/role";

export default class GraphElementsFactoryMishapVictims extends GraphElementsFactory {

    hookSystemObject(element: GraphElement<SystemObjectData>) {
        if (!isRole(element.data.systemObject)) {
            element.classes = [element.data.systemObject.type.toString(), 'faded'];
        } else if (element.data.systemObject.possibleHarms.length > 0) {
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
