"""Models and database functions"""

from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()


##############################################################################
# Model definitions
class User(db.Model):
    pass



##############################################################################
# Helper functions

def connect_to_db(app):
    """Connect the database to app."""

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/developdb'
    db.app = app
    db.init_app(app)


if __name__ == "__main__":

    from server import app
    connect_to_db(app)
    print "Connected to DB."