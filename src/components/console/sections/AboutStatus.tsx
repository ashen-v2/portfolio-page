import type { Profile } from "../../../data/content";
import { PixelIcon } from "../pixelIcons";

type AboutStatusProps = {
  profile: Profile;
  saveData: { label: string; value: string }[];
};

export function AboutStatus({ profile, saveData }: AboutStatusProps) {
  return (
    <div className="hud-section hud-about">
      <article className="trainer-card">
        <header className="trainer-card__head">
          <PixelIcon className="trainer-card__sprite" name="about" />
          <div>
            <p className="trainer-card__kicker">Trainer card</p>
            <h3>{profile.name}</h3>
            <p>
              {profile.className} · {profile.role}
            </p>
          </div>
        </header>
        <p className="trainer-card__flavor">{profile.tagline}</p>
        <dl className="trainer-stats">
          {saveData.map((entry) => (
            <div className="trainer-stat" key={entry.label}>
              <dt>{entry.label}</dt>
              <dd>{entry.value}</dd>
            </div>
          ))}
        </dl>
      </article>
    </div>
  );
}
