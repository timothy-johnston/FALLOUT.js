"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FALLOUT = void 0;
var FALLOUT = /** @class */ (function () {
    function FALLOUT(alias) {
        console.log("FALLOUT initialized.");
    }
    return FALLOUT;
}());
exports.FALLOUT = FALLOUT;
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
function attachListener(selector, eventType, handler) {
    //Define success/failure info to return to caller
    var response = {
        code: 1,
        msg: "Unable to attach listeners; no elements found by selector.",
        elements: []
    };
    //Select elements to append listener to; loop over these and assign listener; update the
    //response object with success code & supporting info
    var targetEls = document.querySelectorAll(selector);
    if (isPopulated(targetEls)) {
        response.code = 0;
        response.msg = "At least one element successfully found by selector. See the 'elements' field.";
        targetEls.forEach(function (targetEl) {
            targetEl.addEventListener(eventType, handler);
            response.elements.push(targetEl);
        });
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
function animate(selector, group, variation, options) {
    var animConfig = _getAnimationConfig(group, variation, options);
}
function _getAnimationConfig(group, variation, options) {
    var animGroups;
    (function (animGroups) {
        animGroups["TEXT"] = "text";
    })(animGroups || (animGroups = {}));
    var defaultConfig = {};
    var config = mergeObject(defaultConfig, options);
    var runner;
    switch (group) {
        case animGroups.TEXT:
            runner = new TextAnimationRunner();
            break;
        default:
            __error();
            break;
    }
    if (isSet(runner)) {
        runner.prepare(variation, config);
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
var AnimationRunner = /** @class */ (function () {
    function AnimationRunner() {
        this.isPrepared = false;
        this.config = {
            "attrs": {}
        };
        this.animationAttrs = {};
        this.variation = "",
            this.options = {};
        this.animationHandler = function () { };
        this.groupVariations = {};
        this.animationAttrs = {};
    }
    //Super methods
    AnimationRunner.prototype.prepare = function (variation, options) {
        this.variation = variation;
        this.options = options;
        this.config = mergeObject(this.config, this.options);
        this._prepare();
    };
    AnimationRunner.prototype.run = function () {
        this.animationHandler();
    };
    ;
    return AnimationRunner;
}());
var DisplayAnimationRunner = /** @class */ (function (_super) {
    __extends(DisplayAnimationRunner, _super);
    //Define groupVariation options
    function DisplayAnimationRunner() {
        var _this = _super.call(this) || this;
        _this.groupVariations = {
            BLINK: "blink"
        };
        return _this;
    }
    DisplayAnimationRunner.prototype._prepare = function () {
        var error = 0;
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
    ;
    DisplayAnimationRunner.prototype._configureAnimationDisplayBlink = function () {
        var _this = this;
        this.animationHandler = function () { return _this._animateDisplayBlink(); };
    };
    DisplayAnimationRunner.prototype._animateDisplayBlink = function () {
        var targetSelector = get(this.config, "target_selector");
        var targets = document.querySelectorAll(targetSelector); //this will support animating multiple elements
        var speed = get(this.config, "speed");
        var repeatImplementation = function () {
            targets.forEach(function (target) {
                target.classList.toggle("hidden");
            });
        };
        this.config.attrs.repeat_id = repeat(repeatImplementation, speed);
    };
    return DisplayAnimationRunner;
}(AnimationRunner));
var TextAnimationRunner = /** @class */ (function (_super) {
    __extends(TextAnimationRunner, _super);
    //Define groupVariation options
    function TextAnimationRunner() {
        var _this = _super.call(this) || this;
        _this.groupVariations = {
            TYPING: "typing"
        };
        return _this;
    }
    TextAnimationRunner.prototype._prepare = function () {
        var error = 0;
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
    ;
    TextAnimationRunner.prototype._configureAnimationTextTyping = function () {
        var _this = this;
        this.animationHandler = function () { return _this._animateTextTyping(); };
        //Require this.config to have:
        //Optional:
    };
    TextAnimationRunner.prototype._animateTextTyping = function () {
        var target = get(this.config, "target");
        var text = get(this.config, "text");
        var cursorConfig = get(this.config, "cursor");
        var showCursor = get(cursorConfig, "show");
        var blinkCursor; //true or false
        var blinkCursorSpeed; //milliseconds
        //Trigger cursor-blink, if requested
        if (showCursor) {
            var cursor = document.getElementsByTagName(get(this.config, "cursor_selector"))[0];
            cursor.classList.remove("hidden");
            blinkCursor = get(this.config, "blink");
            blinkCursorSpeed = get(this.config, "blink_speed");
            if (get(cursorConfig, "blink")) {
                var cursorAnimationRunner = new DisplayAnimationRunner();
                cursorAnimationRunner.prepare("blink", cursorConfig);
                cursorAnimationRunner.run();
            }
        }
        for (var position in text) {
            var letter = text[position];
            var targetText = target.innerText;
            targetText += letter;
            target.innerText = targetText;
        }
    };
    return TextAnimationRunner;
}(AnimationRunner));
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
function __error_console(msg) {
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
function get(obj, key) {
    return obj[key];
}
function getNested(obj, keys) {
    var key = keys.shift();
    var val = obj[key];
    if (keys.length > 0) {
        if (isSet(val)) {
            val = getNested(val, keys);
        }
        else {
            //If any of the parent nested objects are undefined or null, error out
            __error();
        }
    }
    return val;
}
function getIfSet(obj, key) {
    var val = obj[key];
    if (!isSet(val)) {
        __error();
    }
    return val;
}
function getNestedIfSet(obj, keys) {
    var val = getNested(obj, keys);
    if (!isSet(val)) {
        __error();
    }
    return val;
}
function isSet(obj, key) {
    if (_isDefinedAndNotNull(key)) {
        obj = obj[key];
    }
    return _isDefinedAndNotNull(obj);
}
function isSetNested(obj, keys) {
    var key = keys.shift();
    var val = obj[key];
    var targetFieldIsSet = _isDefinedAndNotNull(val);
    if (keys.length > 0) {
        if (targetFieldIsSet) {
            targetFieldIsSet = isSetNested(val, keys);
        }
    }
    return targetFieldIsSet;
}
function _isDefinedAndNotNull(val) {
    //Strict equality checks for input is UNDEFINED or NULL
    //If all evaluate to false, the input is defined and we can return true
    //If at least one
    var undefinedOrNullChecks = [
        typeof (val) === "undefined",
        val === undefined,
        val === null
    ];
    var undefinedOrNull = undefinedOrNullChecks.includes(true);
    return (undefinedOrNull);
}
/**
 * Description placeholder
 * @date 10/21/2023 - 12:09:34 PM
 *
 * @param {(any[] | object)} val
 * @returns {boolean}
 */
function isPopulated(val) {
    var isPopulated = false;
    if (Array.isArray(val)) {
        isPopulated = (val.length > 0);
    }
    else if (typeof (val) == "object") {
        isPopulated = (Object.keys(val).length > 0);
    }
    __error_console("Attempted to call 'isPopulated' on invalid object: " + val);
    return isPopulated;
}
//recursively merges
function mergeObject(target, source) {
    var merged = target;
    for (var property in source) {
        if (isSet(target, property) && typeof (get(target, property)) == "object") {
            merged = mergeObject(get(target, property), get(source, property));
        }
        else {
            merged[property] = source[property];
        }
    }
    return merged;
}
//easy way to create intervals
function repeat(callback, delay) {
    if (delay === void 0) { delay = 5000; }
    var repeatId = setInterval(callback, delay);
    return repeatId;
}
//easy way to stop intervals
function repeatStop(repeatId) {
    clearInterval(repeatId);
}
