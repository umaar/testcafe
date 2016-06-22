import { Promise } from '../../deps/hammerhead';
import DriverStatus from '../../status';
import { createReplicator, FunctionTransform, ClientFunctionNodeTransform } from './replicator';
import evalFunction from './eval-function';
import { UncaughtErrorInClientFunctionCode } from '../../../../errors/test-run';

export default class ClientFunctionExecutor {
    constructor (command) {
        this.command    = command;
        this.replicator = this._createReplicator();
    }

    getResult () {
        return Promise.resolve()
            .then(() => {
                var scopeVars = this.replicator.decode(this.command.scopeVars);

                return evalFunction(this.command.fnCode, scopeVars);
            })
            .then(fn => {
                var args = this.replicator.decode(this.command.args);

                return this._executeFn(fn, args);
            })
            .catch(err => {
                if (!err.isTestCafeError)
                    err = new UncaughtErrorInClientFunctionCode(this.command.instantiationCallsiteName, err);

                throw err;
            });
    }

    getResultDriverStatus () {
        return this
            .getResult()
            .then(result => new DriverStatus({
                isCommandResult: true,
                result:          this.replicator.encode(result)
            }))
            .catch(err => {
                return new DriverStatus({
                    isCommandResult: true,
                    executionError:  err
                });
            });
    }

    // Overridable methods
    _createReplicator () {
        return createReplicator([
            new ClientFunctionNodeTransform(this.command.instantiationCallsiteName),
            new FunctionTransform()
        ]);
    }

    _executeFn (fn, args) {
        return fn.apply(window, args);
    }
}
