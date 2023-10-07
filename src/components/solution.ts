import { MaterialShape, MaterialState } from "~/components/material";
import { mapValues } from "~/utils";

class Solution {
  /**
   * Provide only one of the following to initialize the solution collection
   *
   * @param materialList
   * @param materialStateList
   * @param materialStateMap
   */
  constructor({
    materialList,
    materialStateList,
    materialStateMap,
  }: {
    materialList?: MaterialShape[];
    materialStateList?: MaterialState[];
    materialStateMap?: Record<string, MaterialState>;
  }) {
    // Check if provided more than one of the initialization parameters
    const numProvided = [
      materialList,
      materialStateList,
      materialStateMap,
    ].filter((x) => x).length;
    if (numProvided > 1) {
      throw new Error(
        "Only one of the following parameters should be provided: materialList, materialStateList, materialStateMap",
      );
    } else if (numProvided == 0) {
      throw new Error(
        "One of the following parameters should be provided: materialList, materialStateList, materialStateMap",
      );
    }

    if (materialList) {
      materialStateList = materialList.map(
        (material) => new MaterialState(material),
      );
    }
    if (materialStateList) {
      materialStateMap = Object.fromEntries(
        materialStateList.map((materialState) => [
          materialState.id,
          materialState,
        ]),
      );
    }
    // At this point, materialStateMap is guaranteed to be defined
    this.materialStates = materialStateMap!;
  }

  public materialStates: Record<string, MaterialState> = {};

  public get materialMap(): Record<string, MaterialShape> {
    return mapValues(
      this.materialStates,
      (materialState) => materialState.material,
    );
  }

  public get usedTargetIds(): string[] {
    return Object.values(this.materialStates).flatMap((ms) =>
      ms.assignedSequence.map((target) => target.id),
    );
  }

  public serialize(): object {
    return {
      materialStates: mapValues(this.materialStates, (materialState) =>
        materialState.serialize(),
      ),
    };
  }

  public static deserialize(json: object): Solution {
    // @ts-ignore
    const { materialStates } = json;
    return new Solution({
      materialStateMap: mapValues(materialStates, (materialState) =>
        MaterialState.deserialize(materialState),
      ),
    });
  }
}

export { Solution };
