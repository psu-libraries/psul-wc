import { LitElement, html, css } from 'lit-element/lit-element.js';
import "@psul/tei-render/tei-render.js";
import "@psul/tei-render/src/lib/tei-note.js";
//import "@psul/tei-render/src/lib/tei-pb.js";
export class PsuLibrariesDemos extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }
  render() {
    return html`
      <h1>tei-render demo:</h1>
      <tei-render src="assets/BF-TSV-Edited-valid.xml" mode="drama" ref-prefix="../works-cited/"></tei-render>
    `;
  }
  /**
   * LitElement hack to remove the shadowRoot
   */
  createRenderRoot() {
    return this;
  }
}
