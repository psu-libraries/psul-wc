import { LitElement, html, css } from 'lit-element';
import "tei-render/tei-render.js"

export class PsuLibrariesDemos extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      page: { type: String }
    };
  }
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
      <tei-render src="assets/TSV_Base_Text_Sample_Revised.xml" mode="play"></tei-render>
      <tei-render src="assets/TSV_Base_Text_Sample_Revised.xml" mode="drama"></tei-render>
    `;
  }
}
