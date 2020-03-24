import React from 'react';
import SystemObject from '../../entities/system-description/system-object';
import MishapVictim from '../../entities/mishap-victim-identification/mishap-victim';

interface Props {
    roles: SystemObject[];
    mishapVictims: MishapVictim[];
    mishapVictimsUpdated: (items: MishapVictim[]) => void;
}

const TableView: React.FC<Props> = (props: Props) => {
    return <h1>Table View</h1>;
};

export default TableView;
