// Parses docs/JOURNAL.md into day cards. Handles only the markdown the journal
// uses: headings, paragraphs, bold, italic, inline code, nested lists, rules.
// Pure functions, no I/O.

export type Inline = { kind: "text" | "bold" | "italic" | "code"; value: string };

export type ListNode = {
  ordered: boolean;
  items: { content: Inline[]; children: ListNode[] }[];
};

export type Block =
  | { type: "heading"; level: number; content: Inline[] }
  | { type: "paragraph"; content: Inline[] }
  | { type: "list"; list: ListNode };

export type DayCard = {
  day: number;
  title: string;
  // Heading level of the Day heading. Inner headings are shown relative to it.
  level: number;
  blocks: Block[];
};

const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const DAY_HEADING = /^Day\s+(\d+)\b\s*(?:[—–:-]\s*)?(.*)$/i;
const LIST_ITEM = /^(\s*)([*-]|\d+\.)\s+(.*)$/;
const RULE = /^\s*(-{3,}|\*{3,}|_{3,})\s*$/;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  const re = /\*\*([^*]+)\*\*|`([^`]+)`|\*([^*\s][^*]*)\*/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push({ kind: "text", value: text.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ kind: "bold", value: m[1] });
    else if (m[2] !== undefined) out.push({ kind: "code", value: m[2] });
    else out.push({ kind: "italic", value: m[3] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ kind: "text", value: text.slice(last) });
  return out;
}

type ListEntry = { indent: number; ordered: boolean; text: string };

// Builds nested lists from flat entries, using indentation for depth.
function buildLists(entries: ListEntry[]): ListNode[] {
  const roots: ListNode[] = [];
  const stack: { indent: number; list: ListNode }[] = [];

  for (const entry of entries) {
    while (stack.length > 0 && stack[stack.length - 1].indent > entry.indent) stack.pop();
    let top = stack[stack.length - 1];

    if (top && top.indent === entry.indent && top.list.ordered !== entry.ordered) {
      // Same level but a different list kind: start a sibling list.
      stack.pop();
      top = stack[stack.length - 1];
      const sibling: ListNode = { ordered: entry.ordered, items: [] };
      if (top) top.list.items[top.list.items.length - 1].children.push(sibling);
      else roots.push(sibling);
      stack.push({ indent: entry.indent, list: sibling });
    } else if (!top || top.indent < entry.indent) {
      const list: ListNode = { ordered: entry.ordered, items: [] };
      const parentItems = top?.list.items;
      if (parentItems && parentItems.length > 0)
        parentItems[parentItems.length - 1].children.push(list);
      else roots.push(list);
      stack.push({ indent: entry.indent, list });
    }

    stack[stack.length - 1].list.items.push({
      content: parseInline(entry.text),
      children: [],
    });
  }
  return roots;
}

function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let entries: ListEntry[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0)
      blocks.push({ type: "paragraph", content: parseInline(paragraph.join(" ")) });
    paragraph = [];
  };
  const flushList = () => {
    for (const list of buildLists(entries)) blocks.push({ type: "list", list });
    entries = [];
  };

  for (const line of lines) {
    const heading = HEADING.exec(line);
    const item = LIST_ITEM.exec(line);

    if (line.trim() === "" || RULE.test(line)) {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "heading",
        level: heading[1].length,
        content: parseInline(heading[2]),
      });
    } else if (item) {
      flushParagraph();
      entries.push({
        indent: item[1].replace(/\t/g, "  ").length,
        ordered: /\d/.test(item[2]),
        text: item[3],
      });
    } else if (entries.length > 0 && /^\s+/.test(line)) {
      // Wrapped continuation of the previous list item.
      entries[entries.length - 1].text += ` ${line.trim()}`;
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

// Falls back to the "Focus:" line when a Day heading has no title.
function focusLine(lines: string[]): string {
  for (const line of lines) {
    const m = /\*\*Focus:\*\*\s*(.+)/.exec(line);
    if (m) return m[1].trim();
  }
  return "";
}

// A card runs from a "Day N" heading to the next heading of the same or a
// higher level. Other headings and anything before the first Day are dropped.
// Newest first: higher day number first, and later in the file first on a tie.
export function parseJournal(source: string): DayCard[] {
  const cards: { card: DayCard; order: number }[] = [];
  let current: { level: number; title: string; day: number; lines: string[] } | null = null;

  const close = () => {
    if (!current) return;
    cards.push({
      order: cards.length,
      card: {
        day: current.day,
        level: current.level,
        title: current.title || focusLine(current.lines),
        blocks: parseBlocks(current.lines),
      },
    });
    current = null;
  };

  for (const line of source.split(/\r?\n/)) {
    const heading = HEADING.exec(line);
    if (heading) {
      const level = heading[1].length;
      const day = DAY_HEADING.exec(heading[2]);
      if (day) {
        close();
        current = { level, day: Number(day[1]), title: day[2].trim(), lines: [] };
        continue;
      }
      if (current && level <= current.level) close();
    }
    if (current) current.lines.push(line);
  }
  close();

  return cards
    .sort((a, b) => b.card.day - a.card.day || b.order - a.order)
    .map((c) => c.card);
}
