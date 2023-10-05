import { TargetShape } from "~/components/types";

const MATERIAL_WIDTH = 1.8;

/**
 * These are the only valid adapter cuts
 */
const AdapterCuts: TargetShape[] = [
  new TargetShape("AD0_1", 0, 1, MATERIAL_WIDTH),
  new TargetShape("AD0_3", 0, 3, 0),
  new TargetShape("AD2_0", 2, 0, 0),
  new TargetShape("AD2_1", 2, 1, MATERIAL_WIDTH),
  new TargetShape("AD2_3", 2, 3, 0),
  new TargetShape("AD4_0", 4, 0, MATERIAL_WIDTH),
  new TargetShape("AD4_1", 4, 1, MATERIAL_WIDTH * 2),
  new TargetShape("AD4_3", 4, 3, MATERIAL_WIDTH),
];

const AdapterCutsMap: Record<string, TargetShape> = Object.fromEntries(
  AdapterCuts.map((c) => [c.id, c]),
);

function isAdapterCut(shape: TargetShape | string): boolean {
  const id = typeof shape === "string" ? shape : shape.id;
  // eslint-disable-next-line no-prototype-builtins
  return AdapterCutsMap.hasOwnProperty(id);
}

export { AdapterCuts, AdapterCutsMap, isAdapterCut };
