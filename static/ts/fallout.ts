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
        if (isSet(val)) {
            val = getNested(val, keys);
        } else {
            //If any of the parent nested objects are undefined or null, error out
            __error();
        }
    }
    return val;
}

function getIfSet(obj: {[key: string]: any}, key: string): any {
    let val = obj[key];
    if (!isSet(val)) {
        __error();
    }
    return val;
}

function getNestedIfSet(obj: {[key: string]: any}, keys: string[]) {
    let val = getNested(obj, keys);
    if (!isSet(val)) {
        __error();
    }
    return val;
}

function isSet(obj: any): boolean;
function isSet(obj: any, key?: string): boolean {
    if (_isDefinedAndNotNull(key)) {
        obj = obj[key as string];
    }
    return _isDefinedAndNotNull(obj);
}

function isSetNested(obj: any, keys: string[]): boolean {
    let key = keys.shift() as string;
    let val = obj[key];
    let targetFieldIsSet = _isDefinedAndNotNull(val);
    if (keys.length > 0) {
        if (targetFieldIsSet) {
            targetFieldIsSet = isSetNested(val, keys);
        }
    }
    return targetFieldIsSet;
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


