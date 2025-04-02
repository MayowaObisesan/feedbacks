// components/FeedbacksEmbed.ts
export class FeedbacksEmbed extends HTMLElement {
  constructor() {
    super();

    // Create shadow DOM
    const shadow = this.attachShadow({ mode: "closed" });

    // Add styles
    const style = document.createElement("style");

    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        border: none;
        overflow: hidden;
      }
      .container {
        width: 100%;
        height: 100%;
        overflow: auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
    `;
    shadow.appendChild(style);

    // Create container
    const container = document.createElement("div");

    container.className = "container";
    shadow.appendChild(container);

    // Load content when src changes
    this.loadContent(container);
  }

  static get observedAttributes() {
    return ["src", "width", "height"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      const container = this.shadowRoot?.querySelector(".container");

      if (container) {
        // if (name === "width") container.style.width = newValue;
        // if (name === "height") container.setAttribute("style", "");
        // if (name === "src") this.loadContent(container);
      }
    }
  }

  private async loadContent(container: HTMLDivElement) {
    const src = this.getAttribute("src");

    if (!src) return;

    try {
      const response = await fetch(src);
      const html = await response.text();

      container.innerHTML = html;

      // Handle scripts
      const scripts = container.getElementsByTagName("script");

      Array.from(scripts).forEach((script) => {
        const newScript = document.createElement("script");

        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = script.textContent;
        script.parentNode?.replaceChild(newScript, script);
      });

      // Handle resize messages
      window.addEventListener("message", (event) => {
        if (new URL(src).origin !== event.origin) return;
        if (event.data.type === "resize") {
          this.style.height = `${event.data.height}px`;
        }
      });
    } catch (error) {
      container.innerHTML = `<div style="color: red; padding: 1rem;">Error loading content</div>`;
    }
  }
}

// Register custom element
customElements.define("feedbacks-embed", FeedbacksEmbed);
