export class FALLOUT {
    constructor(alias?: string) {
        console.log("FALLOUT initialized.");
    }
}
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

function get(obj: object): object;
function get(obj: object, keys: string[]): any;
function get(obj: object, ...keys: string[]): any;
function get(obj: object, ...keys: string[]|string[][]): any {

    //TODO: What if input arg keys is array of arrays (because i believe this will be allowed based
    //on the ...keys: string[]|string[][] def, even though thats not what i want).  Handle.
    //Basically, 'keys' should ONLY ever be an array of strings, whether this comes from multple
    //strings via ...keys or from one string array passed in via keys
    //I think with the check for target key != undefined and not an array handles this edge case,
    //but need gracefully return something useful to the user - maybe throw exception 


    let targetVal;
    if (_isDefinedAndNotNulll(keys) && populated(keys)) {
        const targetKey = keys.shift();
        if (typeof(targetKey) != "undefined" && !Array.isArray(targetKey)) {
            
            targetVal = obj[targetKey];
            
            //Shift the first key off the path; create a new array of the provided keys minus the one
            //that was shifted off. If there is at least one key remaining, recursively call this
            //function using the retrieved targetVal & shifted keys array
            let keysShifted = [] as string[];
            keys.forEach((key) => { keysShifted.push(key)} );
            if (populated(keysShifted)) {
                get(targetVal, keysShifted)
            }
                        
        } else {
            //throw excpetion here?
        }

    } else {
        targetVal = obj;
    }

    return targetVal;

}


/**
 * Note: This won't reliably handle objects with overridden 'null' or 'undefined' properties
 * @date 10/22/2023 - 8:40:36 AM
 *
 * @param {*} val
 * @returns {boolean}
 */
function isSet(val: any): boolean;
function isSet(obj: object, keys: string[]): boolean;
function isSet(obj: object, ...keys: string[]): boolean;
function isSet(valOrObj: any, ...keys: string[]|string[][]): boolean {

    //TODO: What if input arg keys is array of arrays (because i believe this will be allowed based
    //on the ...keys: string[]|string[][] def, even though thats not what i want).  Handle.
    //Basically, 'keys' should ONLY ever be an array of strings, whether this comes from multple
    //strings via ...keys or from one string array passed in via keys
    //I think with the check for target key != undefined and not an array handles this edge case,
    //but need gracefully return something useful to the user - maybe throw exception 
    
    //First check the provided entity to determine if it is undefined/null. If so, we're done and
    //can return isSet (which would currently be false)
    //We also check the length of the 'keys' array; if it is empty then we know we've evaluated out
    //target value. If it is not empty then we need to continue traversing down the input object,
    //and will do so by shifting the keys array and recursively calling this method on the new obj
    let targetIsSet = _isDefinedAndNotNulll(valOrObj);
    if (targetIsSet && (_isDefinedAndNotNulll(keys) && populated(keys))) {

        //Get the value at the first key in the key path
        let targetVal;
        const targetKey = keys.shift();
        if (typeof(targetKey) != "undefined" && !Array.isArray(targetKey)) {
            
            targetVal = valOrObj[targetKey];
        
            //Shift the first key off the path; create a new array of the provided keys minus the one
            //that was shifted off. If there is at least one key remaining, recursively call this
            //function using the retrieved targetVal & shifted keys array
            let keysShifted = [] as string[];
            keys.forEach((key) => { keysShifted.push(key)} );
            if (populated(keysShifted)) {
                isSet(targetVal, keysShifted)
            }

        }

    }

    return targetIsSet;

}

function _isDefinedAndNotNulll(val: any): boolean {
    //Strict equality checks for input is UNDEFINED or NULL
    //If all evaluate to false, the input is defined and we can return true
    //If at least one
    const undefinedOrNullChecks = [
        typeof(val) === "undefined",
        val === undefined,
        val === null
    ]
    return(!undefinedOrNullChecks.includes(true));
}

/**
 * Description placeholder
 * @date 10/21/2023 - 12:07:18 PM
 *
 * @param {(any[] | object)} val
 * @returns {boolean}
 */
function empty(val: any[] | object): boolean {

    let isEmpty;
    if (Array.isArray(val)) {
        isEmpty = emptyArray(val);
    } else if (typeof(val) == "object") {
        isEmpty = emptyObject(val);
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
function populated(val: any[] | object): boolean {
    return !empty(val);
}

/**
 * Description placeholder
 * @date 10/21/2023 - 12:07:26 PM
 *
 * @param {object} obj
 * @returns {boolean}
 */
function emptyObject(obj: object): boolean {
    return emptyArray(Object.keys(obj));
}

/**
 * Description placeholder
 * @date 10/21/2023 - 12:07:32 PM
 *
 * @param {any[]} arr
 * @returns {boolean}
 */
function emptyArray(arr: any[]): boolean {
    return (arr.length == 0)
}


