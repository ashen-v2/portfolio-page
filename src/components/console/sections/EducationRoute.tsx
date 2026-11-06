type EducationItem = {
  title: string;
  note: string;
  org: string;
  when: string;
};

export function EducationRoute({ education }: { education: EducationItem[] }) {
  return (
    <div className="hud-section hud-edu">
      <ol className="route-list">
        {education.map((item, index) => (
          <li className="route-stop" key={item.title}>
            <div className="route-rail" aria-hidden="true">
              <span className="route-node" />
            </div>
            <article className="route-card">
              {index === 0 ? <p className="route-flag">Now</p> : null}
              <h3>{item.title}</h3>
              {item.note ? <p className="route-star">{item.note}</p> : null}
              <p>{item.org}</p>
              <p className="when">{item.when}</p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
