/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {AmpInsticator} from '../amp-insticator';

describes.realWin('amp-insticator', {
  amp: {
    extensions: ['amp-insticator'],
  },
}, env => {

  let win;
  let doc;
  let ampInsticator;
  let layoutCallbackSpy;
  let getRequestSpy;

  function getAmpInsticatior() {
    const ampInsticator = doc.createElement('amp-insticator');
    ampInsticator.setAttribute('data-embed-id', '5bf0548f-a332-4934-9d35-c9ca9e93d4ff')
    doc.body.appendChild(ampInsticator);

    //Seting up spys
    getRequestSpy = env.sandbox.spy(ampInsticator.implementation_, 'getRequest');

    return ampInsticator.build()
    .then( () => ampInsticator.layoutCallback() )
    .then( () => ampInsticator );
  }

  beforeEach(async function() {
    win = env.win;
    doc = win.document;
    ampInsticator = await getAmpInsticatior();
    });

  it('renders', function() {
    expect(ampInsticator).to.not.be.undefined;
    expect(ampInsticator).to.not.be.null;
    const iframe = ampInsticator.querySelector('iframe');
    console.log(iframe.contentWindow.document.head ? 'there is a head' : 'there is nothing in the iframe');
    expect(iframe).to.not.be.undefined;
    expect(iframe).to.not.be.null;
  });

  it('makes a request for ads data was made correctly', function() {
    //we'll read the url property from the real instance
    const obj = ampInsticator.implementation_;
    expect(getRequestSpy).to.be.calledOnce;
    const argumentsPassedToGetRequest = getRequestSpy.args[0];
    const requestedUrl = argumentsPassedToGetRequest[0];
    expect(requestedUrl).to.include(obj.url.ads);
    expect(argumentsPassedToGetRequest[1]).to.be.a('function');
  });

  it('removes iframe on unlayoutCallback()', function() {
    const iframe = ampInsticator.querySelector('iframe');
    expect(iframe).to.not.be.undefined;
    expect(iframe).to.not.be.null;
    const obj = ampInsticator.implementation_;
    obj.unlayoutCallback();
    expect(ampInsticator.querySelector('iframe')).to.be.null;
  });
});
