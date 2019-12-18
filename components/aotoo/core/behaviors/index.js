export {
  commonBehavior,
  commonMethodBehavior,
  resetStoreEvts,  // 清空全局变量
  reactFun,  // 通用事件响应方法
  setPropsHooks  // 抽离配置中的hooks属性，作为实例hooks的方法
} from "./common";

export {
  itemBehavior,
  itemComponentBehavior
} from "./item";

export {
  listBehavior,
  listComponentBehavior
} from "./list";

export {
  treeBehavior,
  treeComponentBehavior
} from "./tree";

export {
  baseBehavior
} from './base'