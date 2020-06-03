import { TableCell, withStyles, createStyles } from '@material-ui/core';

const TableCellSmall = withStyles(theme =>
    createStyles({
        sizeSmall: {
            padding: theme.spacing(1)
        }
    })
)(TableCell);

export default TableCellSmall;
