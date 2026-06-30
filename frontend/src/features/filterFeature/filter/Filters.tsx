import styled from 'styled-components';
import { getUniqueValues } from '../../../utils/helpers';
import { priceFormat } from '../../../utils/constants';
import { updateFilters, clearFilters } from '../filterSlice';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { ChangeEvent } from 'react';

const Filters = () => {
  const dispatch = useAppDispatch();
  const {
    filters: { text, category, min_price, max_price, price, shipping },
    all_products,
  } = useAppSelector((state) => state.filter);

  const categories = getUniqueValues(all_products, 'category');

  const handleFilter = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLSelectElement
    ) {
      const name = e.target.name;
      let value;
      value = e.target.value as string;

      if (name === 'color') {
        value = e.target.dataset.color as string;
      }
      if (name === 'shipping' && e.target instanceof HTMLInputElement) {
        value = e.target.checked as boolean;
      }
      dispatch(updateFilters({ name, value }));
    }
  };

  return (
    <Wrapper className='w-full'>
      <div className='bg-baz-white'>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className='form-control'>
            <input
              type='text'
              name='text'
              className='search-input bg-white'
              value={text}
              onChange={handleFilter}
              placeholder='search'
            />
          </div>
          <div className='form-control sub-control'>
            <span className='label'>Category:</span>
            <select
              name='category'
              onChange={handleFilter}
              className='bg-white p-2 outline-none cursor-pointer'>
              <option value={'all'}>all</option>
              {categories.map((c, index) => (
                <option
                  key={index}
                  value={c}
                  className={`${
                    category.toLowerCase() === c.toLowerCase() ? 'active' : null
                  }`}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className='form-control sub-control'>
            <div className='label'>Price:</div>
            <div className='price'>{priceFormat(min_price ? price : 0)}</div>
            <input
              type='range'
              name='price'
              className='cursor-pointer '
              onChange={handleFilter}
              min={min_price ? min_price : 0}
              max={min_price ? max_price : 100}
              value={min_price ? price : 0}
            />
          </div>
          <div className='form-control shipping hidden'>
            <label htmlFor='shipping' className='label'>
              free shipping
            </label>
            <input
              type='checkbox'
              name='shipping'
              id='shipping'
              className='cursor-pointer'
              onChange={handleFilter}
              checked={shipping}
            />
          </div>
          <button
            type='button'
            className='clear-btn'
            onClick={() => dispatch(clearFilters())}>
            clearFilters
          </button>
        </form>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  width: 100%;

  .content {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
  }

  form {
    display: flex;
    justify-content: center;

    align-items: center;
    flex-wrap: wrap;
    gap: 1.5em;

    // @media (max-width: 900px) {
    //   display: flex;
    //   flex-direction: column;
    //   align-items: flex-start;
    //   width: 100%;
    //   gap: 1em;
    // }
  }

  input {
    margin-block: 0;
  }
  .search-input {
    padding: 0.5rem;
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    letter-spacing: 0.1em;
    font-family: poppins;
  }
  .search-input::placeholder {
    text-transform: capitalize;
  }

  button {
    display: block;
    margin: 0.25em 0;
    padding: 0.25rem 0;
    text-transform: capitalize;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-5);
    cursor: pointer;
  }
  .active {
    border-color: var(--clr-grey-5);
  }
  .company {
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    padding: 0.25rem;
  }
  .all-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
    opacity: 0.5;
  }
  .active {
    opacity: 1;
  }
  .all-btn .active {
    text-decoration: underline;
  }

  .shipping {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    text-transform: capitalize;
    column-gap: 0.5rem;
    font-size: 1rem;
  }
  .clear-btn {
    background: var(--clr-red-dark);
    color: var(--clr-white);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius);
  }
  .sub-control {
    display: flex;
    gap: 0.5em;
    align-items: center;
  }
  .label {
    font-family: poppins;
  }
  @media (min-width: 768px) {
    .content {
      position: sticky;
      top: 1rem;
    }
  }
`;

export default Filters;
