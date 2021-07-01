//const viewAvailableThings = require("./view-available-things");

module.exports = {


  friendlyName: 'Destroy one thing',


  description: 'Delete one thing from the database',


  inputs: {
    id:{
      type:'number',
      required:true
    }
  },


  exits: {
    forbidden:{
      description:'The user making this request doesn\'t have the permissions to delete this thing.',
      responseType:'forbidden'
    },
    notFound:{
      description:'This thing was not found',
      responseType:'notFound'
    }
  },


  fn: async function (inputs) {

    var thing=await Thing.findOne({
      id:inputs.id
    });
    if(!thing){
      throw 'notFound';
    }
    if(thing.owner!==this.req.me.id){
      throw 'forbidden';
    }
    await Thing.destroy({
      id:inputs.id
    });
    //await viewAvailableThings.destroy({id:inputs.id})
    // All done.
    return;

  }


};
