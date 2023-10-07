import { ref } from "vue";
import {
  prefillCuttingTargetsPool,
  prefillMaterialsPool,
} from "~/components/prefill";
import { mapValues } from "~/utils";
import { TargetShape } from "~/components/types";
import { Solution } from "~/components/solution";
import { StorageHelper } from "~/components/storage-helper";

const defaultData = {
  targetPool: prefillCuttingTargetsPool,
  solution: new Solution({ materialList: Object.values(prefillMaterialsPool) }),
};

type SessionData = typeof defaultData;

function serSessionData(d: SessionData) {
  return JSON.stringify(
    {
      targetPool: mapValues(d.targetPool, (target: TargetShape) =>
        target.serialize(),
      ),
      solution: d.solution.serialize(),
    },
    null,
    2,
  );
}
function deserSessionData(s: string | object) {
  const objData = typeof s === "string" ? JSON.parse(s) : s;
  return {
    targetPool: mapValues(objData.targetPool, (target: object) =>
      TargetShape.deserialize(target),
    ),
    solution: Solution.deserialize(objData.solution),
  };
}

const localStorageHelper = new StorageHelper(
  "cutting-problem-interactive-session-data",
);

const _loadedData = localStorageHelper.loadFromLocal();
const _initData: SessionData = _loadedData
  ? deserSessionData(_loadedData)
  : defaultData;

const sessionData = ref(_initData);

export {
  sessionData,
  defaultData,
  localStorageHelper,
  serSessionData,
  deserSessionData,
};
