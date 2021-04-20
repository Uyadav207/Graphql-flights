const graphql = require('graphql');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLList
} = graphql;

// dummy test data

const Flights = [
    { name: "AirIndia", from: "lucknow", to: "delhi", fair: 2504, class: "Business", id: "1",},
    { name: "AirAsia", from: "delhi", to: "mumbai", fair: 9873, class: "economy", id: "2" },
    { name: "Indigo", from: "odissa", to: "banglore", fair: 5472, class: "Business", id: "3",},
    { name: "boing", from: "USA", to: "chicago", fair: 6764, class: "A", id: "4" },
    { name: "emirates", from: "Dubai", to: "NYC", fair: 9533, class: "VIP", id: "5" },
];

const Passengers = [
    { name: "utkarsh", age: 20, luggage: { carry: true, number: 2, type: "Bag", weight: 10 }, id: "1", flightId: "2" },
    { name: "Priyanka Yadav", age: 26, luggage: { carry: true, number: 1, type: "Suitcase", weight: 20 }, id: "2", flightId: "1" },
    { name: "Ekansh", age: 20, luggage: { carry: false, number: 0, type: "null", weight: 0 }, id: "3", flightId: "2" },
    { name: "vijay Laxmi Yadav", age: 50, luggage: { carry: false, number: 0, type: "null", weight: 0 }, id: "4", flightId: "1" },
    { name: "Ashok Kumar Yadav", age: 52, luggage: { carry: true, number: 3, type: "Briefcase", weight: 10 }, id: "5", flightId: "3" },
    { name: "Ashok Kumar Yadav", age: 52, luggage: { carry: true, number: 3, type: "Briefcase", weight: 10 }, id: "6", flightId: "2" }
]


const LuggageType = new GraphQLObjectType({
    name: 'Luggage',
    fields: () => ({
        carry: { type: GraphQLBoolean },
        number: { type: GraphQLInt },
        type: { type: GraphQLString },
        weight: { type: GraphQLInt },
    })
});

const FlightType = new GraphQLObjectType({
    name: 'Flight',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        from: { type: GraphQLString },
        to: { type: GraphQLString },
        fair: { type: GraphQLInt },
        class: { type: GraphQLString },
        passengers: {
            type: new GraphQLList(PassengerType),
            resolve(parent, args) {
                return _.filter(Passengers, { flightId: parent.id })
            }
        }
    })
});

const PassengerType = new GraphQLObjectType({
    name: 'Passenger',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        luggage: { type: new GraphQLNonNull(LuggageType) },
        flight: {
            type: FlightType,
            resolve(parent, args) {
                return _.find(Flights, { id: parent.flightId })
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        flight: {
            type: FlightType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(Flights, { id: args.id });
            }
        },
        passenger: {
            type: PassengerType,
            args: { id: { type: GraphQLID } },
            resolve(parents, args) {
                return _.find(Passengers, { id: args.id });
            }
        }
    }
})


module.exports = new graphql.GraphQLSchema({
    query: RootQuery
})