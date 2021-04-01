Component({
    externalClasses: ['i-class'],

    options: {
        multipleSlots: true
    },

    properties: {
        indexs:{
            type: Number,
            value: 0 
        },
        hasSlot: {
            type: Boolean,
            value: true
        },
        full: {
            type: Boolean,
            value: false
        },
        thumb: {
            type: String,
            value: ''
        },
        title: {
            type: String,
            value: ''
        },
        subtitle: {
            type: String,
            value: ''
        },
        extra: {
            type: String,
            value: ''
        }
    },
    methods:{
        tapTrigger(e){
            this.triggerEvent('tapped',{
                index:this.data.indexs
            })
        }
    }
});
