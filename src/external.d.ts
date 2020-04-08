declare module 'react-cytoscapejs';

declare module 'cytoscape-popper'{
    export default function popper (cytoscape: (options?: CytoscapeOptions | undefined) => Core): void;
};

declare module 'cytoscape-expand-collapse';
