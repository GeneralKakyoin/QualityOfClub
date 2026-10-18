// ==UserScript==
// @name Quality of Club
// @namespace https://www.bondageprojects.com/
// @version 1.0.16
// @description Quality of life improvements for Bondage Club
// @author Matti
// @match *://*.bondageeurope.com/*
// @match *://bondageeurope.com/*
// @match *://*.bondage-europe.com/*
// @match *://bondage-europe.com/*
// @match *://*.bondageprojects.com/*
// @match *://bondageprojects.com/*
// @match *://*.bondageprojects.elementfx.com/*
// @match *://bondageprojects.elementfx.com/*
// @match https://www.bondageeurope.com/*
// @match https://www.bondageeurope.com/R*/*
// @include *://*bondage*/*
// @run-at document-end
// @grant none
// @updateURL https://raw.githubusercontent.com/GeneralKakyoin/QualityOfClub/main/qoc.user.js
// @downloadURL https://raw.githubusercontent.com/GeneralKakyoin/QualityOfClub/main/qoc.user.js
// ==/UserScript==

setTimeout(function () {
    let n = document.createElement("script");
    n.setAttribute("language", "JavaScript");
    n.setAttribute("crossorigin", "anonymous");
    n.setAttribute("src", "https://generalkakyoin.github.io/QualityOfClub/bundle.js?v=" + Date.now());
    n.onload = () => n.remove();
    document.head.appendChild(n);
}, 1000);
