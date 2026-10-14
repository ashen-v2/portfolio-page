type SkillBarProps = {
  name: string;
  level: number;
  learning?: boolean;
};

export function SkillBar({ name, level, learning }: SkillBarProps) {
  return (
    <div className="xp">
      <div className="xp-head">
        <span className="xp-label">{name}</span>
        <span className="xp-val">{level}</span>
      </div>
      <div className="xp-track" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={level} aria-label={name}>
        <div className={`xp-fill${learning ? " learn" : ""}`} style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}
