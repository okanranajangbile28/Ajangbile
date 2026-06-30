import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { closeSidebar } from '../../productFeature/productSlice';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { openSearchBar } from '../../filterFeature/filterSlice';

const CartButtons = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { total_items } = useAppSelector((state) => state.cart);

  return (
    <Wrapper className='cart-btn-wrapper'>
      <button
        type='button'
        className='auth-btn text-baz-black'
        onClick={() => {
          dispatch(closeSidebar());
          dispatch(openSearchBar());
          navigate('/shop');
        }}>
        <FiSearch />
      </button>

      <Link
        to='cart'
        className='cart-btn text-baz-black'
        onClick={() => dispatch(closeSidebar())}>
        <span className='cart-container'>
          <FiShoppingCart />
          <span className='cart-value text-baz-white'>{total_items}</span>
        </span>
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Cinzel&display=swap');
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5em;
  align-items: center;
  width: 100px;

  .cart-btn {
    font-size: 1.5rem;
    letter-spacing: var(--spacing);
    display: flex;
    font-family: 'Cinzel', serif;
    align-items: center;
  }
  .cart-container {
    display: flex;
    align-items: center;
    position: relative;
    svg {
      height: 1.6rem;
      margin-left: 5px;
    }
  }
  .cart-value {
    position: absolute;
    top: -10px;
    right: -16px;
    background: var(--clr-primary-5);
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.75rem;
    padding: 10px;
  }
  .auth-btn {
    display: flex;
    align-items: center;
    background: transparent;
    border-color: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    letter-spacing: var(--spacing);
    svg {
      margin-left: 5px;
    }
    font-family: 'Cinzel', serif;
  }
`;
export default CartButtons;
