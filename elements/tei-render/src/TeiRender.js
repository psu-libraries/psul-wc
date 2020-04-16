import { LitElement, html } from "lit-element/lit-element.js";
import { CETEI } from './lib/ceteicean.js';
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-toast/paper-toast.js";
import "@lrnwebcomponents/anchor-behaviors/anchor-behaviors.js";

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
    // this is some btopro sauce to get the correct base path
    this.basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    // elements for toast
    this.closeIcon = "close";
    this.closeLabel = "Close";
    this.copyMessage = "Copied to Clipboard";
    this.linkIcon = "link";
    this.linkLabel = "Get link";
    this.pageIcon = "description";
    this.pageLabel = "See the original page";
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
      },
      /**
       * how frequently to show line numbers
       */
      lineDisplay: {
        type: String,
      },
      /**
       * what prefix to use for ids for line numbers
       */
      linePrefix: {
        type: String,
      },
      /**
       * what number to start line numbers
       */
      lineStart: {
        type: String,
      },
      /**
       * overrides state manager's default icon for copy link's toast's close button
       */
      "closeIcon": {
        "type": String
      },
      /**
       * overrides state manager's default label for copy link's toast's close button
       */
      "closeLabel": {
        "type": String
      },
      /**
       * overrides state manager's default message for copy link's toast
       */
      "copyMessage": {
        "type": String
      },
      /**
       * current line being copied
       */
      "currentLineId": {
        "type": String
      },
      /**
       * icon for copy link's button
       */
      "linkIcon": {
        "type": String
      },
      /**
       * label for copy link's button
       */
      "linkLabel": {
        "type": String
      },
      /**
       * icon for page link's button
       */
      pageIcon: {
        type: String
      },
      /**
       * label for page link's button
       */
      pageLabel: {
        type: String
      },
      "toast": {
        type: Object
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
          // "speaker": function (elt) {
          //   const b = document.createElement("b");
          //   b.innerHTML = elt.innerHTML;
          //   return b;
          // },
          // Adds a new handler for <lb>, wrapping it in html where text was orphaned before
          "lb": function (elt) {
            elt.innerHTML = elt.parentNode.lastChild.textContent;
            elt.parentNode.lastChild.textContent = '';
          },
          // Adds a new handler for <lb>, wrapping it in html where text was orphaned before
          "pb": function (elt) {
            // elt.innerHTML = elt.parentNode.lastChild.textContent;
            // elt.parentNode.lastChild.textContent = '';
            let pbutton = document.createElement('paper-icon-button');
            pbutton.setAttribute('icon',"description");
            pbutton.setAttribute('label',this.pageLabel);
            let pblinked = document.createElement('a');
            pblinked.setAttribute('href',elt.getAttribute("facs"));
            pblinked.appendChild(pbutton);
            return pblinked;
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
        let lines = this.querySelectorAll('tei-l');
        let i=this.lineStart;
        let lineIdPrefix=this.linePrefix || "line"
        lineIdPrefix=lineIdPrefix
        if(lines) [...lines].forEach((line,i)=>{
          // set the line ID
          let currentLineNumber=i+1
          let lineId = `${lineIdPrefix}-${currentLineNumber}`, 
            button = document.createElement('paper-icon-button');
          line.setAttribute('id',lineId);
          // set the line margin identifier for nth Line
          if( currentLineNumber % this.lineDisplay === 0 || currentLineNumber === 1 ){
            line.setAttribute('data-lineno',currentLineNumber)
          }
          // create the buttons
          button.setAttribute('aria-controls',"relative-heading-toast");
          button.setAttribute('icon',this.linkIcon);
          button.setAttribute('label',this.linkLabel);
          button.addEventListener('click', e=>this._handleCopyClick(lineId));
          line.appendChild(button);
          // line.prepend(button);
        });
        let tbutton = document.createElement('paper-icon-button');
          tbutton.setAttribute('icon',this.closeIcon);
          tbutton.setAttribute('label',this.closeLabel);
          tbutton.addEventListener('click', this.closeCopyLink);
        this.toast = document.createElement('paper-toast');
        this.toast.id ="relative-heading-toast";
        this.toast.duration = 5000;
        this.toast.appendChild(tbutton);
        this.appendChild(this.toast);
        // console.log('toasty!',this.toast);
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
   * gets whether heading is currently anchored
   * @readonly
   * @returns {boolean}
   */
  get anchored() {
    return window.AnchorBehaviors && window.AnchorBehaviors.getTarget
      ? window.AnchorBehaviors.getTarget(this)
      : false;
  }
  _handleCopyClick(lineId) {
    this.copyLink(lineId);
  }
 /**
   * handles copying the share link
   * @param {object} active heading
   */
  copyLink(lineId) {
    let el = document.createElement("textarea");
    this.currentLineId = `${window.location.href.replace(window.location.hash, "")}#${lineId}`;
    console.log('copylink',this.currentLineId);
    el.value = this.currentLineId;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    console.log('yeah toast!',this.toast);
    if (
      this.toast &&
      this.toast.open
    )
      this.toast.text = `${this.copyMessage}: ${this
        .currentLineId}`;
      this.toast.open();
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
