import { RefObject, useEffect } from 'react';

export const useViewportHeightVar = () => {
  useEffect(() => {
    const root = document.documentElement;

    const updateViewportHeight = () => {
      root.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.visualViewport?.addEventListener('resize', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.visualViewport?.removeEventListener('resize', updateViewportHeight);
    };
  }, []);
};

export const useElementHeightVar = (
  ref: RefObject<HTMLElement>,
  variableName: string
) => {
  useEffect(() => {
    const root = document.documentElement;
    const element = ref.current;

    if (!element) {
      return;
    }

    const updateElementHeight = () => {
      root.style.setProperty(variableName, `${element.offsetHeight}px`);
    };

    updateElementHeight();

    const observer = new ResizeObserver(updateElementHeight);
    observer.observe(element);
    window.addEventListener('resize', updateElementHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateElementHeight);
    };
  }, [ref, variableName]);
};
