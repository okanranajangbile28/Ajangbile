import { FaTimes } from 'react-icons/fa';

interface Props {
  content: JSX.Element;
  closeModal: () => void;
}

export default function Modal({ content, closeModal }: Props) {
  return (
    <>
      <div className='justify-center items-center mt-[100px] flex overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
          <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
            <div className='relative flex-auto'>
              {content}
              <button
                className='absolute right-4 top-4 text-baz-danger text-[24px]'
                onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
    </>
  );
}
