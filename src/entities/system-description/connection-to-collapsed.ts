import Connection from "./connection";
import { NodeSingular } from "cytoscape";

// wierd side effect of cytoscape.js-expand-collapse
// which somehow propagates through the entire props tree
// if one end lies inside a collapsed subsystem it is set to the subsystem itself, not the actual node
// original ends are got preserved in a new member

export default interface ConnectionToCollapsed extends Connection {
    originalEnds: {
        source: NodeSingular,
        target: NodeSingular
    }
}
