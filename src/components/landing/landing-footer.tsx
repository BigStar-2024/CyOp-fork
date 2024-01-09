import LandingMouse from "./landing-mouse";
import LandingFooterNav from "./landing-footer-nav";

const LandingFooter = () => {
  return (
    <div className="landing-footer text-center d-flex flex-column justify-content-center align-items-center">
      <LandingMouse />
      <LandingFooterNav />
    </div>
  );
};

export default LandingFooter;
