import { ZIndex, ZIndexOptions } from '@material-ui/core/styles/zIndex';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

type AppSpacing = {
    standard: number;
    fabOverlap: number;
};

type AppSpacingOptions = Partial<AppSpacing>;

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
        appSpacing: AppSpacing
    }
    interface ThemeOptions {
        appSpacing?: AppSpacingOptions
    }
}
