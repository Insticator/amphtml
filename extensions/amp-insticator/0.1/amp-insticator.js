/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/* ++++++++++ --------------- IMPORTS --------------- ++++++++++ */
import { Layout } from '../../../src/layout';
import { setStyles } from '../../../src/style';



/* ++++++++++ --------------- EXPORT AMP-INSTICATOR --------------- ++++++++++ */
export class AmpInsticator extends AMP.BaseElement {


  // ..... CONSTRUCTOR ..... //
  constructor(element) {
    super(element);
    this.iFrameElement = null; // amp requirement
    this.url = {
      ads: 'https://drhn9v8cwg89y.cloudfront.net',
      embed: 'https://d3lcz8vpax4lo2.cloudfront.net'
    }
  }


  // ~~~~~ AMP METHODs ~~~~~ //
  preconnectCallback() {
    // define preconnect first
    const {preconnect} = this;
    // app code and ads settings served from here
    preconnect.url(this.urls.local);
  }
  buildCallback() {
    // create markup structure
    const template = this.createTemplate(this.createInitialMarkup());

    // append markup structure to DOM
    this.appendElement(this.element, template);
  }
  layoutCallback() {
    // get data attribute from the amp-insticator tag
    const embedId = this.element.getAttribute('embed-id');
    // store DOM elements
    const insticatorContainer = this.element.querySelector('#insticator-container'); 
    const embedIframe = this.iFrameElement = this.element.querySelector('#insticator-iframe');
    const embedApp = this.createElement(this.element.ownerDocument, 'div', { id: 'app' });
    const embedScript = this.createElement(this.element.ownerDocument, 'script', { type: 'text/javascript', src: `${this.url.embed}/embed-code/${embedId}.js` });
    
    // append iframe
    this.appendElement(this.element.querySelector('#insticator-embed'), embedIframe);

    // append content to iframe
    this.appendElement(embedIframe.contentWindow.document.body, embedApp);
    this.appendElement(embedIframe.contentWindow.document.head, embedScript);

    // append ads
    this.getRequest(`${this.url.ads}/test/ad_settings/${embedId}.js`, (ads) => this.appendAds(ads));

    // apply custom styles
    setStyles(embedIframe, { 'height': '350px' }); // this needs to be dynamic, recalculated from the child iframe (where we have height specified via settings files)
    setStyles(insticatorContainer, { 'text-align': 'center' });
  }
  isLayoutSupported(layout) {
    return layout == Layout.CONTAINER;
  }


  // ----- CUSTOM FUNCTIONs ----- //
  getRequest(file, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => xhr.readyState == 4 && xhr.status == 200 ? callback(JSON.parse(xhr.responseText)) : null;
    xhr.open('GET', file, true);
    xhr.send();
  }
  createTemplate(domString) {
    const template = document.createElement('template');
    template.innerHTML = domString;
    return template.content;
  }
  createElement(location, el, attrs) {
    const newEl = location.createElement(el);
    Object.entries(attrs).forEach(attr => newEl.setAttribute(attr[0], attr[1]));
    return newEl;
  }
  appendElement(location, el) {
    location.appendChild(el);
  }
  appendAds(ads) {
    Object.entries(ads).forEach(ad => this.appendElement(this.element.querySelector(`#div-insticator-ad-${ad[0][ad[0].length -1]}`), this.createElement(this.element.ownerDocument, 'amp-ad', ad[1])));
  }
  createInitialMarkup() {
    // replicates our standard setup
    return `
      <div id="insticator-container">
        <div id="div-insticator-ad-1"></div>
        <div id="insticator-embed">
          <iframe id="insticator-iframe" scrolling="no" frameborder="0" allowtransparency="true"></iframe>
        </div>
        <div id="div-insticator-ad-2"></div>
      </div>
    `;
  }
  renderContent(el) {
    this.applyFillContent(el, true); /* replacedContent */
  }
}



/* ++++++++++ --------------- EXTEND AMP --------------- ++++++++++ */
AMP.extension('amp-insticator', '0.1', AMP => {
  AMP.registerElement('amp-insticator', AmpInsticator);
});
