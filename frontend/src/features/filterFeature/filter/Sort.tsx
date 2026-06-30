import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import styled from 'styled-components';
import { updateSort, toggleFilter } from '../filterSlice';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';

const Sort = () => {
  const dispatch = useAppDispatch();
  const { filtered_product: products, openFilter } = useAppSelector(
    (state) => state.filter
  );

  return (
    <Wrapper>
      <p>{products.length} products</p>
      <div className='filter-sort-flex'>
        <div className='filter-arrow' onClick={() => dispatch(toggleFilter())}>
          <p>Filter</p>
          {openFilter ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}
        </div>

        <form>
          <select
            name='sort'
            id='sort'
            // value={sort}
            onChange={(e) => {
              dispatch(updateSort(e.target.value));
            }}
            className='sort-input bg-baz-white'>
            <option value='price-lowest'>Price (lowest)</option>
            <option value='price-highest'>Price (highest)</option>
            <option value='name-a'>name (a - z)</option>
            <option value='name-z'>name (z - a)</option>
          </select>
        </form>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  width: 100%;
  border-bottom: 1px solid black;
  @media (max-width: 576px) {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 0.75rem;
    .btn-container {
      width: 50px;
    }
    label {
      display: inline-block;
      margin-right: 0.5rem;
    }
  }
  @media (min-width: 768px) {
    column-gap: 2rem;
  }
  p {
    text-transform: capitalize;
    margin-bottom: 0;
    font-family: 'Bell MT';
    font-size: 20px;
    line-height: 22px;
    letter-spacing: 0.1em;
  }

  .btn-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 0.5rem;
    button {
      background: transparent;
      border: 1px solid var(--clr-black);
      color: var(--clr-black);
      width: 1.5rem;
      border-radius: var(--radius);
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      svg {
        font-size: 1rem;
      }
    }
    .active {
      background: var(--clr-black);
      color: var(--clr-white);
    }
  }

  .sort-input {
    border-color: transparent;
    text-transform: capitalize;
    padding: 0.25rem 0.5rem;
    font-family: 'Bell MT';
    font-size: 20px;
    line-height: 22px;
    letter-spacing: 0.05em;
    outline: none;
    border: none;
    cursor: pointer;
  }
  option {
    cursor: pointer;
  }
  .filter-sort-flex {
    display: flex;
    align-items: center;
    gap: 2em;
    @media (max-width: 768px) {
      display: flex;
      justify-content: space-between;
    }
  }
  .filter-arrow {
    display: flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
  }
`;

export default Sort;
