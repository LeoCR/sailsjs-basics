const User = require("../../models/User");

module.exports = {


  friendlyName: 'Add friends',


  description: '',


  inputs: {
    friends:{
      description:'An array of new friends to send requests to.',
      type:[
        {
          emailAddress:'string',
          fullName:'string'
        }
      ],
      example:[
        {
          emailAddress:'foo@example.com',
          fullName:'Foo McFoo'
        }
      ],
      required:true
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    const desiredFriendEmails=_.map(inputs.friends,'emailAddress');
    const friends=await User.find({
      emailAddress:{
        in:_.map(inputs.friends,'emailAddress')
      }
    });

    const existingUserFriendIds=_.map(friends,'id');
    const existingUserEmails=_.map(friends,'emailAddress');
    /* for (let friend of inputs.friends) {
      await User.addToCollection(this.req.me.id,'outboundFriendRequests',friend.id);
    } */
    const newUserEmails=_.difference(desiredFriendEmails,existingUserEmails);
    for (const email of newUserEmails) {
      const token = await sails.helpers.strings.random('url-friendly');
      await User.create({
        emailAddress:email,
        fullName:(_.find(inputs.friends,{emailAddress:email})).fullName,
        emailProofToken: token,
        emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
        emailStatus: 'confirmed'
      });
      //Todo send emeail to newly invited users
    }
    await User.addToCollection(this.req.me.id,'outboundFriendRequests',existingUserFriendIds);
    // All done.
    return;

  }


};
