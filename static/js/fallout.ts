/* 
---------------------------------------------------------------------------------------------------
    
    CATEGORY
    Events and Listeners
    
    FUNCTIONALITY
    Assign listeners, handle events, etc

---------------------------------------------------------------------------------------------------
*/



/**
 * Description placeholder
 * @date 10/21/2023 - 12:32:02 PM
 *
 * @param {string} selector
 * @param {string} eventType
 * @param {() => void} handler
 * @returns {object}
 */
function attachListener(selector: string, eventType: string, handler: () => void): object {

    //Define success/failure info to return to caller
    let response = {
        code: 1,
        msg: "Unable to attach listeners; no elements found by selector.",
        elements: [] as object[]
    }

    //Select elements to append listener to; loop over these and assign listener; update the
    //response object with success code & supporting info
    const targetEls = document.querySelectorAll(selector);
    if (isPopulated(targetEls)) {
        response.code = 0;
        response.msg = "At least one element successfully found by selector. See the 'elements' field.";
        targetEls.forEach(targetEl => {
            targetEl.addEventListener(eventType, handler);
            response.elements.push(targetEl);
        })
    }
    
    return response;
    
}








/* 
---------------------------------------------------------------------------------------------------
    
    CATEGORY
    
    
    FUNCTIONALITY
    

---------------------------------------------------------------------------------------------------
*/












/* 
---------------------------------------------------------------------------------------------------
    
    CATEGORY
    
    
    FUNCTIONALITY
    

---------------------------------------------------------------------------------------------------
*/












/* 
---------------------------------------------------------------------------------------------------
    
    CATEGORY
    tbd
    
    
    FUNCTIONALITY
    misc; should sort these out of this category
    

---------------------------------------------------------------------------------------------------
*/

/**
 * Description placeholder
 * @date 10/21/2023 - 12:07:18 PM
 *
 * @param {(any[] | object)} val
 * @returns {boolean}
 */
function isEmpty(val: any[] | object): boolean {

    let isEmpty;
    if (Array.isArray(val)) {
        isEmpty = isEmptyArray(val);
    } else if (typeof(val) == "object") {
        isEmpty = isEmptyObject(val);
    }

    return isEmpty;

}

/**
 * Description placeholder
 * @date 10/21/2023 - 12:09:34 PM
 *
 * @param {(any[] | object)} val
 * @returns {boolean}
 */
function isPopulated(val: any[] | object): boolean {
    return !isEmpty(val);
}

/**
 * Description placeholder
 * @date 10/21/2023 - 12:07:26 PM
 *
 * @param {object} obj
 * @returns {boolean}
 */
function isEmptyObject(obj: object): boolean {
    return isEmptyArray(Object.keys(obj));
}

/**
 * Description placeholder
 * @date 10/21/2023 - 12:07:32 PM
 *
 * @param {any[]} arr
 * @returns {boolean}
 */
function isEmptyArray(arr: any[]): boolean {
    return (arr.length == 0)
}


