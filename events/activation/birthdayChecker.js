const { Events } = require('discord.js');
const currentDate = require('./currentDate');
const birthdaySchema = require('../../schemas/fun/birthdaySchema');

module.exports = {
    name: Events.MessageCreate,
    once: true,
    execute() {
        const fetchCurrentDate = currentDate.toDateString();
        const formattedCurrentDate = fetchCurrentDate.replace((19|20)[0-9][0-9]);
        const queryAllBirthdays = () => {
            function findGermanShepard(dogs){
                for (let i=0; i<dogs.length; i++){
                    const dog = dogs[i];
                    if(dog.name == formattedCurrentDate){
                        return dog
                    }
                }
                return null;
            }
        }



















    },
};

