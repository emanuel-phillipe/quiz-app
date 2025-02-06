import React from "react";
import ReactMarkdown from "react-markdown";
import { MathJaxContext, MathJax } from "better-react-mathjax";

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [["$", "$"]],
    displayMath: [["$", "$"]],
  },
};

export default function MathText({children}) {
  return (
    <MathJaxContext config={config}>
      <div>
        <MathJax dynamic hideUntilTypeset="every">
          <ReactMarkdown>{children}</ReactMarkdown>
        </MathJax>
      </div>
    </MathJaxContext>
  );
}
