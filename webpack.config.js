module.exports = {
    // ...
    module: {
      rules: [
        {
          // ...
          use: [
            // ...
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  plugins: [
                    require('tailwindcss'),
                    require('autoprefixer'),
                  ],
                },
              }
            },
          ],
        },
        {
   
          test: /.(png|jpe?g|gif|webp|avif)$/i,
      
          use: [{loader: 'file-loader'}]
      
         }
      ],
    }
  }
 