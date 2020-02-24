import SystemObject from "../system-description/system-object";

export default interface Element {
    group: 'nodes' | 'edges';

    data: {
        id: string,
        label?: string,
        source?: string,
        target?: string,
        object?: SystemObject,
        updateRequired?: boolean
    };

    position?: {
        x: number,
        y: number
    };

    classes?: string[];

    pannable?: boolean;
}
