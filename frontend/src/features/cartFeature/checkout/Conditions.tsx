import styled from 'styled-components';
import { BsShieldCheck } from 'react-icons/bs';
import { RxCube } from 'react-icons/rx';
import { FiTruck } from 'react-icons/fi';

const Conditions = () => {
  const terms = [
    {
      icons: <RxCube />,
      meaning: 'Delivery within 3-10 business days',
    },
    {
      icons: <FiTruck />,
      meaning: 'For overseas delivery, orders should be made via instagram',
    },
    {
      icons: <BsShieldCheck />,
      meaning: 'Secure payment with Paystack',
    },
  ];

  const termList = terms.map((term, index) => (
    <li
      key={index}
      className='flex items-center gap-[10px] tablet:gap-[10.5px]'>
      <div className='text-[20px] flex items-center justify-center tablet:text-[30px]'>
        {term.icons}
      </div>
      <div className='termMeaning text-[10px] tablet:text-[15px]'>
        {term.meaning}
      </div>
    </li>
  ));

  return (
    <Wrapper className='flex flex-col gap-[14px] tablet:gap-[18px]'>
      {termList}
    </Wrapper>
  );
};

const Wrapper = styled.ul`
  // justify-content: center;
  // align-items: flex-start;
  // gap: 18px;
  // width: 100%;
  // margin-block: 2em;
  // li {
  //   display: flex;
  //   align-items: center;
  //   gap: 10.5px;
  // }
  .termMeaning {
    font-family: Inter;
  }
  // .termIcon {
  //   font-size: 24px;
  // }
`;
export default Conditions;
