parasails.registerPage('available-things', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    things:[],
    confirmDeleteThingModalOpen:false,
    selectedThing:undefined,
    syncing:false,
    cloudError:'',
    formErrors:{},
    uploadThingModalOpen:false,
    uploadFormData:{
      label:'',
      photo:undefined
    },
    me:{
      friends:[]
    }
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    //…
  },
  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    /*
    clickThing:async function(thingID){
      console.log('Clicked thing #'+thingID);
      await Cloud.destroyOneThing.with({id:thingID});
      _.remove(this.things,{id:thingID});
      this.$forceUpdate();
    },
    */
    clickDeleteThing:function(thingID){
      console.log('Clicked delete button')
      this.confirmDeleteThingModalOpen=true;
      this.selectedThing=_.find(this.things,{id:thingID});
    },
    closeDeleteThingModal:function(){
      this.selectedThing=undefined;
      this.confirmDeleteThingModalOpen=false;
    },
    submittedDeleteThingForm:function(){
      console.log('Ok it worked');
      _.remove(this.things,{id:this.selectedThing.id});
      this.$forceUpdate();
      this.confirmDeleteThingModalOpen=false;
      this.selectedThing=undefined;
    },
    handleParsingDeleteThingForm:function(){
      return {
        id: this.selectedThing.id,
      };
    },
    clickAddButton:function(){
      this.uploadThingModalOpen=true;
    },
    _clearUploadThingModal:function(){
      //Close Modal
      this.uploadThingModalOpen=false;
      //Reset form data
      this.uploadFormData={
        label:'',
        photo:undefined
      };
      //Clear error states
      this.formErrors={};
      this.cloudError='';
    },
    closeUploadThingModal:function(){
      this._clearUploadThingModal();
    },
    submittedUploadThingForm:async function(result){
      try {
        if(result&&result.id&&result.fullName){
          this.things.push({
            label:this.uploadFormData.label,
            id:result.id,
            owner:{
              id:result.id,
              fullName:result.fullName
            }
          });
        }
      } catch (error) {
        console.error('An error occurs in submittedUploadThingForm',error);
      }
      //Close the modal
      this._clearUploadThingModal();
    },
    handleParsingUploadThingForm:function(){
      // Clear out any pre-existing error messages.
      this.formErrors={};

      var argins=this.uploadFormData;

      //TODO : validations go here

      /**
       * If there were any issues, they've already now been comunicated to the user,
       * so simply return undefined. (This signifies that the submission should be)
       * cancelled.
       */
      if(Object.keys(this.formErrors).length>0){
        return;
      }
      return argins;
    },
    changeFileInput:function(files){
      const selectedFile=files[0];
      if(!selectedFile){
        this.uploadFormData.photo=undefined;
        return;
      }
      this.uploadFormData.photo=selectedFile;
    }
  }
});
