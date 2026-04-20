import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Blog } from '@/features/blogs/types';

type ArticleContentProps = {
  content: Blog['content'];
  highlight?: string | null;
};

type BlogContentNode = {
  type?: string;
  content?: BlogContentNode[];
  text?: string;
  marks?: Array<{ type?: string; attrs?: { href?: string } }>;
  attrs?: {
    level?: number;
    src?: string;
    alt?: string;
    title?: string;
  };
};

export function ArticleContent({ content, highlight }: ArticleContentProps) {
  return (
    <section className="mx-auto w-full max-w-[740px]">
      <div className="space-y-6 text-[16px] leading-7 text-zinc-700 md:text-[18px] md:leading-8">
        {renderContent(content)}
      </div>

      {highlight ? (
        <Card className="mt-10 border-zinc-200 bg-zinc-50 shadow-none">
          <CardContent className="p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Key insight</p>
            <blockquote className="mt-3 border-l-4 border-zinc-900 pl-4 text-lg font-medium leading-8 text-zinc-950">
              {highlight}
            </blockquote>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}

function renderContent(content: Blog['content']): React.ReactNode {
  const parsed = typeof content === 'string' ? tryParseJson(content) ?? content : content;

  if (typeof parsed === 'string') {
    return <p className="whitespace-pre-wrap text-zinc-700">{parsed}</p>;
  }

  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  const doc = parsed as BlogContentNode;
  const nodes = Array.isArray(doc.content) ? doc.content : [];

  return nodes.map((node, index) => renderNode(node, index));
}

function renderNode(node: BlogContentNode, key: React.Key): React.ReactNode {
  if (!node?.type) {
    return null;
  }

  switch (node.type) {
    case 'paragraph':
      return <p key={key}>{renderInlineContent(node.content)}</p>;
    case 'heading': {
      const level = Math.min(Math.max(node.attrs?.level || 2, 1), 6);
      const HeadingTag = `h${level}` as React.ElementType;
      const headingClasses = level === 2
        ? 'mt-10 text-2xl font-semibold tracking-tight text-zinc-950'
        : 'mt-8 text-xl font-semibold tracking-tight text-zinc-950';

      return <HeadingTag key={key} className={headingClasses}>{renderInlineContent(node.content)}</HeadingTag>;
    }
    case 'bullet_list':
      return (
        <ul key={key} className="space-y-3 pl-5">
          {(node.content || []).map((child, index) => renderNode(child, `${key}-${index}`))}
        </ul>
      );
    case 'ordered_list':
      return (
        <ol key={key} className="space-y-3 pl-5">
          {(node.content || []).map((child, index) => renderNode(child, `${key}-${index}`))}
        </ol>
      );
    case 'list_item':
      return (
        <li key={key} className="list-disc pl-1 marker:text-zinc-400">
          {renderInlineContent(node.content)}
        </li>
      );
    case 'blockquote':
      return (
        <blockquote key={key} className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-900">
          {renderInlineContent(node.content)}
        </blockquote>
      );
    case 'code_block':
      return (
        <pre key={key} className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm text-zinc-900">
          <code>{renderTextContent(node.content)}</code>
        </pre>
      );
    case 'image':
      return (
        <figure key={key} className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
          <img
            src={node.attrs?.src || ''}
            alt={node.attrs?.alt || node.attrs?.title || 'Blog image'}
            className="h-auto w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </figure>
      );
    case 'horizontal_rule':
      return <hr key={key} className="my-8 border-zinc-200" />;
    case 'hard_break':
      return <br key={key} />;
    default:
      return node.content ? <React.Fragment key={key}>{node.content.map((child, index) => renderNode(child, `${key}-${index}`))}</React.Fragment> : null;
  }
}

function renderInlineContent(nodes?: BlogContentNode[]): React.ReactNode {
  return (nodes || []).map((node, index) => renderInlineNode(node, index));
}

function renderInlineNode(node: BlogContentNode, key: React.Key): React.ReactNode {
  if (node.type === 'text') {
    return applyTextMarks(node.text || '', node.marks, key);
  }

  if (node.type === 'hard_break') {
    return <br key={key} />;
  }

  return node.content ? <React.Fragment key={key}>{renderInlineContent(node.content)}</React.Fragment> : null;
}

function applyTextMarks(
  text: string,
  marks?: Array<{ type?: string; attrs?: { href?: string } }>,
  key?: React.Key,
): React.ReactNode {
  return (marks || []).reduceRight<React.ReactNode>((accumulator, mark, index) => {
    const markKey = `${key ?? 'text'}-${index}`;

    switch (mark.type) {
      case 'bold':
        return <strong key={markKey} className="font-semibold text-zinc-950">{accumulator}</strong>;
      case 'italic':
        return <em key={markKey}>{accumulator}</em>;
      case 'code':
        return <code key={markKey} className="rounded bg-zinc-100 px-1 py-0.5 text-[0.9em] text-zinc-900">{accumulator}</code>;
      case 'link':
        return (
          <a key={markKey} href={mark.attrs?.href} target="_blank" rel="noreferrer" className="font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-500">
            {accumulator}
          </a>
        );
      default:
        return accumulator;
    }
  }, text);
}

function renderTextContent(nodes?: BlogContentNode[]): string {
  return (nodes || [])
    .map((node) => {
      if (node.type === 'text') {
        return node.text || '';
      }

      return renderTextContent(node.content);
    })
    .join('');
}

function tryParseJson(value: string): unknown | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}