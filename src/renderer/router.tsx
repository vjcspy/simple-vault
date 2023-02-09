import { createBrowserRouter } from 'react-router-dom';
import File from '@components/file/file';
import Editor from '@components/editor/editor';
import Secret from './components/secret/secret';

export const router = createBrowserRouter([
  {
    path: '/index.html',
    element: <File />,
  },
  {
    path: '/file',
    element: <File />,
  },
  {
    path: '/secret',
    element: <Secret />,
  },
  {
    path: '/editor',
    element: <Editor />,
  },
]);
