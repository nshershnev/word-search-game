import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { values } from 'lodash';

import gameLevels from '../../game-levels.json';
import SearchWords from './';

let container: any = null;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it('renders SearchWords component', () => {
    const [testLevel] = gameLevels;

    act(() => {
        render(<SearchWords foundWords={[]} level={testLevel} />, container);
    });

    expect(container.querySelector('p.search-words__main-word').textContent).toBe(testLevel.word);
    expect(container.querySelector('p.search-words__words-remaining').textContent).toBe(`Words Remaining: ${values(testLevel.word_locations).length}`);
});