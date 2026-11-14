import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * Formats AI and user messages into clean, modern text with light-bold styling,
 * stripping away raw markdown syntax (**, ###, -, ```) and presenting
 * natural, readable typography exactly like ChatGPT/Claude.
 */
export default function FormattedChatMessage({ text = '', isUser = false }) {
  if (!text) return null;

  if (isUser) {
    return (
      <p className="text-white text-xs sm:text-sm font-normal leading-relaxed whitespace-pre-wrap">
        {text}
      </p>
    );
  }

  // Pre-clean text to repair broken markdown patterns (e.g. **text* or stray asterisks)
  const sanitizeLine = (raw) => {
    let s = raw;
    // Fix mismatched bold/italic: **word* -> **word**
    s = s.replace(/\*\*([^*\n]+)\*(?!\*)/g, '**$1**');
    // Fix mismatched italic/bold: *word** -> **word**
    s = s.replace(/(?<!\*)\*([^*\n]+)\*\*/g, '**$1**');
    return s;
  };

  const renderInline = (rawText) => {
    const sanitized = sanitizeLine(rawText);

    // 1. Split by backtick inline code
    const codeParts = sanitized.split(/(`[^`]+`)/g);

    return codeParts.map((codePart, cIdx) => {
      if (codePart.startsWith('`') && codePart.endsWith('`') && codePart.length > 2) {
        return (
          <code
            key={`code-${cIdx}`}
            className="px-1.5 py-0.5 mx-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[11px] font-medium border border-indigo-100"
          >
            {codePart.slice(1, -1)}
          </code>
        );
      }

      // 2. Split by bold **...** or __...__
      const boldParts = codePart.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);

      return boldParts.map((boldPart, bIdx) => {
        if (
          (boldPart.startsWith('**') && boldPart.endsWith('**') && boldPart.length > 4) ||
          (boldPart.startsWith('__') && boldPart.endsWith('__') && boldPart.length > 4)
        ) {
          const boldText = boldPart.slice(2, -2).trim();
          return (
            <span
              key={`b-${cIdx}-${bIdx}`}
              className="font-semibold text-slate-900"
            >
              {boldText}
            </span>
          );
        }

        // 3. Split by italic *...* or _..._
        const italicParts = boldPart.split(/(\*[^*]+\*|_[^_]+_)/g);

        return italicParts.map((itPart, itIdx) => {
          if (
            (itPart.startsWith('*') && itPart.endsWith('*') && itPart.length > 2) ||
            (itPart.startsWith('_') && itPart.endsWith('_') && itPart.length > 2)
          ) {
            const itText = itPart.slice(1, -1).trim();
            return (
              <span
                key={`it-${cIdx}-${bIdx}-${itIdx}`}
                className="font-normal italic text-slate-800"
              >
                {itText}
              </span>
            );
          }

          // 4. Clean any residual stray asterisks or hashes from plain text
          const cleanText = itPart.replace(/[*#_]{2,}/g, '').replace(/(^|\s)[*#_](\s|$)/g, '$1$2');
          return cleanText;
        });
      });
    });
  };

  // Code Block Component with Copy Button
  const CodeBlock = ({ lang, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard?.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="my-2.5 rounded-xl bg-slate-900 text-slate-100 overflow-hidden shadow-sm border border-slate-800">
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/70 border-b border-slate-800 text-[11px] text-slate-400">
          <span className="font-mono uppercase tracking-wider text-[10px] text-slate-400">
            {lang || 'code'}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-white transition-colors text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-3.5 text-xs font-mono leading-relaxed overflow-x-auto text-emerald-300">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  const lines = text.split('\n');
  const elements = [];
  let inCode = false;
  let codeBuffer = [];
  let codeLang = '';

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Code block delimiters
    if (trimmed.startsWith('```')) {
      if (inCode) {
        elements.push(
          <CodeBlock
            key={`code-block-${idx}`}
            lang={codeLang}
            code={codeBuffer.join('\n')}
          />
        );
        inCode = false;
        codeBuffer = [];
        codeLang = '';
      } else {
        inCode = true;
        codeLang = trimmed.replace('```', '').trim();
      }
      return;
    }

    if (inCode) {
      codeBuffer.push(line);
      return;
    }

    // Dividers
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      elements.push(<hr key={`hr-${idx}`} className="my-2.5 border-slate-200" />);
      return;
    }

    // Empty lines -> soft vertical spacing
    if (!trimmed) {
      elements.push(<div key={`empty-${idx}`} className="h-1.5" />);
      return;
    }

    // Headings (###, ##, #) -> Clean, light-bold subtitles with NO raw markdown symbols
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const headingText = trimmed.replace(/^#+\s*/, '');
      elements.push(
        <h4
          key={`h-${idx}`}
          className="text-xs sm:text-sm font-semibold text-slate-900 mt-2.5 mb-1 tracking-tight"
        >
          {renderInline(headingText)}
        </h4>
      );
      return;
    }

    // Bullet points (- or *) -> Clean rounded bullet dot, NO raw asterisks or dashes
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bulletText = trimmed.slice(2);
      elements.push(
        <div
          key={`bullet-${idx}`}
          className="flex items-start gap-2 my-1 pl-1 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></span>
          <div className="flex-1">{renderInline(bulletText)}</div>
        </div>
      );
      return;
    }

    // Numbered items (1. , 2. ) -> Clean indigo badge number
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      const num = numMatch[1];
      const rest = numMatch[2];
      elements.push(
        <div
          key={`num-${idx}`}
          className="flex items-start gap-2 my-1 pl-1 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal"
        >
          <span className="font-semibold text-indigo-600 text-xs shrink-0">{num}.</span>
          <div className="flex-1">{renderInline(rest)}</div>
        </div>
      );
      return;
    }

    // Normal paragraph text -> Natural, clear, comfortable font with light-bold accents
    elements.push(
      <p
        key={`p-${idx}`}
        className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal my-0.5"
      >
        {renderInline(line)}
      </p>
    );
  });

  return <div className="space-y-0.5">{elements}</div>;
}
