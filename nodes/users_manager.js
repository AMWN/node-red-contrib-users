var path = require('path');
var users = require('../users');


function checkedRequiredFields(RED, node, config, msg) {
  // Message testing conditions
  /*
  if !(msg.hasOwnProperty('user_management')){
    throw new Error("users.errors.user-management-required");
  }
  if !(msg.user_management.hasOwnProperty('action')){
    throw new Error("users.errors.user-management-action-required");
  }
  if !(msg.user_management.hasOwnProperty('username')){
    throw new Error("users.errors.user-management-username-required");
  }
  if !(msg.user_management.hasOwnProperty('password')){
    throw new Error("users.errors.user-management-password-required");
  }
  */
}

module.exports = function (RED) {

  function UsersManagerNode(n) {
    RED.nodes.createNode(this,n);
    var node = this;
    node.status({});

    // Searching though all nodes to find the users_config node
    // to extract the credentials from
    var config;
    RED.nodes.eachNode(function (n) {
      if (n.type === "users_config") {
        config = n;
        config.credentials = RED.nodes.getCredentials(n.id);
      }
    });

    node.on('input', function (msg) {
      try {
        checkedRequiredFields(RED, node, config, msg);
      } catch (err) {
        node.error(RED._(err.message));
        node.status({fill: "red", shape: "ring", text: RED._(err.message)});
        msg.res.status(500);
        msg.res.send("Error: invalid config");
      }

      user_m = msg.user_management;
      switch(user_m.action) {
	case 'test':
	  user_m.result = users.getUser('operator','operator');
	  break;
	/*
        case 'create':
	  if(users.getUserExistance(user_m.username) == null){
	    // Create the new user
            user_m.result = "Creation request";
	    users.addUser(user_m.username, user_m.password);
	  }
	  else{
	    // We have encountered an error
            user_m.error = "Creation request error, user already exists";
	  }
	  break;
	case 'update':
	  if(users.getUserExistance(user_m.username) != null){
	    // Update the user
            user_m.result = "Update request"
	    
	  }
	  else{
	    // We have encountered an error
            user_m.error = "Update request error, user does not exist";
	  }
	  break;
	case 'update_or_create':
          // Create the user (we can be indiscriminate b/c
          // we want to overwrite the old record if it exists
          if(users.getUserExistance(user_m.username) == null){
	    // User doesn't exist, create
	    users.addUser(user_m.username, user_m.password);
	  }
	  else {
	    // User exists, we will delete them and then recreate
	    users.deleteUser(user_m.username);
	    user.createUser(user_m.username, user_m.password);
	  }
	  break;
	case 'delete': 
	  if(users.getUser(user_m.username,user_m.password) != null){
	    // Delete the user
            user_m.result = "Delete request";
	  }
	  else{
	    // We have encountered an error
            user_m.error = "Delete request error";
	  }
	  break;
	*/
	default:
	  // Default action
          user_m.error = "Default action triggered";
      }

      if (user_m.hasOwnProperty('error')) {
        node.status({fill: "yellow", shape: "dot", text: "Invalid"});
        //node.send([msg, null]);
      } else {
        node.status({fill: "green", shape: "dot", text: "Valid"});
      }

      // Testing function
      msg.user_management = user_m;
      credentials = config.credentials;
      msg.payload = credentials;
      node.send(msg);
    });
  }

  RED.nodes.registerType("users_manager", UsersManagerNode);
};
