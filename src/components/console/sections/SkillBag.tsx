import { useState } from "react";
import { SkillTile } from "../../SkillBar";

type SkillGroup = {
  id: string;
  title: string;
  skills: { name: string; icon: string }[];
};

const tabLabel: Record<string, string> = {
  cloud: "Cloud",
  script: "Script",
  net: "Net",
  dev: "Dev",
  learn: "Learn",
};

export function SkillBag({ skillGroups }: { skillGroups: SkillGroup[] }) {
  const [pocket, setPocket] = useState(skillGroups[0]?.id ?? "");
  const group = skillGroups.find((item) => item.id === pocket) ?? skillGroups[0];

  if (!group) return null;

  return (
    <div className="hud-section hud-skills">
      <div className="skill-bag">
        <p className="skill-bag__kicker">Item bag</p>
        <div className="skill-bag__body">
          <div className="skill-bag__tabs" role="tablist" aria-label="Skill pockets">
            {skillGroups.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className="skill-bag__tab"
                aria-selected={item.id === group.id}
                onClick={() => setPocket(item.id)}
              >
                {tabLabel[item.id] ?? item.title}
              </button>
            ))}
          </div>
          <section className="skill-bag__pocket" role="tabpanel" aria-label={group.title}>
            <h3>{group.title}</h3>
            <ul className="skill-bag__grid">
              {group.skills.map((skill) => (
                <li key={skill.name}>
                  <SkillTile name={skill.name} icon={skill.icon} learning={group.id === "learn"} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
