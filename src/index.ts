import tailwindClasses from './tailwindClasses';
import * as webpack from 'webpack';

const prefixCache: { [x: string]: string } = {};
const dynamicClassNameRegex = /_useCssPrefix.*=*\{([^}]+)\}|cx\(.+\)/gim;

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

function processContent(matches: RegExpMatchArray | null, prefix: string, content: string) {
  if (matches) {
    for (const match of matches) {
      const prefixed = applyPrefix(prefix, match);
      content = content.replace(match, prefixed);
    }
  }
  return content;
}

function loader(this: webpack.loader.LoaderContext, content: string) {
  const { prefix, attrs, debug } = this.query;
  let classNameAttrs = ['className', 'cx'];
  if (attrs) {
    classNameAttrs = classNameAttrs.concat(attrs);
  }

  const reactRegex = new RegExp(`(${classNameAttrs.join('|')})\\s*[=({](?:["'\`]\\W+\\s*(?:\\w+)\\()*`, 'igm');
  const reactMatches = content.match(reactRegex);
  if (reactMatches || content.includes('/* ADD_CSS_PREFIX_TO_FILE */')) {
    if (debug) console.log(reactMatches);
    content = applyPrefix(prefix, content);
    if (debug) console.log(content);
  } else {
    const dynamicClassMatches = content.match(dynamicClassNameRegex);
    if (dynamicClassMatches) {
      content = processContent(dynamicClassMatches, prefix, content);
    }
  }
  return content;
}

export default loader;
