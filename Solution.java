
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Solution {

    private record PairWordIndex(String word, int index) {}
    private static final int ALPHABET_SIZE = 26;
    private final Map<String, ArrayList<PairWordIndex>> minAbbreviation_wordsPerMinAbbreviation = new HashMap<>();
    private final Map<TrieNode, String> trieRoot_minAbbreviation = new HashMap<>();

    class TrieNode {
        int commonPrefix;
        TrieNode[] branches = new TrieNode[ALPHABET_SIZE];
    }

    public List<String> wordsAbbreviation(List<String> words) {
        initializeMap_minAbbreviation_wordsPerMinAbbreviation(words);
        createTrieForAllMinAbbreviationGroups();
        return extractMinAbbreviationsForAllWords(words);
    }

    private List<String> extractMinAbbreviationsForAllWords(List<String> words) {
        for (TrieNode node : trieRoot_minAbbreviation.keySet()) {
            List<PairWordIndex> pairs = minAbbreviation_wordsPerMinAbbreviation.get(trieRoot_minAbbreviation.get(node));
            for (PairWordIndex p : pairs) {
                extractMinAbbreviationForWord(node, p, words);
            }
        }
        return words;
    }

    private void extractMinAbbreviationForWord(TrieNode root, PairWordIndex pair, List<String> words) {
        TrieNode current = root;
        for (int i = 1; i < pair.word.length(); ++i) {
            int indexBranches = pair.word.charAt(i) - 'a';
            if (current.commonPrefix == 1) {
                String abbreviation = abbreviateWord(pair.word, i - 1);
                if (abbreviation.length() < pair.word.length()) {
                    words.set(pair.index, abbreviation);
                }
                return;
            }
            current = current.branches[indexBranches];
        }
    }

    private void createTrieForAllMinAbbreviationGroups() {
        for (String group : minAbbreviation_wordsPerMinAbbreviation.keySet()) {
            TrieNode root = new TrieNode();
            trieRoot_minAbbreviation.put(root, group);
            List<PairWordIndex> pairs = minAbbreviation_wordsPerMinAbbreviation.get(group);
            for (PairWordIndex p : pairs) {
                createTrieForMinAbbreviationGroup(root, p.word);
            }
        }
    }

    private void createTrieForMinAbbreviationGroup(TrieNode root, String word) {
        TrieNode current = root;
        for (int i = 1; i < word.length(); ++i) {
            int indexBranches = word.charAt(i) - 'a';
            if (current.branches[indexBranches] == null) {
                current.branches[indexBranches] = new TrieNode();
            }
            ++current.commonPrefix;
            current = current.branches[indexBranches];
        }
    }

    private void initializeMap_minAbbreviation_wordsPerMinAbbreviation(List<String> words) {
        for (int i = 0; i < words.size(); ++i) {
            String shortestAbbreviation = abbreviateWord(words.get(i), 0);
            minAbbreviation_wordsPerMinAbbreviation.putIfAbsent(shortestAbbreviation, new ArrayList<>());
            minAbbreviation_wordsPerMinAbbreviation.get(shortestAbbreviation).add(new PairWordIndex(words.get(i), i));
        }
    }

    private String abbreviateWord(String word, int index) {
        if (word.length() < 4) {
            return word;
        }

        String prefix = word.substring(0, index + 1);
        int numberOfAbbreviatedCharacters = word.length() - index - 2;
        char suffix = word.charAt(word.length() - 1);

        return prefix + numberOfAbbreviatedCharacters + suffix;
    }
}
