import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

import CornerButtonPrimary from '../shared/corner-button-primary';

interface Props {
    back: () => void;
}

const Summary: React.FC<Props> = (props: Props) => {

    return (
        <React.Fragment>
            <TableContainer>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Mishap Victim<br />(Env Obj)</TableCell>
                            <TableCell>Exposure</TableCell>
                            <TableCell>Hazard Element<br />(Env Obj)</TableCell>
                            <TableCell>Harm TruthMaker</TableCell>
                            <TableCell>Hazard Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={6} align='center'>
                                No hazards identified
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <CornerButtonPrimary onClick={props.back} >
                Back
            </CornerButtonPrimary>
        </React.Fragment>
    );
};

export default Summary;
