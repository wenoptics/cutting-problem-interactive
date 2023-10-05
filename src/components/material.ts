import { isAdapterCut } from "~/components/adapter-cuts";
import {
  ALLOW_RIGHT_ENDS,
  CuttingSequence,
  EndType,
  TargetShape,
} from "~/components/types";

class MaterialShape extends TargetShape {}

class MaterialState {
  constructor(public readonly material: MaterialShape) {}

  public get id(): string {
    return this.material.id;
  }

  protected _assignedSequence: CuttingSequence = [];

  public get assignedLength(): number {
    return this._assignedSequence.reduce(
      (acc: number, cur: CuttingSequence[0]) => acc + cur.length,
      0,
    );
  }

  public get remainingLength(): number {
    return this.material.length - this.assignedLength;
  }

  public get currentWasteFromAdapterCuts(): number {
    return this._assignedSequence.reduce(
      (acc: number, cur: CuttingSequence[0]) => {
        if (isAdapterCut(cur)) {
          return acc + cur.length;
        } else {
          return acc;
        }
      },
      0,
    );
  }

  public get lastAssigned(): TargetShape | undefined {
    if (this._assignedSequence.length == 0) return undefined;
    return this._assignedSequence[this._assignedSequence.length - 1];
  }

  public get nextAllowedLeftEnd(): EndType {
    if (this.lastAssigned === undefined) {
      // This will be the first cut
      return this.material.leftEnd;
    }
    return getLeftEnd(this.lastAssigned.rightEnd);
  }

  public assignNewCut(target: TargetShape): void {
    const { leftEnd, rightEnd, length } = target;
    if (length > this.remainingLength) {
      throw new Error(
        `Target length ${length} is larger than remaining length ${this.remainingLength}`,
      );
    }
    if (leftEnd != this.nextAllowedLeftEnd) {
      throw new Error(
        `Target left end (${leftEnd}) is not equal to current left most end (${this.nextAllowedLeftEnd})`,
      );
    }
    this._assignedSequence.push(target);
  }

  public unassignLastCut(): void {
    if (this._assignedSequence.length == 0) {
      // throw new Error(`No cut to unassign`)
      console.warn(`No cut to unassign`);
      return;
    }
    this._assignedSequence.pop();
  }

  public get assignedSequence(): CuttingSequence {
    return this._assignedSequence;
  }
}

export { MaterialState, MaterialShape };

function getLeftEnd(rightEnd: EndType) {
  if (!ALLOW_RIGHT_ENDS.includes(rightEnd)) {
    throw new Error(`Invalid end: ${rightEnd} cannot be right end`);
  }
  switch (rightEnd) {
    case EndType.T0:
      return EndType.T0;
    case EndType.T1:
      return EndType.T2;
    case EndType.T3:
      return EndType.T4;
  }
  throw new Error(`Invalid end: ${rightEnd}`);
}
