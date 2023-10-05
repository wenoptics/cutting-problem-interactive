import { ref } from "vue";
import {
  prefillCuttingTargetsPool,
  prefillMaterialsPool,
} from "~/components/prefill";
import { mapValues } from "~/utils";
import { TargetShape } from "~/components/types";
import { Solution } from "~/components/solution";

const defaultData = {
  targetPool: prefillCuttingTargetsPool,
  solution: new Solution({ materialList: Object.values(prefillMaterialsPool) }),
};

type SessionData = typeof defaultData;

function saveSessionData(sd: SessionData) {
  const rawData = {
    version: 1.0,
    timestamp: Date.now(),
    data: {
      targetPool: mapValues(sd.targetPool, (target) => target.serialize()),
      solution: sd.solution.serialize(),
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
    if (objData.version >= 2.0) {
      confirm(
        "Cannot load data from previous version. Local data will be ignored",
      );
      return null;
    }
    try {
      return {
        targetPool: mapValues(objData.data.targetPool, (target: object) =>
          TargetShape.deserialize(target),
        ),
        solution: Solution.deserialize(objData.data.solution),
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

export { sessionData, defaultData, saveSessionData };
