Red Claw Integrity

Red Claw Integrity is a project focused on [briefly describe the project purpose or mission here — e.g., advancing anti-corruption practices through technology and education].




Setup & Configuration



Development Environment

To run the project in development mode:

Uncomment this line in your code:
os.environ['FLASK_ENV'] = 'development'

Create a file named .env.dev in your project root with the following content:
FLASK_ENV=development
DATABASE_URL=sqlite:///site.db
SECRET_KEY=your_secret_key_here

The database (site.db) will be created locally when you run the app.




Production Environment

To run the project in production mode:

Comment out or remove the following line in your code:
os.environ['FLASK_ENV'] = 'development'

Create a file named .env.prod with the following content:
FLASK_ENV=production
DATABASE_URL=your_production_database_url_here
SECRET_KEY=your_production_secret_key_here

Set up your production database as specified in DATABASE_URL.






Notes

Make sure to keep your SECRET_KEY secure and never expose it publicly.

Adjust the database URLs according to your environment and database service.





Contribution

Feel free to fork the repository and submit pull requests. Please ensure your code follows the project style and includes tests where applicable.





License

[Add your license information here]