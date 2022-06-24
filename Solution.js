
/**
 * @param {string[]} words
 * @return {string[]}
 */
var wordsAbbreviation = function (words) {
    this.ALPHABET_SIZE = 26;
    this.ASCII_SMALL_CASE_A = 97;
    this.minAbbreviation_wordsPerMinAbbreviation = new Map();
    this.trieRoot_minAbbreviation = new Map();

    initializeMap_minAbbreviation_wordsPerMinAbbreviation(words);
    createTrieForAllMinAbbreviationGroups();
    return extractMinAbbreviationsForAllWords(words);
};

/**
 * @param {string} word
 * @param {number} index
 */
function PairWordIndex(word, index) {
    this.word = word;
    this.index = index;
}

/**
 * @param {number} ALPHABET_SIZE
 */
function TrieNode(ALPHABET_SIZE) {
    this.commonPrefix = 0;
    this.branches = new Array(ALPHABET_SIZE).fill(null);
}

/**
 * @param {string[]} words
 * @return {string[]}
 */
function extractMinAbbreviationsForAllWords(words) {
    for (let node of this.trieRoot_minAbbreviation.keys()) {
        let pairs = this.minAbbreviation_wordsPerMinAbbreviation.get(this.trieRoot_minAbbreviation.get(node));
        for (let p of pairs) {
            extractMinAbbreviationForWord(node, p, words);
        }
    }
    return words;
}

/**
 * @param {TrieNode} root
 * @param {PairWordIndex} pair
 * @param {string[]} words
 * @return {void}
 */
function extractMinAbbreviationForWord(root, pair, words) {
    let current = root;
    for (let i = 1; i < pair.word.length; ++i) {
        let indexBranches = pair.word.codePointAt(i) - this.ASCII_SMALL_CASE_A;
        if (current.commonPrefix === 1) {
            let abbreviation = abbreviateWord(pair.word, i - 1);
            if (abbreviation.length < pair.word.length) {
                words[pair.index] = abbreviation;
            }
            return;
        }
        current = current.branches[indexBranches];
    }
}

/**
 * @return {void}
 */
function createTrieForAllMinAbbreviationGroups() {
    for (let group of this.minAbbreviation_wordsPerMinAbbreviation.keys()) {
        const root = new TrieNode(this.ALPHABET_SIZE);
        this.trieRoot_minAbbreviation.set(root, group);
        const pairs = this.minAbbreviation_wordsPerMinAbbreviation.get(group);
        for (let p of pairs) {
            createTrieForMinAbbreviationGroup(root, p.word);
        }
    }
}

/**
 * @param {TrieNode} root
 * @param {string} word
 * @return {void}
 */
function createTrieForMinAbbreviationGroup(root, word) {
    let current = root;
    for (let i = 1; i < word.length; ++i) {
        let indexBranches = word.codePointAt(i) - this.ASCII_SMALL_CASE_A;
        if (current.branches[indexBranches] === null) {
            current.branches[indexBranches] = new TrieNode(this.ALPHABET_SIZE);
        }
        ++current.commonPrefix;
        current = current.branches[indexBranches];
    }
}

/**
 * @param {string[]} words
 * @return {void}
 */
function initializeMap_minAbbreviation_wordsPerMinAbbreviation(words) {
    for (let i = 0; i < words.length; ++i) {
        let shortestAbbreviation = abbreviateWord(words[i], 0);
        if (!this.minAbbreviation_wordsPerMinAbbreviation.has(shortestAbbreviation)) {
            this.minAbbreviation_wordsPerMinAbbreviation.set(shortestAbbreviation, []);
        }
        this.minAbbreviation_wordsPerMinAbbreviation.get(shortestAbbreviation).push(new PairWordIndex(words[i], i));
    }
}

/**
 * @param {string} word
 * @param {number} index
 * @return {string}
 */
function abbreviateWord(word, index) {
    if (word.length < 4) {
        return word;
    }

    const prefix = word.substr(0, index + 1);
    const numberOfAbbreviatedCharacters = word.length - index - 2;
    const suffix = word.charAt(word.length - 1);

    return prefix + numberOfAbbreviatedCharacters + suffix;
}
