import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import { useAppContext } from '@app/context/app.context';
import { useNavigate } from 'react-router-dom';
import { IPC_SELECT_FILE } from '../../../shared/common';

export default function File() {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const appContext = useAppContext();

  useEffect(() => {
    const handleDragOver = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: Event | any) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.files?.length > 1) {
        toast('Please select one file', {
          type: 'error',
        });
      }
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('dragover', handleDragOver);
      element.addEventListener('drop', handleDrop);

      return () => {
        element.removeEventListener('dragover', handleDragOver);
        element.removeEventListener('drop', handleDrop);
      };
    }
  }, []);

  const btnSelectFileHandle = useCallback(() => {
    const { electron } = window;
    electron.ipcRenderer.sendMessage(IPC_SELECT_FILE);
  }, []);

  useEffect(() => {
    const { electron } = window;
    return electron.ipcRenderer.on(IPC_SELECT_FILE, (args: any) => {
      if (typeof args === 'object') {
        appContext.setContent(args.data);
        appContext.setPath(args.path);
        setTimeout(() => {
          navigate('/secret');
        }, 250);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="drag" ref={ref}>
        <div className="center">
          <p className="drag-text ">
            First drag and drop your encrypted file in the window (If it's the
            first time, use an empty file)
          </p>
          <p className="drag-button">
            <Button onClick={btnSelectFileHandle} variant="contained">
              Or select a file...
            </Button>
          </p>
        </div>
      </div>
    </>
  );
}
