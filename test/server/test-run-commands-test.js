var expect          = require('chai').expect;
var TYPE            = require('../../lib/test-run/commands/type');
var createCommand   = require('../../lib/test-run/commands/from-object');
var ERROR_TYPE      = require('../../lib/errors/test-run/type');
var SelectorBuilder = require('../../lib/client-functions/selector-builder');


// NOTE: chai's throws doesn't perform deep comparison of error objects
function assertThrow (fn, expectedErr) {
    var actualErr = null;

    try {
        fn();
    }
    catch (err) {
        actualErr = err;
    }

    expect(actualErr).eql(expectedErr);
}

function makeSelector (str, skipVisibilityCheck) {
    var builder = new SelectorBuilder(str, { visibilityCheck: !skipVisibilityCheck }, { instantiation: 'Selector' });
    var command = builder.getCommand([]);

    return JSON.parse(JSON.stringify(command));
}

describe('Test run commands', function () {
    describe('Construction from object and serialization', function () {
        it('Should create ClickCommand from object', function () {
            var commandObj = {
                type:     TYPE.click,
                selector: '#yo',
                yo:       'test',

                options: {
                    offsetX:  23,
                    offsetY:  32,
                    caretPos: 2,
                    dummy:    'yo',

                    modifiers: {
                        ctrl:  true,
                        shift: true,
                        dummy: 'yo',
                        alt:   true,
                        meta:  true
                    }
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.click,
                selector: makeSelector('#yo'),

                options: {
                    offsetX:  23,
                    offsetY:  32,
                    caretPos: 2,

                    modifiers: {
                        ctrl:  true,
                        alt:   true,
                        shift: true,
                        meta:  true
                    }
                }
            });

            commandObj = {
                type:     TYPE.click,
                selector: '#yo'
            };

            command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.click,
                selector: makeSelector('#yo'),

                options: {
                    offsetX:  null,
                    offsetY:  null,
                    caretPos: null,

                    modifiers: {
                        ctrl:  false,
                        alt:   false,
                        shift: false,
                        meta:  false
                    }
                }
            });
        });

        it('Should create RightClickCommand from object', function () {
            var commandObj = {
                type:     TYPE.rightClick,
                selector: '#yo',
                yo:       'test',

                options: {
                    offsetX:  23,
                    offsetY:  32,
                    caretPos: 2,
                    dummy:    'yo',

                    modifiers: {
                        ctrl:  true,
                        shift: false,
                        dummy: 'yo',
                        alt:   true,
                        meta:  false
                    }
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.rightClick,
                selector: makeSelector('#yo'),

                options: {
                    offsetX:  23,
                    offsetY:  32,
                    caretPos: 2,

                    modifiers: {
                        ctrl:  true,
                        alt:   true,
                        shift: false,
                        meta:  false
                    }
                }
            });

            commandObj = {
                type:     TYPE.rightClick,
                selector: '#yo'
            };

            command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.rightClick,
                selector: makeSelector('#yo'),

                options: {
                    offsetX:  null,
                    offsetY:  null,
                    caretPos: null,

                    modifiers: {
                        ctrl:  false,
                        alt:   false,
                        shift: false,
                        meta:  false
                    }
                }
            });
        });

        it('Should create DoubleClickCommand from object', function () {
            var commandObj = {
                type:     TYPE.doubleClick,
                selector: '#yo',
                yo:       'test',

                options: {
                    offsetX:  23,
                    offsetY:  32,
                    caretPos: 2,
                    dummy:    'yo',

                    modifiers: {
                        ctrl:  true,
                        shift: false,
                        dummy: 'yo',
                        alt:   true,
                        meta:  false
                    }
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.doubleClick,
                selector: makeSelector('#yo'),

                options: {
                    offsetX:  23,
                    offsetY:  32,
                    caretPos: 2,

                    modifiers: {
                        ctrl:  true,
                        alt:   true,
                        shift: false,
                        meta:  false
                    }
                }
            });

            commandObj = {
                type:     TYPE.doubleClick,
                selector: '#yo'
            };

            command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.doubleClick,
                selector: makeSelector('#yo'),

                options: {
                    offsetX:  null,
                    offsetY:  null,
                    caretPos: null,

                    modifiers: {
                        ctrl:  false,
                        alt:   false,
                        shift: false,
                        meta:  false
                    }
                }
            });
        });

        it('Should create HoverCommand from object', function () {
            var commandObj = {
                type:     TYPE.hover,
                selector: '#yo',
                yo:       'test',

                options: {
                    offsetX:  23,
                    offsetY:  32,
                    caretPos: 2,
                    dummy:    'yo',

                    modifiers: {
                        ctrl:  true,
                        shift: false,
                        dummy: 'yo',
                        alt:   true,
                        meta:  false
                    }
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.hover,
                selector: makeSelector('#yo'),

                options: {
                    offsetX: 23,
                    offsetY: 32,

                    modifiers: {
                        ctrl:  true,
                        alt:   true,
                        shift: false,
                        meta:  false
                    }
                }
            });

            commandObj = {
                type:     TYPE.hover,
                selector: '#yo'
            };

            command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.hover,
                selector: makeSelector('#yo'),

                options: {
                    offsetX: null,
                    offsetY: null,

                    modifiers: {
                        ctrl:  false,
                        alt:   false,
                        shift: false,
                        meta:  false
                    }
                }
            });
        });

        it('Should create DragCommand from object', function () {
            var commandObj = {
                type:        TYPE.drag,
                selector:    '#yo',
                dragOffsetX: 10,
                dragOffsetY: -15,
                dummy:       false,

                options: {
                    offsetX:  23,
                    offsetY:  32,
                    caretPos: 2,
                    dummy:    1,

                    modifiers: {
                        ctrl:  true,
                        shift: false,
                        dummy: 'yo',
                        alt:   true,
                        meta:  false
                    }
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:        TYPE.drag,
                selector:    makeSelector('#yo'),
                dragOffsetX: 10,
                dragOffsetY: -15,

                options: {
                    offsetX: 23,
                    offsetY: 32,

                    modifiers: {
                        ctrl:  true,
                        alt:   true,
                        shift: false,
                        meta:  false
                    }
                }
            });

            commandObj = {
                type:        TYPE.drag,
                selector:    '#yo',
                dragOffsetX: 10,
                dragOffsetY: -15
            };

            command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:        TYPE.drag,
                selector:    makeSelector('#yo'),
                dragOffsetX: 10,
                dragOffsetY: -15,

                options: {
                    offsetX: null,
                    offsetY: null,

                    modifiers: {
                        ctrl:  false,
                        alt:   false,
                        shift: false,
                        meta:  false
                    }
                }
            });
        });

        it('Should create DragToElementCommand from object', function () {
            var commandObj = {
                type:                TYPE.dragToElement,
                selector:            '#yo',
                destinationSelector: '#destination',
                dragOffsetX:         10,

                options: {
                    offsetX:  23,
                    offsetY:  32,
                    caretPos: 2,
                    dummy:    1,

                    modifiers: {
                        ctrl:  true,
                        shift: false,
                        dummy: 'yo',
                        alt:   true,
                        meta:  false
                    }
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:                TYPE.dragToElement,
                selector:            makeSelector('#yo'),
                destinationSelector: makeSelector('#destination'),

                options: {
                    offsetX: 23,
                    offsetY: 32,

                    modifiers: {
                        ctrl:  true,
                        alt:   true,
                        shift: false,
                        meta:  false
                    }
                }
            });

            commandObj = {
                type:                TYPE.dragToElement,
                selector:            '#yo',
                destinationSelector: '#destination'
            };

            command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:                TYPE.dragToElement,
                selector:            makeSelector('#yo'),
                destinationSelector: makeSelector('#destination'),

                options: {
                    offsetX: null,
                    offsetY: null,

                    modifiers: {
                        ctrl:  false,
                        alt:   false,
                        shift: false,
                        meta:  false
                    }
                }
            });
        });

        it('Should create TypeTextCommand from object', function () {
            var commandObj = {
                type:     TYPE.typeText,
                selector: '#yo',
                text:     'testText',
                yo:       'test',

                options: {
                    offsetX:  23,
                    offsetY:  32,
                    caretPos: 2,
                    dummy:    'yo',
                    replace:  true,
                    paste:    true,

                    modifiers: {
                        ctrl:  true,
                        shift: false,
                        dummy: 'yo',
                        alt:   false,
                        meta:  false
                    }
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.typeText,
                selector: makeSelector('#yo'),
                text:     'testText',

                options: {
                    offsetX:  23,
                    offsetY:  32,
                    caretPos: 2,
                    replace:  true,
                    paste:    true,

                    modifiers: {
                        ctrl:  true,
                        alt:   false,
                        shift: false,
                        meta:  false
                    }
                }
            });

            commandObj = {
                type:     TYPE.typeText,
                selector: '#yo',
                text:     'testText'
            };

            command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.typeText,
                selector: makeSelector('#yo'),
                text:     'testText',

                options: {
                    offsetX:  null,
                    offsetY:  null,
                    caretPos: null,
                    replace:  false,
                    paste:    false,

                    modifiers: {
                        ctrl:  false,
                        alt:   false,
                        shift: false,
                        meta:  false
                    }
                }
            });
        });

        it('Should create SelectTextCommand from object', function () {
            var commandObj = {
                type:     TYPE.selectText,
                selector: '#yo',
                startPos: 1,
                endPos:   2,
                yo:       'test',

                options: {
                    offsetX: 23,
                    dummy:   'yo'
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.selectText,
                selector: makeSelector('#yo'),
                startPos: 1,
                endPos:   2
            });

            commandObj = {
                type:     TYPE.selectText,
                selector: '#yo'
            };

            command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.selectText,
                selector: makeSelector('#yo'),
                startPos: null,
                endPos:   null
            });
        });

        it('Should create SelectTextAreaContentCommand from object', function () {
            var commandObj = {
                type:      TYPE.selectTextAreaContent,
                selector:  '#yo',
                startLine: 0,
                startPos:  1,
                endLine:   2,
                endPos:    3,
                yo:        5,

                options: {
                    offsetX: 23,
                    dummy:   'yo'
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:      TYPE.selectTextAreaContent,
                selector:  makeSelector('#yo'),
                startLine: 0,
                startPos:  1,
                endLine:   2,
                endPos:    3
            });

            commandObj = {
                type:     TYPE.selectTextAreaContent,
                selector: '#yo'
            };

            command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:      TYPE.selectTextAreaContent,
                selector:  makeSelector('#yo'),
                startLine: null,
                startPos:  null,
                endLine:   null,
                endPos:    null
            });
        });

        it('Should create SelectEditableContentCommand from object', function () {
            var commandObj = {
                type:          TYPE.selectEditableContent,
                selector:      '#yo',
                startSelector: '#node1',
                endSelector:   '#node2',
                yo:            'test',

                options: {
                    offsetX: 23,
                    dummy:   'yo'
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:          TYPE.selectEditableContent,
                startSelector: makeSelector('#node1'),
                endSelector:   makeSelector('#node2')
            });

            commandObj = {
                type:          TYPE.selectEditableContent,
                selector:      '#yo',
                startSelector: '#node1'
            };

            command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:          TYPE.selectEditableContent,
                startSelector: makeSelector('#node1'),
                endSelector:   null
            });
        });

        it('Should create PressKeyCommand from object', function () {
            var commandObj = {
                type:     TYPE.pressKey,
                selector: '#yo',
                keys:     'a+b c',
                yo:       'test',

                options: {
                    offsetX: 23,
                    offsetY: 32,
                    dummy:   'yo',

                    modifiers: {
                        ctrl:  true,
                        shift: false,
                        dummy: 'yo',
                        alt:   false,
                        meta:  false
                    }
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type: TYPE.pressKey,
                keys: 'a+b c'
            });
        });

        it('Should create WaitCommand from object', function () {
            var commandObj = {
                type:    TYPE.wait,
                timeout: 1000
            };
            var command    = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:    TYPE.wait,
                timeout: 1000
            });
        });

        it('Should create NavigateToCommand from object', function () {
            var commandObj = {
                type: TYPE.navigateTo,
                url:  'localhost'
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type: TYPE.navigateTo,
                url:  'localhost'
            });
        });

        it('Should create SetFilesToUploadCommand from object', function () {
            var commandObj = {
                type:     TYPE.setFilesToUpload,
                selector: '#yo',
                filePath: '/test/path',
                dummy:    'test',

                options: {
                    dummy: 'yo'
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.setFilesToUpload,
                selector: makeSelector('#yo', true),
                filePath: '/test/path'
            });

            commandObj = {
                type:     TYPE.setFilesToUpload,
                selector: '#yo',
                filePath: ['/test/path/1', '/test/path/2'],
                dummy:    'test',

                options: {
                    dummy: 'yo'
                }
            };

            command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.setFilesToUpload,
                selector: makeSelector('#yo', true),
                filePath: ['/test/path/1', '/test/path/2']
            });
        });

        it('Should create ClearUploadCommand from object', function () {
            var commandObj = {
                type:     TYPE.clearUpload,
                selector: '#yo',
                dummy:    'test',

                options: {
                    dummy: 'yo'
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.clearUpload,
                selector: makeSelector('#yo', true)
            });
        });

        it('Should create TakeScreenshotCommand from object', function () {
            var commandObj = {
                type:     TYPE.takeScreenshot,
                selector: '#yo',
                path:     'custom',
                dummy:    'test',

                options: {
                    dummy: 'yo'
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type: TYPE.takeScreenshot,
                path: 'custom'
            });

            commandObj = {
                type:     TYPE.takeScreenshot,
                selector: '#yo',
                dummy:    'test',

                options: {
                    dummy: 'yo'
                }
            };

            command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type: TYPE.takeScreenshot,
                path: ''
            });
        });

        it('Should create ResizeWindowCommand from object', function () {
            var commandObj = {
                type:     TYPE.resizeWindow,
                selector: '#yo',
                dummy:    'test',
                width:    100,
                height:   100,

                options: {
                    dummy: 'yo'
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:   TYPE.resizeWindow,
                width:  100,
                height: 100
            });
        });

        it('Should create ResizeWindowToFitDeviceCommand from object', function () {
            var commandObj = {
                type:     TYPE.resizeWindowToFitDevice,
                selector: '#yo',
                dummy:    'test',
                device:   'iPhone',

                options: {
                    dummy:               'yo',
                    portraitOrientation: true
                }
            };

            var command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:    TYPE.resizeWindowToFitDevice,
                device:  'iPhone',
                options: { portraitOrientation: true }
            });

            commandObj = {
                type:   TYPE.resizeWindowToFitDevice,
                device: 'iPhone'
            };

            command = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:    TYPE.resizeWindowToFitDevice,
                device:  'iPhone',
                options: { portraitOrientation: false }
            });
        });

        it('Should create SwitchToIframeCommand from object', function () {
            var commandObj = {
                type:     TYPE.switchToIframe,
                selector: '#iframe'
            };
            var command    = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type:     TYPE.switchToIframe,
                selector: makeSelector('#iframe')
            });
        });

        it('Should create SwitchToMainWindowCommand from object', function () {
            var commandObj = {
                type: TYPE.switchToMainWindow
            };
            var command    = createCommand(commandObj);

            expect(JSON.parse(JSON.stringify(command))).eql({
                type: TYPE.switchToMainWindow
            });
        });
    });

    describe('Validation', function () {
        it('Should validate СlickСommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.click
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but undefined was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.click,
                        selector: 1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but number was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.click,
                        selector: 'element',
                        options:  1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionOptionsTypeError,
                    actualType:      'number',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.click,
                        selector: 'element',
                        options:  {
                            offsetX: 'offsetX'
                        }
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionIntegerOptionError,
                    optionName:      'offsetX',
                    actualValue:     'string',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.click,
                        selector: 'element',
                        options:  {
                            offsetX: 10.5
                        }
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionIntegerOptionError,
                    optionName:      'offsetX',
                    actualValue:     10.5,
                    callsite:        null
                }
            );
        });

        it('Should validate RightСlickСommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.rightClick
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but undefined was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.rightClick,
                        selector: true
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector,' +
                                     ' node snapshot or a Promise returned by a Selector, but boolean was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.rightClick,
                        selector: 'element',
                        options:  'options'
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionOptionsTypeError,
                    actualType:      'string',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.rightClick,
                        selector: 'element',
                        options:  {
                            offsetX: false
                        }
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionIntegerOptionError,
                    optionName:      'offsetX',
                    actualValue:     'boolean',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.rightClick,
                        selector: 'element',
                        options:  {
                            modifiers: {
                                shift: 'true'
                            }
                        }
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionBooleanOptionError,
                    optionName:      'modifiers.shift',
                    actualValue:     'string',
                    callsite:        null
                }
            );
        });

        it('Should validate DoubleСlickСommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.doubleClick
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but undefined was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.doubleClick,
                        selector: true
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but boolean was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.doubleClick,
                        selector: 'element',
                        options:  1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionOptionsTypeError,
                    actualType:      'number',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.doubleClick,
                        selector: 'element',
                        options:  {
                            caretPos: '5'
                        }
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionPositiveIntegerOptionError,
                    optionName:      'caretPos',
                    actualValue:     'string',
                    callsite:        null
                }
            );
        });

        it('Should validate HoverСommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.hover
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but undefined was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.hover,
                        selector: 1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but number was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.hover,
                        selector: 'element',
                        options:  true
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionOptionsTypeError,
                    actualType:      'boolean',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.hover,
                        selector: 'element',
                        options:  {
                            offsetX: 'offsetX'
                        }
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionIntegerOptionError,
                    optionName:      'offsetX',
                    actualValue:     'string',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.hover,
                        selector: 'element',
                        options:  {
                            offsetY: 1.01
                        }
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionIntegerOptionError,
                    optionName:      'offsetY',
                    actualValue:     1.01,
                    callsite:        null
                }
            );
        });

        it('Should validate DragСommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.drag
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but undefined was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.drag,
                        selector: 1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but number was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.drag,
                        selector: 'element'
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionIntegerArgumentError,
                    argumentName:    'dragOffsetX',
                    actualValue:     'undefined',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:        TYPE.drag,
                        selector:    'element',
                        dragOffsetX: 10
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionIntegerArgumentError,
                    argumentName:    'dragOffsetY',
                    actualValue:     'undefined',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:        TYPE.drag,
                        selector:    'element',
                        dragOffsetX: 10,
                        dragOffsetY: 10.5
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionIntegerArgumentError,
                    argumentName:    'dragOffsetY',
                    actualValue:     10.5,
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:        TYPE.drag,
                        selector:    'element',
                        dragOffsetX: 1,
                        dragOffsetY: -1,
                        options:     1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionOptionsTypeError,
                    actualType:      'number',
                    callsite:        null
                }
            );
        });

        it('Should validate DragToElementСommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.dragToElement
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but undefined was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.dragToElement,
                        selector: 1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but number was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.dragToElement,
                        selector: 'element'
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'destinationSelector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but undefined was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:                TYPE.dragToElement,
                        selector:            'element',
                        destinationSelector: 1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'destinationSelector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but number was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:                TYPE.dragToElement,
                        selector:            'element',
                        destinationSelector: 'destination',
                        options:             1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionOptionsTypeError,
                    actualType:      'number',
                    callsite:        null
                }
            );
        });

        it('Should validate TypeTextСommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.typeText
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but undefined was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.typeText,
                        selector: 1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but number was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.typeText,
                        selector: 'element'
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArgumentError,
                    argumentName:    'text',
                    actualValue:     'undefined',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.typeText,
                        selector: 'element',
                        text:     2
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArgumentError,
                    argumentName:    'text',
                    actualValue:     'number',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.typeText,
                        selector: 'element',
                        text:     ''
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArgumentError,
                    argumentName:    'text',
                    actualValue:     '""',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.typeText,
                        selector: 'element',
                        text:     'testText',
                        options:  true
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionOptionsTypeError,
                    actualType:      'boolean',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.typeText,
                        selector: 'element',
                        text:     'testText',
                        options:  {
                            offsetX: 'offsetX'
                        }
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionIntegerOptionError,
                    optionName:      'offsetX',
                    actualValue:     'string',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.typeText,
                        selector: 'element',
                        text:     'testText',
                        options:  {
                            replace: 10
                        }
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionBooleanOptionError,
                    optionName:      'replace',
                    actualValue:     'number',
                    callsite:        null
                }
            );
        });

        it('Should validate SelectTextСommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.selectText
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but undefined was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.selectText,
                        selector: {}
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but object was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.selectText,
                        selector: 'element',
                        startPos: ''
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionPositiveIntegerArgumentError,
                    argumentName:    'startPos',
                    actualValue:     'string',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.selectText,
                        selector: 'element',
                        startPos: 5.5
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionPositiveIntegerArgumentError,
                    argumentName:    'startPos',
                    actualValue:     5.5,
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.selectText,
                        selector: 'element',
                        endPos:   NaN
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionPositiveIntegerArgumentError,
                    argumentName:    'endPos',
                    actualValue:     NaN,
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.selectText,
                        selector: 'element',
                        endPos:   -1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionPositiveIntegerArgumentError,
                    argumentName:    'endPos',
                    actualValue:     -1,
                    callsite:        null
                }
            );
        });

        it('Should validate SelectTextAreaContentСommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.selectTextAreaContent
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but undefined was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.selectTextAreaContent,
                        selector: {}
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but object was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:      TYPE.selectTextAreaContent,
                        selector:  'element',
                        startLine: ''
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionPositiveIntegerArgumentError,
                    argumentName:    'startLine',
                    actualValue:     'string',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:      TYPE.selectTextAreaContent,
                        selector:  'element',
                        startLine: 5.5
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionPositiveIntegerArgumentError,
                    argumentName:    'startLine',
                    actualValue:     5.5,
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.selectTextAreaContent,
                        selector: 'element',
                        endLine:  NaN
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionPositiveIntegerArgumentError,
                    argumentName:    'endLine',
                    actualValue:     NaN,
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.selectTextAreaContent,
                        selector: 'element',
                        endLine:  -1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionPositiveIntegerArgumentError,
                    argumentName:    'endLine',
                    actualValue:     -1,
                    callsite:        null
                }
            );
        });

        it('Should validate SelectEditableContentСommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.selectEditableContent
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'startSelector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but undefined was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:          TYPE.selectEditableContent,
                        startSelector: 1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'startSelector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but number was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:          TYPE.selectEditableContent,
                        startSelector: 'node1',
                        endSelector:   true
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'endSelector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but boolean was passed.',

                    callsite: null
                }
            );
        });

        it('Should validate PressKeyСommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.pressKey
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArgumentError,
                    argumentName:    'keys',
                    actualValue:     'undefined',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.pressKey,
                        keys: true
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArgumentError,
                    argumentName:    'keys',
                    actualValue:     'boolean',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.pressKey,
                        keys: ''
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArgumentError,
                    argumentName:    'keys',
                    actualValue:     '""',
                    callsite:        null
                }
            );
        });

        it('Should validate WaitСommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.wait
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionPositiveIntegerArgumentError,
                    argumentName:    'timeout',
                    actualValue:     'undefined',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:    TYPE.wait,
                        timeout: -5
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionPositiveIntegerArgumentError,
                    argumentName:    'timeout',
                    actualValue:     -5,
                    callsite:        null
                }
            );
        });

        it('Should validate NavigateToCommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.navigateTo
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArgumentError,
                    argumentName:    'url',
                    actualValue:     'undefined',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.navigateTo,
                        url:  true
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArgumentError,
                    argumentName:    'url',
                    actualValue:     'boolean',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.navigateTo,
                        url:  ''
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArgumentError,
                    argumentName:    'url',
                    actualValue:     '""',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.navigateTo,
                        url:  'file://index.html'
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionUnsupportedUrlProtocolError,
                    protocol:        'file',
                    argumentName:    'url',
                    callsite:        null
                }
            );
        });

        it('Should validate SetFilesToUploadCommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.setFilesToUpload
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but undefined was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.setFilesToUpload,
                        selector: 1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but number was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.setFilesToUpload,
                        selector: 'element'
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringOrStringArrayArgumentError,
                    argumentName:    'filePath',
                    actualValue:     'undefined',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.setFilesToUpload,
                        selector: 'element',
                        filePath: 2
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringOrStringArrayArgumentError,
                    argumentName:    'filePath',
                    actualValue:     'number',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.setFilesToUpload,
                        selector: 'element',
                        filePath: ''
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringOrStringArrayArgumentError,
                    argumentName:    'filePath',
                    actualValue:     '""',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.setFilesToUpload,
                        selector: 'element',
                        filePath: {}
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringOrStringArrayArgumentError,
                    argumentName:    'filePath',
                    actualValue:     'object',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.setFilesToUpload,
                        selector: 'element',
                        filePath: []
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringOrStringArrayArgumentError,
                    argumentName:    'filePath',
                    actualValue:     '[]',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.setFilesToUpload,
                        selector: 'element',
                        filePath: ['123', 42]
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArrayElementError,
                    argumentName:    'filePath',
                    actualValue:     'number',
                    elementIndex:    1,
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.setFilesToUpload,
                        selector: 'element',
                        filePath: ['123', '']
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArrayElementError,
                    argumentName:    'filePath',
                    actualValue:     '""',
                    elementIndex:    1,
                    callsite:        null
                }
            );
        });

        it('Should validate ClearUploadCommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.clearUpload
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but undefined was passed.',

                    callsite: null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:     TYPE.clearUpload,
                        selector: 1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionSelectorError,
                    selectorName:    'selector',
                    errMsg:          'Selector is expected to be initialized with a function, CSS selector string, another Selector, ' +
                                     'node snapshot or a Promise returned by a Selector, but number was passed.',

                    callsite: null
                }
            );
        });

        it('Should validate TakeScreenshot', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.takeScreenshot,
                        path: 1
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArgumentError,
                    actualValue:     'number',
                    argumentName:    'path',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.takeScreenshot,
                        path: ''
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArgumentError,
                    actualValue:     '""',
                    argumentName:    'path',
                    callsite:        null
                }
            );
        });

        it('Should validate ResizeWindowСommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.resizeWindow
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionPositiveIntegerArgumentError,
                    argumentName:    'width',
                    actualValue:     'undefined',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:   TYPE.resizeWindow,
                        width:  5,
                        height: -5
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionPositiveIntegerArgumentError,
                    argumentName:    'height',
                    actualValue:     -5,
                    callsite:        null
                }
            );
        });

        it('Should validate ResizeWindowToFitDeviceСommand', function () {
            assertThrow(
                function () {
                    return createCommand({
                        type: TYPE.resizeWindowToFitDevice
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArgumentError,
                    argumentName:    'device',
                    actualValue:     'undefined',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:   TYPE.resizeWindowToFitDevice,
                        device: 5
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArgumentError,
                    argumentName:    'device',
                    actualValue:     'number',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:   TYPE.resizeWindowToFitDevice,
                        device: ''
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionStringArgumentError,
                    argumentName:    'device',
                    actualValue:     '""',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:   TYPE.resizeWindowToFitDevice,
                        device: 'iPhone 555'
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionUnsupportedDeviceTypeError,
                    argumentName:    'device',
                    actualValue:     'iPhone 555',
                    callsite:        null
                }
            );

            assertThrow(
                function () {
                    return createCommand({
                        type:    TYPE.resizeWindowToFitDevice,
                        device:  'iPhone',
                        options: { portraitOrientation: {} }
                    });
                },
                {
                    isTestCafeError: true,
                    type:            ERROR_TYPE.actionBooleanOptionError,
                    optionName:      'portraitOrientation',
                    actualValue:     'object',
                    callsite:        null
                }
            );
        });
    });
});
