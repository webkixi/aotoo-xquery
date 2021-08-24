const lib = require('../../lib/index')

import {
  listBehavior,
  listComponentBehavior
} from "./list/index";

export const treeBehavior = function(app, mytype) {
  mytype = mytype || 'tree'
  return Behavior({
    behaviors: [listBehavior(app, mytype)],
    lifetimes: {
      created: function created() {
        // this.$$is = 'tree'
        this.childs = {}
      },
    }
  })
}

export const treeComponentBehavior = function(app, mytype) {
  mytype = mytype || 'tree'
  return Behavior({
    behaviors: [treeBehavior(app, mytype)],
  })
}