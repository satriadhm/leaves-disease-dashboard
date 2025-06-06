const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require("webpack"); // Add this import

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  entry: "./src/main.js",
  
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isProduction ? "js/[name].[contenthash:8].js" : "js/[name].js",
    chunkFilename: isProduction ? "js/[name].[contenthash:8].chunk.js" : "js/[name].chunk.js",
    assetModuleFilename: isProduction ? "assets/[name].[contenthash:8][ext]" : "assets/[name][ext]",
    clean: true,
    publicPath: "/",
  },
  
  resolve: {
    extensions: [".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@services": path.resolve(__dirname, "src/services"),
      "@styles": path.resolve(__dirname, "src/styles"),
    },
  },
  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: ["> 1%", "last 2 versions", "not dead"],
                  },
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: !isProduction,
              modules: false,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  ["autoprefixer"],
                  ...(isProduction ? [["cssnano", { preset: "default" }]] : []),
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp|ico)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name].[contenthash:8][ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[contenthash:8][ext]",
        },
      },
    ],
  },
  
  plugins: [
    // ✅ Add DefinePlugin to inject environment variables
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify(process.env.API_URL || "https://leaves-disease-api-production.up.railway.app"),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
        VERSION: JSON.stringify(process.env.npm_package_version || "2.0.0"),
      }
    }),
    
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      inject: "body",
      minify: isProduction
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          }
        : false,
      templateParameters: {
        env: {
          API_URL: process.env.API_URL || "https://leaves-disease-api-production.up.railway.app",
          NODE_ENV: process.env.NODE_ENV || "development",
          VERSION: process.env.npm_package_version || "2.0.0",
        },
      },
    }),
    
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:8].css",
            chunkFilename: "css/[name].[contenthash:8].chunk.css",
          }),
        ]
      : []),
  ],
  
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProduction,
            drop_debugger: isProduction,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
    
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: 10,
          reuseExistingChunk: true,
        },
        common: {
          name: "common",
          minChunks: 2,
          chunks: "all",
          priority: 5,
          reuseExistingChunk: true,
          enforce: true,
        },
        styles: {
          name: "styles",
          type: "css/mini-extract",
          chunks: "all",
          enforce: true,
        },
      },
    },
    
    runtimeChunk: {
      name: "runtime",
    },
    
    usedExports: true,
    sideEffects: false,
  },
  
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 3000,
    hot: true,
    open: true,
    compress: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\//, to: "/index.html" },
      ],
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    devMiddleware: {
      stats: "minimal",
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
  },
  
  stats: {
    preset: "minimal",
    moduleTrace: true,
    errorDetails: true,
    colors: true,
    chunks: false,
    modules: false,
  },
  
  performance: {
    hints: isProduction ? "warning" : false,
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
  },
  
  devtool: isProduction ? "source-map" : "eval-cheap-module-source-map",
  
  mode: isProduction ? "production" : "development",
  
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
};