var DB = {
    characters: [
        {
            id: 1,
            name: "Harry Potter",
            species: "Human",
            house: "Gryffindor",
            ancestry: "Half-blood",
            wand: {
                core: "Phoenix feather",
                length: 11
            },
            hogwartsStudent: true,
            hogwartsStaff: false
        },
        {
            id: 2,
            name: "Severus Snape",
            species: "Human",
            house: "Slytherin",
            ancestry: "Half-blood",
            wand: {
            core: ""
            ,
            length: ""
            ,
            },
            hogwartsStudent: false,
            hogwartsStaff: true,
        },
        {
            id: 3,
            name: "Rubeus Hagrid",
            species: "Half-giant",
            house: "Gryffindor",
            ancestry: "Half-blood",
            wand: {
            core: ""
            ,
            length: 16,
            },
            hogwartsStudent: false,
            hogwartsStaff: true,
        },
        {
            id: 4,
            name: "Cedric Diggory",
            species: "Human",
            house: "Hufflepuff",
            ancestry: ""
            ,
            wand: {
            core: "Unicorn hair",
            length: 12.25,
            },
            hogwartsStudent: true,
            hogwartsStaff: false,
        },
        {
            id: 5,
            name: "Draco Malfoy",
            species: "Human",
            house: "Slytherin",
            ancestry: "Pure-blood",
            wand: {
            core: "Unicorn tail-hair",
            length: 10,
            },
            hogwartsStudent: true,
            hogwartsStaff: false,
        }
    ]
};

module.exports = DB;