const { Events } = require('discord.js');
const currentDate = require('./currentDate');
const birthdayDb = require('../../hydra')
const birthdaySchema = require('../../schemas/fun/birthdaySchema');

module.exports = {
    name: Events.MessageCreate,
    once: true,
    execute() {
        const formattedCurrentDate = currentDate.toDateString();
        const queryAllBirthdays = () => {
            birthdaySchema.find({} , (err, birthday) => {
                if(err) {
                    console.error(err + "The birthday updater has broken");
                }
                    birthday.map(birthdays => {
                        const fetchBDay = birthdays.get("birth_date")
                        const formattedFetchBDay = fetchBDay.toDateString();
                        if (formattedFetchBDay == formattedCurrentDate) {
                            ;
                        }
                    })
            })
        }



















    },
};

