import { useState } from "react";
import { SkillTile } from "../../SkillBar";

type Skill = { name: string; icon: string };

type SkillGroup = {
  id: string;
  title: string;
  skills: Skill[];
};

const rowSize = 2;

function rowsOf(skills: Skill[]) {
  const rows: Skill[][] = [];
  for (let index = 0; index < skills.length; index += rowSize) {
    rows.push(skills.slice(index, index + rowSize));
  }
  return rows;
}

export function SkillBag({ skillGroups }: { skillGroups: SkillGroup[] }) {
  const first = skillGroups[0]?.skills[0];
  const [selected, setSelected] = useState(first ? `${skillGroups[0].id}:${first.name}` : "");
  const picked = skillGroups
    .flatMap((group) => group.skills.map((skill) => ({ group, skill })))
    .find((item) => `${item.group.id}:${item.skill.name}` === selected);

  return (
    <div className="hud-section hud-skills">
      <div className="skill-tree-board">
        <div className="skill-tree-board__branches">
          {skillGroups.map((group) => (
            <section className="skill-branch" key={group.id} aria-label={group.title}>
              <h3>{group.title}</h3>
              <span className="skill-branch__root" aria-hidden="true" />
              {rowsOf(group.skills).map((row, index) => (
                <div className="skill-branch__row" key={`${group.id}-${index}`}>
                  {row.map((skill) => {
                    const id = `${group.id}:${skill.name}`;
                    return (
                      <button
                        key={skill.name}
                        type="button"
                        className="skill-node"
                        aria-pressed={selected === id}
                        onClick={() => setSelected(id)}
                      >
                        <SkillTile name={skill.name} icon={skill.icon} learning={group.id === "learn"} />
                      </button>
                    );
                  })}
                </div>
              ))}
            </section>
          ))}
        </div>
        {picked ? (
          <div className="skill-selected">
            <p className="skill-selected__kicker">Selected</p>
            <h3>{picked.skill.name}</h3>
            <p>{picked.group.title}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
