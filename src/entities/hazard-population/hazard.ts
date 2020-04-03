import { HazardDetails } from "./hazard-details";
import SystemObject from "../system-description/system-object";
import Connection from "../system-description/connection";
import { PossibleHazard } from "./possible-hazard";

export interface Hazard extends PossibleHazard {
    details: HazardDetails;
    hazardElementEnvObj?: {
        object: SystemObject;
        connection: Connection;
    };
}
