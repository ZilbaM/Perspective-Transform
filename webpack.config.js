import path from 'path';

export default {
  entry: './src/index.tsx', // Update to your TypeScript entry point
  output: {
    path: path.resolve('dist'),
    filename: 'index.js',
    library: {
      type: 'module', // Outputs an ES module
    },
  },
  experiments: {
    outputModule: true, // Enables outputting ES modules
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Add .tsx and .ts extensions for resolution
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Match .ts and .tsx files
        exclude: /node_modules/,
        use: 'ts-loader', // Use ts-loader for TypeScript files
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
};
