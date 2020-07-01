import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@lrnwebcomponents/simple-modal/lib/simple-modal-template.js";

class TeiPB extends LitElement {
  static get styles() {
    return [css`
      :host {
        display: inline-flex;
      }
      simple-modal-template {
        --simple-modal-width: 70vw;
        --simple-modal-height: 70vh;
        --simple-modal-min-width: unset;
        --simple-modal-min-height: unset;
        --simple-modal-max-width: 70vw;
        --simple-modal-max-height: 70vh;
      }
    `];
  }
  static get properties() {
    return {
      icon: {
        type: String,
      },
      action: {
        type: String,
      },
      title: {
        type: String,
      }
    };
  }
  constructor() {
    super();
    this.icon = "av:note";
    this.action = "View additional notes!";
    this.title = "Page break details";
  }
  static get tag() {
    return "tei-pb";
  }
  firstUpdated() {
    if (super.firstUpdated) {
      super.firstUpdated();
    }
    setTimeout(() => {
      this.shadowRoot.querySelector('simple-modal-template').associateEvents(this.shadowRoot.querySelector('paper-icon-button'));      
    }, 0);
  }
  render() {
    return html`
    <paper-icon-button title="${this.title}" icon="${this.icon}"></paper-icon-button>!
    <simple-modal-template title="${this.title}">
      <div slot="content"><slot></slot></div>
    </simple-modal-template>
    `;
  }
}

customElements.define(TeiPB.tag, TeiPB);