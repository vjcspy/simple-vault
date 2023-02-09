import { useAppContext } from '@app/context/app.context';

export const useIsCreateNew = () => {
  const appContext = useAppContext();

  return {
    isCreateNew:
      !appContext?.content ||
      (typeof appContext?.content === 'string' &&
        (appContext.content.length === 0 ||
          appContext.content.trim() === '' ||
          appContext.content === '')),
  };
};
