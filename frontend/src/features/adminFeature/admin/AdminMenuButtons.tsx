import { CiLogout, CiSearch, CiUser } from 'react-icons/ci';
import { useAppDispatch } from '../../../App/hooks';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../userFeature/userSlice';
import styled from 'styled-components';

const AdminMenuButtons = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <Wrapper className='gap-4 flex text-[30px]'>
      <button>
        <CiSearch />
      </button>
      <button>
        <CiUser />
      </button>
      <button
        type='button'
        className='auth-btn'
        onClick={() => {
          dispatch(logOut());
          navigate('/login');
        }}>
        <CiLogout />
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: none;
  @media (min-width: 992px) {
    display: flex;
  }
`;

export default AdminMenuButtons;
