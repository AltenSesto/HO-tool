import { ObjectTypes } from "../system-description/object-types";

const graphStyle = [
    {
        selector: 'node',
        style: {
            'background-color': '#fff',
            'border-width': 1,
            'border-style': 'solid',
            'border-color': '#000',
            'shape': 'round-rectangle',
            'label': 'data(label)',
            'height': 'label',
            'width': '130px',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '130px',
            'font-size': 11,
            'padding': '10px'
        }
    },
    {
        selector: 'edge',
        style: {
            'width': 3,
            'curve-style': 'taxi',
            'line-color': '#000'
        }
    },
    {
        selector: `.${ObjectTypes.kind.toString()}`,
        style: {
            'background-color': '#8282ff',
            'color': '#fff'
        }
    },
    {
        selector: `.${ObjectTypes.role.toString()}`,
        style: {
            'background-color': '#818181',
            'color': '#fff'
        }
    },
    {
        selector: `.${ObjectTypes.relator.toString()}`,
        style: {
            'background-color': '#fff',
            'color': '#000'
        }
    }
];

export default graphStyle;
