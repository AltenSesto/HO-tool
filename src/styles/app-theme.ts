import { createMuiTheme } from '@material-ui/core/styles';

const appZIndex = {
    graph: 10,
    nodeAction: 20,
    graphHelp: 30,
    graphAction: 40
};

const appTheme = createMuiTheme({
    zIndex: appZIndex
});

export default appTheme;
