import type { QuestStatus } from "../data/content";
import type { HudTone } from "./console/hudTone";

type QuestCardProps = {
  title: string;
  status: QuestStatus;
  subtitle: string;
  points: string[];
  stack: string[];
  tone: HudTone;
  onReadMore?: () => void;
};

export function QuestCard({ title, status, subtitle, points, stack, tone, onReadMore }: QuestCardProps) {
  return (
    <article className={`quest-crate quest-crate-${tone}`}>
      <header className="quest-crate__lid">
        <div>
          <h3>{title}</h3>
          <p className="quest-crate__sub">{subtitle}</p>
        </div>
        <span className={`quest-status ${status}`}>{status}</span>
      </header>
      <ul>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <div className="chip-row">
        {stack.map((item) => (
          <span className="chip" key={item}>
            {item}
          </span>
        ))}
      </div>
      {onReadMore ? (
        <button type="button" className="btn secondary quest-read" onClick={onReadMore}>
          See more
        </button>
      ) : null}
    </article>
  );
}
