const Modal = ({
  title,
  buttons,
}: {
  title: string;
  buttons: { name: string; action: () => void }[];
}) => {
  return (
    <div className='fixed w-full h-full flex items-center  justify-center backdrop-blur-sm z-50'>
      <div className='bg-[rgba(0,0,0,0.8)] text-white rounded-md p-4 flex flex-col gap-3 '>
        <div className='text-lg font-baz1'>{title}</div>
        <div className='flex gap-4 justify-end'>
          {buttons.map((button, index) => {
            return (
              <button
                key={index}
                onClick={button.action}
                className={`text-lg font-baz1 p-2 rounded-lg ${
                  index !== 1 ? 'bg-rose-500' : 'bg-white text-black'
                }`}>
                {button.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Modal;
