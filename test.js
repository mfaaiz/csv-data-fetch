// let obj = {
//     answer_box: {
//         type: 'organic_result',
//         title: 'Barnes-Jewish Hospital - Washington University Physicians',
//         link:
//             'https://physicians.wustl.edu/places/barnes-jewish-hospital/#:~:text=Barnes%2DJewish%20Hospital%20is%20a,hospital%20%E2%80%94%20the%20largest%20in%20Missouri.',
//         displayed_link: 'https://physicians.wustl.edu › Places',
//         hover_info: [
//             {
//                 text: 'Barnes-Jewish Hospital',
//                 info:
//                     'Barnes-Jewish Hospital is the largest hospital in the U.S. state of Missouri. Located in the Central West End neighborhood of St. Louis, it is the adult teaching hospital for the Washington University School of Medicine and a major component of the Washington University Medical Center.',
//                 title: 'Barnes-Jewish Hospital - Wikipedia',
//                 link: 'https://en.wikipedia.org/wiki/Barnes-Jewish_Hospital',
//                 displayed_link:
//                     'https://en.wikipedia.org › wiki › Barnes-Jewish_Hospital',
//             },
//         ],
//         snippet:
//             'Barnes-Jewish Hospital is a 1,400-bed nonprofit teaching hospital — the largest in Missouri.',
//         snippet_highlighted_words: ['1,400-bed'],
//         about_this_result: {
//             source: {
//                 description:
//                     'Washington University in St. Louis is a private research university with its main campus in St. Louis County, and Clayton, Missouri. Founded in 1853, the university is named after George Washington. Washington University is ranked among the top universities in the United States.',
//                 source_info_link:
//                     'https://physicians.wustl.edu/places/barnes-jewish-hospital/',
//                 security: 'secure',
//                 icon:
//                     'https://serpapi.com/searches/63cbd3ab9790545f69014be7/images/6fc62ddd39ab17b255b40d43e63818f76df39819dad36be50d69c12bf8092448e94f19661774d9cbc545ed2eee91b5e8.png',
//             },
//             keywords: ['wustl', 'jewish', 'barnes', 'no'],
//             related_keywords: ['barnes jewish', 'hospital'],
//             languages: ['English'],
//             regions: ['the United States'],
//         },
//         about_page_link:
//             'https://www.google.com/search?q=About+https://physicians.wustl.edu/places/barnes-jewish-hospital/&tbm=ilp&ilps=AB_Lh3qG4_yDjKuQvWH8v2lrFVcZpT0x4Q',
//     },
//     organic_results: [
//         {
//             position: 1,
//             title: 'Facilities | HPB-GI Surgery | Washington University in St. Louis',
//             link: 'https://hpbgisurgery.wustl.edu/education/facilities/',
//             displayed_link: 'https://hpbgisurgery.wustl.edu › education › facilities',
//             snippet:
//                 'Barnes-Jewish Hospital is located at the western edge of the Washington ... The hospital, which has 1,158 licensed beds, is a nonprofit institution and is ...',
//             snippet_highlighted_words: ['1,158 licensed beds'],
//             about_this_result: {
//                 source: {
//                     description:
//                         'Washington University in St. Louis is a private research university with its main campus in St. Louis County, and Clayton, Missouri. Founded in 1853, the university is named after George Washington. Washington University is ranked among the top universities in the United States.',
//                     source_info_link:
//                         'https://hpbgisurgery.wustl.edu/education/facilities/',
//                     security: 'secure',
//                     icon:
//                         'https://serpapi.com/searches/63cbd3ab9790545f69014be7/images/cdf96cfbbb3dabfcb8593807cfe3f55c0645c2d41c7c036b0411ef1590ee58b8862b0f78ab90b6584212ce813a1bf47a.png',
//                 },
//             },
//             about_page_link:
//                 'https://www.google.com/search?q=About+https://hpbgisurgery.wustl.edu/education/facilities/&tbm=ilp&ilps=AB_Lh3pAt6Zy3tQKPIv9yR_-DB9loTNFGw',
//             about_page_serpapi_link:
//                 'https://serpapi.com/search.json?engine=google_about_this_result&google_domain=google.com&ilps=AB_Lh3pAt6Zy3tQKPIv9yR_-DB9loTNFGw&q=About+https%3A%2F%2Fhpbgisurgery.wustl.edu%2Feducation%2Ffacilities%2F',
//             cached_page_link:
//                 'https://webcache.googleusercontent.com/search?q=cache:0i5dPrVI1g8J:https://hpbgisurgery.wustl.edu/education/facilities/&cd=10&hl=en&ct=clnk&gl=us',
//         },
//     ],
// }

let obj = {
    answer_box: {
        type: 'organic_result',
        title: 'About Us - Yale New Haven Health',
        link:
            'https://www.ynhhs.org/about#:~:text=Yale%20New%20Haven%20Hospital%20is,regional%2C%20national%20and%20international%20referrals.',
        displayed_link: 'https://www.ynhhs.org › about',
        snippet:
            'Yale New Haven Hospital is a non-profit, 1,541-bed acute and tertiary medical center receiving regional, national and international referrals.',
        snippet_highlighted_words: ['1,541-bed'],
        about_this_result: {
            source: {
                description:
                    "Yale New Haven Health System is a nonprofit healthcare system with headquarters in New Haven, Connecticut. It is Connecticut's largest healthcare system with 2,409 beds and includes hospitals, physicians and related health services throughout Connecticut as well as New York and Rhode Island.",
                source_info_link: 'https://www.ynhhs.org/about',
                security: 'secure',
                icon:
                    'https://serpapi.com/searches/63cc1222629a014413d09ec9/images/a18ee13848aa63561e042726f49c9e5e95bb7caef5f3563f5c089ad49754ede2ecfeb0e7f5cd1bc269868d285f6af6da.png',
            },
            keywords: ['yale', 'university', 'no'],
            languages: ['English'],
            regions: ['the United States'],
        },
        about_page_link:
            'https://www.google.com/search?q=About+https://www.ynhhs.org/about&tbm=ilp&ilps=AB_Lh3o9ItFSkvxOdRmUdstuTMmqEjB1ig',
        cached_page_link:
            'https://webcache.googleusercontent.com/search?q=cache:UeeLG4jxw5AJ:https://en.wikipedia.org/wiki/Yale_New_Haven_Hospital&cd=4&hl=en&ct=clnk&gl=us',
    },

    "organic_results":
        [

        ]
}

let firstTime = true
let bed

function makeNestedSearchOnResult(obj, hospitalName) {
    let number_of_beds
    let confidence_level

    if (obj?.knowledge_graph?.number_of_beds !== undefined) {
        number_of_beds = obj['knowledge_graph']['number_of_beds']
        confidence_level = 1
    }

    else if (obj?.answer_box !== undefined) {
        if (obj.answer_box?.answer !== undefined) {
            number_of_beds = obj['answer_box']['answer']
            confidence_level = 1
        }
        else if (obj.answer_box?.snippet !== undefined) {
            number_of_beds, confidence_level = countBeds(obj.answer_box, hospitalName)
        }
    }

    else if (obj?.organic_results !== undefined) {
        number_of_beds, confidence_level = countBeds(obj.organic_results, hospitalName)
    }
    return { number_of_beds, confidence_level }
}

function countBeds(obj, hospitalName) {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            countBeds(obj[key])
        }

        else if (key.toLowerCase() === 'snippet' || key.toLowerCase() === "snippet_highlighted_words") {
            //check hospital name in snippet value if matches get bed number
            if (obj.snippet_highlighted_words !== undefined) {
                let beds_string = obj.snippet_highlighted_words.toString() //converting array to string
                let without_space = beds_string.replace(/ /g, '') //removing the spaces from string
                bed = without_space
            }
            else {
                if (obj.snippet !== undefined &&
                    obj.snippet.includes(hospitalName)) {
                    //suming all the numbers
                    let pattern = /\d+/g
                    let beds_string = obj.snippet.toString() //converting array to string
                    let without_space = beds_string.replace(/ /g, '') //removing the spaces from string

                    let bedIndex = without_space.indexOf('bed')
                    let beforeBed = without_space.substring(bedIndex - 4, bedIndex).trim() // extract the number before "bed"
                    let afterBed = without_space
                        .substring(bedIndex + 3, bedIndex + 7)
                        .trim() // extract the number after "bed"

                    let arr = []
                    arr.push(beforeBed.match(pattern))
                    arr.push(afterBed.match(pattern))
                    if (arr != null) {
                        let total = arr.reduce((prev, num) => {
                            return prev + +num
                        }, 0)

                        if (firstTime) {
                            firstTime = false
                            bed = total
                        }
                    }
                }
            }
            return { number_of_beds: bed, confidence_level: 0.8 }
        }
    }
}

let ans = makeNestedSearchOnResult(obj, 'Yale New Haven Hospital')
console.log(ans.confidence_level, ans.number_of_beds);
// console.log("makeNestedSearchOnResult====>", number_of_beds, confidence_level)
