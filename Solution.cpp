
#include <array>
#include <string>
#include <vector>
#include <memory>
#include <unordered_map>
using namespace std;

class Solution {
    
    inline static const int ALPHABET_SIZE = 26;

    struct PairWordIndex {
        string word{};
        int index{};
        PairWordIndex(string word, int index) : word{word}, index{ index}{};
    };

    struct TrieNode {
        int commonPrefix{};
        array<shared_ptr<TrieNode>, ALPHABET_SIZE> branches{};
    };

    unordered_map<string, vector<PairWordIndex>> minAbbreviation_wordsPerMinAbbreviation;
    unordered_map<shared_ptr<TrieNode>, string> trieRoot_minAbbreviation;

public:
    vector<string> wordsAbbreviation(vector<string>& words) {
        initializeMap_minAbbreviation_wordsPerMinAbbreviation(words);
        createTrieForAllMinAbbreviationGroups();
        return extractMinAbbreviationsForAllWords(words);
    }

private:
    vector<string> extractMinAbbreviationsForAllWords(vector<string>& words) {
        for (const auto& node : trieRoot_minAbbreviation) {
            vector<PairWordIndex> pairs = minAbbreviation_wordsPerMinAbbreviation[node.second];
            for (const auto& p : pairs) {
                extractMinAbbreviationForWord(node.first, p, words);
            }
        }
        return words;
    }

    void extractMinAbbreviationForWord(const shared_ptr< TrieNode>& root, const PairWordIndex& pair, vector<string>& words) {
        shared_ptr< TrieNode> current = root;
        for (int i = 1; i < pair.word.length(); ++i) {
            int indexBranches = pair.word[i] - 'a';
            if (current->commonPrefix == 1) {
                string abbreviation = abbreviateWord(pair.word, i - 1);
                if (abbreviation.length() < pair.word.length()) {
                    words[pair.index] = abbreviation;
                }
                return;
            }
            current = current->branches[indexBranches];
        }
    }

    void createTrieForAllMinAbbreviationGroups() {
        for (const auto& group : minAbbreviation_wordsPerMinAbbreviation) {
            shared_ptr< TrieNode> root = make_shared< TrieNode>();
            trieRoot_minAbbreviation[root] = group.first;
            vector<PairWordIndex>& pairs = minAbbreviation_wordsPerMinAbbreviation[group.first];
            for (PairWordIndex p : pairs) {
                createTrieForMinAbbreviationGroup(root, p.word);
            }
        }
    }

    void createTrieForMinAbbreviationGroup(shared_ptr< TrieNode>& root, const string& word) {
        shared_ptr< TrieNode> current = root;
        for (int i = 1; i < word.length(); ++i) {
            int indexBranches = word[i] - 'a';
            if (current->branches[indexBranches] == nullptr) {
                current->branches[indexBranches] = make_shared<TrieNode>();
            }
            ++current->commonPrefix;
            current = current->branches[indexBranches];
        }
    }

    void initializeMap_minAbbreviation_wordsPerMinAbbreviation(const vector<string>& words) {
        for (int i = 0; i < words.size(); ++i) {
            string shortestAbbreviation = abbreviateWord(words[i], 0);

            //C++20: minAbbreviation_wordsPerMinAbbreviation.contains(shortestAbbreviation)
            if (minAbbreviation_wordsPerMinAbbreviation.find(shortestAbbreviation) == minAbbreviation_wordsPerMinAbbreviation.end()) {
                minAbbreviation_wordsPerMinAbbreviation[shortestAbbreviation] = vector<PairWordIndex>();
            }
            minAbbreviation_wordsPerMinAbbreviation[shortestAbbreviation].emplace_back(words[i], i); //alternatively: push_back(PairWordIndex(words[i], i));
        }
    }

    string abbreviateWord(const string& word, int index) {
        if (word.length() < 4) {
            return word;
        }

        string prefix = word.substr(0, index + 1);
        int numberOfAbbreviatedCharacters = word.length() - index - 2;
        char suffix = word[word.length() - 1];

        return prefix + to_string(numberOfAbbreviatedCharacters) + suffix;
    }
};
