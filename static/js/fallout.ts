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
 * @date 10/21/2023 - 11:11:36 AM
 *
 * @param {string} selector - valid css selector to identify target element(s)
 * @param {*} eventType - any valid event type; 'click', 'hover', 'pointerdown', etc
 * @param {*} handler
 * @param {*} handlerArgs
 * @returns {string}
 */
function attachListener(selector: string, eventType: string, handler: () => void, handlerArgs?: object): string {
    const targetEls = document.querySelectorAll(selector);
    if ()
    .forEach(targetEl => {
        targetEl.addEventListener(eventType)
    })
    return "yeah";
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


