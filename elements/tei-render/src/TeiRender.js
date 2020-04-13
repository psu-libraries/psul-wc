import { LitElement } from 'lit-element/lit-element.js';
import { CETEI } from './lib/ceteicean.js';
const validModes = () => {
  return {
    drama: "Drama",
    play: "Play"
  };
};
export class TeiRender extends LitElement {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    // tee up the initial constructor
    this.CETEIcean = new CETEI();
    this.src = null;
    this.validModes = Object.keys(validModes());
    this.mode = 'drama';
    // this is some btopro sauce
    this.basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      /**
       * Source of the TEI file
       */
      src: {
        type: String
      },
      /**
       * presentation mode / topic matter
       */
      mode: {
        type: String,
      }
    };
  }
  /**
   * LitElement property change record
   */
  updated(changedProperties) {
    // loop through the Array of changes
    changedProperties.forEach((oldValue, propName) => {
      //console.log(`${propName} changed. ${this[propName]}`);
      if (propName === 'src') {
        // re-render the document; this frags the light dom of this tag
        this.teiRender();
      }
      if (propName === 'mode') {
        this._modeChanged(this[propName]);
      }
    });
  }
  /**
   * mode changed callback
   */
  _modeChanged(newValue) {
    if (this.validModes.includes(newValue)) {
      this.applyModeStyles(newValue);
    }
  }
  /**
   * Bridge to render the TEI document
   */
  teiRender() {
    try {
      this.CETEIcean.addBehaviors({
        "handlers": {
          // Adds a new handler for <term>, wrapping it in an HTML <b>
          // "sp": function (elt) {
          //   var b = document.createElement("");
          //   b.innerHTML = elt.innerHTML;
          //   return b;
          // },
          
          // Adds a new handler for <term>, wrapping it in an HTML <b>
          "speaker": function (elt) {
            const b = document.createElement("b");
            b.innerHTML = elt.innerHTML;
            return b;
          },
          // Inserts the first array element before tei:add, and the second, after.
          "add": ["`", "´"]
        }
      });
      // return HTML aka fetch the file
      this.CETEIcean.getHTML5(this.src, (data) => {
        // wipe THIS element we are working on
        this.innerHTML = "";
        // make sure the mode is valid for security
        if (this.validModes.includes(this.mode)) {
          this.applyModeStyles(this.mode);
        }
        // append the data, which will happen just after the styles
        this.appendChild(data);
      });
    } catch (error) {
      console.log("Error in getting the document.")
    }
  }
  /**
   * Target the old style tag and replace it with the new one
   */
  applyModeStyles(mode) {
    if (this.querySelector('#teirenderstyletag')) {
      this.querySelector('#teirenderstyletag').innerHTML = '';
    }
    else {
      let style = document.createElement('style');
      style.id = 'teirenderstyletag';
      if (this.children && this.children.length > 0) {
        this.insertBefore(style, this.children[0]);
      }
      else {
        this.appendChild(style);
      }
    }
    // Go get the associated css file
    fetch(`${this.basePath}/../lib/css/${mode}.css`).then((data) => {
      // return response as plain text
      return data.text();
    }).then((data) => {
      // find our style tag in the LOCAL DOM
      const styleTag = this.querySelector('#teirenderstyletag');
      // this hack works for some reason
      styleTag.innerHTML = data;
    }).catch((e) => {
      console.warn(`CSS file failed to load file with a mode of ${mode}`);
    });
  }
  /**
   * LitElement hack to remove the shadowRoot
   */
  createRenderRoot() {
    return this;
  }
  /**
   * take a url and lob off the file / portion just after the last /
   */
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  /**
   * HAXproperties
   */
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "TEI Document",
        description:
          "Display a TEI document in the browser",
        icon: "book",
        color: "green",
        groups: ["Content", "Creative Commons"],
        handles: [
          {
            type: "content",
            title: "search"
          }
        ],
        meta: {
          author: "Penn State Libraries"
        }
      },
      settings: {
        quick: [
          
        ],
        configure: [
          {
            property: "src",
            title: "Source",
            description: "source of the TEI file",
            inputMethod: "haxupload",
            icon: "link",
            validationType: "url",
            required: true
          },
          {
            property: "mode",
            title: "Mode",
            description: "Mode of presenting this",
            inputMethod: "select",
            options: validModes()
          }
        ]
      },
      saveOptions: {
        wipeSlot: true,
        unsetAttributes: ["basePath"]
      }
    };
  }
}
