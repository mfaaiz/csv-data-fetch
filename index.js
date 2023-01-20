// Requiring the module
import reader from 'xlsx'
import SerpApi from 'google-search-results-nodejs'
import Excel from 'exceljs'

const SEARCH_API_KEY_ONE =
    '05e105f4137d60a8ea87f7c4241a098fbe15363c9c988309d8016b02ccbb633d' //Faaiz:  used (exhausted i.e completed 100 seraches)
const SEARCH_API_KEY_TWO =
    '74c04fa361971039f980843a3f7c3bfaa29d7535180a3013a6108dbe8edd4cf9' //Hamza:  used (exhausted i.e completed 100 seraches)
const SEARCH_API_KEY =
    'fdae8ad8549f85c7bd4bfb962d49d850871622598ad347f743caf23ee63c7caf'  //PROD : 30,000 SEARCHES

// declare variables
const search = new SerpApi.GoogleSearch(SEARCH_API_KEY)
let temp
let finalArray = []

let readExcel = () => {
    // Reading our test file
    const file = reader.readFile('44.xlsx')

    //writing search result into excel file
    const sheets = file.SheetNames

    // filter individual values of excel and search to SerpApi
    for (let i = 0; i < sheets.length; i++) {
        temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
        let params
        let val
        temp.forEach(async (res) => {
            val = Object.values(res)[0]
            params = {
                q: `${val} no. of beds`,
                location: '',
                hl: 'en',
                gl: 'us',
                google_domain: 'google.com',
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
    })
}

function createArray(hospitalName, data) {
    let keys = ['knowledge_graph', 'answer_box', 'organic_results']
    const extractedData = Object.assign(
        {},
        ...keys.map((key) => ({ [key]: data[key] })),
    )
    let result = makeNestedSearchOnResult(extractedData)

    finalArray.push({
        key: hospitalName,
        value: result.number_of_beds,
        confidence: result.confidence_level,
    })
    if (finalArray.length === temp.length) {
        writeExcel()
    }
}

function writeExcel() {
    // Create a new workbook
    const workbook = new Excel.Workbook()

    // Add a worksheet to the workbook
    const worksheet = workbook.addWorksheet('My Sheet')

    worksheet.columns = [
        { header: 'Site Name', key: 'Site Name', width: 92 },
        { header: 'No of Beds', key: 'No of Beds', width: 16 },
        { header: 'Confidence Level', key: 'Confidence Level', width: 20 },
    ]

    // Add some data to the worksheet
    finalArray.forEach((d, i) => {
        worksheet.addRow([d.key, d.value, d.confidence])
    })

    // Save the workbook to an .xlsx file
    workbook.xlsx.writeFile('result-44.xlsx').then(() => {
        console.log('File is written!')
    })
}

function makeNestedSearchOnResult(res) {
    let number_of_beds
    let confidence_level

    /*-----xxxxxxxxxx    1st APPROACH   xxxxxxxx--------  
             answer_box ==>answer ==> take the number as it is (confidence 1) */
    if (res?.knowledge_graph?.number_of_beds !== undefined) {
        number_of_beds = res['knowledge_graph']['number_of_beds']
        confidence_level = 1
    } else if (res?.answer_box !== undefined) {
        /*-----xxxxxxxxxx    2ND APPROACH   xxxxxxxx--------  
               answer_box ==>answer ==> take the number as it is (confidence 1) */
        if (res.answer_box?.answer !== undefined) {
            number_of_beds = res['answer_box']['answer']
            confidence_level = 1
        }
    } else if (res?.answer_box !== undefined) {
        /*-----xxxxxxxxxx    3RD APPROACH   xxxxxxxx--------  
              answer_box ==> snippet_highlighted_words ==> if bed is in
              string,count total number (confidence 0.9) */
        if (res.answer_box?.snippet_highlighted_words !== undefined) {
            var pattern = /\d+/g
            let beds_string = res.answer_box.snippet_highlighted_words.toString() //converting array to string
            let without_space = beds_string.replace(/ /g, '') //removing the spaces from string
            //counting the total of the digits in the string
            var total = without_space.match(pattern).reduce(function (prev, num) {
                return prev + +num
            }, 0)
            number_of_beds = total
            confidence_level = 0.9
        }
    } else if (res?.organic_results !== undefined) {
        /*-----xxxxxxxxxx    4TH APPROACH   xxxxxxxx--------  
               if it is only a number then it is correct / 
                      OR 
               if the string contains bed in the array, sum all the numbers in 
               the string(confidence 0.8 )
           */
        if (res.organic_results[0]?.snippet_highlighted_words !== undefined) {
            //checking if this property only contains a number if true then take it only
            if (
                res.organic_results[0]?.snippet_highlighted_words[0].match(
                    /^[0-9]+$/,
                ) != null
            ) {
                number_of_beds = Number(
                    res.organic_results[0]?.snippet_highlighted_words[0],
                ) //converting string to number
            } else {
                //suming all the numbers
                var pattern = /\d+/g
                let beds_string = res.organic_results[0]?.snippet_highlighted_words[0].toString() //converting array to string
                let without_space = beds_string.replace(/ /g, '') //removing the spaces from string
                //counting the total of the digits in the string
                let arr = without_space.match(pattern)
                if (arr != null) {
                    var total = arr.reduce((prev, num) => {
                        return prev + +num
                    }, 0)
                    number_of_beds = total
                    confidence_level = 0.8
                }
            }
        }
    }
    // console.log(number_of_beds);
    return { number_of_beds: number_of_beds, confidence_level: confidence_level }
}

readExcel()
