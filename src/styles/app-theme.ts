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
    drawerWidth: 240
};

const appTheme = createMuiTheme({
    zIndex: appZIndex,
    appSpacing
});

export default appTheme;
