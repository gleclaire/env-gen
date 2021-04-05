import yaml from 'js-yaml';
import _ from 'lodash';

const outputFormatter = (outputType, properties) => {
    if (outputType === 'Simple') {
        return simpleFormatter(properties)
    } else if (outputType === 'Terminal') {
        return terminalFormatter(properties)
    } else if (outputType === 'Kubernetes') {
        return kubernetesFormatter(properties)
    } else if (outputType === 'Properties') {
        return propertiesFormatter(properties)
    } else if (outputType === 'YAML') {
        return yamlFormatter(properties)
    } else {
        throw new Error("outputType " + outputType + "not supported");
    }
}

const getName = property => (
    property
        .split("=")[0]
        .toUpperCase()
        .replaceAll("-", "")
        .replaceAll(".", "_")
        .replaceAll("[", "_")
        .replaceAll("]", "_")
)

const getValue = property => (property.split("=")[1])

const simpleFormatter = (properties) => {
    var result = "";
    properties.forEach((property) => {
        result = result
            .concat(getName(property))
            .concat("=")
            .concat(getValue(property))
            .concat('\n')       
    })
    return result;
}

const terminalFormatter = (properties) => {
    var result = "";
    properties.forEach((property) => {
        result = result
            .concat(getName(property))
            .concat("=")
            .concat(getValue(property))
            .concat(' ')       
    })
    return result;
}

const kubernetesFormatter = (properties) => {
    var result = "";
    properties.forEach((property) => {
        result = result
            .concat('- name: ')
            .concat(getName(property))
            .concat('\n  value: \'')
            .concat(getValue(property))
            .concat('\'\n')       
    })
    return result;
}

const propertiesFormatter = (properties) => {
    var result = "";
    properties.forEach((property) => {
        result = result
            .concat(property.split("=")[0])
            .concat('=')
            .concat(property.split("=")[1])
            .concat('\n')       
    })
    return result;
}

const yamlFormatter = (properties) => {
    var result = properties
    .filter(Boolean) //removes empty lines
    .reduce((acc, line) => {
        _.set(acc, ...line.split("="));
        return acc;
    }, {})
    return yaml.dump(result);
}

export default outputFormatter;
