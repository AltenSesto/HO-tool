import { ZIndex, ZIndexOptions } from '@material-ui/core/styles/zIndex';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

declare module '@material-ui/core/styles/zIndex' {
    interface ZIndex {
        graph: number,
        nodeAction: number,
        graphHelp: number,
        graphAction: number
    }
    interface ZIndexOptions {
        graph?: number,
        nodeAction?: number,
        graphHelp?: number,
        graphAction?: number
    }
}

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
    }
    interface ThemeOptions {
    }
}
