Comments = new Meteor.Collection('comments');
Meteor.methods({
  comment: function(commentAttributes) {
    var user = Meteor.user();
    var entry = Entries.findOne(commentAttributes.entryId);
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to make comments");
    if (!commentAttributes.body)
      throw new Meteor.Error(422, 'Please write some content');
    if (!commentAttributes.entryId)
      throw new Meteor.Error(422, 'You must comment on an entry');
    comment = _.extend(_.pick(commentAttributes, 'entryId', 'body'), {
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime()
    });
    Entries.update(comment.entryId, {$inc: {commentsCount: 1}});
    
    return Comments.insert(comment);
  }
});