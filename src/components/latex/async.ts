export async function renderLatex(latex: string) {
  const { parse, HtmlGenerator } = await import('latex.js');
  const generator = new HtmlGenerator({ hyphenate: false });
  const doc: Document = parse(latex, { generator }).htmlDocument();
  return doc.documentElement.outerHTML;
}

export async function renderKatex(latex: string) {
  const { default: autoRender } = import('katex/contrib/auto-render');
  const el = document.createElement('div');
  el.innerHTML = latex;
  autoRender(el, { throwOnError: false });
  const html = el.innerHTML;
  el.remove();
  return html;
}

export async function render(latex: string): Promise<string> {
  latex = latex.replace(/\\n/g, '\n'); // just fix the source text
  try {
    // first try latex.js
    return await renderLatex(latex);
  } catch (e) {
    try {
      // then fallback to katex
      return await renderKatex(latex);
    } catch (e) {
      return latex;
    }
  }
}
