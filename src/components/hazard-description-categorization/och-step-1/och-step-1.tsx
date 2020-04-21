import React from 'react';
import Hazard from '../../../entities/hazard-population/hazard';
import { TableContainer, TableBody, TableRow, Table, TableHead, TableCell } from '@material-ui/core';
import OchStep1TableRow from './table-row';

interface Props {
    hazards: Hazard[];
    systemUpdated: (system: { hazards: Hazard[] }) => void;
}

const OchStep1: React.FC<Props> = (props) => {

    const updateHazard = (hazard: Hazard) => {
        props.systemUpdated({ hazards: props.hazards.map(e => e.id === hazard.id ? hazard : e) });
    };

    return (
        <React.Fragment>
            <TableContainer>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                ID
                             </TableCell>
                            <TableCell>
                                Hazard Description
                             </TableCell>
                            <TableCell>
                                Category
                             </TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.hazards.length === 0 ?
                            <TableRow>
                                <TableCell colSpan={4}>
                                    No hazards identified
                                </TableCell>
                            </TableRow>
                            :
                            props.hazards.map((hazard, index) => (
                                <OchStep1TableRow
                                    key={index}
                                    hazard={hazard}
                                    hazardUpdated={updateHazard}
                                />
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
};

export default OchStep1;
