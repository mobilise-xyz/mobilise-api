const roles = [
  {
    name: `Driver's Mate`,
    involves: 'Heavy Lifting',
  },
  {
    name: 'Warehouse Assistant',
    involves: 'Organising and Sorting Food',
  },
  {
    name: 'Floral Designer',
    involves: 'Showcasing flowers',
  }
];

module.exports = {
    
  // Seeded admin details
  admins: [
    {
      email: 'seededadmin1@testing.com',
      password: 'Admin123',
      UUID: '8fa1b90c-80b6-11e9-bc42-526af7764f00',
      firstName: 'Jane',
      lastName: 'Doe',
      isAdmin: true,
      dob: '1997-11-25',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06',
      telephone: '07979797979'
    },
    {
      email: 'seededadmin2@testing.com',
      password: 'Admin123',
      UUID: '8fa1b90c-80b6-11e9-bc42-526af7764f01',
      firstName: 'Jane',
      lastName: 'Doe',
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
      email: 'seededvolunteer1@testing.com',
      password: 'Volunteer123',
      UUID: '8fa1b3d0-80b6-11e9-bc42-526af7764f50',
      firstName: 'Dave',
      lastName: 'Hughes',
      isAdmin: false,
      dob: '1997-11-25',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06',
      telephone: '07979797979'
    },
    {
      email: 'seededvolunteer2@testing.com',
      password: 'Volunteer123',
      UUID: '8fa1b3d0-80b6-11e9-bc42-526af7764f51',
      firstName: 'Dave',
      lastName: 'Hughes',
      isAdmin: false,
      dob: '1997-11-25',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06',
      telephone: '07979797979'
    }
  ],

  // Seeded role details
  roles: [
    {
      name: roles[0].name,
      involves: roles[0].involves,
      colour: '#2C72DC',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06'
    },
    {
      name: roles[1].name,
      involves: roles[1].involves,
      colour: '#F08080',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06'
    },
    {
      name: roles[2].name,
      involves: roles[2].involves,
      colour: '#BCE7FD',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06'
    }
  ],

  shifts: [
    {
      UUID: 'f2e8f0a3-16fc-465e-b80c-9aa573f6dc00',
      title: 'Food Pickup',
      description: 'Collect food from Food Bank',
      date: '2019-07-08',
      start: '16:00',
      stop: '18:00',
      address: 'Food Bank, Acton',
      creatorId: '8fa1b90c-80b6-11e9-bc42-526af7764f01',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06',
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
      title: 'Chelsea Flower Show',
      description: 'Volunteer for a better tomorrow',
      date: '2019-07-10',
      start: '16:00',
      stop: '18:00',
      address: 'Royal Chelsea Hospital, Chelsea',
      creatorId: '8fa1b90c-80b6-11e9-bc42-526af7764f01',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06',
      rolesRequired: [
        {
          roleName: roles[2].name,
          number: 20
        }
      ]
    }
  ]
}

