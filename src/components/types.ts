enum EndType {
    T0 = 0,
    T1 = 1,
    T2 = 2,
    T3 = 3,
    T4 = 4,
}

const ALLOW_LEFT_ENDS = [EndType.T0, EndType.T2, EndType.T4]
const ALLOW_RIGHT_ENDS = [EndType.T0, EndType.T1, EndType.T3]

class TargetShape {
    constructor(
        public readonly id: string,
        public readonly leftEnd: EndType,
        public readonly rightEnd: EndType,
        public readonly length: number) {
        this.fixLeftRight()
    }

    protected fixLeftRight(): void {
        if (!ALLOW_LEFT_ENDS.includes(this.leftEnd) || !ALLOW_RIGHT_ENDS.includes(this.rightEnd)) {
            // Swap left and right
            [this.leftEnd, this.rightEnd] = [this.rightEnd, this.leftEnd]
            console.debug(`Swapped left and right ends for ${this.id}`)
        }
        // Check if LEFT RIGHT are valid
        if (!ALLOW_LEFT_ENDS.includes(this.leftEnd)) {
            throw new Error(`Invalid end: ${this.leftEnd} cannot be left end`)
        }
        if (!ALLOW_RIGHT_ENDS.includes(this.rightEnd)) {
            throw new Error(`Invalid end: ${this.rightEnd} cannot be right end`)
        }
    }
}

type CuttingSequence = TargetShape[];

type TargetShapePool = Record<string, TargetShape>

// -----------------------------------------------------------
// Material
// -----------------------------------------------------------

type MaterialShape = TargetShape;

class MaterialState {
    constructor(
        public readonly material: MaterialShape
    ) {}

    public get id(): string { return this.material.id }
    protected _assignedSequence: CuttingSequence = []

    public get assignedLength(): number {
        return this._assignedSequence.reduce((acc: number, cur: CuttingSequence[0]) => acc + cur.length, 0)
    }

    public get remainingLength(): number {
        return this.material.length - this.assignedLength
    }

    public get leftMostAssigned() : TargetShape | undefined {
        if (this._assignedSequence.length == 0) return undefined
        return this._assignedSequence[this._assignedSequence.length - 1]
    }

    public get leftMostEnd(): EndType {
        return this.leftMostAssigned?.leftEnd ?? this.material.leftEnd
    }

    public assignNewCut(target: TargetShape): void {
        const { leftEnd, rightEnd, length } = target
        if (length > this.remainingLength) {
            throw new Error(`Target length ${length} is larger than remaining length ${this.remainingLength}`)
        }
        if (leftEnd != this.leftMostEnd) {
            throw new Error(`Target left end (${leftEnd}) is not equal to current left most end (${this.leftMostEnd})`)
        }
        this._assignedSequence.push(target)
    }

}


export {
    EndType,
    TargetShape, CuttingSequence, TargetShapePool,
    MaterialShape, MaterialState
}
