module.exports = {
    
  // Seeded admin details
  admins: [
    {
      email: 'seededadmin1@testing.com',
      password: 'Admin123',
      UUID: '8fa1b90c-80b6-11e9-bc42-526af7764f00',
      firstName: 'Seeded Admin 1',
      lastName: 'Adminson',
      isAdmin: true,
      dob: '1997-11-25',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06'
    },
    {
      email: 'seededadmin2@testing.com',
      password: 'Admin123',
      UUID: '8fa1b90c-80b6-11e9-bc42-526af7764f01',
      firstName: 'Seeded Admin 2',
      lastName: 'Adminson',
      isAdmin: true,
      dob: '1997-11-25',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06'
    }
  ],

  // Seeded volunteer details
  volunteers: [
    {
      email: 'seededvolunteer1@testing.com',
      password: 'Volunteer123',
      UUID: '8fa1b3d0-80b6-11e9-bc42-526af7764f50',
      firstName: 'Seeded Volunteer 1',
      lastName: 'Volunteerson',
      isAdmin: false,
      dob: '1997-11-25',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06'
    },
    {
      email: 'seededvolunteer2@testing.com',
      password: 'Volunteer123',
      UUID: '8fa1b3d0-80b6-11e9-bc42-526af7764f51',
      firstName: 'Seeded Volunteer 2',
      lastName: 'Volunteerson',
      isAdmin: false,
      dob: '1997-11-25',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06'
    }
  ],

  // Seeded role details
  roles: [
    {
      name: 'Seeded Role',
      involves: 'Testing',
      colour: '#2C72DC',
      createdAt: '2019-06-06',
      updatedAt: '2019-06-06'
    }
  ]
}

