import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Tabs element.
 *
 */
@customElement('fk-tabs')
export class FkTabs extends LitElement {
  // List of panes.
  @property({ type: Object, attribute: false })
  panes: NodeListOf<HTMLDivElement>;

  @property({ type: String, attribute: false }) activePaneId: string;

  constructor() {
    super();
    // Get child panes.
    this.panes = this.querySelectorAll('div');
    // First pane is active by default.
    this.activePaneId = this.panes[0].id;
  }

  // This function renders the component.
  render() {
    // Update pane visibility.
    this.panes.forEach((pane) => {
      if (pane.id === this.activePaneId) {
        pane.setAttribute('data-pane-visible', '');
      } else {
        pane.removeAttribute('data-pane-visible');
      }
    });

    // Create list of tabs.
    const tabs = Array.from(this.panes).map(
      (pane) => html`
        <li class="tab">
          <a
            href="#${pane.id}"
            class="tab-link"
            data-pane-id="${pane.id}"
            ?data-tab-active=${pane.id === this.activePaneId}
            @click=${this._tabClickHandler}
            >${pane.getAttribute('title')}</a
          >
        </li>
      `,
    );

    return html`
      <div>
        <ul class="tab-list">
          ${tabs}
        </ul>
        <div class="pane-container">
          <slot></slot>
        </div>
      </div>
    `;
  }

  // Event handler for tab click.
  private _tabClickHandler(event: Event) {
    event.preventDefault();
    const target = event.currentTarget as HTMLLinkElement;
    const paneId = target.getAttribute('data-pane-id');
    if (paneId && paneId !== this.activePaneId) this.activePaneId = paneId;
  }

  // Styles.
  static styles = css`
    :host {
      --tab-link-text-color: #333;
      --tab-link-background-color: #fff;
    }

    ::slotted(div) {
      display: none;
    }

    ::slotted(div[data-pane-visible]) {
      display: block;
    }

    .tab-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
    }

    .tab {
      margin-right: 10px;
    }

    .tab-link {
      text-decoration: none;
      display: block;
      color: var(--tab-link-text-color);
      background-color: var(--tab-link-background-color);
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    .tab-link:hover {
      color: #666;
    }

    .tab-link[data-tab-active] {
      color: #000;
      font-weight: bold;
      background-color: #f0f0f0;
    }
  `;
}
