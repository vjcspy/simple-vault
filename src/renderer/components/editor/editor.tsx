/* eslint-disable react-hooks/exhaustive-deps */
import { createReactEditorJS } from 'react-editor-js';
import { EDITOR_JS_TOOLS } from '@components/editor/tootls';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Button } from '@mui/material';
import { useAppContext } from '@app/context/app.context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useIsCreateNew } from '@app/hooks/useIsCreateNew';
import { IPC_WRITE_FILE } from '../../../shared/common';

export default function Editor() {
  const { electron } = window;
  const { password, path, editorData } = useAppContext();
  const navigate = useNavigate();
  const { isCreateNew } = useIsCreateNew();

  useEffect(() => {
    if (typeof password !== 'string' || password.length < 8) {
      navigate('/secret');
      return;
    }
    if (typeof path !== 'string' || path.length === 0) {
      navigate('/file');
    }
  }, [password, path]);

  const editorCore = useRef<any>(null);

  const handleInitialize = useCallback((instance: any) => {
    editorCore.current = instance;
  }, []);

  const handleSave = useCallback(async () => {
    if (editorCore?.current) {
      const savedData = await editorCore.current.save();
      if (Array.isArray(savedData?.blocks) && savedData?.blocks.length > 0) {
        electron.ipcRenderer.sendMessage(IPC_WRITE_FILE, [
          {
            content: savedData,
            path,
            password,
          },
        ]);
      } else {
        toast("Couldn't save data", { type: 'error' });
      }
    }
  }, []);

  const ReactEditorJS = useMemo(() => {
    if (!isCreateNew && typeof editorData !== 'object') {
      return <div>waiting...</div>;
    }

    const Element = createReactEditorJS();
    return (
      <>
        <Element
          onInitialize={handleInitialize}
          defaultValue={editorData}
          tools={EDITOR_JS_TOOLS}
          holder="editorjs"
        />
      </>
    );
  }, [handleInitialize, editorData, EDITOR_JS_TOOLS, isCreateNew]);

  return (
    <div className="editor">
      <div className="center">
        <div className="editorjs">{ReactEditorJS}</div>
      </div>
      <div className="editor-button">
        <Button variant="outlined" onClick={() => handleSave()}>
          Save
        </Button>
      </div>
    </div>
  );
}
