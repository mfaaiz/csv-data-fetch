// Requiring the module
import reader from "xlsx";
import SerpApi from "google-search-results-nodejs";
import Excel from "exceljs";

const SEARCH_API_KEY_ONE =
    "05e105f4137d60a8ea87f7c4241a098fbe15363c9c988309d8016b02ccbb633d"; //Faaiz:  used (exhausted i.e completed 100 seraches)
const SEARCH_API_KEY_TWO =
    "74c04fa361971039f980843a3f7c3bfaa29d7535180a3013a6108dbe8edd4cf9"; //Hamza:  used (exhausted i.e completed 100 seraches)
const SEARCH_API_KEY =
    "fdae8ad8549f85c7bd4bfb962d49d850871622598ad347f743caf23ee63c7caf"; //PROD : 30,000 SEARCHES

// declare variables
const search = new SerpApi.GoogleSearch(SEARCH_API_KEY);
let temp;
let finalArray = [];

let firstTime = true;
let bed;
let confidence;

let readExcel = () => {
    // Reading our test file
    const file = reader.readFile("firstTwoHundred.xlsx");

    //writing search result into excel file
    const sheets = file.SheetNames;

    // filter individual values of excel and search to SerpApi
    for (let i = 0; i < sheets.length; i++) {
        temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
        let params;
        let val;
        temp.forEach(async (res) => {
            val = Object.values(res)[0];
            params = {
                q: `${val} no. of beds`,
                location: "",
                hl: "en",
                gl: "us",
                google_domain: "google.com",
            };
            // serach from google
            serachAPI(val, params);
        });
    }
};

function serachAPI(value, params) {
    search.json(params, (data) => {
        // make an array of records
        createArray(value, data);
    });
}

function createArray(hospitalName, data) {
    let keys = ["knowledge_graph", "answer_box", "organic_results"];
    const extractedData = Object.assign(
        {},
        ...keys.map((key) => ({ [key]: data[key] }))
    );
    let result = makeNestedSearchOnResult(extractedData, hospitalName);

    finalArray.push({
        key: hospitalName,
        value: result.number_of_beds,
        confidence: result.confidence_level,
    });
    if (finalArray.length === temp.length) {
        writeExcel();
    }
}

function writeExcel() {
    // Create a new workbook
    const workbook = new Excel.Workbook();

    // Add a worksheet to the workbook
    const worksheet = workbook.addWorksheet("My Sheet");

    worksheet.columns = [
        { header: "Site Name", key: "Site Name", width: 92 },
        { header: "No of Beds", key: "No of Beds", width: 16 },
        { header: "Confidence Level", key: "Confidence Level", width: 20 },
    ];

    // Add some data to the worksheet
    finalArray.forEach((d, i) => {
        worksheet.addRow([d.key, d.value, d.confidence]);
    });

    // Save the workbook to an .xlsx file
    workbook.xlsx.writeFile("result-firstTwoHundred.xlsx").then(() => {
        console.log("File is written!");
    });
}

function makeNestedSearchOnResult(obj, hospitalName) {
    let number_of_beds;
    let confidence_level;

    if (obj?.knowledge_graph?.number_of_beds !== undefined) {
        number_of_beds = obj["knowledge_graph"]["number_of_beds"];
        confidence_level = 1;
    } else if (obj?.answer_box !== undefined) {
        if (obj.answer_box?.answer !== undefined) {
            number_of_beds = obj["answer_box"]["answer"];
            confidence_level = 1;
        } else if (obj.answer_box?.contents?.table !== undefined) {
            let table = obj.answer_box?.contents?.table;
            table.forEach((singleArr, index, array) => {
                if (singleArr[0].toLowerCase().includes("bed")) {
                    number_of_beds = singleArr[1];
                    confidence_level = 1;
                }
            });
        } else if (obj.answer_box?.snippet !== undefined) {
            let resultFromAnswerBox = countBeds(obj.answer_box, hospitalName);
            number_of_beds = resultFromAnswerBox.number_of_beds;
            confidence_level = resultFromAnswerBox.confidence_level;
        }
    } else if (obj?.organic_results !== undefined) {
        let resultFromOrganicResult = countBeds(
            obj.organic_results[0],
            hospitalName
        );
        number_of_beds = resultFromOrganicResult?.number_of_beds;
        confidence_level = resultFromOrganicResult?.confidence_level;
    }
    return { number_of_beds, confidence_level };
}

function countBeds(obj, hospitalName) {
    if (obj.title.toLowerCase().includes(hospitalName.toLowerCase())) {
        let pattern = /\d+/g;
        let beds_string = obj.snippet.toString(); //converting array to string
        let without_space = beds_string.replace(/ /g, ""); //removing the spaces from string
        without_space = without_space.toLowerCase();
        let bedIndex = without_space.indexOf("bed");

        let beforeBed = without_space.substring(bedIndex - 14, bedIndex).trim(); // extract the number before "bed"
        let afterBed = without_space.substring(bedIndex + 7, bedIndex + 7).trim(); // extract the number after "bed"
        let arr = [];
        arr.push(beforeBed.match(pattern));
        arr.push(afterBed.match(pattern));
        //doing this for values like 2,000 , 1,000
        //the match pattern splits up values like 2,000 into 2 and 000
        //so we are checking if at 0 index there is an array which contains 2 at 0 and 000 at 1
        //we are then adding both,placing at 0 index and removing the second index
        if (arr[0] != null) {
            let zeroIndexofArray = arr[0];
            if (zeroIndexofArray.length > 1) {
                zeroIndexofArray[0] = zeroIndexofArray[0] + zeroIndexofArray[1];
                zeroIndexofArray.splice(1);
            }
        }

        if (arr != null) {
            let total = arr.reduce((prev, num) => {
                return prev + +num;
            }, 0);
            if (firstTime) {
                firstTime = false;
                if (total == 0) {
                    bed = undefined;
                    confidence = undefined;
                } else {
                    bed = total;
                    confidence = 1;
                }
            }
        }
    } else {
        //else is written because in most cases hospital name will not match
        let pattern = /\d+/g;
        let beds_string = obj.snippet.toString(); //converting array to string
        let without_space = beds_string.replace(/ /g, ""); //removing the spaces from string
        without_space = without_space.toLowerCase();
        let bedIndex = without_space.indexOf("bed");
        let beforeBed = without_space.substring(bedIndex - 14, bedIndex).trim(); // extract the number before "bed"
        let afterBed = without_space.substring(bedIndex, bedIndex + 18).trim(); // extract the number after "bed"
        let arr = [];
        arr.push(beforeBed.match(pattern));
        arr.push(afterBed.match(pattern));
        //doing this for values like 2,000 , 1,000
        //the match pattern splits up values like 2,000 into 2 and 000
        //so we are checking if at 0 index there is an array which contains 2 at 0 and 000 at 1
        //we are then adding both,placing at 0 index and removing the second index
        if (arr[0] != null) {
            let zeroIndexofArray = arr[0];
            if (zeroIndexofArray.length > 1) {
                zeroIndexofArray[0] = zeroIndexofArray[0] + zeroIndexofArray[1];
                zeroIndexofArray.splice(1);
            }
        }

        if (arr != null) {
            let total = arr.reduce((prev, num) => {
                return prev + +num;
            }, 0);
            if (firstTime) {
                firstTime = false;
                if (total == 0) {
                    bed = undefined;
                    confidence = undefined;
                } else {
                    bed = total;
                    confidence = 0.8;
                }
            }
        }
    }

    return { number_of_beds: bed, confidence_level: confidence };
}

readExcel();
