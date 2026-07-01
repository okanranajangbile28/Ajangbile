import styled from "styled-components";
import { getUniqueValues } from "../../../utils/helpers";
import { priceFormat } from "../../../utils/constants";
import { updateFilters, clearFilters } from "../filterSlice";
import { useAppDispatch, useAppSelector } from "../../../App/hooks";
import { ChangeEvent } from "react";

const Filters = () => {
  const dispatch = useAppDispatch();

  const {
    filters: { text, category, min_price, max_price, price, shipping },
    all_products = [],
  } = useAppSelector((state) => state.filter);

  // ✅ SAFE: prevent crash when data is empty
  const categories: string[] = Array.isArray(all_products)
    ? (getUniqueValues(all_products, "category") as string[])
    : [];

  const handleFilter = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>,
  ) => {
    const name = e.target.name;

    let value: string | boolean = e.target.value;

    if (name === "color") {
      value = (e.target as HTMLInputElement).dataset.color || "";
    }

    if (name === "shipping") {
      value = (e.target as HTMLInputElement).checked;
    }

    dispatch(updateFilters({ name, value }));
  };

  return (
    <Wrapper className="w-full">
      <div className="bg-baz-white">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-control">
            <input
              type="text"
              name="text"
              className="search-input bg-white"
              value={text}
              onChange={handleFilter}
              placeholder="search"
            />
          </div>

          <div className="form-control sub-control">
            <span className="label">Category:</span>
            <select
              name="category"
              onChange={handleFilter}
              className="bg-white p-2 outline-none cursor-pointer"
            >
              <option value="all">all</option>

              {categories.map((c, index) => (
                <option
                  key={index}
                  value={c}
                  className={category === c ? "active" : ""}
                >
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control sub-control">
            <div className="label">Price:</div>
            <div className="price">{priceFormat(min_price ? price : 0)}</div>

            <input
              type="range"
              name="price"
              className="cursor-pointer"
              onChange={handleFilter}
              min={min_price || 0}
              max={max_price || 100}
              value={price || 0}
            />
          </div>

          <div className="form-control shipping hidden">
            <label htmlFor="shipping" className="label">
              free shipping
            </label>
            <input
              type="checkbox"
              name="shipping"
              id="shipping"
              className="cursor-pointer"
              onChange={handleFilter}
              checked={shipping}
            />
          </div>

          <button
            type="button"
            className="clear-btn"
            onClick={() => dispatch(clearFilters())}
          >
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

  form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5em;
  }

  .search-input {
    padding: 0.5rem;
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    letter-spacing: 0.1em;
    font-family: poppins;
  }

  .active {
    border-color: var(--clr-grey-5);
  }

  .clear-btn {
    background: var(--clr-red-dark);
    color: var(--clr-white);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius);
  }
`;

export default Filters;
