interface Props {
  title: string;
}

const TopNavbar = ({ title }: Props) => {
  return (
    <div className="bg-white shadow px-8 py-5 flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-purple-900">{title}</h2>

        <p className="text-gray-500">
          Confederation of Ogboni Aborigine Fraternity
        </p>
      </div>

      <div className="text-right">
        <h3 className="font-bold text-purple-900">Administrator</h3>

        <p className="text-gray-500">admin@ajangbileheritage.com</p>
      </div>
    </div>
  );
};

export default TopNavbar;
