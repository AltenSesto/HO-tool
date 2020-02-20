import { ObjectTypes } from "./object-types";

const style = [
    {
        selector: `.${ObjectTypes.kind.toString()}`,
        style: {
            'background-color': 'white',
        }
    },
    {
        selector: `.${ObjectTypes.role.toString()}`,
        style: {
            'background-color': 'blue',
        }
    },
    {
        selector: `.${ObjectTypes.relator.toString()}`,
        style: {
            'background-color': 'yellow',
        }
    }
]; 

export default style;
