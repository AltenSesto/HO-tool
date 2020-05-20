import { createMuiTheme } from '@material-ui/core/styles';

const appZIndex = {
    graph: 10,
    nodeAction: 20,
    graphHelp: 30,
    graphAction: 40
};

const defaultTheme = createMuiTheme();

const appSpacing = {
    standard: defaultTheme.spacing(2),
    fabOverlap: defaultTheme.spacing(2) + defaultTheme.spacing(1) + 40
};

const appTheme = createMuiTheme({
    zIndex: appZIndex,
    appSpacing
});

export default appTheme;
