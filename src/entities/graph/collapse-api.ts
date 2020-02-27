import { NodeSingular } from "cytoscape";

const options = {
    animate: false,
    cueEnabled: false
};

export interface CollapseApi {
    collapse: (node: NodeSingular) => void;
    expand: (node: NodeSingular) => void;
}

export function initCollapseApi(cy: any) {
    cy.expandCollapse(options);
}

export function getCollapseApi(cy: any): CollapseApi {
    return cy.expandCollapse('get');
}
