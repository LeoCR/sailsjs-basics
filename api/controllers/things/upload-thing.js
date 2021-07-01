module.exports = {


  friendlyName: 'Upload thing',


  description: '',
  files:['photo'],

  inputs: {
    photo:{
      type:'ref',
      description:'Uploaded file stream',
      required:true
    },
    label:{
      type:'string'
    }
  },


  exits: {
    success:{
      outputDescription:'Information about the newly created record.',
      outputType:{
        id:'number',
        imageSrc:'string',
      }
    },
    badRequest:{
      description:'No image upload was provided',
      responseType:'badRequest'
    }
  },


  fn: async function (inputs) {
    const url=require('url');
    const info=await sails.uploadOne(inputs.photo);
    if(!info){
      throw 'badRequest';
    }
    console.log('info%%%%%%%%%%%%',info);
    // All done.
    const newThing=await Thing.create({
      imageUploadFd:info.fd,
      imageUploadMime:info.type,
      owner:this.req.me.id,
      label:inputs.label
    }).fetch();

    newThing.imageSrc=url.resolve(sails.config.custom.baseUrl,'/api/v1/things/'+newThing.id);
    const owner=await User.findOne({
      id:this.req.me.id
    });
    console.log('owner$$$$$$$$$$$$$',owner);

    return{
      id:newThing.id,
      fullName:owner.fullName?owner.fullName:'No Name',
      imageSrc:newThing.imageSrc
    };

  }


};
