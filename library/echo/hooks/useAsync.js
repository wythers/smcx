"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAsyncInitialize = useAsyncInitialize;
const react_1 = require("react");
function useAsyncInitialize(func, deps = []) {
    const [state, setState] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        (() => __awaiter(this, void 0, void 0, function* () {
            setState(yield func());
        }))();
    }, deps);
    return state;
}
