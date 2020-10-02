import tailwindClasses from './tailwindClasses';
import * as webpack from 'webpack';

const prefixCache: { [x: string]: string } = {};

export function applyPrefix(prefix: string, snippet: string) {
  if (prefixCache[snippet]) return prefixCache[snippet];

  let result = snippet;

  // credit: https://github.com/vesper8/vue-tailwind-prefix-applicator/blob/master/src/views/Home.vue
  const escapeRegExp = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  tailwindClasses.forEach((cls) => {
    result = result.replace(
      new RegExp(`(["':\\s])(?!${prefix})(-?${escapeRegExp(cls)})(?![-/])`, 'g'),
      `$1${prefix}$2`,
    );
  });

  prefixCache[snippet] = result;
  return result;
}

function loader(this: webpack.loader.LoaderContext, content: string) {
  const { prefix, attrs } = this.query;
  let classNameAttrs = ['className'];
  if (attrs) {
    classNameAttrs = classNameAttrs.concat(attrs);
  }

  const classMatchRegex = new RegExp(
    `(?=<[^>]+(?=[\\s+\\"\\'](${classNameAttrs.join('|')})=(.*)[\\s+\\"\\']).+)([^>]+>)`,
    'gim',
  );

  const classNamesMatches = content.match(classMatchRegex);

  if (classNamesMatches) {
    for (const match of classNamesMatches) {
      const prefixed = applyPrefix(prefix, match);
      content = content.replace(match, prefixed);
    }
  }

  return content;
}

export default loader;
