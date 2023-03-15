const {User, Thought} = require('../models');

module.exports = {
    getThoughts(req,res){
        Thought.find()
            .populate('reactions')
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .populate('reactions')
            .then((thought) =>
                !thought
                ? res.status(404).json({ message: 'No thought with that ID' })
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {return User.findOneAndUpdate({_id: req.body.userId},{$addToSet: {thought:thought_id}}, {new:true})})
            .catch((err) => res.status(500).json(err));
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate({_id: req.params.thoughtId},{$set: req.body}, {runValidators:true, new:true})
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
    },
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) =>
        !thought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : Application.deleteMany({ _id: { $in: thought.applications } })
        )
        .then(() => res.json({ message: 'Thought and associated apps deleted!' }))
        .catch((err) => res.status(500).json(err));
    },
    addReaction(req, res){
        Thought.findOneAndUpdate({_id: req.params.thoughtId},{$addToSet: {reactions:req.body}}, {new:true})
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
    },
    removeReaction(req, res){
        Thought.findOneAndUpdate({_id: req.params.thoughtId},{$pull: {reactions:req.params.reactionId}}, {new:true})
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
    }
}