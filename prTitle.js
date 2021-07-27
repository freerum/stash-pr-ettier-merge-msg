/**
 * Finds the title for the Pull Request
 * @returns {string|null}
 */
function getPullRequestTitle() {
    const logger = getLogger('getPullRequestTitle()');

    const prHeader = document.getElementById('pull-request-header');
    logger.debug('prHeader=', prHeader);

    if (!prHeader) {
        logger.error(errors.PR_TITLE_HEADER_NOT_FOUND);
        return null;
    }

    const h2Collection = prHeader.getElementsByTagName('h2');
    const prTitle = h2Collection.length === 1 && h2Collection[0];
    logger.debug('h2 collection.length = ', h2Collection.length, 'prTitle=', prTitle);

    if (!prTitle) {
        logger.error(errors.PR_TITLE_H2_NOT_FOUND);
        return null;
    }

    logger.debug('PR title found: ', prTitle.innerText);
    return prTitle.innerText;
}
