// ==UserScript==
// @name			Stack Exchange - replace some words
// @namespace		https://github.com/PurpleMagick/
// @description		Replaces the word "folk" with other "people"
// @author			VLAZ
// @version			1
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
//       match                 replacement
	[/\b(f)olks\b/ig,          (_, first) => {
		let p = "p";
		if (first.toUpperCase() === first)
			p = "P";

		return p + "eople";
	}]
]);

const runReplacements = searchAndReplace(rules);

function searchAndReplace(replacementConfig) {
	return function replaceAllWords(textNode) {
		let result = textNode.nodeValue;

		for(const [regex, replacement] of replacementConfig) {
			result = result.replace(regex, replacement);
		}

		textNode.textContent = result;
	};
}

function main(startNode) {
	const walker = document.createTreeWalker(startNode, NodeFilter.SHOW_TEXT, null, false);

	let node;
	// eslint-disable-next-line no-cond-assign
	while(node = walker.nextNode()) {
		runReplacements(node);
	}
}

const callback = function(mutationsList) {
	for(let mutation of mutationsList) {
		const newNodesAdded = mutation.type === "childList" && mutation.addedNodes.length > 0;
		const textChanged = mutation.type === "characterData";

		if (newNodesAdded || textChanged){
			main(mutation.target);
		}
	}
};

const observer = new MutationObserver(callback);

//run once for the page initially
main(document.body);

//set up observer to re-run on future modifications
const config = { characterData: true, childList: true, subtree: true };
observer.observe(document.body, config);
