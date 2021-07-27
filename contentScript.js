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
        const prTitle = getPullRequestTitle();
        const prNumber = getPullRequestNumber();
        const prDesc = getPullRequestDescription();
        updateMergeMessage(prTitle, prNumber, prDesc);
    };
}
