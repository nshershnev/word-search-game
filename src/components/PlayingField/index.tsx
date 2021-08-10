import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { get, isEqual } from 'lodash';
import './index.css';

import {
	createLevelMap,
	checkWordExists,
	getSelectionVector,
} from '../../services/PlayingField';

interface PlayingFieldProps {
	onWordFound: Function;
	level: Level;
	onLevelChange: Function;
}

const clearPlayingField = () => {
	const cells: NodeListOf<Element> = document.querySelectorAll('[data-cell]');
	cells.forEach((cell) => cell.classList.remove('playing-field__cell--highlighted'));
};

const getCellsToEdit = (selectionVector: string[]): NodeListOf<Element> => {
	const selectors = selectionVector.map((point) => `[data-cell='${point}']`);
	return document.querySelectorAll(selectors.join(','));
};

const highlightCells = (selectionVector: string[]) => {
	const cellsToHighlight: NodeListOf<Element> = getCellsToEdit(selectionVector);
	cellsToHighlight.forEach((cell) => cell.classList.add('playing-field__cell--highlighted'));
};

const removeHighlightCells = (selectionVector: string[]) => {
	const cellsToRemoveHighlight: NodeListOf<Element> = getCellsToEdit(selectionVector);
	cellsToRemoveHighlight.forEach((cell) => cell.classList.remove('playing-field__cell--highlighted'));
};

const generateCell = (symbol: string, columnIndex: number, rowIndex: number): React.ReactElement => (
	<div
		className="playing-field__cell"
		data-cell={`${rowIndex},${columnIndex}`}
		key={`cell-${rowIndex}-${columnIndex}`}
	>
		{symbol}
	</div>
);

const generateColumn = (cells: string[], columnIndex: number): React.ReactElement => (
	<div className="playing-field__column" key={`column-${columnIndex}`}>
		{cells.map((cell, rowIndex) => generateCell(cell, columnIndex, rowIndex))}
	</div>
);

const PlayingField = ({ level, onLevelChange, onWordFound }: PlayingFieldProps): React.ReactElement => {
	const [playingField, setPlayingField] = useState<Array<JSX.Element>>();
	const [startPoint, setStartPoint] = useState<string>("");
	const [lastWordSelection, setLastWordSelection] = useState<string[]>([""]);
	const [wordsToSearchCount, setWordsToSearchCount] = useState<number>();
	const [levelMap, setLevelMap] = useState<string[]>([]);
	const [foundWordsCoordinates, setFoundWordsCoordinates] = useState<string[]>([]);

	const handleMouseOver = useCallback((event: MouseEvent) => {
		const currentPointCoordinates: string = get(event, 'target.dataset.cell');

		if (startPoint.length > 0 && currentPointCoordinates) {
			const selectionVector: string[] = getSelectionVector(startPoint, currentPointCoordinates);

			const unHighlightedCells: string[] = levelMap.filter((cell) => !foundWordsCoordinates.includes(cell) && !selectionVector.includes(cell));
			removeHighlightCells(unHighlightedCells);

			highlightCells(selectionVector);

			if (!isEqual(lastWordSelection, selectionVector)) {
				setLastWordSelection(selectionVector);
			}
		}
	}, [foundWordsCoordinates, lastWordSelection, levelMap, startPoint]);


	const handleMouseDown = useCallback((event: MouseEvent) => {
		const startPointCoordinates: string = get(event, 'target.dataset.cell');

		if (startPointCoordinates) {
			setStartPoint(startPointCoordinates);
		}
	}, []);

	const handleMouseUp = useCallback(() => {
		const { word_locations }: Level = level;

		const isSelectedWordExists: boolean = checkWordExists(word_locations, lastWordSelection.join(','));

		if (!isSelectedWordExists) {
			removeHighlightCells(lastWordSelection);
		} else {
			if (wordsToSearchCount && wordsToSearchCount > 0) {
				const updatedWordsToSearchCount: number = wordsToSearchCount - 1;
				setWordsToSearchCount(updatedWordsToSearchCount);
				setFoundWordsCoordinates(prevFoundWordsCoordinates => [...prevFoundWordsCoordinates, ...lastWordSelection]);

				const foundWord: string = get(word_locations, lastWordSelection.join(','));
				onWordFound(foundWord);
			}
		}

		setStartPoint("");
		setLastWordSelection([""]);
	}, [lastWordSelection, level, onWordFound, wordsToSearchCount]);

	useEffect(() => {
		window.addEventListener("mouseover", handleMouseOver);
		window.addEventListener("mousedown", handleMouseDown);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("mouseover", handleMouseOver);
			window.removeEventListener("mousedown", handleMouseDown);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [handleMouseOver, handleMouseDown, handleMouseUp]);

	useEffect(() => {
		if (level) {
			const { word_locations }: Level = level;
			setWordsToSearchCount(Object.keys(word_locations).length);
		}
	}, [level]);

	useEffect(() => {
		if (level) {
			const { character_grid }: Level = level;

			const playingField: Array<JSX.Element> = character_grid.map((cells, columnIndex) => generateColumn(cells, columnIndex));
			setPlayingField(playingField);

			const levelMap: string[] = createLevelMap(playingField.length);
			setLevelMap(levelMap);
		}
	}, [level]);

	useEffect(() => {
		if (wordsToSearchCount === 0) {
			clearPlayingField();
			setStartPoint("");
			setLastWordSelection([""]);
			setFoundWordsCoordinates([]);
			onLevelChange();
		}
	}, [wordsToSearchCount, onLevelChange]);

	return (
		<div className="playing-field">
			{playingField}
		</div>
	)
}

export default PlayingField;
