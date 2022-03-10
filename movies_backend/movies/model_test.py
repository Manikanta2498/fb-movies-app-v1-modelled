from django.forms.models import model_to_dict
from rest_framework.decorators import api_view

from movies.models import Dynamic, Fname, Lname, Movie, Output, User, UserPattern
from pypmml import Model

model = Model.fromFile("movies/shallow_model.pmml")
eduMap = {
    "Did not graduate high school" : "less.than.bachelors",
    "Graduated high school" : "less.than.bachelors",
    "Some college, no degree" : "less.than.bachelors",
    "Associate degree"  : "less.than.bachelors",
    "Bachelor degree"   : "bachelors",
    "Master degree"    : "more.than.bachelors",
    "Professional degree" : "more.than.bachelors",
    "Doctoral degree" : "more.than.bachelors"
}

predictions1 = []
predictions2 = []

randomMovieslist = [6, 35, 41, 25, 30, 10, 7, 42, 39, 16, 24, 21, 11, 19, 37, 33, 5, 32, 4, 27, 8, 9, 15, 38, 12, 23, 3, 17, 13, 22, 28, 31, 14, 20, 34, 1, 2, 26, 36, 29, 18, 40]
namesList = [{'fname': 'Jay', 'lname': 'M', 'race': 'white', 'gender': 'Male'}, {'fname': 'Terell', 'lname': 'J', 'race': 'black', 'gender': 'Male'}, {'fname': 'Geoffrey', 'lname': 'K', 'race': 'white', 'gender': 'Male'}, {'fname': 'Emily', 'lname': 'S', 'race': 'white', 'gender': 'Female'}, {'fname': 'Juanita', 'lname': 'R', 'race': 'hispanic', 'gender': 'Female'}, {'fname': 'Juanita', 'lname': 'M', 'race': 'hispanic', 'gender': 'Female'}, {'fname': 'Tyler', 'lname': 'S', 'race': 'white', 'gender': 'Male'}, {'fname': 'Cody', 'lname': 'H', 'race': 'white', 'gender': 'Male'}, {'fname': 'Scott', 'lname': 'S', 'race': 'white', 'gender': 'Male'}, {'fname': 'Claire', 'lname': 'R', 'race': 'white', 'gender': 'Female'}, {'fname': 'Gabriella', 'lname': 'L', 'race': 'hispanic', 'gender': 'Female'}, {'fname': 'Jay', 'lname': 'S', 'race': 'white', 'gender': 'Male'}, {'fname': 'Carlos', 'lname': 'M', 'race': 'hispanic', 'gender': 'Male'}, {'fname': 'Juan', 'lname': 'R', 'race': 'hispanic', 'gender': 'Male'}, {'fname': 'Greg', 'lname': 'E', 'race': 'white', 'gender': 'Male'}, {'fname': 'Reginald', 'lname': 'J', 'race': 'black', 'gender': 'Male'}, {'fname': 'Thomas', 'lname': 'H', 'race': 'white', 'gender': 'Male'}, {'fname': 'Anne', 'lname': 'S', 'race': 'white', 'gender': 'Female'}, {'fname': 'Matthew', 'lname': 'F', 'race': 'white', 'gender': 'Male'}, {'fname': 'Matthew', 'lname': 'A', 'race': 'white', 'gender': 'Male'}, {'fname': 'Hakim', 'lname': 'J', 'race': 'black', 'gender': 'Male'}, {'fname': 'Cody', 'lname': 'S', 'race': 'white', 'gender': 'Male'}, {'fname': 'Emily', 'lname': 'F', 'race': 'white', 'gender': 'Female'}, {'fname': 'Cody', 'lname': 'S', 'race': 'white', 'gender': 'Male'}, {'fname': 'Carrie', 'lname': 'A', 'race': 'white', 'gender': 'Female'}, {'fname': 'Carlos', 'lname': 'G', 'race': 'hispanic', 'gender': 'Male'}, {'fname': 'Juan', 'lname': 'L', 'race': 'hispanic', 'gender': 'Male'}, {'fname': 'Emily', 'lname': 'R', 'race': 'white', 'gender': 'Female'}, {'fname': 'Daquan', 'lname': 'F', 'race': 'black', 'gender': 'Male'}, {'fname': 'Gabriella', 'lname': 'R', 'race': 'hispanic', 'gender': 'Female'}, {'fname': 'Matthew', 'lname': 'S', 'race': 'white', 'gender': 'Male'}, {'fname': 'Douglas', 'lname': 'W', 'race': 'white', 'gender': 'Male'}, {'fname': 'Jacob', 'lname': 'A', 'race': 'white', 'gender': 'Male'}, {'fname': 'Gabriella', 'lname': 'M', 'race': 'hispanic', 'gender': 'Female'}, {'fname': 'Allison', 'lname': 'O', 'race': 'white', 'gender': 'Female'}, {'fname': 'Claire', 'lname': 'S', 'race': 'white', 'gender': 'Female'}, {'fname': 'Tyrone', 'lname': 'R', 'race': 'black', 'gender': 'Male'}, {'fname': 'Carlos', 'lname': 'R', 'race': 'hispanic', 'gender': 'Male'}, {'fname': 'Greg', 'lname': 'S', 'race': 'white', 'gender': 'Male'}, {'fname': 'Jill', 'lname': 'M', 'race': 'white', 'gender': 'Female'}, {'fname': 'Tyler', 'lname': 'R', 'race': 'white', 'gender': 'Male'}, {'fname': 'Douglas', 'lname': 'W', 'race': 'white', 'gender': 'Male'}, {'fname': 'Malcolm', 'lname': 'P', 'race': 'black', 'gender': 'Male'}]
movies = [model_to_dict(Movie.objects.get(id=movie_id+206)) for movie_id in randomMovieslist]
for i in range(len(movies)):
    movie = movies[i]
    recommender = namesList[i]
    genre_match = 1 if "Other" in movie['genre'] else 0
    # edu = eduMap[user['user_education']]
    
    model_result = model.predict({
        "user_age": 27,
        "clean_edu" : "bachelors",
        "user_frequency" : "Several times a month",
        "user_genre" : "Other",
        "genre.match" : genre_match,
        "rating.y" : movie['rating'],
        "rec_gender" : recommender['gender'],
        "rec_race" : recommender['race'].capitalize()
    })
    predictions1.append(model_result['predicted_clicked'])
    
print(predictions1)