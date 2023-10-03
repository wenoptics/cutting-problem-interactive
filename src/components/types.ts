enum EndType {
    T0 = 0,
    T1 = 1,
    T2 = 2,
    T3 = 3,
    T4 = 4,
}

type TargetShape = {
    leftEnd: EndType;
    rightEnd: EndType;
    length: number;
    id: string;
}

type MaterialShape = TargetShape;

type CuttingSequence = TargetShape[];

type TargetShapePool = Record<string, TargetShape>

export { EndType, MaterialShape, TargetShape, CuttingSequence, TargetShapePool }
