from flask import Flask, redirect, url_for, session, request, jsonify, render_template, flash
from flask_oauthlib.client import OAuth
import os
from flask_debugtoolbar import DebugToolbarExtension
from model import connect_to_db, db
from jinja2 import StrictUndefined
from twilio import twiml
from twilio.rest import TwilioRestClient
from model import connect_to_db, db, User, Position

import scrape_data



app = Flask(__name__)
app.debug = True
app.secret_key = 'development'
oauth = OAuth(app)

linkedin = oauth.remote_app(
    'linkedin',

    consumer_key=os.environ['CLIENT_ID'],  # replace with you own Client ID
    consumer_secret=os.environ['CLIENT_SECRET'], # replace with your consumer_secret


    request_token_params={
        'scope': 'r_basicprofile', # replace with r_fullprofile
        'state': 'RandomString',
    },
    base_url='https://api.linkedin.com/v1/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://www.linkedin.com/uas/oauth2/accessToken',
    authorize_url='https://www.linkedin.com/uas/oauth2/authorization',
)


@app.route('/')
def index():
    user_id = session.get('current_user', None)
    user = None
    if user_id:
        user = User.get_user_by_user_id(user_id)

    return render_template('index.html', user=user)
    # if 'linkedin_token' in session:
    #     return render_template('dashboard.html')
    # return redirect(url_for('login'))


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

@app.route('/login')
def login():
    if 'linkedin_token' in session:
        print session.get('curent_user', None), "this is current user in session"
        return render_template('dashboard.html')
    return linkedin.authorize(callback=url_for('authorized', _external=True))

@app.route('/logout')
def logout():
    session.pop('linkedin_token', None)
    session.pop('current_user', None)
    return render_template("index.html")

@app.route('/process-user-info', methods=['POST'])
def process_user_info():
    user_id = session['current_user']
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    headline = request.form.get('headline')
    location = request.form.get('form')
    gender = request.form.get('gender')
    industry = request.form.get('industry')
    salary = int(request.form.get('salary'))

    user = User.get_user_by_user_id(user_id)
    user.update_user_profile(first_name=first_name, last_name=last_name, headline=headline, location=location, gender=gender,
                             industry=industry)
    position = Position.get_position_by_user_id(user_id)
    if position:
        position.update_position(salary=salary)
    else:
        Position.create(user_id=user_id, salary=salary)

    flash ("Your profile has been updated")
    return render_template('search.html')

@app.route('/login/authorized')
def authorized():
    resp = linkedin.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    session['linkedin_token'] = (resp['access_token'], '')

    me = linkedin.get('people/~:(id,first-name,last-name,headline,positions,location,industry,specialties,public-profile-url)?format=json')
    user_data = me.data
    print "user data: ", user_data

    first_name = user_data.get('firstName', None)
    last_name = user_data.get('lastName', None)
    id = user_data.get('id', None)
    headline = user_data.get('headline', None)
    industry = user_data.get('industry', None)
    location = user_data.get('location', None)
    if location:
        location_name = location['name']

    check_user = User.get_user_by_linkedin_id(id) #check to see if the user exists already
    print check_user, "this is check_user"
    if not check_user:
        user = User.create(first_name=first_name,
                    last_name=last_name,
                    linkedin_id=id,
                    headline=headline,
                    industry=industry,
                    location=location_name
                    )

    else:
        user = check_user
    print user, "this is the user"
    user_id = user.user_id
    session['current_user'] = user_id
    positions = user_data.get('positions', None)
    if positions and positions.get('values', None):
        position_info = positions.get('values')[0]
        position_company = None
        position_start_date = None
        position_title = None
        if position_info.get('company', None):
            position_company = position_info.get('company', None)['name']
        if position_info.get('startDate', None):
            position_start_date_month = position_info['startDate']['month']
            position_start_date_year = position_info['startDate']['year']
            position_start_date = str(position_start_date_month) + " " + str(position_start_date_year)
        if position_info.get('title', None):
            position_title = position_info['title']

        position = Position.create(user_id=user_id, company=position_company, start_date=position_start_date, title=position_title)


    else:
        position = None

    return render_template('dashboard.html', user=user, position=position)


@linkedin.tokengetter
def get_linkedin_oauth_token():
    return session.get('linkedin_token')


def change_linkedin_query(uri, headers, body):
    auth = headers.pop('Authorization')
    headers['x-li-format'] = 'json'
    if auth:
        auth = auth.replace('Bearer', '').strip()
        if '?' in uri:
            uri += '&oauth2_access_token=' + auth
        else:
            uri += '?oauth2_access_token=' + auth
    return uri, headers, body

linkedin.pre_request = change_linkedin_query


@app.route('/processsearch.json')
def process_search():
    """find title in scraped data."""

    # title = request.args.get('title')

    title = "Computer programmers"

    entire_dict = get_title_and_salaries()

    if title in entire_dict:
        
        new_dict = {'title': title,
                    'men': entire_dict[title][3],
                    'women': entire_dict[title][5]}

        print new_dict

        return jsonify(new_dict)








if __name__ == '__main__':
    app.debug = True

    connect_to_db(app)


    # DebugToolbarExtension(app)
    app.run()