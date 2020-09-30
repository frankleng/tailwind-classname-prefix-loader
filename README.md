# tailwind-classname-prefix-loader

Add a prefix to all Tailwind classes in a `className` (React default) attribute.

Usage Example
```js
//webpack.config.js
  {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          ...
        }
      },
      {
        loader: 'node_modules/tailwind-classname-prefix-loader/lib/index.js',
        options: {
          prefix: 'prefix-',
          attrs: [
            // additional attributes to prefix

            // ie. transition classes from React Transition Group component
            'enter',
            'enterFrom',
            'enterTo',
            'leave',
            'leaveFrom',
            'leaveTo',

            // ie. CSS Module
           'styleName'
          ]
        }
      }
    ]
  }
```
