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
    Animation
    
    FUNCTIONALITY
    Visual effects

---------------------------------------------------------------------------------------------------
*/

function animate(selector: String, group: String, variation: String, options: object) {

    let animConfig = _getAnimationConfig(group, variation, options);


}


function _getAnimationConfig(group: String, variation: String, options: object) {

    enum animGroups {
        TEXT = "text"
    }

    let defaultConfig = {};
    let config = mergeObject(defaultConfig, options);
    let runner;

    switch(group){
        case animGroups.TEXT:
            runner = new TextAnimationRunner();
            break;
        default:
            __error();
            break;
    }


    runner.prepare(variation, config)

}


/* 
--------------------------
    SUBCATEGORY
    Animation Configurers
--------------------------
*/

interface varObj {
    
}

abstract class AnimationRunner {
    
    //Member variables
    protected variation: String;
    protected options: object;
    protected groupVariations: {[key: string]: any}; //use as enum; define in sublcass constructor
    protected isPrepared: boolean = false;
    protected animationHandler: () => void;
    protected config: {[key: string]: any} = {
        "attrs": {}
    };
    protected animationAttrs: {[key: string]: any} = {};

    //Super methods
    public prepare(variation: String, options: object) {
        this.variation = variation;
        this.options = options;
        this.config = mergeObject(this.config, this.options);
        this._prepare();
    }

    public run() {
        this.animationHandler();
    };

    //Abstract methods; all to be implemented by descendant class
    protected abstract _prepare();

}

class DisplayAnimationRunner extends AnimationRunner {
        //Define groupVariation options
        constructor() {
            super();
            this.groupVariations = {
                BLINK: "blink"
            }
        }

        protected _prepare() {
            let error = 0;
            switch (this.variation) {
                case this.groupVariations.TYPING:
                    this._configureAnimationDisplayBlink();
                    break;
                default:
                    __error(); 
                    error = 1;   
                    break;
            }
    
            if (error == 0) {
                this.isPrepared = true;
            }
    
        };

        private _configureAnimationDisplayBlink() {
            this.animationHandler = () => this._animateDisplayBlink();
        }

        private _animateDisplayBlink() {
            const targetSelector = get(this.config, "target_selector");
            const targets = document.querySelectorAll(targetSelector);   //this will support animating multiple elements
            const speed = get(this.config, "speed");
            const repeatImplementation: () => void = function() {
                targets.forEach(target => {
                    target.classList.toggle("hidden");
                });
            }
            this.config.attrs.repeat_id = repeat(repeatImplementation, speed);
        }

}

class TextAnimationRunner extends AnimationRunner {

    //Define groupVariation options
    constructor() {
        super();
        this.groupVariations = {
            TYPING: "typing"
        }
    }

    protected _prepare() {
        let error = 0;
        switch (this.variation) {
            case this.groupVariations.TYPING:
                this._configureAnimationTextTyping();
                break;
            default:
                __error(); 
                error = 1;   
                break;
        }

        if (error == 0) {
            this.isPrepared = true;
        }

    };

    // public run() {
    //     this.animationHandler();
    // };

    private _configureAnimationTextTyping() {

        this.animationHandler = () => this._animateTextTyping();
        //Require this.config to have:


        //Optional:

    }

    private _animateTextTyping () {

        const target = get(this.config, "target");
        const text = get(this.config, "text");
        const cursorConfig = get(this.config, "cursor");
        const showCursor = get(cursorConfig, "show");
        let cursorSelector: string;
        let blinkCursor: boolean;   //true or false
        let blinkCursorSpeed: number;   //milliseconds
        let inteval_blinkCursor;    //interval function to handle cursor blink
        const speed = get(this.config, "speed");    //milliseconds

        //Trigger cursor-blink, if requested
        if (showCursor) {
            let cursor = document.getElementsByTagName(get(this.config, "cursor_selector"))[0];
            cursor.classList.remove("hidden");
            blinkCursor = get(this.config, "blink");
            blinkCursorSpeed = get(this.config, "blink_speed");
            if (get(cursorConfig, "blink")) {
                const cursorAnimationRunner = new DisplayAnimationRunner();
                cursorAnimationRunner.prepare("blink", cursorConfig);
                cursorAnimationRunner.run();
            }
            
        }

        for (let position in text) {
            let letter = text[position];
            let targetText = target.innerText;
            targetText += letter;
            target.innerText = targetText;
        }

    }

}

/* 
---------------------------------------------------------------------------------------------------
    
    CATEGORY
    Admin
    
    FUNCTIONALITY
    Error handling, input validation, etc

---------------------------------------------------------------------------------------------------
*/
function __error() {
    console.log("global error handler");
}

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
    if (_isDefinedAndNotNulll(keys) && isPopulated(keys)) {
        const targetKey = keys.shift();
        if (typeof(targetKey) != "undefined" && !Array.isArray(targetKey)) {
            //todo: revisit this logic - why checking for if key is not array?
            //see comment above also. this algorithm needs revisited
            
            targetVal = obj[targetKey];
            
            //Shift the first key off the path; create a new array of the provided keys minus the one
            //that was shifted off. If there is at least one key remaining, recursively call this
            //function using the retrieved targetVal & shifted keys array
            let keysShifted = [] as string[];
            keys.forEach((key) => { keysShifted.push(key)} );
            if (isPopulated(keysShifted)) {
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
    if (targetIsSet && (_isDefinedAndNotNulll(keys) && isPopulated(keys))) {

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
            if (isPopulated(keysShifted)) {
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
function isPopulated(val: any[] | object): boolean {
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

//recursively merges
function mergeObject(target, source): object {

    let merged: object = target;

    for (const property in source) {
        if (isSet(target, property) && typeof(get(target, property)) == "object") {
            merged = mergeObject(get(target, property), get(source, property))
        } else {
            merged[property] = source[property];
        }
    }

    return merged;

}

//easy way to create intervals
function repeat(callback, delay = 5000): number {
    const repeatId: number = setInterval(callback, delay);
    return repeatId;
}

//easy way to stop intervals
function repeatStop(repeatId) {
    clearInterval(repeatId);
}


