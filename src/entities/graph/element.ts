import SystemObject from "../system-description/system-object";
import Subsystem from "../system-description/subsystem";

export default interface Element {
    group: 'nodes' | 'edges';

    data: {
        id: string,
        label?: string,
        source?: string,
        target?: string,
        parent?: string,
        object?: SystemObject,
        subsystem?: Subsystem,
        updateRequired?: boolean
    };

    position?: {
        x: number,
        y: number
    };

    classes?: string[];

    pannable?: boolean;
}

export const defaultPosition = {
    x: 100, y: 50
};
