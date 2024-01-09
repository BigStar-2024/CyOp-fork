import { useEffect, useRef } from "react";

const LandingMouse = () => {

  const iconRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    let width = window.screen.width;
    let height = window.screen.height;
    if (iconRef.current) {

      if (width > height) {
        if (width < 992) {
          iconRef.current.style.display = 'none'
        }
        else
          iconRef.current.style.display = 'block'
      }
      else {
        iconRef.current.style.display = 'block'
      }

      if (height <= 410)
        iconRef.current.style.display = 'block'
    }
  }, [])

  return (
    <div className="landing-mouse">
      <div id="wheel-up" style={{ display: "none" }}>
        <span className="m_scroll_up_arrows one" />
        <span className="m_scroll_up_arrows two" />
      </div>

      <div ref={iconRef} className="mouse-ico" style={{ display: "none" }}>
        <div className="wheel" />
      </div>

      <div id="wheel-down">
        <span className="m_scroll_down_arrows one" />
        <span className="m_scroll_down_arrows two" />
      </div>
    </div>
  );
};

export default LandingMouse;
