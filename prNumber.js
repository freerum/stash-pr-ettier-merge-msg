/**
 * Finds the Pull Request number
 * @returns {number|null}
 */
function getPullRequestNumber() {
    const logger = getLogger('getPullRequestNumber()');

    const titleCollection = document.getElementsByTagName('title');
    const title = titleCollection.length === 1 && titleCollection[0];
    const titleText = title && title.innerText;

    // prettier-ignore
    logger.debug('title collection.length=', titleCollection.length, 'title=', title, 'title text=', titleText );

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
                logger.debug('PR Number found:', prNumber);
                return prNumber;
            }
        }
    }

    logger.error(errors.PR_NUM_NOT_FOUND);
    return null;
}
