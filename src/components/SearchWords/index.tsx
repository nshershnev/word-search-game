
import { get, values } from 'lodash';
import './index.css';

interface SearchWordsProps {
	foundWords: string[];
	level: Level;
}

const isWordFound = (word: any, foundWords: string[]): boolean => {
	return foundWords.includes(word);
};

const SearchWords = ({ foundWords, level }: SearchWordsProps): React.ReactElement => {
	const wordLocations: Object = get(level, 'word_locations', []);

	return (
		<div className="search-words">
			<div className="search-words__header">
				<p className="search-words__main-word">{get(level, 'word')}</p>
				<p>Words Remaining: {values(wordLocations).length}</p>
			</div>
			<ul>
				{values(wordLocations).map((location, key) => (
					<li key={key} className={`search-words__item ${isWordFound(location, foundWords) ? 'search-words__item--found' : ''}`}>{location}</li>
				))}
			</ul>
		</div>
	)
}

export default SearchWords;
