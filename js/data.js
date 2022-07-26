const DATA = {
  // These are the ingredients that are:
  // automatically produced
  // manually grown
  farm: [
    {
      id: 'water',
      tags: ['liquid'],
      time: 1, // time to make 1 unit
      reqs: [] // required purchases
    },
    {
      id: 'wheat',
      tags: ['plant'],
      time: 3,
      reqs: []
    }
  ],
  factory: [
    {
      id: 'flour',
      tags: [],
      time: 1,
      ingredients: [
        {
          id: 'wheat',
          qty: 1
        }
      ],
      reqs: []
    },
    {
      id: 'dough',
      tags: [],
      time: 1,
      ingredients: [
        {
          id: 'flour',
          qty: 1
        },
        {
          id: 'water',
          qty: 1
        }
      ],
      reqs: []
    }
  ],
  // These are the recipes in the cookbook
  food: [
    {
      id: 'bread',
      time: 1,
      ingredients: [
        {
          id: 'dough',
          qty: 1,
        },
      ],
      reqs: [
        'oven'
      ],
      output: {
        id: 'bread',
        qty: 1,
      },
    },
  ],

  // These are things the player can buy
  store: [
    {
      id: 'oven-0',
      tags: ['oven'],
      cost: 0,
      reqs: []
    },
  ]
}