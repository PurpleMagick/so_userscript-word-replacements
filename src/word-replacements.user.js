// ==UserScript==
// @name			Stack Exchange - replace some words
// @namespace		https://github.com/PurpleMagick/
// @description		Replaces the word "folk" with other "people"
// @author			VLAZ
// @version			0.0.1
//
// @include			/^https:\/\/(?:meta\.)?stackoverflow\.com/
// @include			/^https:\/\/(?:meta\.)?serverfault\.com/
// @include			/^https:\/\/(?:meta\.)?superuser\.com/
// @include			/^https:\/\/(?:meta\.)?askubuntu\.com/
// @include			/^https:\/\/(?:meta\.)?mathoverflow\.net/
// @include			/^https:\/\/(?:meta\.)?stackapps\.com/
// @include			/^https:\/\/(?:[^\/.]+\.)(?:meta\.)?stackexchange\.com/
//
// @exclude			https://chat.stackexchange.com
// @exclude			https://chat.meta.stackexchange.com
// @exclude			https://api.stackexchange.com
// @exclude			https://data.stackexchange.com
//
// @grant			none
// ==/UserScript==

const rules = new Map([
//   match                         replacement
	[/\b(f)olks\b/ig,          (_, first) => {
		let p = "p";
		if (first.toUpperCase() === first)
			p = "P";

		return p + "eople";
	}]
]);

const runReplacements = searchAndReplace(rules);
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

let node;
// eslint-disable-next-line no-cond-assign
while(node = walker.nextNode()) {
	runReplacements(node);
}

function searchAndReplace(what) {
	return function(textNode) {

		let result = textNode.nodeValue;
		for(const [regex, replacement] of what) {
			result = result.replace(regex, replacement);
		}
		textNode.textContent = result;
	};
}