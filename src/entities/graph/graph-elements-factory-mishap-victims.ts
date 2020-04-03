import GraphElementsFactory from "./graph-elements-factory";
import { GraphElement, SystemObjectData, ConnectionData, SubsystemData } from "./graph-element";
import { isRole, isMishapVictim } from "../system-description/role";

export default class GraphElementsFactoryMishapVictims extends GraphElementsFactory {

    hookSystemObject(element: GraphElement<SystemObjectData>) {
        if (!isRole(element.data.systemObject)) {
            element.classes = [element.data.systemObject.type.toString(), 'faded'];
        } else if (isMishapVictim(element.data.systemObject)) {
            element.classes = ['mishap-victim'];
        }
        element.grabbable = false;
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

    hookSubsystem(element: GraphElement<SubsystemData>) {
        element.grabbable = false;
        return element;
    }
}
