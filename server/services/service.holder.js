/**
 * Holder service to hold some singleton objects which are initialized by passing parameters to require.
 * Noticed a difference in the behaviour. Hence this workaround
 */
var services = {};

exports.setService = (name, service) => {
    services[name] = service;
}

exports.getService = (name) => {
    return services[name];
}
