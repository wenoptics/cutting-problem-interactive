import { MaterialShape, MaterialState } from "~/components/material";
import { ref } from "vue";
import {
  prefillCuttingTargetsPool,
  prefillMaterialsPool,
} from "~/components/prefill";
import { mapValues } from "~/utils";
import { TargetShape } from "~/components/types";

type Solution = {
  [materialId: string]: MaterialState;
};

function serializeSolution(solution: Solution): object {
  return mapValues(solution, (state) => state.serialize());
}

function deserializeSolution(json: object): Solution {
  return mapValues(json, (state) => MaterialState.deserialize(state));
}

function createEmptySolution(
  materialPool: typeof prefillMaterialsPool,
): Solution {
  return mapValues(materialPool, (material) => new MaterialState(material));
}

const defaultData = {
  currentMaterialPool: prefillMaterialsPool,
  currentCuttingTargetPool: prefillCuttingTargetsPool,
  currentSolution: createEmptySolution(prefillMaterialsPool),
};

type SessionData = typeof defaultData;

function saveSessionData(sd: SessionData) {
  const rawData = {
    version: "0.0.1",
    timestamp: Date.now(),
    data: {
      currentMaterialPool: mapValues(sd.currentMaterialPool, (material) =>
        material.serialize(),
      ),
      currentCuttingTargetPool: mapValues(
        sd.currentCuttingTargetPool,
        (target) => target.serialize(),
      ),
      currentSolution: serializeSolution(sd.currentSolution),
    },
  };

  console.debug("Saving session data", rawData);
  // Save data to local storage
  localStorage.setItem("sessionData", JSON.stringify(rawData));
}

function loadSessionData(): SessionData | null {
  // Load data from local storage
  const rawData = localStorage.getItem("sessionData");
  if (rawData) {
    console.log("Session data found", rawData);
    const objData = JSON.parse(rawData);
    if (objData.version !== "0.0.1") {
      confirm(
        "Cannot load data from previous version. Local data will be ignored",
      );
      return null;
    }
    try {
      return {
        currentMaterialPool: mapValues(
          objData.data.currentMaterialPool,
          (material) => MaterialShape.deserialize(material),
        ),
        currentCuttingTargetPool: mapValues(
          objData.data.currentCuttingTargetPool,
          (target) => TargetShape.deserialize(target),
        ),
        currentSolution: deserializeSolution(objData.data.currentSolution),
      };
    } catch (e) {
      console.warn("Failed to deserialize data", e);
      confirm(
        "Failed to load data from local storage. Local data will be ignored",
      );
      return null;
    }
  } else {
    console.log("No session data found");
    return null;
  }
}

const _loadedData = loadSessionData();
// if (_loadedData) {
//   showToast("Session data loaded from local storage");
// }
const _initData: SessionData = _loadedData ?? defaultData;

const sessionData = ref(_initData);

export {
  createEmptySolution,
  Solution,
  sessionData,
  defaultData,
  saveSessionData,
};
