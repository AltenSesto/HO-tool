import { HazardCategory } from "../hazard-description-categorization/hazard-category";

interface NameIdPair {
    id: string;
    name: string;
}

export default interface Hazard {
    id: number;
    harmTruthmaker: string;
    description: string;
    mishapVictim: NameIdPair;
    mishapVictimEnvObj: NameIdPair;
    exposure: NameIdPair;
    hazardElement: NameIdPair;
    hazardElementEnvObj: NameIdPair;
    category?: HazardCategory;
}
