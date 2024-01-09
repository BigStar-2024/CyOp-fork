import { useState, useEffect } from 'react'

export const useIntersection = (element: any) => {
  const [isVisible, setState] = useState(false);

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      setState(entry.isIntersecting);
    }, options
  );

  useEffect(() => {
    let mounted = true


    if (mounted && element.current) {

      setTimeout(() => {
        observer.observe(element.current);
      }, 80);

    }
    return () => {
      element.current && observer.unobserve(element.current)
      mounted = false
    };
  }, []);

  return isVisible;
};