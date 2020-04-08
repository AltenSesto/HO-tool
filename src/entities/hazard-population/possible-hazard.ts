import { MishapVictim } from "../system-description/role";
import SystemObject from "../system-description/system-object";
import Connection from "../system-description/connection";

export interface ConnectionToObject {
    object: SystemObject;
    connection: Connection;
}

export interface PossibleHazard {
    mishapVictim: MishapVictim;
    mishapVictimEnvObj: ConnectionToObject;
    exposure: ConnectionToObject;
    hazardElement: ConnectionToObject;
    hazardElementEnvObjs: ConnectionToObject[];
}
