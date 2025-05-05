type HachTagItemProps = {
  onSelectCompany: (company: string) => void;
  company: string;
};

export default function HashTagItem({
  onSelectCompany,
  company,
}: HachTagItemProps) {
  return (
    <li key={company}>
      <button onClick={() => onSelectCompany(company)}>#{company}</button>
    </li>
  );
}
