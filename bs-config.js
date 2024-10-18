module.exports = {
  proxy: "https://dealer21750.dealeron.com/about.htm",
  serveStatic: ["./"],
  files: ["spark_team.css", "inject.html", "inject.js"],
  injectChanges: true,
  snippetOptions: {
    rule: {
      match: /<\/body>/i,
      fn: function (snippet, match) {
        return `<script src="/inject.js"></script>` + snippet + match;
      },
    },
  },
  watchOptions: {
    ignoreInitial: false,
  },
  https: true,
  logLevel: "debug",
};
