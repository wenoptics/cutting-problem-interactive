enum EndType {
  T0 = 0,
  T1 = 1,
  T2 = 2,
  T3 = 3,
  T4 = 4,
}

const ALLOW_LEFT_ENDS = [EndType.T0, EndType.T2, EndType.T4];
const ALLOW_RIGHT_ENDS = [EndType.T0, EndType.T1, EndType.T3];

class TargetShape {
  constructor(
    public readonly id: string,
    public readonly leftEnd: EndType,
    public readonly rightEnd: EndType,
    public readonly length: number,
  ) {
    this.fixLeftRight();
  }

  protected fixLeftRight(): void {
    if (
      !ALLOW_LEFT_ENDS.includes(this.leftEnd) ||
      !ALLOW_RIGHT_ENDS.includes(this.rightEnd)
    ) {
      // Swap left and right
      [this.leftEnd, this.rightEnd] = [this.rightEnd, this.leftEnd];
      console.debug(`Swapped left and right ends for ${this.id}`);
    }
    // Check if LEFT RIGHT are valid
    if (!ALLOW_LEFT_ENDS.includes(this.leftEnd)) {
      throw new Error(`Invalid end: ${this.leftEnd} cannot be left end`);
    }
    if (!ALLOW_RIGHT_ENDS.includes(this.rightEnd)) {
      throw new Error(`Invalid end: ${this.rightEnd} cannot be right end`);
    }
  }
}

type CuttingSequence = TargetShape[];

type TargetShapePool = Record<string, TargetShape>;

export {
  EndType,
  ALLOW_LEFT_ENDS,
  ALLOW_RIGHT_ENDS,
  TargetShape,
  CuttingSequence,
  TargetShapePool,
};
