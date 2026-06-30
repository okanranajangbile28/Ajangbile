import styled from 'styled-components';
import { FaPlus, FaMinus } from 'react-icons/fa';

type AmountButtonType = {
  increase: () => void;
  decrease: () => void;
  amount: number;
};

const AmountButtons = ({ increase, decrease, amount }: AmountButtonType) => {
  return (
    <Wrapper className='flex gap-2'>
      <button
        type='button'
        className='amount-btn place-center button'
        onClick={decrease}>
        <FaMinus />
      </button>
      <h2 className='amount'>{amount}</h2>
      <button
        type='button'
        className='amount-btn place-center'
        onClick={increase}>
        <FaPlus />
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  justify-content: flex-start;
  align-items: center;
  h2 {
    margin-bottom: 0;
  }
  button {
    background: transparent;
    border-color: transparent;
    cursor: pointer;
    padding: 1rem 0;
    width: 2rem;
    height: 1rem;
    display: flex;
  }
  h2 {
    margin-bottom: 0;
  }
`;

export default AmountButtons;
