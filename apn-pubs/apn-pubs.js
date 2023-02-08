import {
  authors,
  filterFactory,
  fnlt5,
  has,
  licenses,
  search,
  size,
  types,
} from "./search.js";

import { emphasizeSpecies } from "./species.js";

import { yearsSet } from "./time.js";

import "../apn-pubs-histogram/index.js";

import { helper, sortDirTitle, t } from "./t.js";
import { renderResults } from "./render-results.js";
import { styles } from "./styles.js";

import { html, LitElement } from "lit";

const desc = ""; //"↧";
const asc = ""; //"↥";

const upcase1st = (key) => key[0].toUpperCase() + key.substring(1);

const sortOption = ({ key, label = upcase1st(key), sort, dir }) =>
  html`<option
  ?selected="${sort === key}"
  value="${key}"
  >${dir === -1 ? asc : desc} ${label}</option
>`;

export class ApnPubs extends LitElement {
  static properties = {
    lang: { type: String, reflect: true },
    q: { type: String },
    variant: { type: String },
    sort: { type: String },
    sortdir: { type: String },
    selected: { type: Map },
    pubs: { type: Array },
    menuIsOpen: { type: Boolean },
    ready: { type: Boolean },
    total: { type: Number }, // total number of publicatons
    found: { type: Number }, // number of publications found by current search
    limit: { type: Number }, // max publications
    histogramPeriod: { type: String },
  };

  static styles = styles;

  constructor() {
    super();

    this.lang = "en";
    this.filters = new Map();
    this.variant = "cards";
    this.years = yearsSet();
    this.pubs = [];
    this.sort = "published";
    this.sortdir = -1;
    this.selected = new Map();
    this.limit = 24;
    this.q = "";
    this.histogramPeriod = "2000/";
  }

  get ready() {
    return size() > 0;
  }

  firstUpdated() {
    // Handle startup with query params
    //setHeadTitle("Publications");
    const params = new URLSearchParams(window.location.search);
    const isFilterParam = (k) => !["q", "limit", "sort"].includes(k);
    const isBoolOrNull = (v) => ["null", "true", "false"].includes(String(v));

    for (const [k, v] of params) {
      if (isFilterParam(k)) {
        const set = this.selected.get(k) ?? new Set();
        if (["years"].includes(k)) {
          v.split(",")
            .map(Number)
            .map((n) => set.add(n));
        } else {
          set.add(isBoolOrNull(v) ? JSON.parse(v) : v);
        }
        this.selected.set(k, set);
      } else if (params.has("q")) {
        this.q = params.get("q");
      } else if (params.has("sort")) {
        this.sort = params.get("sort");
      }
    }
    this.search();
  }

  setSelected(what, value) {
    const { q, selected } = this;
    const set = new Set([value]);
    this.selected.set(what, set);
    this.updateURL(what);
    this.search();
  }

  updateSelected(what, value) {
    const { q, selected } = this;
    const set = selected.get(what) ?? new Set();
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
    this.selected.set(what, set);
    this.updateURL(what);
    this.search();
  }

  updateURL(what) {
    const { selected } = this;
    const set = selected.get(what) ?? new Set();
    const { searchParams } = new URL(document.location);
    if (set.size === 0) {
      searchParams.delete(what);
    } else {
      searchParams.set(what, [...set]);
    }
    const params = Object.fromEntries(searchParams);
    history.replaceState(params, "search", "?" + searchParams);
  }

  handleSortSelected({ target: { value } }) {
    if (value?.length) {
      this.sort = value;
      const { searchParams } = new URL(document.location);
      searchParams.set("sort", value);
      const params = Object.fromEntries(searchParams);
      history.replaceState(params, "search", "?" + searchParams);
      this.search();
      //this.requestUpdate();
    }
  }

  handleSearchInput({ target: { value } }) {
    const { searchParams } = new URL(document.location);
    searchParams.set("q", value);
    const params = Object.fromEntries(searchParams);
    history.replaceState(params, "search", "?" + searchParams);
    this.q = value;

    if (this.q.length < 5) {
      this.limit = /^[0-9]{4}$/.test(this.q) || fnlt5.includes(this.q)
        ? 200
        : 12;
    } else {
      this.limit = 200;
    }

    this.search();
  }

  async search() {
    const { ready } = this;

    if (ready) {
      const { q, selected, limit, sort, sortdir } = this;

      const { searchParams } = new URL(document.location);
      const params = Object.fromEntries(searchParams);
      params.limit = limit;
      params.q = q;
      params.filter = filterFactory({ selected });
      params.selected = selected;
      params.sort = sort;
      params.sortdir = sortdir;

      const { docs, total, found, ...rest } = await search({ params });

      this.total = total;
      this.found = found;
      this.pubs = docs.map(({ title, ...rest }) => ({
        ...rest,
        title: emphasizeSpecies({ text: title }),
      }));
      //setHeadTitle(q?.length > 0 ? `Publications [${q}]` : `Publications`);
      this.doi = undefined;
      if (docs?.length === 0 && /10\.[0-9]{4,}\/.+/.test(q)) {
        const doi = "10." + q.split("10.")[1];
        if (!has(doi)) {
          this.doi = doi;
        }
      }
    }
  }

  toggleMenu() {
    this.menuIsOpen = !this.menuIsOpen;
  }

  toggleHistogramPeriod() {
    this.histogramPeriod = this.histogramPeriod === "2000/" ? "/2000" : "2000/";
  }

  toggleSortDir(e) {
    this.sortdir = -1 * this.sortdir;
    this.search();
  }

  renderYearFilters({ onlyIfSelected = false } = {}) {
    const sort = (a, b) => a - b;
    const { years, selected } = this;
    const set = selected.get("years") ?? new Set();

    return (
      [...years]
        .sort(sort)
        //.filter(filter)
        .map(
          (year) =>
            html`<mwc-button
              class="${set.has(year) ? "red" : ""}"
              icon="${set.has(year) ? "highlight_off" : ""}"
              @click="${() => {
              this.updateSelected("years", year);
            }}"
              label="${year}"
              outlined
            >
            </mwc-button>`,
        )
    );
  }

  renderFilterButtons({ name, onlyIfSelected = false, list } = {}) {
    const { selected } = this;
    const set = selected.get(name) ?? new Set();

    return [...list]
      .filter((k) => (onlyIfSelected ? selected.has(name) && set.has(k) : true))
      .map(
        (k) =>
          html`<mwc-button
            style="--mdc-typography-button-text-transform: none; white-space: nowrap;"
            class="${set.has(k) ? "red" : ""}"
            icon="${set.has(k) ? "highlight_off" : ""}"
            @click="${() => this.updateSelected(name, k)}"
            label="${k}"
            outlined
          >
          </mwc-button>`,
      );
  }

  render() {
    const {
      years,
      pubs,
      tags,
      type_of_media,
      menuIsOpen,
      lang,
      variant,
      selected,
      filters,
      params,
      found,
      total,
      q,
      histogramPeriod,
      sort,
      sortdir,
    } = this;

    const ready = size() > 0;
    const dir = sortdir;
    const selectedYears = this.selected.get("years") ?? new Set();

    return html`<apn-app-nav class="hide-large" activeIndex="1"></apn-app-nav>
      <article class="mdc-typography" style="padding: 4px;">
        <nav>
          <div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));"
          >
            <span
              class="headline4"
              style="--apn-primary: rgb(var(--apn-red)); padding: 4px;"
            >
              <a href="/pubs">${t("title", lang)} </a>
              <mwc-icon-button
                @click="${() => (this.menuIsOpen = !menuIsOpen)}"
                class="secondary"
                icon="filter_center_focus"
                _icon="filter_tilt_shift"
              >
              </mwc-icon-button>

              <span
                class="mdc-typography--body1"
                ?hidden="${!ready}"
                style="color: var(--apn-secondary);"
              >
                <mwc-icon-button
                  title="${
      /card/.test(this.variant) ? "View as list of references" : "View as cards"
    }"
                  icon="${
      /card/.test(this.variant) ? "format_quote" : "dashboard"
    }"
                  @click="${
      /card/.test(this.variant)
        ? () => (this.variant = "list")
        : () => (this.variant = "cards")
    }"
                ></mwc-icon-button>

                <mwc-icon-button-toggle
                  title="${
      sortDirTitle({
        key: sort,
        dir: -1 * sortdir,
        lang,
      })
    }"
                  onicon="sort"
                  @click="${this.toggleSortDir}"
                  ?on="${sortdir === 1}"
                >
                  <svg slot="offIcon">
                    <path
                      fill="currentColor"
                      d="M3 11H15V13H3M3 18V16H21V18M3 6H9V8H3Z"
                    />
                  </svg>
                </mwc-icon-button-toggle>

                <div style="position: relative">
                  <mwc-menu hasHeader type="modal" ?open=${menuIsOpen}>
                    <dl>
                      <dt><mwc-button disabled>Years</mwc-button></dt>
                      <dd>${this.renderYearFilters()}</dd>
                    </dl>
                    <dl>
                      <dt><mwc-button disabled>Type</mwc-button></dt>
                      <dd>
                        ${
      this.renderFilterButtons({
        name: "type",
        list: types,
      })
    }
                      </dd>
                    </dl>
                    <dl>
                      <dt><mwc-button disabled>License</mwc-button></dt>
                      <dd>
                        ${
      this.renderFilterButtons({
        name: "license",
        list: licenses,
      })
    }
                      </dd>
                    </dl>
                  </mwc-menu>
                </div>
              </span>
            </span>
            <!-- <h2 class="headline6">
            <a>
              <mwc-icon role="presentation" label="official"></mwc-icon>
              <span> journal articles </span>
            </a>
          </h2> -->
            ${
      ready
        ? html`<mwc-textfield
                  type="search"
                  autofocus
                  autocomplete="false"
                  outlined
                  placeholder="${
          ready
            ? `${`Find by title, year, author, journal, type, or DOI`}`
            : `loading…`
        }"
                  helper="${helper(this)}"
                  iconTrailing="search"
                  @input="${this.handleSearchInput}"
                  value="${q}"
                ></mwc-textfield>`
        : html`<mwc-circular-progress
                  ?indeterminate=${!ready}
                ></mwc-circular-progress>`
    }
          </div>
        </nav>
        ${
      this.doi
        ? html`<a class="headline4" href="/doi/${this.doi}">${this.doi}</a>`
        : html`<div>
              <mwc-icon-button-toggle
                onicon="arrow_forward"
                officon="arrow_back"
                @click="${this.toggleHistogramPeriod}"
              ></mwc-icon-button-toggle>

              <apn-pubs-histogram
                .selected=${selectedYears}
                period="${histogramPeriod}"
                label="↑ publications per year"
                @year-click="${({ detail: { year } }) => {
          this.updateSelected("years", year);
        }}"
              ></apn-pubs-histogram>

              ${found} of ${total},

              <label for="sort-select">sorted on</label>
              <select
                id="sort-select"
                slot="label"
                @change="${this.handleSortSelected}"
              >
                ${sortOption({ key: "published", sort, dir })}
                ${sortOption({ key: "title", sort, dir })}
                ${
          sortOption({
            key: "container",
            label: "Journal / Container",
            sort,
            dir,
          })
        }
                ${
          sortOption({
            key: "_authors",
            label: "Authors",
            sort,
            dir,
          })
        }
                ${
          sortOption({
            key: "cites",
            label: "Citations",
            sort,
            dir,
          })
        }</select
              >
            </div>`
    }
        ${renderResults({ host: this })}
      </article>`;
  }
}
