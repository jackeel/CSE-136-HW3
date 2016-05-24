/**
 * Created by kevingu on 5/21/16.
 */
var status = {};
status.ERROR = "error";
status.SUCCESS = "success";
status.FAIL = "fail";

var successMessages={};
successMessages.OK = "OK";

var failedMessages = {};
failedMessages.FAIL = "FAIL";
failedMessages.MISSING_PARAMETERS = "Missing parameters!";


exports.status = status;
exports.failedMessages = failedMessages;
exports.successMessages = successMessages;
