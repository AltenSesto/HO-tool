import SystemObject from "../system-description/system-object";
import Connection from "../system-description/connection";

export default interface Element {
    group: 'nodes' | 'edges';

    data: {
        id: string,
        label?: string,
        source?: string,
        target?: string,
        object: SystemObject | Connection,
        updateRequired?: boolean
    };

    position?: {
        x: number,
        y: number
    };

    classes?: string[];

    pannable?: boolean;
}
