export const MANDATORY_COLS = [
    {
        "name": "fund_type",
        "pattern": ["type"]
    }, {
        "name": "bank_name",
        "pattern": ["bank"]
    }, {
        "name": "fund_number",
        "pattern": ["account", "a/c", "policy"]
    }, {
        "name": "name",
        "pattern": ["name"]
    }, {
        "name": "nomination",
        "pattern": ["nomination", "nominee"]
    }, {
        "name": "amount",
        "pattern": ["amount"]
    }, {
        "name": "is_closed",
        "pattern": ["closed"]
    }, {
        "name": "maturity_date",
        "pattern": ["maturity-date"]
    }
];

export const ALLOWED_NAMES = [
    "shri",
    "shree",
    "navneet",
    "poonam",
    "ashish",
    "hiteshi",
    "chirag",

    "raman",
    "sarita",
    "daizy",
    "shubhangi",
    "happy",

    "sharda"
]

export const FILLER_WORDS = [
    " ",
    "jain",
    "and",
    "&",
    "chand",
    "box",
    "factory"
]

/* It would be good not to expand the list for 10-20 years to come 🙏*/
export const HONORED_NAMES = [
    "navneet",
    "shri",
    "shree",
    "sharda"
]

export const DOUGHNUT_COLORS = [
    "rgb(75,192,192)",
    "rgb(255,159,64)",
    "#36EB7E",
    "rgb(255, 99, 132)",
    "rgb(54, 162, 235)",
    "rgb(255, 205, 86)",
    "#90EBE2",
    "#36EBD9",
    "#FFB1C2",
    "#FFC7B1",
    "#FFE3D7",
    "rgb(203, 86, 111)",
    "rgb(88, 79, 112)",
    "rgb(159, 156, 165)",
    "rgb(127, 154, 157)"
]

export const DUMMMY_AGGRID_DATA = [
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
]

export const DUMMMY_AGGRID_COLDEFS = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" }
]

export const DUMMY_DOUGHTNUT_DATA = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
        {
            label: 'My Dataset',
            data: [300, 50, 100],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            borderWidth: 1,
        },
    ],
};

export const DANGER_LEVEL_DEFS = {
    "1": [{"primary": false, "secondary": false, "nomination": false}],
    "2": [{"primary": false, "secondary": false, "nomination": true}],
    "3": [{"primary": true, "secondary": false, "nomination": false}, {"primary": false, "secondary": true, "nomination": false} ],
    "4": [{"primary": true, "secondary": false, "nomination": true}, {"primary": false, "secondary": true, "nomination": true}],
    "5": [{"primary": true, "secondary": true, "nomination": false}],
    "6": [{"primary": true, "secondary": true, "nomination": true}],
}

export const DANGER_LEVEL_DEFS_EXCEL = [
    {"Primary": "No", "Secondary": "No", "Nomination": "No", "Level": 1},
    {"Primary": "No", "Secondary": "No", "Nomination": "Yes", "Level": 2},
    {"Primary": "Yes", "Secondary": "No", "Nomination": "No", "Level": 3},
    {"Primary": "No", "Secondary": "Yes", "Nomination": "No", "Level": 3},
    {"Primary": "Yes", "Secondary": "No", "Nomination": "Yes", "Level": 4},
    {"Primary": "No", "Secondary": "Yes", "Nomination": "Yes", "Level": 4},
    {"Primary": "Yes", "Secondary": "Yes", "Nomination": "No", "Level": 5},
    {"Primary": "Yes", "Secondary": "Yes", "Nomination": "Yes", "Level": 6},
]