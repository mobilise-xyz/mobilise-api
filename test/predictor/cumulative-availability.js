var chai = require("chai");

var expect = chai.expect;

const Seeded = require('../../server/utils/seeded');
const Predictor = require('../../server/recommenderSystem').Predictor;

describe('Cumulative Availability', function() {

    it('Returns zeroed array for Seeded Volunteers', async function() {
        var cumulative = await Predictor.getCumulativeAvailability();

        expect(cumulative).to.eql(Array(7).fill([0,0,0]));
    })
})