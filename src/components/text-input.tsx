import { useEffect, useRef, KeyboardEvent, ClipboardEvent } from "react";

export const TextInputing = (props: any) => {
  const inputRef: any = useRef(null);

  useEffect(() => {
    if ("focused" in props && props.focused) {
      inputRef.current.focus();
    }
  }, [inputRef.current]); // eslint-disable-line

  const onKeyUp = (e: KeyboardEvent) => {
    // first check if the content is valid
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    const element = e.target as HTMLElement;
    const innerText = element.innerText;

    if (props.setValue) {
      props.setValue(innerText);
    }
  };

  const checkEnterKey = (e: KeyboardEvent) => {
    // first check if the content is valid
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    if ((!("allowParapraphs" in props) || !props.allowParapraphs) && e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).innerText = e.clipboardData.getData("text/plain");
  };

  return (
    <>
      <div
        ref={inputRef}
        contentEditable="true"
        className="co-input-field"
        onKeyDown={checkEnterKey}
        onKeyUp={onKeyUp}
        onPaste={onPaste}
      ></div>
    </>
  );
};

export default TextInputing;
