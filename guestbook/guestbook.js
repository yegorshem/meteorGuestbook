Messages = new Mongo.Collection("messages");

Router.route('/', function () {
    this.render('guestBook');  // render guestbook template
    this.layout('layout');      // set the main layout template
});

Router.route('/about', function () {
    this.render('about');
    this.layout('layout');
});

Router.route('/messages/:_id', function () {
        this.render('message', {
            data: function () {
                return Messages.findOne({_id: this.params._id});
            }
        });
        this.layout('layout');
    },
    {
        name: 'message.show'
    });


if (Meteor.isClient) {

    Accounts.ui.config({
        //options are listed in book on p. 135
        //USERNAME_AND_EMAIL, USERNAME_AND_OPTONAL_EMAIL,
        //USERNAME_ONLY< EMAIL_ONLY
        passwordSignupFields: "USERNAME_ONLY"
    });

    Meteor.subscribe("messages");

    Template.guestBook.helpers({
            "messages": function () {
                return Messages.find({}, {sort: {createdOn: -1}}) || {};
            }
        }
    );

    //template.guestbook
    Template.guestBook.events({
        "submit form": function (event) {
            event.preventDefault();

            var messageBox = $(event.target).find('textarea[name=guestBookMessage]');

            var messageText = messageBox.val();

            //var nameBox = $(event.target).find('input[name=guestName]');
            //var nameText = nameBox.val();

            if (messageText.length > 0) {

                Messages.insert(
                    {
                        name: Meteor.user().username,
                        message: messageText,
                        createdOn: Date.now()
                    }
                );
            }
            else {
                alert("Please enter a message");
                //Console(messageBox);
                //messageBox.addClass('control-group error');
            }


            //alert("Name is " + nameText + ", message: " + messageText);
        }

    });

}

if (Meteor.isServer) {

    Meteor.publish("messages", function () {
        return Messages.find();
    });
}
