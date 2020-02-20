import ElementData from "./element-data";

export default interface Element {
    group: 'nodes' | 'edges';

    data: ElementData;

    position?: {
        x: number,
        y: number
    };

    classes?: string[];

    pannable?: boolean;
}
