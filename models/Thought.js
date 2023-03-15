const {Schema,model, get}= require('mongoose')
const dayjs = require('dayjs')

function dateFormat(date){
    return dayjs(date).format('MM/DD/YYYY h:mm a')
}

const reactionSchema = new Schema({
    reactionId:{
        type: Schema.Types.ObjectId
    },
    reactionBody:{
        type: String,
        required: true,
        maxLength: 280
    },
    username:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: dayjs(),
        get: dateFormat,
    }
},{
    toJSON:{getters:true},id:false
})
const thoughtSchema = new Schema({
    thoughtText:{
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280,
    },
    createdAt:{
        type: Date,
        default: dayjs(),
        get: dateFormat,
    },
    username:{
        type: String,
        required: true,
    },
    reactions:[
        reactionSchema
    ],
},{
    toJSON:{virtuals:true, getters:true},id:false
})


thoughtSchema.virtual("reactionCount").get(function(){return this.reactions.length})

const Thought = model('Thought', thoughtSchema)

module.exports = Thought