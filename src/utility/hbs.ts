import Handlebars from 'handlebars';
import * as fs from 'node:fs';
export function getHtml(
  templateName: string,
  data: Record<string, string>,
): string {
  const file = fs.readFileSync(
    __dirname + `/html/${templateName}.html`,
    'utf8',
  );
  const template = Handlebars.compile(file);
  return template(data);
}
