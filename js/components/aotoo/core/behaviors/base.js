import {
  commonBehavior,
  commonMethodBehavior,
}
from "./common";

export const baseBehavior = function (app, mytype) {
  mytype = mytype || 'tree'
  return Behavior({
    behaviors: [commonBehavior(app, mytype), commonMethodBehavior(app, mytype)],
  })
}