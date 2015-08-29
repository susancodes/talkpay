from flask import Flask, render_template
from flask_debugtoolbar import DebugToolbarExtension
from model import connect_to_db, db
from jinja2 import StrictUndefined
from twilio import twiml
from twilio.rest import TwilioRestClient

import os

app = Flask(__name__)

app.secret_key = "developHER"
app.jinja_env.undefined = StrictUndefined


##############################################################################
# **** Twilio **** 

account_sid = os.environ['TWILIO_ACCOUNT_SID']
auth_token = os.environ['TWILIO_AUTH_TOKEN']
client = TwilioRestClient(account_sid, auth_token)
to_number = os.environ['TWILIO_TO_NUMBER']
TWILIO_NUMBER = os.environ['TWILIO_NUMBER']

##############################################################################



@app.route("/")
def homepage():
	"""Render home page for log-in."""

	return render_template("index.html")


if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the point
    # that we invoke the DebugToolbarExtension
    app.debug = True

    connect_to_db(app)

    # Use the DebugToolbar
    # DebugToolbarExtension(app)

    app.run()