/**
 * Replaces the default merge commit message with the one provided
 * @param {string} title          The merge commit message
 * @param {number} id         The Pull Request Number
 * @param {string} description    The Pull Request details
 */
function updateMergeMessage(id, title, description) {
    const logger = getLogger('updateMergeMessage()');

    if (!title || !id) {
        logger.error(!id ? errors.PR_MERGE_MSG_PR_ID_PARAM_MISSING : errors.PR_MERGE_MSG_PR_TITLE_PARAM_MISSING);
        return;
    }

    const prCommitMessage = document.querySelector('textarea[aria-label="Commit description"]');
    if (!prCommitMessage) {
        logger.error(errors.PR_MERGE_MSG_TARGET_NOT_FOUND);
        return;
    }

    const titleWithPR = title + (id ? ` (PR #${id})` : '');
    const commitMessage = titleWithPR + '\n\n' + (description ?? '');

    logger.debug('PR Merge Commit Message changed from "', prCommitMessage.value, '" to:', commitMessage);

    prCommitMessage.value = commitMessage;
}
