import { barX, barY, binX, plot, text } from "@observablehq/plot";

// Example styling on mouse hover and selected
// apn-pubs-histogram rect:hover {
//   fill: rgb(var(--apn-red));
// }
// apn-pubs-histogram rect.selected {
//   fill: rgb(var(--apn-red));
// }

const sum = (data) => data.reduce((p, [, count]) => (p += count), 0);

export const yearCounts = async () => {
  const r = await fetch("https://dois.deno.dev/count/published/substring/0,4");
  const { data } = await r.json();
  return data.map(([year, count]) => [+year, count]);
};

export class ApnPubsHistogram extends HTMLElement {
  static get observedAttributes() {
    return ["period", "what", "label"];
  }

  get selected() {
    return this._selected;
  }

  set selected(s) {
    this._selected = s;
    for (const year of s) {
      const yearRect = this.querySelector(`rect[year="${year}"]`);
      if (yearRect) {
        yearRect.classList.add("selected");
      }
    }
  }

  attributeChangedCallback(name, was, is) {
    if (name === "period") {
      try {
        const [min, max] = is.split("/").map((v) => new Date(v).toJSON());
        this.min = min;
        this.max = max;
      } finally {
        if (this.data) {
          this.plot();
        }
      }
    } else {
      this[name] = is;
    }
  }

  async connectedCallback() {
    if (!this.data) {
      this.data = await yearCounts();
    }
    this.what = !this.hasAttribute("what")
      ? "publications"
      : this.getAttribute("what");
    this.plot();
  }

  cssVar(name) {
    return getComputedStyle(this).getPropertyValue(name);
  }

  fireYearClick({ year }) {
    const yearClick = new CustomEvent("year-click", {
      detail: { year },
    });
    this.dispatchEvent(yearClick);
  }

  // https://observablehq.com/@observablehq/plot-interval
  plot() {
    const { data, min, max, selected, label, what, width, height } = this;

    const minFilter = min != null
      ? ([year, count]) => new Date([year]) >= new Date(min)
      : () => true;

    const maxFilter = max != null
      ? ([year, count]) => new Date([year]) < new Date(max)
      : () => true;

    const filtered = (data ?? []).filter(minFilter).filter(maxFilter);
    const el = plot({
      width: width ?? window.innerWidth,
      height: height ?? 120,
      y: { label },
      x: { label: "", tickFormat: (d) => (d % 2 ? "" : d) },
      style: {
        color: "rgb(40, 75, 93)",
        background: "var(--blue-0)",
      },
      color: {
        scheme: "YlGnBu",
      },
      marks: [
        // Histogram ie Y-axis bars
        barY(filtered, {
          x: "0",
          y: "1",
          fill: "rgb(40, 75, 93)", //this.cssVar("--accent"),
          title: (d) => `${d[1]} ${what} in ${d[0]}`,
        }),

        // Counts above each bar
        text(filtered, {
          x: "0",
          y: "1",
          text: "1",
          dy: -5,
          fill: this.cssVar("--apn-primary"),
        }),
      ],
    });
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.appendChild(el);

    if (!this.hasAttribute("no-click")) {
      const rects = el.querySelectorAll("rect");
      const sortedRects = Array.from(rects).sort(
        (a, b) => a.getAttribute("x") - b.getAttribute("x"),
      );
      const sorted = data
        ?.sort((a, b) => +a[0] - +b[0])
        .filter(([y]) => new Date([+y]) >= new Date(min));

      let y = sorted?.[0]?.[0];

      sortedRects.map((rect, i) => {
        const year = sorted[i][0];
        rect.setAttribute("year", year);

        rect.addEventListener("click", ({ ctrlKey }) => {
          this.fireYearClick({ year });
          if (!ctrlKey) {
            for (const r of rects) {
              if (+r.getAttribute("year") !== year) {
                r.classList.remove("selected");
              }
            }
          }
          rect.classList.toggle("selected");
        });
        rect.setAttribute("cursor", "pointer");
      });
    }
  }
}
