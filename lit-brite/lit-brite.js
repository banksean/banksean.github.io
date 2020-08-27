import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element/lit-element.js?module";

const numPegs = 12 * (30 + 31); // 24 alternating rows of 30 and 31 cols.
const colors = [
  "blank",
  "red",
  "blue",
  "orange",
  "white",
  "green",
  "yellow",
  "pink",
  "violet"
];

class LitBrite extends LitElement {
  static get properties() {
    return {
      colors: { type: String },
      pegs: { type: Array },
      colorCounts: { type: Map }
    };
  }

  constructor() {
    super();

    this.pegs = [];
    for (let i = 0; i < numPegs; i++) {
      this.pegs.push({ color: "blank" });
    }
    this.colors = colors.map((c) => {
      return { name: c, count: c == "blank" ? "" : 0 };
    });
    this.load();
  }

  packPegs(pegs) {
    let ret = "";
    pegs.forEach((peg) => {
      ret += colors.indexOf(peg.color);
    });
    return ret;
  }

  unpackPegs(rleString) {
    let pegString = RLE.decode(rleString);
    let ret = [];
    for (let i = 0; i < pegString.length; i++) {
      ret.push({ color: colors[Number(pegString[i])] });
    }
    return ret;
  }

  save() {
    let pegStr = this.packPegs(this.pegs);
    history.replaceState({}, location.pathname, '?'+RLE.encode(pegStr));
  }

  load() {
    if (location.search.length != this.pegs.length+1) {
      return;
    }
    let pegStr = location.search.substr(1);
    this.pegs = this.unpackPegs(pegStr);
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        color: white;
        background-color: black;
        height: 7.25in;
        width: 8in;
      }
      #controls {
        padding: 0.25in;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        justify-content: space-around;
      }
      button {
        width: 3em;
        height: 3em;
        border-radius: 50%;
        background: #333;
        border: 0;
        outline: none;
      }
      .controls:hover {
        background: #666;
      }
      #peg-grid {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        margin-left: 0.125in;
      }
      lit-brite-peg:nth-child(61n + 1) {
        margin-left: 0.125in;
      }
      lit-brite-peg:nth-child(61n-31) {
        margin-right: 0.25in;
      }
    `;
  }

  pegClicked(evt) {
    let idx = Array.from(evt.target.parentNode.children).indexOf(evt.target);
    this.pegs[idx].color = this.shadowRoot.querySelector(
      'input[name="colorRadio"]:checked'
    ).value;
    this.pegs = [...this.pegs];
    this.updateColorCounts();
  }

  updateColorCounts() {
    let counts = {};
    this.pegs.forEach((peg) => {
      counts[peg.color] = (counts[peg.color] || 0) + 1;
    });
    this.colors.forEach((color) => {
      if (color.name != "blank") {
        color.count = counts[color.name] || 0;
      }
    });
    this.colors = [...this.colors];
  }

  saveClicked(evt) {
    this.save();    
  }

  clearClicked(evt) {
    this.pegs.forEach((peg) => {
      peg.color = "blank";
    });
    this.pegs = [...this.pegs];
    this.updateColorCounts();
  }

  render() {
    return html`
      <div id="controls">
        ${this.colors.map(
          (color, i) => html`<label>
            <input
              value="${color.name}"
              name="colorRadio"
              type="radio"
              ?checked=${i == 0}
            />
            <lit-brite-peg .color="${color.name}">${color.count}</lit-brite-peg>
          </label> `
        )}
        <button id="save" @click=${this.saveClicked}>🔗</button>
        <button id="clear" @click=${this.clearClicked}>🗑️</button>
      </div>
      <div id="peg-grid">
        ${this.pegs.map((peg, i) => {
          return html` <lit-brite-peg
            .color=${peg.color}
            @click=${this.pegClicked}
          >
          </lit-brite-peg>`;
        })}
      </div>
    `;
  }
}

customElements.define("lit-brite", LitBrite);

class LitBritePeg extends LitElement {
  constructor() {
    super();
    this.color = "blank";
  }

  static get properties() {
    return {
      color: { type: String },
      gen: { type: Number }
    };
  }

  static get styles() {
    return css`
      div {
        border-radius: 50%;
        height: 0.21in;
        width: 0.21in;
        margin: 0.02in;
        color: black;
        text-align: center;
        font-size: 0.15in;
      }
      .red {
        background: red;
        filter: drop-shadow(0 0 0.75rem red);
      }
      .blue {
        background: blue;
        filter: drop-shadow(0 0 0.75rem blue);
      }
      .orange {
        background: orange;
        filter: drop-shadow(0 0 0.75rem orange);
      }
      .white {
        background: white;
        filter: drop-shadow(0 0 0.75rem white);
      }
      .green {
        background: green;
        filter: drop-shadow(0 0 0.75rem green);
      }
      .yellow {
        background: yellow;
        filter: drop-shadow(0 0 0.75rem yellow);
      }
      .pink {
        background: violet;
        filter: drop-shadow(0 0 0.75rem violet);
      }
      .violet {
        background: indigo;
        filter: drop-shadow(0 0 0.75rem indigo);
      }
      .blank {
        background: #333;
      }
    `;
  }

  render() {
    return html`<div class=${this.color}><slot></slot></div>`;
  }
}

customElements.define("lit-brite-peg", LitBritePeg);

class RLE {
  // given a string, returns a run length encoded string
  static encode(str) {
    let count = 0;
    let char = '';
    let out = '';

    str.split('').forEach((alpha) => {
      count += 1;
      if (alpha === char) {
        return;
      }
      if (char !== '') {
        out += this.appendEncoded(char, count);
      }
      char = alpha;
      count = 0;
    });
    out += this.appendEncoded(char, count + 1);

    return out;
  }

  // given a run length encoded string, returns the decoded string
  static decode(str) {
    // use a string to store count to account for multi digit nums
    let count = '';
    let out = '';

    str.split('').forEach((char) => {
      // build the count string
      if (char.match(/\d/)) {
        count += char;
        return;
      }
      // handle single char runs
      count = count ? parseInt(count, 10) : 1;
      // using the count and the current char, build the output string
      for (let i = 0; i < count; i += 1) {
        out += char;
      }
      count = '';
    });

    return out;
  }

  // helper method to build the encoded string
  static appendEncoded(char, count) {
    let result = '';

    result += count > 1 ? count.toString() : '';

    return result + char;
  }
}
