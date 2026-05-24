export const useOutsideClick = (ref, callback) => {
  const listener = (event) => {
    if (!ref.current || ref.current.contains(event.target)) {
      return;
    }
    callback(event);
  };

  if (typeof window !== "undefined") {
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
  }

  return () => {
    if (typeof window !== "undefined") {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    }
  };
};
