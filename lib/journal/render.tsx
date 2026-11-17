import type { ReactNode } from "react";
import type { Block, DayCard, Inline, ListNode } from "./parse";

// Builds React elements only. React escapes all text, so journal content
// can never inject HTML.
function renderInline(content: Inline[]): ReactNode[] {
  return content.map((part, i) => {
    switch (part.kind) {
      case "bold":
        return <strong key={i}>{part.value}</strong>;
      case "italic":
        return <em key={i}>{part.value}</em>;
      case "code":
        return <code key={i}>{part.value}</code>;
      default:
        return part.value;
    }
  });
}

function renderList(list: ListNode, key: number | string): ReactNode {
  const Tag = list.ordered ? "ol" : "ul";
  return (
    <Tag key={key}>
      {list.items.map((item, i) => (
        <li key={i}>
          {renderInline(item.content)}
          {item.children.map((child, j) => renderList(child, j))}
        </li>
      ))}
    </Tag>
  );
}

// The card title is the h2, so inner headings start at h3.
function renderBlock(block: Block, cardLevel: number, key: number): ReactNode {
  switch (block.type) {
    case "heading": {
      const level = Math.min(6, Math.max(3, 2 + block.level - cardLevel));
      const Tag = `h${level}` as "h3" | "h4" | "h5" | "h6";
      return <Tag key={key}>{renderInline(block.content)}</Tag>;
    }
    case "paragraph":
      return <p key={key}>{renderInline(block.content)}</p>;
    case "list":
      return renderList(block.list, key);
  }
}

export function renderCardBody(card: DayCard): ReactNode[] {
  return card.blocks.map((block, i) => renderBlock(block, card.level, i));
}
