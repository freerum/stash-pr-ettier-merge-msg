/**
 * Updates the PR Merge message on page load
 */

/**
 * Gets the Merge Button element
 * @returns {HTMLButtonElement | undefined} Merge Button Element
 */
function getMergeButton() {
    const collection = document.getElementsByClassName('merge-button');
    if (collection && collection.length === 1 && collection[0].nodeName === 'BUTTON') {
        return collection[0];
    }
}

// find the Merge button and listen to its click event to update the merge message
const mergeButton = getMergeButton();
if (mergeButton) {
    mergeButton.onclick = function () {
        const pr = getPR();
        updateMergeMessage(pr.id, pr.title, pr.description);
    };
}

/**
 * Content scripts are isolated from the underlying page, so we have to use the DOM or postMessage in order to
 * communicate between the two, you can't just read variables (like `require`) directly from the page.
 *
 * So to extract the PR information, we inject a script into the page that puts the PR info in the body's dataset.
 * Then we can read it from the content script and clean it all up.
 */
function getPR() {
    const scriptContent = `
        (() => {
            const pr = require('bitbucket/internal/feature/pull-request/store/pull-request-store').getState().pullRequest;
            document.body.dataset.pr = JSON.stringify(pr);
        })();
    `;

    const script = document.createElement('script');
    script.appendChild(document.createTextNode(scriptContent));
    document.body.appendChild(script);

    const pr = JSON.parse(document.body.dataset.pr);

    document.body.dataset.pr = undefined;
    document.body.removeChild(script);

    return pr;
}
