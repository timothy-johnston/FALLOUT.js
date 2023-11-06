export class FALLOUT {
    constructor(alias?: string) {
        console.log("FALLOUT initialized.");
    }
}
interface OptionsGet {
    keys: string[];
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

    if (isSet(runner)) {
        (runner as AnimationRunner).prepare(variation, config);
    }
    

}


/* 
--------------------------
    SUBCATEGORY
    Animation Configurers
--------------------------
*/

//TODO: In documentation for this, mention abstract class parent/child relationship, and explain
//the different "types" of animation runners. For example, DisplayAnimationRunner runs display-related 
//animations (ie, blinking an object from visible to invisble), TextAnimationRunner runs text-related
//animations, like simulating a sentence being typed out in real time
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

    constructor() {
        this.variation = "",
        this.options = {};
        this.animationHandler = function(){}; 
        this.groupVariations = {};
        this.animationAttrs = {};
    }

    //Super methods
    public prepare(variation: String, options: object): void {
        this.variation = variation;
        this.options = options;
        this.config = mergeObject(this.config, this.options);
        this._prepare();
    }

    public run() {
        this.animationHandler();
    };

    //Abstract methods; all to be implemented by descendant class
    protected abstract _prepare(): void;

}

class DisplayAnimationRunner extends AnimationRunner {
        //Define groupVariation options
        constructor() {
            super();
            this.groupVariations = {
                BLINK: "blink"
            }
        }

        protected _prepare(): void {
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
        let blinkCursor: boolean;   //true or false
        let blinkCursorSpeed: number;   //milliseconds

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
//todo: make error handler class and move to different file. it will have methods like error, error_console, etc 
//could make an abstract class called "info" - it could have two implementations: infoUser and infoConsole 
function __error() {
    console.log("global error handler");
    throw "error handler";
}

function __error_console(msg: string) {
    console.log(msg);
}

/* 
---------------------------------------------------------------------------------------------------
    
    CATEGORY
    tbd
    
    
    FUNCTIONALITY
    misc; should sort these out of this category
    

---------------------------------------------------------------------------------------------------
*/

//diference between get and getRequired: get will return 'undefined' if the target key is not
//set. getRequired will instead throw and exception
function get(obj: {[key: string]: any}, key: string): any {
    return obj[key];
}

function getNested(obj: {[key: string]: any}, keys: string[]) {
    let key: string = keys.shift() as string;
    let val = obj[key];
    if (keys.length > 0) {
        val = getNested(val, keys);
    }
    return val;
}

function getRequired(obj: {[key: string]: any}, key: string): any {
    let val = obj[key];
    if (!_isDefinedAndNotNull(val)) {
        __error();
    }
    return val;
}

function getNestedRequired(obj: {[key: string]: any}, keys: string[]) {
    let val = getNested(obj, keys);
    if (!_isDefinedAndNotNull(val)) {
        __error();
    }
    return val;
}


//this method signature should accept EITHER any number of string rest arguments, or exactly one
//string array. to test: 1, with multiple string args, 2 with one string array arg, 3 with multiple
//string array args (this one should fail)
function get2___(obj: {[key: string]: any}, ...keys: (string | string[])[]): any {
    if (_isDefinedAndNotNull(keys) && isPopulated(keys)) {
        //Ideally based on the method signature and this conditional check, keys is guaranteed to 
        //be an array of strings (if we're here). make sure to confirm / test this
        let key = keys.shift();
        if (Array.isArray(key)) {
            //Handle case where ...keys is exactly one array of strings
            keys = key;
            key = keys.shift();
        }
        if (_isDefinedAndNotNull(obj)) {
            let val = get2(obj, keys as string[]);
            if (_isDefinedAndNotNull(val) && typeof(val) == "object" && isPopulated(val)) {
                val = get2(val, keys as string[])
            }
            return val;
        }
    } else {
        __error_console("Invalid input ...keys");
    }
    // return "test";
}

// function get2(obj: {[key: string]: any}, ...keys: string[]): any;
// function get2(obj: {[key: string]: any}, ...test: string[]): any {
//   if (keys.length > 0) {
//     // You can now access 'keys' as an array of string parameters
//     // Your code here
//   }

//   return "test";
// }






function get_____(obj: {[key: string]: any}): object;
function get_____(obj: {[key: string]: any}, keys: string[]): any;
function get_____(obj: {[key: string]: any}, ...keys: string[]): any;
function get_____(obj: {[key: string]: any}, ...keys: string[]|string[][]): any {

    //TODO: What if input arg keys is array of arrays (because i believe this will be allowed based
    //on the ...keys: string[]|string[][] def, even though thats not what i want).  Handle.
    //Basically, 'keys' should ONLY ever be an array of strings, whether this comes from multple
    //strings via ...keys or from one string array passed in via keys
    //I think with the check for target key != undefined and not an array handles this edge case,
    //but need gracefully return something useful to the user - maybe throw exception 

    let targetVal;
    if (_isDefinedAndNotNull(keys) && isPopulated(keys)) {
        const targetKey = keys.shift();
        if (typeof(targetKey) != "undefined" && !Array.isArray(targetKey)) {
            //todo: revisit this logic - why checking for if key is not array?
            //see comment above also. this algorithm needs revisited
            
            targetVal = obj[targetKey];
            
            //Shift the first key off the path; create a new array of the provided keys minus the one
            //that was shifted off. If there is at least one key remaining, recursively call this
            //function using the retrieved targetVal & shifted keys array
            // let keysShifted = [] as string[];
            // keys.forEach((key) => { keysShifted.push(key)} );

            if (isPopulated(keys)) {
                get(targetVal, keys)
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
    let targetIsSet = _isDefinedAndNotNull(valOrObj);
    if (targetIsSet && (_isDefinedAndNotNull(keys) && isPopulated(keys))) {

        //Get the value at the first key in the key path
        let targetVal;
        const targetKey = keys.shift();
        if (typeof(targetKey) != "undefined" && !Array.isArray(targetKey)) {
            
            targetVal = valOrObj[targetKey];
        
            //Shift the first key off the path; create a new array of the provided keys minus the one
            //that was shifted off. If there is at least one key remaining, recursively call this
            //function using the retrieved targetVal & shifted keys array
            // let keysShifted = [] as string[];
            // keys.forEach((key) => { keysShifted.push(key)} );
            if (isPopulated(keys)) {
                isSet(targetVal, keys)
            }

        }

    }

    return targetIsSet;

}

function _isDefinedAndNotNull(val: any): boolean {
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
 * @date 10/21/2023 - 12:09:34 PM
 *
 * @param {(any[] | object)} val
 * @returns {boolean}
 */
function isPopulated(val: any[] | object): boolean {
    let isPopulated: boolean = false;
    if (Array.isArray(val)) {
        isPopulated = (val.length > 0);
    } else if (typeof(val) == "object") {
        isPopulated = (Object.keys(val).length > 0)
    }
    __error_console("Attempted to call 'isPopulated' on invalid object: " + val);
    return isPopulated;
}

//recursively merges
function mergeObject(target: {[key: string]: any}, source: {[key: string]: any}): object {

    let merged: {[key: string]: any} = target;

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
function repeat(callback: () => void, delay = 5000): number {
    const repeatId: number = setInterval(callback, delay);
    return repeatId;
}

//easy way to stop intervals
function repeatStop(repeatId: number) {
    clearInterval(repeatId);
}


