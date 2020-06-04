import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../store';
import CornerFab from '../../shared/corner-fab';

const mapState = (state: RootState) => ({
});

const mapDispatch = {
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    onClose: () => void;
}

const ExpansionGraph: React.FC<Props> = (props) => {

    return (
        <CornerFab onClick={props.onClose}>
            Back
        </CornerFab>
    );
};

export default connector(ExpansionGraph);
