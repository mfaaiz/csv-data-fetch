// Requiring the module
import reader from 'xlsx'
import SerpApi from 'google-search-results-nodejs'
import Excel from 'exceljs';

const SEARCH_API_KEY_ONE = "05e105f4137d60a8ea87f7c4241a098fbe15363c9c988309d8016b02ccbb633d"  // used (exhausted i.e completed 100 seraches)
const SEARCH_API_KEY = "74c04fa361971039f980843a3f7c3bfaa29d7535180a3013a6108dbe8edd4cf9"

// declare variables
const search = new SerpApi.GoogleSearch(SEARCH_API_KEY);
let temp
let finalArray = []

let readExcel = () => {
    // Reading our test file
    const file = reader.readFile('firstTwenty.xlsx')

    //writing search result into excel file
    const sheets = file.SheetNames

    // filter individual values of excel and search to SerpApi
    for (let i = 0; i < sheets.length; i++) {
        temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]])
        let params;
        let val
        temp.forEach(async (res) => {
            val = Object.values(res)[0]
            params = {
                q: `${val} no. of beds`,
                location: "Austin, Texas, United States",
                hl: "en",
                gl: "us",
                google_domain: "google.com"
            }
            // serach from google
            serachAPI(val, params)
        })
    }
}

function serachAPI(value, params) {
    search.json(params, (data) => {
        // make an array of records
        createArray(value, data)
    });
}


function createArray(hospitalName, data) {
    let bed = data?.['knowledge_graph']?.['number_of_beds'];
    // console.log("Data====>", hospitalName, bed)
    finalArray.push({ key: hospitalName, value: bed })
    if (finalArray.length === temp.length) {
        writeExcel()
    }
}

function writeExcel() {
    // Create a new workbook
    const workbook = new Excel.Workbook();

    // Add a worksheet to the workbook
    const worksheet = workbook.addWorksheet('My Sheet');

    // Add some data to the worksheet

    console.log(finalArray)
    finalArray.forEach((d, i) => {
        worksheet.addRow([d.key, d.value]);
    });

    // Save the workbook to an .xlsx file
    workbook.xlsx.writeFile('data.xlsx')
        .then(() => {
            console.log('File is written!');
        });
}

readExcel()