import { MishapVictim } from "../system-description/role";
import SystemObject from "../system-description/system-object";
import Connection from "../system-description/connection";

export interface PossibleHazard {
    mishapVictim: MishapVictim;
    mishapVictimEnvObj: {
        object: SystemObject;
        connection: Connection;
    };
    exposure: {
        object: SystemObject;
        connection: Connection;
    };
    hazardElement: {
        object: SystemObject;
        connection: Connection;
    };
}
