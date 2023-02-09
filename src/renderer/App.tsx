import { RouterProvider } from 'react-router-dom';
import './App.scss';
import { router } from '@app/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppContextProvider } from '@app/context/app.context';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useEffect } from 'react';
import { IPC_MESSAGE_ERROR, IPC_MESSAGE_SUCCESS } from '../shared/common';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

export default function App() {
  const { electron } = window;
  useEffect(() => {
    const u1 = electron.ipcRenderer.on(IPC_MESSAGE_ERROR, (args) => {
      console.log('error');
      console.log(args);
      if (typeof args === 'string') {
        toast(args, { type: 'error' });
      }
    });
    const u2 = electron.ipcRenderer.on(IPC_MESSAGE_SUCCESS, (args) => {
      console.log('success');
      console.log(args);
      if (typeof args === 'string') {
        toast(args);
      }
    });

    return () => {
      u1();
      u2();
    };
  }, [electron.ipcRenderer]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppContextProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </AppContextProvider>
    </ThemeProvider>
  );
}
