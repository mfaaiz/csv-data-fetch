let obj = {
  answer_box: {
    type: "organic_result",
    title: "Identification and Characteristics",
    link: "https://www.ahd.com/free_profile/110035/WellStar_Kennestone_Hospital/Marietta/Georgia/",
    displayed_link: "https://www.ahd.com › free_profile › Marietta › Georgia",
    about_this_result: {
      source: {
        description:
          "ahd.com was first indexed by Google more than 10 years ago",
        source_info_link:
          "https://www.ahd.com/free_profile/110035/WellStar_Kennestone_Hospital/Marietta/Georgia/",
        security: "secure",
        icon: "https://serpapi.com/searches/63cda03794fb03f78457ec08/images/992eb7aa99ae244dce068fd32113fd7c498fa9b17a871e9620f93e32ae03412e83c8f438ac5cf164ca3d7c0a007085e4.png",
      },
      keywords: ["wellstar", "kennestone", "hospital", "beds"],
      languages: ["English"],
      regions: ["the United States"],
    },
    about_page_link:
      "https://www.google.com/search?q=About+https://www.ahd.com/free_profile/110035/WellStar_Kennestone_Hospital/Marietta/Georgia/&tbm=ilp&ilps=AB_Lh3rBaLyGcMPJkgzejUPmca_XSS_6kQ",
    contents: {
      table: [
        [
          "Name and Address:",
          "WellStar Kennestone Hospital 677 Church Street Marietta, GA 30060",
        ],
        ["Type of Facility:", "Short Term Acute Care"],
        ["Type of Control:", "Governmental, Other"],
        ["In pAtient nasdsh Staffed Beds ipoasdujopsd:", "662"],
        ["Total Patient Revenue:", "$5,732,553,548"],
      ],
      formatted: [
        {
          name_and_address: "Type of Facility:",
          well_star_kennestone_hospital_677_church_street_marietta_ga_30060:
            "Short Term Acute Care",
        },
        {
          name_and_address: "Type of Control:",
          well_star_kennestone_hospital_677_church_street_marietta_ga_30060:
            "Governmental, Other",
        },
        {
          name_and_address: "Total Staffed Beds:",
          well_star_kennestone_hospital_677_church_street_marietta_ga_30060:
            "662",
        },
        {
          name_and_address: "Total Patient Revenue:",
          well_star_kennestone_hospital_677_church_street_marietta_ga_30060:
            "$5,732,553,548",
        },
      ],
    },
  },
};

let firstTime = true;
let bed;
let confidence;

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
    console.log("beforeBed ==>", beforeBed);
    let afterBed = without_space.substring(bedIndex + 7, bedIndex + 7).trim(); // extract the number after "bed"
    console.log("afterBed ==>", afterBed);
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

      console.log("total==>", total);

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
    console.log("bedIndex", bedIndex);
    let beforeBed = without_space.substring(bedIndex - 14, bedIndex).trim(); // extract the number before "bed"
    console.log("beforeBed", beforeBed);
    let afterBed = without_space.substring(bedIndex, bedIndex + 18).trim(); // extract the number after "bed"
    console.log("afterBed==>", afterBed);
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

      console.log("total==>", total);

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

let ans = makeNestedSearchOnResult(obj, "WEST VIRGINIA UNIVERSITY MEDICINE");
console.log(ans.number_of_beds);
console.log(ans.confidence_level);

//WELLSTAR KENNESTONE HOSPITAL unique response in answer box

//WOMENS AND INFANTS HOSPITAL unique response in answer box

//WOMEN'S CANCER CARE ==> 0 wrong //corrected
