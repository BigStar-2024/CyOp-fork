import Logo from "../../assets/images/logo.png";

const LandingLogo = () => {
  return (
    <div className="landing-logo pointer">
      <img src={Logo} className="img-logo" alt="avatar" />
      <b>CyOp</b>
    </div>
  );
};

export default LandingLogo;
