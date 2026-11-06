import type { Profile } from "../../../data/content";

type AboutStatusProps = {
  profile: Profile;
  saveData: { label: string; value: string }[];
};

export function AboutStatus({ profile, saveData }: AboutStatusProps) {
  return (
    <div className="hud-section hud-about">
      <article className="operator-file">
        <header className="operator-file__head">
          <p className="operator-file__kicker">Operator file</p>
          <h3>{profile.name}</h3>
          <p>
            {profile.className} · {profile.role}
          </p>
        </header>
        <p className="operator-file__lead">{profile.tagline}</p>
        <dl className="operator-stats">
          {saveData.map((entry) => (
            <div className="operator-stat" key={entry.label}>
              <dt>{entry.label}</dt>
              <dd>{entry.value}</dd>
            </div>
          ))}
        </dl>
      </article>
    </div>
  );
}
