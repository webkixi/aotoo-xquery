module.exports = function(params) {

  return {
    methods: {
      pickerChange(e){
        console.log(e);
      },

      pvColumnChangeAction(e){
        if(e.detail.columnValue) {
          let columnValue = e.detail.columnValue
          let {column, value} = columnValue
          if (column === 0) {
            if (value === 0) {
              this.updateNextColumn([
                {title: '老虎', id: '102'},
                {title: '狮子', id: '103'},
                {title: '豹子', id: '104', select: true},
                {title: '野狗', id: '105'},
              ])
            }
            if (value === 1) {
              this.updateNextColumn([
                {title: '01', id: '102'},
                {title: '02', id: '103'},
                {title: '03', id: '102'},
                {title: '04', id: '103'},
                {title: '05', id: '102'},
                {title: '06', id: '103'},
                {title: '07', id: '102'},
                {title: '08', id: '103'},
                {title: '09', id: '102'},
                {title: '10', id: '103'},
                {title: '11', id: '102'},
                {title: '12', id: '103'},
              ])
            }
          }
        }
      },

      columnChangeAction(e){
        if (e.detail.column === 0) {
          if (e.detail.value === 0) {
            this.updateNextColumn([
              {title: '老虎', id: '102'},
              {title: '狮子', id: '103'},
              {title: '豹子', id: '104', select: true},
              {title: '野狗', id: '105'},
            ])
          }
          if ( e.detail.value === 1) {
            this.updateNextColumn([
              {title: '老虎', id: '102'},
              {title: '狮子', id: '103', select: true},
            ])
          }
        }
      }
    },


    config: [
      {
        title: '单选择器',
        input: [
          {
            id: 'test_picker',
            type: 'picker',
            title: '标题',
            values: [
              [
                {title: '选项一', id: '100'},
                {title: '选项二', id: '101', select: true},
                {title: '选项三', id: '102'},
              ]
            ]
          },
        ]
      },
      
      
      {
        title: '双选择器',
        input: [
          {
            id: 'test_pickers2',
            type: 'picker',
            title: '标题',
            bindchange: 'pickerChange',
            bindcolumnchange: 'columnChangeAction',
            values: [
              [
                {title: '猫科', id: '100', select: true},
                {title: '狗科', id: '101'},
              ],
              [
                {title: '老虎', id: '102'},
                {title: '狮子', id: '103'},
                {title: '豹子', id: '104', select: true},
                {title: '野狗', id: '105'},
              ],
            ],
          },
        ]
      },


      {
        title: '三选择器',
        input: [
          {
            id: 'test_pickers3',
            type: 'picker',
            title: '标题',
            bindcolumnchange: true,
            values: [
              [
                {title: '猫科', id: '100', select: true},
                {title: '狗科', id: '101'},
              ],
              [
                {title: '老虎', id: '102'},
                {title: '狮子', id: '103'},
                {title: '豹子', id: '104', select: true},
                {title: '野狗', id: '105'},
              ],
              [
                {title: '猎豹', id: '106'},
                {title: '猞猁', id: '107'},
                {title: '英短', id: '108'}
              ]
            ],
          },
        ]
      },


      {
        title: '四选择器',
        input: [
          {
            id: 'test_pickers4',
            type: 'picker',
            title: '标题',
            values: [
              [
                {title: '猫科', id: '100', select: true},
                {title: '狗科', id: '101'},
              ],
              [
                {title: '老虎', id: '102'},
                {title: '狮子', id: '103'},
                {title: '豹子', id: '104', select: true},
                {title: '野狗', id: '105'},
              ],
              [
                {title: '猎豹', id: '106'},
                {title: '猞猁', id: '107'},
                {title: '英短', id: '108'}
              ],
              [
                {title: '猎豹', id: '106'},
                {title: '猞猁', id: '107'},
                {title: '英短', id: '108'}
              ]
            ],
          },
        ]
      },


      {
        title: '五选择器',
        input: [
          {
            id: 'test_pickers5',
            type: 'picker',
            title: '标题',
            values: [
              [
                {title: '猫科', id: '100', select: true},
                {title: '狗科', id: '101'},
              ],
              [
                {title: '老虎', id: '102'},
                {title: '狮子', id: '103'},
                {title: '豹子', id: '104', select: true},
                {title: '野狗', id: '105'},
              ],
              [
                {title: '猎豹', id: '106'},
                {title: '猞猁', id: '107'},
                {title: '英短', id: '108'}
              ],
              [
                {title: '猎豹', id: '106'},
                {title: '猞猁', id: '107'},
                {title: '英短', id: '108'}
              ],
              [
                {title: '猎豹', id: '106'},
                {title: '猞猁', id: '107'},
                {title: '英短', id: '108'}
              ]
            ],
          },
        ]
      },


      {
        title: 'picke-view',
        input: [{
          id: 'custom-target-time',
          type: 'picker-view',
          value: [0, 0, 0],
          bindchange: 'pvColumnChangeAction',
          titles: [{title: '值'}, {title: '时'}, {title: '分'}, {title: '秒'}], // theader
          values: [
            [
              {title: '24小时制', id: 1},
              {title: '12小时制', id: 2},
            ],
            
            [
              {title: '01', id: 1},
              {title: '02', id: 2},
              {title: '03', id: 3},
              {title: '04', id: 4},
              {title: '05', id: 5},
            ],

            [
              {title: '01', id: 1},
              {title: '02', id: 2},
              {title: '03', id: 3},
              {title: '04', id: 4},
              {title: '05', id: 5},
              {title: '60', id: 60},
            ],

            [
              {title: '01', id: 1},
              {title: '02', id: 2},
              {title: '03', id: 3},
              {title: '04', id: 4},
              {title: '05', id: 5},
            ]
          ],
        }]
      }

    ]
  }
}