import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAppContext } from '@app/context/app.context';
import { toast } from 'react-toastify';
import { useIsCreateNew } from '@app/hooks/useIsCreateNew';
import { IPC_DECRYPT_CONTENT } from '../../../shared/common';

export default function Secret() {
  const navigate = useNavigate();
  const appContext = useAppContext();
  const { path } = appContext;
  const [decrypting, setDecrypting] = useState<boolean>(false);
  const { electron } = window;
  const { isCreateNew } = useIsCreateNew();

  useEffect(() => {
    if (typeof path !== 'string' || path.length === 0) {
      navigate('/file');
    }
  }, [navigate, path]);

  const backToFile = useCallback(() => {
    navigate('/file');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPassChange = useCallback((e: any) => {
    const { value } = e.target;
    if (typeof value === 'string') {
      appContext.setPassword(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const u1 = electron.ipcRenderer.on(IPC_DECRYPT_CONTENT, (args: any) => {
      if (typeof args === 'object' && args?.data?.content) {
        setDecrypting(false);
        appContext.setEditorData(args.data.content);
        navigate('/editor');
      } else {
        toast("Couldn't decrypt this file by using your secret", {
          type: 'error',
        });
        setDecrypting(false);
      }
    });

    return () => {
      u1();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { content } = appContext;
  const handleEnter = useCallback(
    (ev: any) => {
      if (ev.key === 'Enter' || ev === 'force_enter') {
        const { password } = appContext;
        if (password?.length && password?.length >= 8) {
          if (!isCreateNew) {
            setDecrypting(true);
            electron.ipcRenderer.sendMessage(IPC_DECRYPT_CONTENT, [
              { content, password },
            ]);
          } else {
            navigate('/editor');
          }
        }
      }
      // eslint-disable-next-line no-prototype-builtins
      if (typeof ev === 'object' && ev.hasOwnProperty('preventDefault')) {
        ev.preventDefault();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appContext.password, isCreateNew]
  );

  if (decrypting) {
    return (
      <div className="editor">
        <div className="center-decrypting">
          <p className="center-text">Decrypting data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="secret">
      <div className="btn-back">
        <IconButton aria-label="back" size="medium" onClick={backToFile}>
          <ArrowBackIcon fontSize="inherit" />
          Change file
        </IconButton>
      </div>
      <div className="center">
        <div className="secret-text">
          <TextField
            id="outlined-password-input"
            label="Enter your secret key"
            type="password"
            onChange={(event: any) => {
              onPassChange(event);
            }}
            onKeyDown={handleEnter}
            InputProps={{
              endAdornment: (
                // eslint-disable-next-line react/button-has-type, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div onClick={() => handleEnter('force_enter')}>
                  <InputAdornment position="end">
                    <ArrowForwardIcon fontSize="large" />
                  </InputAdornment>
                </div>
              ),
            }}
            helperText="Password must be at least 8 characters"
          />
        </div>
      </div>
    </div>
  );
}
