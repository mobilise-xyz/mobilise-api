let chai = require("chai");
let {expect} = chai;
let { describe, it, before, after } = require("mocha");
const Seeded = require('../../server/utils/seeded');
const {getCumulativeAvailability} = require('../../server/utils/availability');
const volunteerRepository = require('../../server/repositories').VolunteerRepository;
const Op = require("../../server/models").Sequelize.Op;

describe('Cumulative Availability for Seeded', function() {

    it('Returns zeroed array for Seeded Volunteers', async function() {

        let allVolunteers = await volunteerRepository.getAll();
        let seededVolunteers = await volunteerRepository.getAll({
            userId: { [Op.in]: [Seeded.volunteers[0].UUID, Seeded.volunteers[1].UUID] }
        });

        if (allVolunteers.length === seededVolunteers.length) {
            let cumulative = await getCumulativeAvailability();

            expect(cumulative).to.eql(Array(7).fill([0,0,0]));
        }
    })
});

describe('Cumulative Availability', async function() {

    // Update a volunteer to maximum availability
    before( async function() {
        await volunteerRepository.updateAvailability(
            Seeded.volunteers[0].UUID,
            Array(7).fill(['2', '2', '2'])
        );
    });

    // Set volunteer availability back to default
    after( async function() {
        await volunteerRepository.updateAvailability(
            Seeded.volunteers[0].UUID,
            Array(7).fill(['0', '0', '0'])
        );
    });

    it('Returns array of 1s for single volunteer with maximum availability', async function() {

        let allVolunteers = await volunteerRepository.getAll();
        let seededVolunteers = await volunteerRepository.getAll({
            userId: { [Op.in]: [Seeded.volunteers[0].UUID, Seeded.volunteers[1].UUID] }
        });

        if (allVolunteers.length === seededVolunteers.length) {
            let cumulative = await getCumulativeAvailability();

            expect(cumulative).to.eql(Array(7).fill([1, 1, 1]));
        }
    })
});