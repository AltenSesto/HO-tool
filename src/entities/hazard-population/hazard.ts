interface NameIdPair {
    id: string;
    name: string;
}

export default interface Hazard {
    id: string;
    harmTruthmaker: string;
    description: string;
    mishapVictim: NameIdPair;
    mishapVictimEnvObj: NameIdPair;
    exposure: NameIdPair;
    hazardElement: NameIdPair;
    hazardElementEnvObj: NameIdPair;
}
