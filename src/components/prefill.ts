// ------------------------------
// Prepare data - material
// ------------------------------

import prefillMaterials from "~/components/prefill_data/material.json";
import { TargetShape, TargetShapePool } from "~/components/types";
import prefillCuttingTargets from "~/components/prefill_data/cutting-targets.json";
import { MaterialShape } from "~/components/material";

const prefillMaterialsList: MaterialShape[] = Object.entries(
  prefillMaterials,
).map(
  ([id, data]) =>
    new MaterialShape(
      id,
      data.leftEnd ?? 0,
      data.rightEnd ?? 0,
      data.length as unknown as number,
    ),
);
const prefillMaterialsPool: Record<string, MaterialShape> = Object.fromEntries(
  prefillMaterialsList.map((material) => [material.id, material]),
);
console.debug("prefillMaterials", prefillMaterials, prefillMaterialsPool);

// ------------------------------
// Prepare data - cutting targets
// ------------------------------
type JSON_CuttingTarget = {
  ID: string;
  End1: 0 | 1 | 2 | 3 | 4;
  End2: 0 | 1 | 2 | 3 | 4;
  Length: number | "" | undefined;
};
const prefillCuttingTargetsPool: TargetShapePool = Object.fromEntries(
  (prefillCuttingTargets as JSON_CuttingTarget[])
    .filter((target) => typeof target.Length === "number")
    .map((target) => {
      const { ID, End1, End2, Length } = target;
      const shape = new TargetShape(ID, End1, End2, Length as number);
      return [ID, shape];
    }),
);
console.debug(
  "prefillCuttingTargets",
  prefillCuttingTargets,
  prefillCuttingTargetsPool,
);

export { prefillMaterialsPool, prefillCuttingTargetsPool };
