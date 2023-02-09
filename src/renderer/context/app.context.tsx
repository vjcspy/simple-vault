import React, { useContext, useMemo, useState } from 'react';

interface AppContextType {
  theme: string;
  setTheme?: any;
  content?: string;
  setContent?: any;

  editorData?: any;
  setEditorData?: any;
  path?: string;
  setPath?: any;
  password?: string;
  setPassword?: any;
}
export const AppContext = React.createContext<AppContextType>({
  theme: 'light',
});

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider: React.FC<{
  children: any;
}> = (props) => {
  const [theme, setTheme] = useState('dark');
  const [content, setContent] = useState();
  const [password, setPassword] = useState();
  const [path, setPath] = useState();
  const [editorData, setEditorData] = useState();

  const appContextValue = useMemo(() => {
    return {
      theme,
      setTheme,
      content,
      setContent,
      path,
      setPath,
      password,
      setPassword,
      editorData,
      setEditorData,
    };
  }, [theme, content, path, password, editorData]);

  return (
    <AppContext.Provider value={appContextValue}>
      {/* eslint-disable-next-line react/destructuring-assignment */}
      {props.children}
    </AppContext.Provider>
  );
};
