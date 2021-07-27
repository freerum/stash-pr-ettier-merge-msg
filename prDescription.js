/**
@typedef NodeConfig
@property {number} indentLevel      The indent level (0: none) of the node
@property {boolean} isList          If the node is part of an ordered or unordered list.
@property {number} listLevel        The nesting level for the list (if any) that this node is part of
@property {boolean} isOrderedList   If the list that the node is part of is an ordered list.
@property {number} listItemNum      The list item number for the ordered list item that this node may be part of
*/

/**
 * Returns an "underline" text for a given heading level
 * @param {number} headingLevel     A heading level in the 1 to 6 range.
 * @returns {string}
 */
function getHeadingUnderline(headingLevel) {
    if (headingLevel === 1) {
        return '==='.repeat(6);
    }

    if (headingLevel > 1 && headingLevel <= 6) {
        return '---'.repeat(7 - headingLevel);
    }

    return '---';
}

/**
 * Collapses multiple blank lines in the text into single blank line.
 * @param {string} text             The text to format
 * @param {number} [collapseTo=1]   How many new lines to collapse to. Defaults to 1
 * @returns {string}
 */
function collapseNewLines(text, collapseTo = 1) {
    if (typeof text !== 'string' || text.length === 1) {
        return text;
    }

    // first remove spaces from lines that have only spaces
    // (a result of applied indenting)
    let trimmedText = text;
    while (/\n +\n/.test(trimmedText)) {
        trimmedText = trimmedText.replaceAll(/\n +\n/g, '\n\n');
    }

    // next collapse `collapseTo + 1` or more newlines into `collapseTo` newlines
    const tooManyAdjacentNewlines = '\n'.repeat(collapseTo + 1);
    const collapsedAdjacentNewlines = '\n'.repeat(collapseTo);
    while (trimmedText.includes(tooManyAdjacentNewlines)) {
        trimmedText = trimmedText.replaceAll(tooManyAdjacentNewlines, collapsedAdjacentNewlines);
    }

    return trimmedText;
}

/**
 * Indents text contents
 * @param {string} text         The text to be indented
 * @param {NodeConfig} config   Config for the node
 * @param {string} nodeName     Name of the node
 * @returns {string} The indented text.
 */
function indentText(text, config, nodeName) {
    let indent = '';
    let firstLineIndent = '';
    if (config.indentLevel > 0) {
        if (nodeName === 'BLOCKQUOTE') {
            indent = ' | ';
        } else if (nodeName === 'LI') {
            indent = '   ';
            firstLineIndent = config.isOrderedList ? `${config.listItemNum}. ` : '*  ';
        } else {
            indent = '   ';
        }
    }

    const lines = text.split('\n');
    const indentedLines = lines.map((line, index) => `${index === 0 ? firstLineIndent : indent}${line}`);

    return indentedLines.join('\n');
}

/**
 * Returns number of columns in a table
 * @param {Node} tHeadNode       The table Node, i.e, a node with `nodeName` of `THEAD`
 */
function getNumberOfTableColumns(tHeadNode) {
    if (
        !tHeadNode.hasChildNodes() ||
        tHeadNode.childNodes[0].nodeName !== 'TR' ||
        !tHeadNode.childNodes[0].hasChildNodes()
    ) {
        return 1;
    }

    let numColumns = 1;
    let numHeadings = 0;

    const headingRow = tHeadNode.childNodes[0];
    for (let i = 0; i < headingRow.childNodes.length; i++) {
        if (headingRow.children[i].nodeName === 'TH') {
            numHeadings++;
        }
    }

    if (numHeadings === headingRow.children.length) {
        numColumns = numHeadings;
    }

    return numColumns;
}

/**
 * Formats table text
 */
function formatTableText(tableText) {
    // figure out max width for each column
    const rowTexts = tableText.split('\n').filter((r) => r !== '');
    const columnWidths = [];
    const cells = new Array(rowTexts.length);
    rowTexts.forEach((rowText, r) => {
        const rowCells = [];
        const columnTexts = rowText.split('|').filter((c) => c !== '');
        columnTexts.forEach((colText, c) => {
            const cellText = colText.trim();
            const cellTextLen = cellText.length;
            rowCells.push(cellText);
            columnWidth = columnWidths[c] || 0;
            if (cellTextLen > columnWidth) {
                columnWidths[c] = cellTextLen;
            }
        });
        cells[r] = rowCells;
    });

    // format the table text
    let formattedTableText = '';
    const numRows = cells.length;
    for (let r = 0; r < numRows; r++) {
        formattedTableText += '| ';
        const numColumns = cells[r].length;
        for (let c = 0; c < numColumns; c++) {
            formattedTableText += cells[r][c].padEnd(columnWidths[c]) + ' | ';
        }
        formattedTableText += '\n';
    }

    return formattedTableText;
}

/**
 * Gets the text contents of one or more child node trees.
 * @param {Node[]} children        The child Nodes
 * @param {NodeConfig} config      The config for converting the nodes to text
 * @returns {string}
 */
function nodesToText(children, config) {
    if (!children || !children.length) {
        return '';
    }

    let text = '';
    for (let i = 0; i < children.length; i++) {
        text += nodeToText(children[i], config);
    }

    return text;
}

/**
 * Gets the text contents of a node.
 * @param {Node} elem               The Node
 * @param {NodeConfig} config       The config for converting the nodes to text
 * @returns {string}
 */
function nodeToText(elem, config) {
    if (!elem) {
        return '';
    }

    // const { indentLevel } = config;

    // let text = '';
    let textBefore = '';
    let textAfter = '';
    // let handled = false;
    let innerText;
    // let indent = indentLevel > 0 ? '  '.repeat(indentLevel) : '';
    const { nodeName, textContent, childNodes } = elem;

    switch (nodeName) {
        case 'H1':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
        case 'H6':
            // get the heading text with an underline under it
            innerText = nodesToText(childNodes, { ...config });
            return `\n\n${innerText}\n${getHeadingUnderline(Number(nodeName[1]))}`;

        case '#text':
            return textContent;

        case 'BR':
            return '\n';

        case 'P':
        case 'DIV':
            // inner text with a paragraph separater
            innerText = nodesToText(childNodes, { ...config });
            return `\n\n${innerText}`;

        case 'BLOCKQUOTE': {
            // indented block of text with a vertical line to the left of the block
            const childConfig = {
                ...config,
                indentLevel: config.indentLevel + 1,
            };
            innerText = nodesToText(childNodes, childConfig);
            innerText = `\n${innerText.trim()}\n`;
            innerText = indentText(innerText, childConfig, nodeName);
            return `\n${innerText}\n`;
        }

        case 'PRE':
            // a code block
            // TODO: indent?
            innerText = nodesToText(childNodes, { ...config });
            textBefore = textAfter = '\n```\n';
            return `${textBefore}${innerText}${textAfter}`;

        case 'UL':
        case 'OL':
            innerText = nodesToText(childNodes, {
                indentLevel: config.indentLevel + 1,
                isList: true,
                isOrderedList: nodeName === 'OL',
                listLevel: config.listLevel + 1,
                listItemNum: 0,
            });
            innerText = collapseNewLines(innerText);
            return `${config.indentLevel === 0 ? '\n' : ''}${innerText}`;

        case 'LI': {
            /** @type {NodeConfig} */
            const childConfig = {
                ...config,
                // intentionlly update the source config's listItemNum too
                listItemNum: ++config.listItemNum,
            };
            innerText = nodesToText(childNodes, childConfig);
            innerText = indentText(innerText.trim(), childConfig, nodeName);
            return `\n${innerText}`;
        }

        case 'CODE':
            innerText = nodesToText(childNodes, { ...config });
            // textBefore = textAfter = '`';
            return `\`${textContent}\``;

        case 'A':
            return ` ${elem.href} `;

        case 'IMG':
            return ` ${elem.alt || 'Image'}: ${elem.src} `;

        case 'TABLE':
            innerText = nodesToText(childNodes, { ...config });
            innerText = collapseNewLines(innerText);
            innerText = formatTableText(innerText);
            return `\n${innerText}`;

        case 'THEAD':
            innerText = nodesToText(childNodes, { ...config });
            let numColumns = getNumberOfTableColumns(elem);
            const headingUnderline = '|' + '---|'.repeat(numColumns);
            return `\n${innerText}\n${headingUnderline}`;

        case 'TR':
            innerText = nodesToText(childNodes, { ...config });
            return `\n| ${innerText.trim().replaceAll(/\n/g, '')}`;

        case 'TH':
        case 'TD':
            innerText = nodesToText(childNodes, { ...config });
            return ` ${innerText.trim()} |`;

        default:
            return nodesToText(childNodes, { ...config });
    }
}

/**
 * Generated formatted text for the contents of an Element
 * @param {HTMLElement} elem    Source HTML Element
 * @returns {string}
 */
function htmlToText(elem, config) {
    const text = nodeToText(elem, config);
    const trimmedText = collapseNewLines(text, 2);
    return trimmedText;
}

/**
 * Get the description text for the Pull Request
 * @returns {string}
 */
function getPullRequestDescription() {
    const descriptionElem = document.querySelector(
        'div.pull-request-content .aui-group .aui-item .details div.description'
    );

    /** @type {NodeConfig} */
    const nodeConfig = {
        indentLevel: 0, // indent level
        isList: false,
        isOrderedList: false,
        listLevel: 0, // nesting level for lists
        listItemNum: 0, // item number for Ordered lists
    };

    return htmlToText(descriptionElem, nodeConfig);
}
