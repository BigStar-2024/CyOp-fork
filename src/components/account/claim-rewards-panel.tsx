import Button from 'components/base/button';
import { toast } from 'react-toastify';


export const AccountClaimRewards = () => {

  const claim = () => {
    toast.success('Claim button clicked');
  }

  return (
    <div style={{ borderTop: '3px solid #05CCB2', height:300 }} className='d-flex flex-column align-items-center justify-content-center'>
      <p className='color-danger fs-2 fw-bold mb-0'>0 USDC</p>
      <p className='color-danger'>Your claimable rewards</p>
      <Button variant='contained' className='px-5 py-1' onClick={() => claim()} disabled>claim</Button>
    </div>
  );
};

export default AccountClaimRewards;
