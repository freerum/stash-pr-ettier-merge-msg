/**
 * Replaces the default merge commit message with the one provided
 * @param {string} message          The merge commit message
 * @param {number} prNumber         The Pull Request Number
 * @param {string} prDescription    The Pull Request details
 */
function updateMergeMessage(message, prNumber, prDescription) {
    const logger = getLogger('updateMergeMessage()');

    if (!message || !prNumber) {
        logger.error(!prNumber ? errors.PR_MERGE_MSG_PRNUM_PARAM_MISSING : errors.PR_MERGE_MSG_PRMSG_PARAM_MISSING);
        return;
    }

    const prCommitMessage = document.getElementById('commit-message');
    if (!prCommitMessage) {
        logger.error(errors.PR_MERGE_MSG_TARGET_NOT_FOUND);
        return;
    }

    const prNumberDesc = prNumber ? ` (PR #${prNumber})` : '';
    const commitMessageHeading = `${message}${prNumberDesc}`;
    const commitMessageBody = prDescription ? `\n\n${prDescription}` : '';
    const commitMessage = `${commitMessageHeading}${commitMessageBody}`;

    logger.debug('PR Merge Commit Message changed from "', prCommitMessage.textContent, '" to:', commitMessage);

    prCommitMessage.textContent = commitMessage;

    // update the 'data-original-value' attribute too so that canceling the merge dialog
    // and re-opening it won't switch the merge message back to the default message.
    prCommitMessage.setAttribute('data-original-value', commitMessage);
}
