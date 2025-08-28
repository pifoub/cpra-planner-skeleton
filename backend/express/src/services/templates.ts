import nunjucks from 'nunjucks';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.resolve(__dirname, '../../../fastapi/app/templates');
const env = nunjucks.configure(TEMPLATE_DIR, { autoescape: true });

env.addFilter('nl2br', (str: string) => str.replace(/\n/g, '<br>\n'));

/** Render a letter template with the provided context. */
export function renderLetter(template: string, context: Record<string, any>): string {
  return env.render(template, context);
}
