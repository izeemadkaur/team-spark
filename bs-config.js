// bs-config.js
module.exports = {
    proxy: 'https://dealer21750.dealeron.com/about.htm', // Replace with your CMS URL
    serveStatic: ['./'], // Serve static files from the current directory
    files: ['index.html', 'inject.js', 'replacement_codes.json'], // Watch for changes
    injectChanges: true,
    snippetOptions: {
      rule: {
        match: /<\/body>/i, // Insert just before the closing body tag
        fn: function (snippet, match) {
          return `<script src="/inject.js"></script>` + snippet + match;
        }
      }
    },
    watchOptions: {
      ignoreInitial: false,
    },
    https: true, // Enable if your CMS uses HTTPS
    logLevel: 'debug', // Set to 'debug' for detailed logging
  };
  