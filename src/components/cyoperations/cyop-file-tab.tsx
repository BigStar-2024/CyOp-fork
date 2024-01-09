import { FC } from 'react';
import Button from 'components/base/button';
import close_icon from 'assets/images/button-icons/close-icon.png'
import { useNavigate } from 'react-router-dom';


interface ICyOpFileTab {
  redirect: string
}
export const CyOpFileTab: FC<ICyOpFileTab> = ({ redirect }) => {
  const navigate = useNavigate();

  return (
    <div className="cyop-file-tab-container px-0" id='file-tab'>
      <div className='tab d-flex justify-content-center align-items-center'>
        <Button variant='text' fullWidth icon={close_icon} className='ml-2' onClick={() => navigate(redirect)}>close file</Button>
      </div>
    </div>
  );
};

export default CyOpFileTab;