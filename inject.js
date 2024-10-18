(function () {
  console.log("inject.js has started.");

  const html_file_name = "index.html";

  function injectStylesheet() {
    if (!document.querySelector('link[href="/spark_team.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "src/spark_team.css";
      link.type = "text/css";
      document.head.appendChild(link);
      console.log("Injected spark_team.css into head.");
    } else {
      console.log("spark_team.css is already injected.");
    }
  }

  function injectContent() {
    console.log("Starting content injection.");

    fetch(`src/${html_file_name}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch html file: " + response.statusText);
        }
        return response.text();
      })
      .then((injectHtml) => {
        console.log("Fetched html file successfully.");

        const cmsPlaceholderElements =
          document.querySelectorAll('[id^="spark-"]');
        const replacements = {};

        cmsPlaceholderElements.forEach((element) => {
          const id = element.id;

          const placeholderCodeWithParams = id.substring(6);

          const placeholder = `#${placeholderCodeWithParams}#`;

          element.style.display = "none";
          console.log(
            `Hid element with ID '${id}' for placeholder '${placeholder}'.`
          );

          replacements[placeholder] = element.innerHTML;
          console.log(
            `Prepared replacement for '${placeholder}':`,
            replacements[placeholder]
          );
        });

        let processedHtml = injectHtml;
        Object.keys(replacements).forEach((placeholder) => {
          const regex = new RegExp(escapeRegExp(placeholder), "g");
          processedHtml = processedHtml.replace(
            regex,
            replacements[placeholder]
          );
          console.log(`Replaced '${placeholder}' in html file.`);
        });

        const injectorDiv = document.querySelector(".team-spark-html-injector");
        if (injectorDiv) {
          injectorDiv.innerHTML = processedHtml;
          console.log(
            "Injected HTML content into .team-spark-html-injector with placeholders replaced."
          );
        } else {
          console.warn(
            "No .team-spark-html-injector element found on the page."
          );
        }

        setupMutationObserver();
      })
      .catch((error) => {
        console.error("Error during injection:", error);
      });
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
  }

  function setupMutationObserver() {
    const observerConfig = { childList: true, subtree: true };

    const observerCallback = function (mutationsList, observer) {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.id &&
              node.id.startsWith("spark-")
            ) {
              const id = node.id;
              const placeholderCodeWithParams = id.substring(6);
              const placeholder = `#${placeholderCodeWithParams}#`;

              node.style.display = "none";
              console.log(
                `Dynamically hid element with ID '${id}' for placeholder '${placeholder}'.`
              );

              const replacementContent = node.innerHTML;
              console.log(
                `Prepared replacement for '${placeholder}':`,
                replacementContent
              );

              const injectorDiv = document.querySelector(
                ".team-spark-html-injector"
              );
              if (injectorDiv && injectorDiv.innerHTML.includes(placeholder)) {
                const regex = new RegExp(escapeRegExp(placeholder), "g");
                injectorDiv.innerHTML = injectorDiv.innerHTML.replace(
                  regex,
                  replacementContent
                );
                console.log(
                  `Replaced '${placeholder}' in .team-spark-html-injector with dynamically added content.`
                );
              } else {
                console.warn(
                  `Placeholder '${placeholder}' not found in .team-spark-html-injector.`
                );
              }
            }
          });
        }
      });
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(document.body, observerConfig);
    console.log(
      "MutationObserver set up to watch for dynamic content changes."
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("DOM fully loaded. Injecting stylesheet and content.");
      injectStylesheet();
      injectContent();
    });
  } else {
    console.log("DOM already loaded. Injecting stylesheet and content.");
    injectStylesheet();
    injectContent();
  }
})();
