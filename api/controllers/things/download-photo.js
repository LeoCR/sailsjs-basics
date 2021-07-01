module.exports = {


  friendlyName: 'Download photo',


  description: 'Download photo file (returning a stream).',


  inputs: {
    id:{
      description:'The id of the thing whose photo we\'re downloading.',
      type:'number',
      required:true
    }
  },


  exits: {
    success:{
      outputDescription:'The streaming bytes of the specified thing\'s photo.',
      outputType:'ref'
    },
    notFound:{
      responseType:'notFound'
    },
    forbidden:{
      responseType:'forbidden'
    }
  },


  fn: async function (inputs) {
    const thing=await Thing.findOne({
      id:inputs.id
    });
    if(!thing){
      throw 'notFound';
    }
    const friends=await User.findOne({
      id:this.req.me.id
    }).populate('friends');

    if(this.req.me.id!==thing.owner&&!_.any(friends,{id:thing.owner})){
      throw 'forbidden';
    }

    this.res.type(thing.imageUploadMime);

    const downloading=await sails.startDownload(thing.imageUploadFd);
    // All done.
    return downloading;

  }


};
