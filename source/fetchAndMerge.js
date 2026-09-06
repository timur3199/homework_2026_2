'use strict';

/** 
 *@param {Array<String>} urls
 *@returns {Promise<Object>}
*/
async function fetchAndMergeData(urls) {
    const result = {};

    for(const url of urls){
        try{
            const response = await fetch(url);
            const data = await response.json();

            for(const key in data){
                if(!result[key]){
                    result[key] = [];
                }
                if(!result[key].includes(data[key])){
                    result[key].push(data[key]);
                }
            }
        } catch {
            //запрос не удался - пропускаем эту ссылку
        }
    }
    return result;
}


