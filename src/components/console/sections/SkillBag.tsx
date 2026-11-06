import { SkillTile } from "../../SkillBar";

type SkillGroup = {
  id: string;
  title: string;
  skills: { name: string; icon: string }[];
};

export function SkillBag({ skillGroups }: { skillGroups: SkillGroup[] }) {
  return (
    <div className="hud-section hud-skills">
      <div className="skill-bag">
        <p className="skill-bag__kicker">Item bag</p>
        <div className="skill-bag__groups">
          {skillGroups.map((group) => (
            <section className="skill-pocket" key={group.id} aria-label={group.title}>
              <h3>{group.title}</h3>
              <ul className="skill-bag__grid">
                {group.skills.map((skill) => (
                  <li key={skill.name}>
                    <SkillTile name={skill.name} icon={skill.icon} learning={group.id === "learn"} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
