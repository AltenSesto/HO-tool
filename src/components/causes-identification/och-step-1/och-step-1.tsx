import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { TableContainer, TableBody, TableRow, Table, TableHead, TableCell } from '@material-ui/core';
import OchStep1TableRow from './table-row';
import { RootState } from '../../../store';
import { updateHazard } from '../../../store/system-model/actions';

const mapState = (state: RootState) => ({
    hazards: state.systemModel.hazards
});

const mapDispatch = {
    hazardUpdated: updateHazard
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>

const OchStep1: React.FC<Props> = (props) => {

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
                                <TableCell colSpan={4} align='center'>
                                    No hazards identified
                                </TableCell>
                            </TableRow>
                            :
                            props.hazards.map((hazard, index) => (
                                <OchStep1TableRow
                                    key={index}
                                    hazard={hazard}
                                    hazardUpdated={props.hazardUpdated}
                                />
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
};

export default connector(OchStep1);
