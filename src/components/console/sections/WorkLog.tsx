type Job = {
  title: string;
  org: string;
  when: string;
  where: string;
  points: string[];
};

export function WorkLog({ experience }: { experience: Job[] }) {
  return (
    <div className="hud-section hud-work">
      {experience.map((job) => (
        <article className="duty-slip" key={`${job.org}-${job.title}`}>
          <header className="work-badge">
            <p className="work-badge__kicker">Operator badge</p>
            <p className="work-badge__org">{job.org}</p>
            <h3>{job.title}</h3>
            <p>
              {job.where} · {job.when}
            </p>
          </header>
          <ul className="duty-list">
            {job.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
