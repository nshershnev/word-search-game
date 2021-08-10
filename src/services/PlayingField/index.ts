import { flattenDeep, has, range, rangeRight } from 'lodash';

export const createLevelMap = (mapSize: number): string[] => {
    const mapIndexes: number[] = Array.from({ length: mapSize }, (_, index) => index);
    const matrixIndexes: string[][] = mapIndexes.map(index => range(mapSize).map((item) => `${index},${item}`));
    return flattenDeep(matrixIndexes);
};

export const getCoordinatesFromPair = (pair: string): string[] => pair.split(',');

export const getVectorSlope = (startPoint: string, currentPoint: string): number => {
    const [x1, y1]: string[] = getCoordinatesFromPair(startPoint);
    const [x2, y2]: string[] = getCoordinatesFromPair(currentPoint);

    const vectorSlope: number = (+y2 - +y1) / (+x2 - +x1);
    return !isFinite(vectorSlope) ? 0 : Math.abs(vectorSlope);
};

export const getNumberRange = (start: number, end: number): number[] => {
    return start < end ? range(start, end + 1) : rangeRight(end, start + 1);
};

export const getCoordinateRange = (start: number, end: number, coordinate: number, isAppend: boolean = false): string[] => {
    const numberRange: number[] = getNumberRange(start, end);
    return numberRange.map((current) => isAppend ? `${current},${coordinate}` : `${coordinate},${current}`);
};

export const getDiagonalCoordinateRange = (startPoint: VectorPoint, currentPoint: VectorPoint): string[] => {
    const xRange: number[] = getNumberRange(startPoint.x, currentPoint.x);
    const yRange: number[] = getNumberRange(startPoint.y, currentPoint.y);

    return xRange.map((x, index) => `${x},${yRange[index]}`);
};

export const handleVectorWithoutSlope = (startPoint: string, currentPoint: string): string[] => {
    const [x1, y1]: string[] = getCoordinatesFromPair(startPoint);
    const [x2, y2]: string[] = getCoordinatesFromPair(currentPoint);

    return x1 === x2
        ? getCoordinateRange(+y1, +y2, +x1)
        : getCoordinateRange(+x1, +x2, +y1, true);
};

export const checkVectorWithSlope = (startPoint: VectorPoint, currentPoint: VectorPoint): boolean => {
    return Math.abs(startPoint.x - currentPoint.x) === Math.abs(startPoint.y - currentPoint.y);
};

export const getCorrectedPoint = (startPoint: VectorPoint, currentPoint: VectorPoint): VectorPoint => {
    const deltaY: number = Math.abs(startPoint.y - currentPoint.y);
    const currentPointUpdatedX: number = Math.abs(startPoint.x - deltaY);

    return { x: currentPointUpdatedX, y: currentPoint.y };
};

export const handleVectorWithSlope = (startPoint: string, currentPoint: string): string[] => {
    const [x1, y1]: string[] = getCoordinatesFromPair(startPoint);
    const [x2, y2]: string[] = getCoordinatesFromPair(currentPoint);

    const startVectorPoint: VectorPoint = { x: +x1, y: +y1 };
    const currentVectorPoint: VectorPoint = { x: +x2, y: +y2 };

    const isAngleSupported: boolean = checkVectorWithSlope(startVectorPoint, currentVectorPoint);

    if (isAngleSupported) {
        return getDiagonalCoordinateRange(startVectorPoint, currentVectorPoint);
    } else {
        const correctedCurrentPoint: VectorPoint = getCorrectedPoint(startVectorPoint, currentVectorPoint);
        return getDiagonalCoordinateRange(startVectorPoint, correctedCurrentPoint);
    }
};

export const getSelectionVector = (startPoint: string, currentPoint: string): string[] => {
    const vectorSlope: number = getVectorSlope(startPoint, currentPoint);

    if (vectorSlope === 0) {
        return handleVectorWithoutSlope(startPoint, currentPoint);
    } else {
        return handleVectorWithSlope(startPoint, currentPoint);
    }
};

export const checkWordExists = (wordLocations: Object, lastWordSelection: string): boolean => {
    return has(wordLocations, lastWordSelection);
};
