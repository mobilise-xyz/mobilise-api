const moment = require('moment');

// This is used for shifts, so that they don't disappear after you pass the date.
const futureDate = moment().add(7, 'days').format('YYYY-MM-DD')

const roles = [
  {
    name: `Driver's Mate`,
    involves: 'Heavy Lifting',
    colour: '#2C72DC',
    createdAt: '2019-06-06',
    updatedAt: '2019-06-06'
  },
  {
    name: 'Warehouse Assistant',
    involves: 'Organising and Sorting Food',
    colour: '#F08080',
    createdAt: '2019-06-06',
    updatedAt: '2019-06-06'
  },
  {
    name: 'Driver',
    involves: 'Driving a van',
    colour: '#BCE7FD',
    createdAt: '2019-06-06',
    updatedAt: '2019-06-06'
  }
];

module.exports = {
    
  // Seeded admin details
  admins: [
    {
      email: 'francesca@testing.com',
      password: 'Admin123',
      UUID: '8fa1b90c-80b6-11e9-bc42-526af7764f00',
      firstName: 'Francesca',
      lastName: 'Santucci',
      isAdmin: true,
      dob: '1997-11-25',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06',
      telephone: '07979797979'
    },
    {
      email: 'paula@testing.com',
      password: 'Admin123',
      UUID: '8fa1b90c-80b6-11e9-bc42-526af7764f01',
      firstName: 'Paula',
      lastName: 'Merrony',
      isAdmin: true,
      dob: '1997-11-25',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06',
      telephone: '07979797979'
    }
  ],

  // Seeded volunteer details
  volunteers: [
    {
      email: 'ben@testing.com',
      password: 'Volunteer123',
      UUID: '8fa1b3d0-80b6-11e9-bc42-526af7764f50',
      firstName: 'Ben',
      lastName: 'Smith',
      isAdmin: false,
      dob: '1997-11-25',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06',
      telephone: '07979797979'
    },
    {
      email: 'dave@testing.com',
      password: 'Volunteer123',
      UUID: '8fa1b3d0-80b6-11e9-bc42-526af7764f51',
      firstName: 'Dave',
      lastName: 'Hughes',
      isAdmin: false,
      dob: '1997-11-25',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06',
      telephone: '07979797979'
    },
    {
      email: 'will@testing.com',
      password: 'Volunteer123',
      UUID: '8fa1b3d0-80b6-11e9-bc42-526af7764f52',
      firstName: 'Will',
      lastName: 'Burr',
      isAdmin: false,
      dob: '1997-11-25',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06',
      telephone: '07979797979'
    }
  ],

  // Seeded role details
  roles: roles,

  shifts: [
    {
      UUID: 'f2e8f0a3-16fc-465e-b80c-9aa573f6dc00',
      title: 'Food Pickup',
      description: 'Collect food from Food Bank',
      date: futureDate,
      start: '09:00',
      stop: '11:00',
      address: 'Food Bank, Acton',
      creatorId: '8fa1b90c-80b6-11e9-bc42-526af7764f01',
      createdAt: moment().format('YYYY-MM-DD'),
      updatedAt: moment().format('YYYY-MM-DD'),
      rolesRequired: [
        {
          roleName: roles[0].name,
          number: 10
        },
        {
          roleName: roles[1].name,
          number: 5
        }
      ]
    },
    {
      UUID: 'f2e8f0a3-16fc-465e-b80c-9aa573f6dc01',
      title: 'Food Delivery',
      description: 'Deliver food to Homeless Shelter',
      date: futureDate,
      start: '16:00',
      stop: '18:00',
      address: 'Shepherds Bush Families Project, W12 8AP',
      creatorId: '8fa1b90c-80b6-11e9-bc42-526af7764f01',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06',
      rolesRequired: [
        {
          roleName: roles[0].name,
          number: 10
        }
      ]
    }
  ]
}

