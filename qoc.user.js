// ==UserScript==
// @name Quality of Club
// @namespace https://www.bondageprojects.com/
// @version 1.0.0
// @description Quality of life improvements for Bondage Club
// @author Matti
// @match https://bondageprojects.elementfx.com/*
// @match https://www.bondageprojects.elementfx.com/*
// @match https://bondage-europe.com/*
// @match https://www.bondage-europe.com/*
// @match https://bondageprojects.com/*
// @match https://bondageprojects.com/*
// @match http://localhost:*/*
// @run-at document-end
// @grant none
// ==/UserScript==

(function() {
    setTimeout(function() {
        const script = document.createElement("script");
        script.setAttribute("language", "JavaScript");
        script.setAttribute("crossorigin", "anonymous");
        script.setAttribute("src", "https://generalkakyoin.github.io/QualityOfClub/bundle.js");
        script.onload = () => script.remove();
        document.head.appendChild(script);
    }, 1500);
})();
