const errors = {
    PR_NUM_NOT_FOUND: {
        message: 'Pull Request number could not be determined.',
        code: 'PR-MSG-01',
    },
    PR_TITLE_HEADER_NOT_FOUND: {
        message: 'Pull Request title not found.',
        code: 'PR-MSG-02',
    },
    PR_TITLE_H2_NOT_FOUND: {
        message: 'Pull Request title not found.',
        code: 'PR-MSG-03',
    },
    PR_MERGE_MSG_PR_ID_PARAM_MISSING: {
        message: 'Pull Request merge message not updated because of missing PR Number.',
        code: 'PR-MSG-04',
    },
    PR_MERGE_MSG_PR_TITLE_PARAM_MISSING: {
        message: 'Pull Request merge message not updated because of missing PR description.',
        code: 'PR-MSG-05',
    },
    PR_MERGE_MSG_TARGET_NOT_FOUND: {
        message: 'Pull Request merge message field not found.',
        code: 'PR-MSG-06',
    },
};

/**
 * Gets a logger with a defined prefix
 * @param {string} prefix     The prefix to attach to each log that this logger generates.
 *                            Example: The calling function's name.
 */
function getLogger(prefix) {
    return {
        /**
         * Logs a message to the console prefixed with the name of the extension and the function
         * This is meant to be used for debugging. Enable the function as needed.
         * @param {any[]} rest              The rest of the arguments for console.log
         */
        debug: function info(...rest) {
            // console.log(`[stash-pr-ettier-merge-message] ${prefix}:`, ...rest);
        },

        /**
         * Logs an Error message to the console
         * @param {object} errorDetails     The error object.
         */
        error: function error(errorDetails) {
            const { message, code } = errorDetails;
            console.error(`[stash-pr-ettier-merge-message] ${code}: ${message}`);
        },
    };
}
