import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-icons/av-icons.js";
//import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";

class TeiNote extends LitElement {
  static get styles() {
    return [css`
      :host {
        display: inline-flex;
      }
      simple-popover {
        max-width: 50vw;
        padding: 16px;
      }
    `];
  }
  static get properties() {
    return {
      icon: {
        type: String
      },
      hiddenStatus: {
        type: Boolean
      },
      title: {
        type: String
      }
    };
  }
  constructor() {
    super();
    this.icon = "av:note";
    this.markerType = "icon";
    this.hiddenStatus = true;
    this.title = "View additional notes";
  }
  static get tag() {
    return "tei-note";
  }
  firstUpdated() {
    if (super.firstUpdated) {
      super.firstUpdated();
    }
    setTimeout(() => {
      this.shadowRoot.querySelector('simple-popover').target = this.shadowRoot.querySelector('a');      
    }, 0);
  }
  render() {
    return html`
    <a href="javascript:void(0);" title="${this.title}" icon="${this.icon}" @click="${this.toggleStatus}">@</a>
    <simple-popover auto ?hidden="${this.hiddenStatus}">
      <slot></slot>
    </simple-popover>
    `;
  }
  toggleStatus(e) {
    this.hiddenStatus = !this.hiddenStatus;
  }
}

customElements.define(TeiNote.tag, TeiNote);