import hammerhead from '../../deps/hammerhead';
import testCafeCore from '../../deps/testcafe-core';
import { ClickOptions } from '../../../../test-run/commands/options';
import ClickAutomation from '../click';
import typeChar from './type-char';
import getKeyCode from '../../utils/get-key-code';
import getKeyIdentifier from '../../utils/get-key-identifier';
import keyIdentifierRequiredForEvent from '../../utils/key-identifier-required-for-event';
import whilst from '../../utils/promise-whilst';
import { getDefaultAutomationOffsets } from '../../utils/offsets';
import { ACTION_STEP_DELAY } from '../../settings';

var Promise               = hammerhead.Promise;
var extend                = hammerhead.utils.extend;
var eventSimulator        = hammerhead.eventSandbox.eventSimulator;
var elementEditingWatcher = hammerhead.eventSandbox.elementEditingWatcher;

var domUtils              = testCafeCore.domUtils;
var contentEditable       = testCafeCore.contentEditable;
var textSelection         = testCafeCore.textSelection;
var delay                 = testCafeCore.delay;
var SPECIAL_KEYS          = testCafeCore.KEY_MAPS.specialKeys;


export default class TypeAutomation {
    constructor (element, text, typeOptions) {
        this.element = TypeAutomation.findTextEditableChild(element) || element;
        this.text    = text.toString();

        this.modifiers = typeOptions.modifiers;
        this.caretPos  = typeOptions.caretPos;
        this.replace   = typeOptions.replace;
        this.paste     = typeOptions.paste;
        this.offsetX   = typeOptions.offsetX;
        this.offsetY   = typeOptions.offsetY;

        this.elementChanged       = element !== this.element;
        this.currentPos           = 0;
        this.currentKeyCode       = null;
        this.currentCharCode      = null;
        this.currentKey           = null;
        this.currentKeyIdentifier = null;

        this.eventArgs = {
            options: null,
            element: null
        };

        this.eventState = {
            skipType:         false,
            simulateKeypress: true,
            simulateTypeChar: true
        };
    }

    static findTextEditableChild (element) {
        var innerElement = null;

        if (!domUtils.isEditableElement(element)) {
            var children = element.querySelectorAll('*');

            for (var i = 0; i < children.length; i++) {
                if (domUtils.isTextEditableElementAndEditingAllowed(children[i])) {
                    innerElement = children[i];
                    break;
                }
            }
        }

        return innerElement;
    }

    _calculateEventArguments (isPressEvent) {
        var activeElement     = domUtils.getActiveElement();
        var isContentEditable = domUtils.isContentEditableElement(this.element);
        var element           = this.eventArgs.element || this.element;

        // T162478: Wrong typing and keys pressing in editor
        if (!isContentEditable && activeElement !== element)
            element = TypeAutomation.findTextEditableChild(activeElement) || activeElement;

        var options = extend({
            keyCode: isPressEvent ? this.currentCharCode : this.currentKeyCode
        }, this.modifiers);

        if (isPressEvent)
            options.charCode = this.currentCharCode;

        if (keyIdentifierRequiredForEvent())
            options.keyIdentifier = isPressEvent ? '' : this.currentKeyIdentifier;
        else
            options.key = this.currentKey;

        return { element, options };
    }

    _calculateTargetElement () {
        var activeElement     = domUtils.getActiveElement();
        var isContentEditable = domUtils.isContentEditableElement(this.element);

        if (isContentEditable) {
            if (activeElement !== contentEditable.findContentEditableParent(this.element)) {
                this.eventState.skipType = true;

                return;
            }
        }
        else if (activeElement !== this.element) {
            this.eventState.skipType = true;

            return;
        }

        this.element = isContentEditable ? this.element : activeElement;
    }

    _click () {
        var activeElement     = domUtils.getActiveElement();
        var isTextEditable    = domUtils.isTextEditableElementAndEditingAllowed(this.element);
        var isContentEditable = domUtils.isContentEditableElement(this.element);

        if (activeElement !== this.element) {
            var { offsetX, offsetY } = getDefaultAutomationOffsets(this.element);
            var clickOptions = new ClickOptions({
                offsetX:   this.elementChanged ? offsetX : this.offsetX,
                offsetY:   this.elementChanged ? offsetY : this.offsetY,
                caretPos:  this.caretPos,
                modifiers: this.modifiers
            });

            var clickAutomation = new ClickAutomation(this.element, clickOptions);

            return clickAutomation
                .run()
                .then(() => delay(ACTION_STEP_DELAY));
        }

        if (isTextEditable)
            elementEditingWatcher.watchElementEditing(this.element);

        var selectionStart    = textSelection.getSelectionStart(this.element);
        var isEditableElement = isTextEditable || isContentEditable;

        if (isEditableElement && !isNaN(parseInt(this.caretPos, 10)) && this.caretPos !== selectionStart)
            textSelection.select(this.element, this.caretPos, this.caretPos);

        return Promise.resolve();
    }

    _type () {
        if (this.eventState.skipType)
            return Promise.resolve();

        var isContentEditable = domUtils.isContentEditableElement(this.element);

        if (this.replace) {
            if (domUtils.isTextEditableElementAndEditingAllowed(this.element))
                textSelection.select(this.element);
            else if (isContentEditable)
                textSelection.deleteSelectionContents(this.element, true);
        }

        return whilst(() => !this._isTypingFinished(), () => this._typingStep());
    }

    _isTypingFinished () {
        return this.currentPos === this.text.length;
    }

    _typingStep () {
        var char = this.text.charAt(this.currentPos);

        this.currentKeyCode       = getKeyCode(char);
        this.currentCharCode      = this.text.charCodeAt(this.currentPos);
        this.currentKey           = this.currentKeyCode === SPECIAL_KEYS['enter'] ? 'Enter' : char;
        this.currentKeyIdentifier = getKeyIdentifier(this.currentKey);

        this._keydown();
        this._keypress();

        return this._keyup();
    }

    _keydown () {
        this.eventArgs = this._calculateEventArguments();

        this.eventState.simulateKeypress = eventSimulator.keydown(this.eventArgs.element, this.eventArgs.options);
    }

    _keypress () {
        if (this.eventState.simulateKeypress === false)
            return;

        this.eventArgs = this._calculateEventArguments(true);

        this.eventState.simulateTypeChar = eventSimulator.keypress(this.eventArgs.element, this.eventArgs.options);
    }

    _keyup () {
        var elementForTyping = this.eventArgs.element;

        this.eventArgs = this._calculateEventArguments();

        if (this.paste) {
            return this
                ._typeAllText(elementForTyping)
                .then(() => {
                    eventSimulator.keyup(this.eventArgs.element, this.eventArgs.options);

                    this.currentPos = this.text.length;
                });
        }

        return this
            ._typeChar(elementForTyping)
            .then(() => {
                eventSimulator.keyup(this.eventArgs.element, this.eventArgs.options);

                this.currentPos++;
            });
    }

    _typeChar (element) {
        // NOTE: change event must not be raised after prevented keydown
        // or keypress even if element value was changed (B253816)
        if (this.eventState.simulateKeypress === false || this.eventState.simulateTypeChar === false) {
            elementEditingWatcher.restartWatchingElementEditing(element);

            return delay(ACTION_STEP_DELAY);
        }

        var currentChar       = this.text.charAt(this.currentPos);
        var isDigit           = /^\d$/.test(currentChar);
        var prevChar          = this.currentPos === 0 ? null : this.text.charAt(this.currentPos - 1);
        var isInputTypeNumber = domUtils.isInputElement(element) &&
                                element.type === 'number';

        if (isInputTypeNumber) {
            var selectionStart      = textSelection.getSelectionStart(element);
            var valueLength         = element.value.length;
            var textHasDigits       = /^\d/.test(this.text);
            var isPermissibleSymbol = currentChar === '.' || currentChar === '-' && valueLength;

            if (!isDigit && (textHasDigits || !isPermissibleSymbol || selectionStart !== 0))
                return delay(ACTION_STEP_DELAY);

            // NOTE: allow to type '.' or '-' only if it is the first symbol and the input already has
            // a value, or if '.' or '-' are added to a digit. Otherwise, the value won't be set.
            if (isDigit && (prevChar === '.' || prevChar === '-' && !valueLength))
                currentChar = prevChar + currentChar;
        }

        typeChar(element, currentChar);

        return delay(ACTION_STEP_DELAY);
    }

    _typeAllText (element) {
        typeChar(element, this.text);
        return delay(ACTION_STEP_DELAY);
    }

    run () {
        return this
            ._click()
            .then(() => this._calculateTargetElement())
            .then(() => this._type());
    }
}
