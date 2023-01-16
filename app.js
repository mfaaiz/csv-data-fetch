// Requiring the module
import reader from 'xlsx'
import SerpApi from 'google-search-results-nodejs'
import Excel from 'exceljs';
import path from 'path';

const search = new SerpApi.GoogleSearch("05e105f4137d60a8ea87f7c4241a098fbe15363c9c988309d8016b02ccbb633d");

// Reading our test file
const file = reader.readFile('firstTwenty.xlsx')

//writing search result into excel file
const sheets = file.SheetNames

const exportFile = async (key, data) => {
   // console.log(key)
    console.log("data==>",data);
    let beds = data['knowledge_graph']['number_of_beds'];
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Search List');

    // writing data into excel

    //TODO: need to fix it
    worksheet.columns = [
        // { key: key, header: key },
        { key: key, header: "Site Name" },
        { header: 'No of Beds', key: "no_of_beds", width: 32 }
    ];

    
   // worksheet.addRow(data);

   const rowValues = [];
rowValues[1] = key;
rowValues[2] = beds;
worksheet.addRow(rowValues);


   //worksheet.addRow({id: "Name", name: 'Jane Doe', dob: new Date(1965,1,7)});

    //TODO: need to fix it

    const exportPath = path.resolve('result2.xlsx');
    await workbook.xlsx.writeFile(exportPath);
};


// filter individual values of excel and search to SerpApi
for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]])
    let params;
    let val
    temp.forEach((res) => {
        val = Object.values(res)[0]
        params = {
            q: `${val} no. of beds`,
            location: "Austin, Texas, United States",
            hl: "en",
            gl: "us",
            google_domain: "google.com"
        }

        //need to search here but due to limited search commenting for now
        search.json(params, (data) => { exportFile(val, data) });
    })
    // console.log(params)

    //only serach last value for testing only, it will remove later
    // search.json(params, (data) => { exportFile(val, data) });
}


//UNIVERSITY OF ALBERTA HOSPITAL no. of beds
//UNIVERSITY HOSPITALS OF CLEVELAND no. of beds