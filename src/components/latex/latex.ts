/* eslint-disable spaced-comment */
//@ts-ignore
import { parse, HtmlGenerator } from 'latex.js';
import autoRender from 'katex/contrib/auto-render';

export function renderLatex(latex: string) {
  const generator = new HtmlGenerator({ hyphenate: false });
  const doc: Document = parse(latex, { generator }).htmlDocument();
  return doc.documentElement.outerHTML;
}

export function renderKatex(latex: string) {
  const el = document.createElement('div');
  el.innerHTML = latex;
  autoRender(el, { throwOnError: false });
  const html = el.innerHTML;
  el.remove();
  return html;
}

export function render(latex: string): string {
  try {
    // first try latex.js
    return renderLatex(latex);
  } catch (e) {
    // then fallback to katex
    return renderKatex(latex);
  }
}
