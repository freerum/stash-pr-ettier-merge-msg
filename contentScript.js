const EXTENSION_NAME = 'stash-pr-ettier-merge-message';

/**
 * Logs a message to the console prefixed with the name of the extension and the function
 * @param {string} functionName     The calling function's name (but could be anything)
 * @param  {...any} rest            The rest of the arguments for console.log
 */
function log(functionName, ...rest) {
    console.log(`[${EXTENSION_NAME}] ${functionName}:`, ...rest);
}

/**
 * Finds the Pull Request number
 * @returns {number|null}
 */
function getPullRequestNumber() {
    const titleCollection = document.getElementsByTagName('title');
    const title = titleCollection.length === 1 && titleCollection[0];
    const titleText = title && title.innerText;

    // prettier-ignore
    log(getPullRequestNumber.name,
        'title collection.length=', titleCollection.length,
        'title=', title,
        'title text=', titleText
    );

    if (titleText) {
        // Title text is typically a string like this:
        //   Pull Request #44523: UX Fixes
        // Parse it and get the number
        const startIndex = titleText.indexOf('#') + 1;
        const endIndex = titleText.indexOf(':');
        if (startIndex && endIndex && endIndex > startIndex) {
            const prNumberString = titleText.substring(startIndex, endIndex);
            const prNumber = parseInt(prNumberString, 10);
            if (prNumber > 0) {
                log(getPullRequestNumber.name, 'PR Number found:', prNumber);
                return prNumber;
            }
        }
    }

    log(getPullRequestNumber.name, 'PR Number NOT found');
    return null;
}

/**
 * Finds the title for the Pull Request
 * @returns {string|null}
 */
function getPullRequestTitle() {
    const prHeader = document.getElementById('pull-request-header');
    log(getPullRequestTitle.name, 'prHeader=', prHeader);

    if (prHeader) {
        const h2Collection = prHeader.getElementsByTagName('h2');
        const prTitle = h2Collection.length === 1 && h2Collection[0];
        log(getPullRequestTitle.name, 'h2 collection.length = ', h2Collection.length, 'prTitle=', prTitle);

        if (prTitle) {
            log(getPullRequestTitle.name, 'PR title found: ', prTitle.innerText);
            return prTitle.innerText;
        }
    }

    log(getPullRequestTitle.name, 'PR title NOT found');
    return null;
}

/**
 * Replaces the default merge commit message with the one provided
 * @param {string} message  The merge commit message
 * @param {number} prNumber The Pull Request Number
 */
function updateMergeMessage(message, prNumber) {
    const prCommitMessage = document.getElementById('commit-message');

    if (prCommitMessage) {
        const prevMessage = prCommitMessage.innerText;
        if (message) {
            const prNumberDesc = prNumber ? ` (PR #${prNumber})` : '';
            prCommitMessage.innerText = `${message}${prNumberDesc}`;
        }

        // prettier-ignore
        log(updateMergeMessage.name,
            'PR Merge Commit Message changed from "', prevMessage,
            '" to:', prCommitMessage.innerText
        );
    } else {
        log(updateMergeMessage.name, 'FAILED to update PR Merge Commit Message');
    }
}

const prTitle = getPullRequestTitle();
const prNumber = getPullRequestNumber();

// The PR Merge Dialog is already part of the document so we can update it as soon as the page loads
// instead of after the Merge Button is clicked.
updateMergeMessage(prTitle, prNumber);
