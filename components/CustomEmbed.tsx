// components/CustomEmbed.tsx
import React, { useEffect, useRef } from "react";

interface CustomEmbedProps {
  src: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

const CustomEmbed: React.FC<CustomEmbedProps> = ({
  src,
  width = 400,
  height = 600,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    // Create shadow DOM for style isolation
    const shadow = container.attachShadow({ mode: "closed" });

    // Add container styles
    const style = document.createElement("style");

    style.textContent = `
      :host {
        all: initial;
        display: block;
        width: ${width}px;
        height: ${height}px;
        border: none;
        overflow: hidden;
      }
      .embed-container {
        width: 100%;
        height: 100%;
        overflow: auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
    `;
    shadow.appendChild(style);

    // Create container for the embedded content
    const embedContainer = document.createElement("div");

    embedContainer.className = "embed-container";

    // Fetch and inject content from src
    fetch(src)
      .then((response) => response.text())
      .then((html) => {
        embedContainer.innerHTML = html;

        // Handle all links to open in new tab
        const links = embedContainer.getElementsByTagName("a");

        Array.from(links).forEach((link) => {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        });

        // Inject any necessary scripts
        const scripts = embedContainer.getElementsByTagName("script");

        Array.from(scripts).forEach((script) => {
          const newScript = document.createElement("script");

          Array.from(script.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.textContent = script.textContent;
          script.parentNode?.replaceChild(newScript, script);
        });
      })
      .catch((error) => {
        embedContainer.innerHTML = `<div style="color: red; padding: 1rem;">Error loading content: ${error.message}</div>`;
      });

    shadow.appendChild(embedContainer);

    // Setup message handling for communication
    window.addEventListener("message", (event) => {
      // Verify origin for security
      if (new URL(src).origin !== event.origin) return;

      // Handle incoming messages
      switch (event.data.type) {
        case "resize":
          if (event.data.height) {
            container.style.height = `${event.data.height}px`;
          }
          break;
        // Add other message handlers as needed
      }
    });

    return () => {
      // Cleanup
      while (shadow.firstChild) {
        shadow.removeChild(shadow.firstChild);
      }
    };
  }, [src, width, height]);

  return <div ref={containerRef} className={className} />;
};

export default CustomEmbed;
