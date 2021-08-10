import {
    createLevelMap,
    checkVectorWithSlope,
    checkWordExists,
    getCoordinatesFromPair,
    getCoordinateRange,
    getCorrectedPoint,
    getDiagonalCoordinateRange,
    getNumberRange,
    getVectorSlope,
    handleVectorWithSlope,
    handleVectorWithoutSlope,
} from './';

describe('Playing Field Service tests', () => {
    describe('createLevelMap tests', () => {
        it('should return an array of all indexes for matrix of selected size', () => {
            expect(createLevelMap(2)).toEqual(["0,0", "0,1", "1,0", "1,1"]);
        });
    });

    describe('getCoordinatesFromPair tests', () => {
        it('should return splitted point coordinates from pair', () => {
            expect(getCoordinatesFromPair("1,1")).toEqual(["1", "1"]);
        });
    });

    describe('getVectorSlope tests', () => {
        it('should return vestor slope value equal 0 for horizontal line between two points', () => {
            expect(getVectorSlope("7,0", "7,3")).toEqual(0);
        });

        it('should return vestor slope value equal 1 for diagonal line between two points', () => {
            expect(getVectorSlope("7,0", "4,3")).toEqual(1);
        });
    });

    describe('getNumberRange tests', () => {
        it('should return number range from n to m, n < m', () => {
            expect(getNumberRange(0, 3)).toEqual([0, 1, 2, 3]);
        });

        it('should return number range from m to n, m > n', () => {
            expect(getNumberRange(4, 1)).toEqual([4, 3, 2, 1]);
        });
    });

    describe('getCoordinateRange tests', () => {
        it('should return coordinate range for horizontal line without slope', () => {
            const testCase: any = {
                y1: 0,
                y2: 7,
                x1: 1
            };

            const { y1, y2, x1 }: any = testCase;
            expect(getCoordinateRange(y1, y2, x1)).toEqual(["1,0", "1,1", "1,2", "1,3", "1,4", "1,5", "1,6", "1,7"]);
        });

        it('should return coordinate range for vertical line without slope', () => {
            const testCase: any = {
                x1: 0,
                x2: 7,
                y1: 1
            };

            const { x1, x2, y1 }: any = testCase;
            expect(getCoordinateRange(x1, x2, y1, true)).toEqual(["0,1", "1,1", "2,1", "3,1", "4,1", "5,1", "6,1", "7,1"]);
        });
    });

    describe('getDiagonalCoordinateRange tests', () => {
        it('should return coordinate range for diagonal line with slope', () => {
            const startPoint: VectorPoint = { x: 0, y: 0 };
            const currentPoint: VectorPoint = { x: 3, y: 3 };

            expect(getDiagonalCoordinateRange(startPoint, currentPoint)).toEqual(["0,0", "1,1", "2,2", "3,3"]);
        });
    });

    describe('handleVectorWithoutSlope tests', () => {
        it('should return horizintal vector without slope', () => {
            expect(handleVectorWithoutSlope("7,0", "7,7")).toEqual(["7,0", "7,1", "7,2", "7,3", "7,4", "7,5", "7,6", "7,7"]);
        });

        it('should return vertical vector without slope', () => {
            expect(handleVectorWithoutSlope("7,0", "3,0")).toEqual(["7,0", "6,0", "5,0", "4,0", "3,0"]);
        });
    });

    describe('checkVectorWithSlope tests', () => {
        it('should return result of vector slope check', () => {
            const startPoint: VectorPoint = { x: 0, y: 0 };
            const currentPoint: VectorPoint = { x: 3, y: 3 };

            expect(checkVectorWithSlope(startPoint, currentPoint)).toBeTruthy();
        });
    });

    describe('getCorrectedPoint tests', () => {
        it('should return updated coordinate for line point', () => {
            const startPoint: VectorPoint = { x: 0, y: 0 };
            const currentPoint: VectorPoint = { x: 3, y: 1 };

            expect(getCorrectedPoint(startPoint, currentPoint)).toEqual({ x: 1, y: 1 });
        });
    });

    describe('handleVectorWithSlope tests', () => {
        it('should return vector with slope', () => {
            expect(handleVectorWithSlope("7,0", "3,4")).toEqual(["7,0", "6,1", "5,2", "4,3", "3,4"]);
        });

        it('should fix current point and return vector with slope', () => {
            expect(handleVectorWithSlope("7,0", "3,3")).toEqual(["7,0", "6,1", "5,2", "4,3"]);
        });
    });

    describe('getSelectionVector tests', () => {
        it('should return vector with slope', () => {
            expect(handleVectorWithSlope("7,0", "3,4")).toEqual(["7,0", "6,1", "5,2", "4,3", "3,4"]);
        });

        it('should return vector without slope', () => {
            expect(handleVectorWithoutSlope("7,0", "7,7")).toEqual(["7,0", "7,1", "7,2", "7,3", "7,4", "7,5", "7,6", "7,7"]);
        });
    });

    describe('checkWordExists tests', () => {
        it('should return result of property exists check', () => {
            const testCase: any = {
                "6,1,6,2,6,3,6,4,6,5,6,6": "hombre"
            };

            expect(checkWordExists(testCase, "6,1,6,2,6,3,6,4,6,5,6,6")).toBeTruthy();
        });
    });
});
