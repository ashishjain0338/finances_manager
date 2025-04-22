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