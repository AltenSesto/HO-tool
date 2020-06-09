import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { TableContainer, TableBody, TableRow, Table, TableHead, TableCell, Button } from '@material-ui/core';
import { RootState } from '../../../store';
import HazardId from '../../hazard-population/hazard-id';
import Hazard from '../../../entities/hazard-population/hazard';
import { Check } from '@material-ui/icons';

const mapState = (state: RootState) => ({
    hazards: state.systemModel.hazards
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    hazardSelected: (hazard: Hazard) => void;
}

const HazardsList: React.FC<Props> = (props) => {

    const hazards = props.hazards.filter(e => e.category);

    return (
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
                        <TableCell>
                            Expanded
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {hazards.length === 0 ?
                        <TableRow>
                            <TableCell colSpan={5} align='center'>
                                No hazards categorized
                                </TableCell>
                        </TableRow>
                        :
                        hazards.map((hazard, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <HazardId hazard={hazard} />
                                </TableCell>
                                <TableCell>
                                    {hazard.description}
                                </TableCell>
                                <TableCell>
                                    {hazard.category}
                                </TableCell>
                                <TableCell>
                                    {hazard.expansion ? <Check /> : '-'}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant='outlined'
                                        onClick={() => props.hazardSelected(hazard)}
                                    >
                                        Expand
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>);
};

export default connector(HazardsList);
