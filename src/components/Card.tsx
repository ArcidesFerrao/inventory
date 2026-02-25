export const Card = ({ title, value }: { title: string; value: number }) => {
  return (
    <div className="dash-card-admin flex flex-col">
      <h3 className="text-lg font-normal">{title}</h3>
      <h4 className="text-lg py-1 whitespace-nowrap font-bold">{value}</h4>
    </div>
  );
};
