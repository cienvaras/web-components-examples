class Tabs extends HTMLElement {
  constructor() {
    super();
    // Get all child panes.
    this.panes = this.querySelectorAll('div');
  }

  connectedCallback() {
    // Wrapper element.
    const wrapper = document.createElement('div');

    // Create the tabs.
    this.links = Array.from(this.panes).map((pane) => {
      const link = document.createElement('a');
      link.classList.add('tab-link');
      link.textContent = pane.getAttribute('title');
      link.setAttribute('href', `#${pane.id}`);
      link.setAttribute('data-pane-id', pane.id);
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this.panes.forEach((p) => {
          if (p.id === event.currentTarget.getAttribute('data-pane-id')) {
            p.setAttribute('data-pane-visible', '');
          } else {
            p.removeAttribute('data-pane-visible');
          }
        });
        this.links.forEach((l) => {
          l.removeAttribute('data-tab-active');
        });
        event.currentTarget.setAttribute('data-tab-active', '');
      });
      return link;
    });

    // Create the tab list and add the tabs to it.
    const linkList = document.createElement('ul');
    linkList.classList.add('tab-list');
    this.links.forEach((link) => {
      const li = document.createElement('li');
      li.classList.add('tab');
      li.appendChild(link);
      linkList.appendChild(li);
    });
    wrapper.appendChild(linkList);

    // Create the pane container and add the panes.
    const paneContainer = document.createElement('div');
    paneContainer.classList.add('pane-container');
    // The first element is visible by default.
    this.panes[0].setAttribute('data-pane-visible', '');
    this.links[0].setAttribute('data-tab-active', '');
    this.panes.forEach((pane) => {
      paneContainer.appendChild(pane);
    });
    wrapper.appendChild(paneContainer);

    // Styles.
    const style = document.createElement('style');
    style.textContent = `
      :host {
        --tab-link-text-color: #333;
        --tab-link-background-color: #fff;
      }
      .pane-container > div {
        display: none;
      }

      .pane-container > div[data-pane-visible] {
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

    // Create the shadow DOM.
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
  }
}

customElements.define('fk-tabs', Tabs);
