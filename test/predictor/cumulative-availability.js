var chai = require("chai");

var expect = chai.expect;

const Seeded = require('../../server/utils/seeded');
const getCumulativeAvailability = require('../../server/utils/availability').getCumulativeAvailability;
const volunteerRepository = require('../../server/repositories').VolunteerRepository;

describe('Cumulative Availability for Seeded', function() {

    it('Returns zeroed array for Seeded Volunteers', async function() {
        var cumulative = await getCumulativeAvailability();

        expect(cumulative).to.eql(Array(7).fill([0,0,0]));
    })
});

describe('Cumulative Availability', async function() {

    // Update a volunteer to maximum availability
    before( async function() {
        await volunteerRepository.updateAvailability(
            Seeded.volunteers[0].UUID,
            Array(7).fill(['2', '2', '2'])
        );
    })

    // Set volunteer availability back to default
    after( async function() {
        await volunteerRepository.updateAvailability(
            Seeded.volunteers[0].UUID,
            Array(7).fill(['0', '0', '0'])
        );
    })

    it('Returns array of 1s for single volunteer with maximum availability', async function() {
        var cumulative = await getCumulativeAvailability();

        console.log(cumulative);

        expect(cumulative).to.eql(Array(7).fill([1, 1, 1]));
    })
});