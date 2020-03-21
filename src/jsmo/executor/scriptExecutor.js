import {Visitor} from "../visitor/visitor.js";

let slope = {
    variables: {}
};

/**
 * if the variable exists, return the value
 * else return the original string
 * @param str
 */
function parseVariable(str) {
    let value = slope.variables[str];
    if (value) {
        return value
    } else {
        return str
    }
}

