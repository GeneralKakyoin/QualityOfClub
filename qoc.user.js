// ==UserScript==
// @name Quality of Club
// @namespace https://www.bondageprojects.com/
// @version 1.0.0
// @description Quality of life improvements for Bondage Club
// @author Matti
// @match *://*.bondageprojects.elementfx.com/*
// @match *://bondageprojects.elementfx.com/*
// @match *://*.bondage-europe.com/*
// @match *://bondage-europe.com/*
// @match *://*.bondageeurope.com/*
// @match *://bondageeurope.com/*
// @match *://*.bondageprojects.com/*
// @match *://bondageprojects.com/*
// @include /^https?:\/\/[^\/]*bondage[^\/]*\/.*$/
// @run-at document-end
// @grant none
// ==/UserScript==

setTimeout(function () {
    let n = document.createElement("script");
    n.setAttribute("language", "JavaScript");
    n.setAttribute("crossorigin", "anonymous");
    n.setAttribute("src", "https://generalkakyoin.github.io/QualityOfClub/bundle.js");
    n.onload = () => n.remove();
    document.head.appendChild(n);
}, 1000);
