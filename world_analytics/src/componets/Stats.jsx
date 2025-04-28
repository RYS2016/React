export default function Stats({ stats }) {
  return (
    <section className="stats">
      <Stat number={stats.numberOfWords} label="words" />
      <Stat number={stats.numberOfCharacters} label="Characters" />
      <Stat number={stats.instagram} label="Instagram" />
      <Stat number={stats.facebook} label="Facebook" />
    </section>
  );
}
function Stat({ number, label }) {
  return (
    <section className="stat">
      <span
        className={`stat__number ${number < 0 ? "stat__number--limit" : ""}`}
      >
        {number}
      </span>
      <h1 className="second-heading">{label}</h1>
    </section>
  );
}
