import { Icon } from "@/components/ui/Icon";
import { FAQ_ITEMS } from "@/lib/faq";

export function Faq() {
  return (
    <div className="faq-list">
      {FAQ_ITEMS.map((item) => (
        <details key={item.question} className="faq-item">
          <summary className="faq-question">
            <span>{item.question}</span>
            <span className="faq-toggle" aria-hidden="true">
              <Icon name="plus" size={16} />
            </span>
          </summary>
          <div className="faq-answer">
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
