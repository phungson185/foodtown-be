const Sponsor = require('../models/sponsor');

const addSponsor = async (sponsor) => {
    try {
        const newSponsor = new Sponsor({
            name: sponsor.name, 
            logo: {
                name: sponsor.logo.originalname, 
                data: sponsor.logo.buffer
        }});
        await newSponsor.save();
        return newSponsor;
    } catch (error) {
        console.log({error});
    }
}

const getAllSponsors = async () => {
    try {
        const sponsors = await Sponsor.find({});
        return sponsors;
    } catch (error) {
        console.log({error});
    }
}

module.exports = {
    addSponsor,
    getAllSponsors
}