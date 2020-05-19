import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { rootReducer } from './store';
import { ThemeProvider } from '@material-ui/core';
import appTheme from './styles/app-theme';

const store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={appTheme}>
            <App />
        </ThemeProvider>
    </Provider>,
    document.getElementById('root'));
