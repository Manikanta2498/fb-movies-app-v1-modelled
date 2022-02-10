from django.http import HttpResponse
from django.http import response
from django.http.response import JsonResponse
from django.forms.models import model_to_dict
from rest_framework.decorators import api_view

from movies.models import Dynamic, Fname, Lname, Movie, Output, User, UserPattern
import dateutil.parser 
import json,ast,random,string,re
from os import listdir
from os.path import isfile, join
import pandas as pd 
from pypmml import Model
import time

IPs = []

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

result = model.predict({
    "user_age": 20,
    "clean_edu" : "more.than.bachelors",
    "user_frequency" : "Once a month",
    "user_genre" : "Comedy",
    "genre.match" : 1,
    "rating.y" : 10,
    "rec_gender" : "Male",
    "rec_race" : "Black"
})

# Local
# images_path = "M:/MS_STUDY/RA/MOVIE/selected gan faces/"
df = pd.read_csv('selected_faces.csv',usecols=['face_number','type'])

# images_path = "/home/ubuntu/MOVIES/selected_images/"
# df = pd.read_csv('/home/ubuntu/MOVIES/fb-movies-app/movies_backend/selected_faces.csv',usecols=['face_number','type'])

def index(request):
    return HttpResponse("Hello, world. You're at the Movies index.")

@api_view(["POST"])
def postIP(data):
    data = data.body.decode("utf-8")
    if data in IPs:
        return JsonResponse(0,safe=False)
    else:
        return JsonResponse(1,safe=False)

@api_view(["GET"])
def getUserID(request):
    r = ''.join([random.choice(string.ascii_letters + string.digits) for n in range(10)])
    if len(User.objects.all()) > 0:
        while (len(User.objects.filter(user_id=r)) != 0):
            r = ''.join([random.choice(string.ascii_letters + string.digits) for n in range(10)])
    return JsonResponse(r,safe=False)

@api_view(["POST"])
def postSurveyData(data):
    data = json.loads(data.body.decode("utf-8"))
    try:
        movies_selected = []
        for movie in data['movies_selected']:
            if data['movies_selected'].get(movie):
                movies_selected.append(movie)
        movies_reviewed = data['movies_reviewed']
        for i in range(len(data['movie_data'])-1,-1,-1):
            movie_data = data['movie_data'][i]
            name_data = data['name_data'][i]
            fname = Fname.objects.filter(first_name=name_data['fname'])[0]
            clicked = 1 if str(i) in movies_selected else 0
            readmore_count = movies_reviewed.get(str(i)) if movies_reviewed.get(str(i)) else 0
            timed = 1 if data["time_choice"] == True else 0
            output_instance = Output.objects.create(
                user_id = data["user_id"],
                order_no = i+1,
                movie_title = movie_data["title"],
                rating = movie_data["rating"],
                review = movie_data["review"],
                clicked = clicked,
                readmore_count = readmore_count,
                timestamp = data["timestamp"],
                timed = timed,
                rec_first_name = fname.first_name,
                rec_last_name = name_data['lname'],
                rec_race = fname.race,
                rec_gender = fname.gender,
            )
        return JsonResponse('Post Info Success',safe=False)
    except Exception as e:
        print(e)
        return JsonResponse('Post Info Failed',safe=False)

@api_view(["POST"])
def postUserTestType(data):
    try:
        data = json.loads(data.body.decode("utf-8"))
        timed = 1 if data["time_choice"] == True else 0
        user = User.objects.get(user_id=data["user_id"])
        user.test_type = timed
        user.save()
        return JsonResponse('Post Test Type Success',safe=False)
    except Exception as e:
        print(e)
        return JsonResponse('Post Test Type Failed',safe=False)

@api_view(["POST"])
def postFeedbackData(data):
    data = json.loads(data.body.decode("utf-8"))
    try:
        user_id = data["user_id"]
        user = User.objects.get(user_id=user_id)
        user.feedback_rate = data["rate"]
        user.feedback_satisfied = data["satisfied"]
        user.feedback_rely = data["rely"]
        user.feedback_likely = data["likely"]
        user.feedback_study = data["study"]
        user.feedback_share = data["share"]
        user.time_spent = str((dateutil.parser.parse(data["user_exit_time"])-user.user_entry_time).total_seconds())
        user.save()
        return JsonResponse('Post Feedback Success',safe=False)
    except Exception as e:
        print(e)
        return JsonResponse('Post Feedback Failed',safe=False)

@api_view(["POST"])
def postMovieLink(data):
    data = json.loads(data.body.decode("utf-8"))
    try:
        user_id = data["user_id"]
        user = User.objects.get(user_id=user_id)
        user.movie_link_clicked = 1
        user.save()
        return JsonResponse('Post Movie Link Success',safe=False)
    except Exception as e:
        print(e)
        return JsonResponse('Post Movie Link Failed',safe=False)

@api_view(["POST"])
def postNewUser(data):
    info = json.loads(data.body.decode("utf-8"))
    try:
        user_instance = User.objects.create(
            user_id = info["user_id"],
            user_entry_time = info["user_entry_time"],
        )
        timed = 1 if info["time_choice"] == True else 0
        user = User.objects.get(user_id=info["user_id"])
        user.test_type = timed
        user.save()
        return JsonResponse('Post Info Success',safe=False)
    except Exception as e:
        print(e)
        return JsonResponse('Post Info Failed',safe=False)

@api_view(["POST"])
def postUserInfo(data):
    info = json.loads(data.body.decode("utf-8"))
    races = ','.join(name for name in info['race'])
    try:
        timed = 1 if info["time_choice"] == True else 0
        user = User.objects.get(user_id=info["user_id"])
        user.test_type = timed
        user.user_race = races
        user.user_gender = info["gender"]
        user.user_age = info["age"]
        user.user_education = info["study"]
        user.user_frequency = info["frequency"]
        user.user_genre = info["genre"]
        user.save()
        createUserMovieNamePattern(info["user_id"],timed)
        return JsonResponse('Post Info Success',safe=False)
    except Exception as e:
        print(e)
        return JsonResponse('Post Info Failed',safe=False)
  

movies_count = len(Movie.objects.all())
fnames_count = len(Fname.objects.all())
whiteNames = []
hispanicNames = []
blackNames = []
asianNames = []
for fname in Fname.objects.all():
    first_name = model_to_dict(fname)['first_name']
    race = model_to_dict(fname)['race']
    gender = model_to_dict(fname)['gender']
    lnames = list(Lname.objects.filter(race=race))
    for lname in lnames:
        last_name = model_to_dict(lname)['last_name']
        if race == 'White':
            whiteNames.append({"fname":first_name,"lname":last_name,"race":'white',"gender":gender})
        elif race == 'Black':
            blackNames.append({"fname":first_name,"lname":last_name,"race":'black',"gender":gender})
        elif race == 'Hispanic':
            hispanicNames.append({"fname":first_name,"lname":last_name,"race":'hispanic',"gender":gender})
        else:
            asianNames.append({"fname":first_name,"lname":last_name,"race":'asian',"gender":gender})
random.shuffle(whiteNames)
random.shuffle(hispanicNames)
random.shuffle(blackNames)
random.shuffle(asianNames)

# onlyfiles = [f for f in listdir(images_path) if isfile(join(images_path, f))]
pattern = '_#\d*_'
exclude_files = [8,41,37,79,80,95,98,111,104,125,140,153,144,143,154,163,177,194,221,256,271,280,287,288,300,313,314,315,320,321,333,350]

def createFacesPattern(namesList):
    image_sets = []
    for name in namesList:
        if name['gender'] == 'Male':
            for i in range(61):
                face_type = df.iloc[[i]]['type'].values[0]
                face_idx = df.iloc[[i]]['face_number'].values[0]
                if (face_type == 'men') and (face_idx not in image_sets):
                    image_sets.append(face_idx)
                    break
        elif name['gender'] == 'Female':
            for i in range(61):
                face_type = df.iloc[[i]]['type'].values[0]
                face_idx = df.iloc[[i]]['face_number'].values[0]
                if (face_type == 'women') and (face_idx not in image_sets):
                    image_sets.append(face_idx)
                    break
    return image_sets

def createUserMovieNamePattern(id,timed):
    try:
        if timed == 1:
            movies_count = model_to_dict(Dynamic.objects.first())['total_movies_time_1']
        else:
            movies_count = model_to_dict(Dynamic.objects.first())['total_movies_time_2']
        randomMovieslist = random.sample(range(1,movies_count+1), movies_count)
        raceProbabilities = {'White':64,'Hispanic':22,'Black':14,'Asian':0}
        namesList = []
        random.shuffle(whiteNames)
        random.shuffle(hispanicNames)
        random.shuffle(blackNames)
        random.shuffle(asianNames)
        for i in range(int(movies_count*raceProbabilities['White']/100)+1):
            namesList.append(whiteNames[i])
        for i in range(int(movies_count*raceProbabilities['Hispanic']/100)+1):
            namesList.append(hispanicNames[i])
        for i in range(int(movies_count*raceProbabilities['Black']/100)+1):
            namesList.append(blackNames[i])
        for i in range(int(movies_count*raceProbabilities['Asian']/100)):
            namesList.append(asianNames[i])
        random.shuffle(namesList)
        image_sets = [] #createFacesPattern(namesList)
        user = model_to_dict(User.objects.get(user_id=id))
        movies = [model_to_dict(Movie.objects.get(id=movie_id+206)) for movie_id in randomMovieslist]
        
        predictions = []
        for i in range(len(movies)):
            movie = movies[i]
            recommender = namesList[i]
            genre_match = 1 if user['user_genre'] in movie['genre'] else 0
            edu = eduMap[user['user_education']]
            
            model_result = model.predict({
                "user_age": user['user_age'],
                "clean_edu" : edu,
                "user_frequency" : user['user_frequency'],
                "user_genre" : user['user_genre'],
                "genre.match" : genre_match,
                "rating.y" : movie['rating'],
                "rec_gender" : recommender['gender'],
                "rec_race" : recommender['race'].capitalize()
            })
            predictions.append(model_result['predicted_clicked'])
            
        moviesListModelled = [x for _,x in sorted(zip(predictions,randomMovieslist),reverse=True)]
    
        user_instance = UserPattern.objects.create(
            user_id = id,
            user_movies_pattern = str(moviesListModelled),
            user_names_pattern = str(namesList),
            user_faces_pattern = str(image_sets),
            movie_index = 0,
            names_index = 0,
        )
        print('User created')
    except Exception as e:
        print(e)
        

@api_view(["GET"])
def getImage(request, data):
    first_name,index = data.split(',')
    fname = Fname.objects.filter(first_name=first_name)[0]
    race = fname.race.lower()
    setFaces = []
    pattern = '_#'+str(index)+'_'
    for f in onlyfiles:
        if pattern in f:
            if race in f:
                setFaces.append(f)
                continue
    img = str(random.choice(setFaces))
    image_data = open(images_path+img, "rb").read()
    return HttpResponse(image_data, content_type="image/jpeg")

@api_view(["POST"])
def getFaces(data):
    try:
        user_id = str(data.body.decode("utf-8").strip())
        index = model_to_dict(UserPattern.objects.get(user_id=user_id))['faces_index']  
        facesList = ast.literal_eval(model_to_dict(UserPattern.objects.get(user_id=user_id))['user_faces_pattern'])
        res = []
        for i in range(index,index+3):
            res.append(facesList[i])
        UserPattern.objects.filter(user_id=user_id).update(faces_index = index+3)
        return JsonResponse(res,safe=False)
    except Exception as e:
        print(e)
        return JsonResponse([],safe=False)

@api_view(["POST"])
def getNames(data):
    try:
        user_id = str(data.body.decode("utf-8").strip())
        index = model_to_dict(UserPattern.objects.get(user_id=user_id))['names_index']  
        namesList = ast.literal_eval(model_to_dict(UserPattern.objects.get(user_id=user_id))['user_names_pattern'])
        res = []
        for i in range(index,index+3):
            res.append(namesList[i])
        UserPattern.objects.filter(user_id=user_id).update(names_index = index+3)
        return JsonResponse(res,safe=False)
    except Exception as e:
        print(e)
        return JsonResponse([],safe=False)

@api_view(["POST"])
def getMovies(data):
    try:
        user_id = str(data.body.decode("utf-8").strip())
        index = model_to_dict(UserPattern.objects.get(user_id=user_id))['movie_index']  
        moviesList = ast.literal_eval(model_to_dict(UserPattern.objects.get(user_id=user_id))['user_movies_pattern'])
        movies_indexes = []
        for i in range(index,index+3):
            movies_indexes.append(moviesList[i])
        UserPattern.objects.filter(user_id=user_id).update(movie_index = index+3)
        movies = [model_to_dict(Movie.objects.get(id=movie_id+206)) for movie_id in movies_indexes]
        return JsonResponse(movies,safe=False)
    except Exception as e:
        print(e)
        return JsonResponse([],safe=False)

@api_view(["GET"])
def getDynamics(request):
    return JsonResponse(model_to_dict(Dynamic.objects.first()),safe=False)

@api_view(["GET"])
def getMoviesCount(request):
    return JsonResponse(len(Movie.objects.all()),safe=False)

@api_view(["GET"])
def getFNamesCount(request):
    return JsonResponse(len(Fname.objects.all()),safe=False)

@api_view(["GET"])
def createFnames(request):
    try:
        with open('DB_Data/fname.json') as f:
            data = json.load(f)
            for fname in data[2]['data']:
                fname_instance = Fname.objects.create(
                    first_name=fname['first_name'],
                    race=fname['race'],
                    gender=fname['gender'])
        return JsonResponse('First names created!',safe=False)
    except ValueError as e:
        print("----Error----")
        return response(e.args[0])

@api_view(["GET"])
def createLnames(request):
    try:
        with open('DB_Data/lname.json') as f:
            data = json.load(f)
            for lname in data[2]['data']:
                fname_instance = Lname.objects.create(
                    last_name=lname['last_name'],
                    race=lname['race'])
        return JsonResponse('Last names created!',safe=False)
    except ValueError as e:
        print("----Error----")
        return response(e.args[0])

@api_view(["GET"])      
def createMovies(request):
    try:
        with open('DB_Data/movies_1.json') as f:
            data = json.load(f)
            for movie in data[2]['data']:
                movie_instance = Movie.objects.create(
                    title=movie['title'],
                    review=movie['review'],
                    link=movie['link'],
                    rating=movie['rating'],
                    image_url=movie['image_link'],
                    length = movie['length'],
                    genre = movie['genre'],
                    release_date = movie['release_date'],
                    )
        return JsonResponse('Movies created!',safe=False)
    except ValueError as e:
        print("----Error----")
        return response(e.args[0])

@api_view(["GET"])      
def createUpdatedMovies(request):
    try:
        data = pd.read_csv('DB_Data/trim_movies.csv')
        for i in range(len(data)):
            # print(data.iloc[[i]]['Title'].values[0])
            movie_instance = Movie.objects.create(
                    title=data.iloc[[i]]['Title'].values[0],
                    review=data.iloc[[i]]['Review'].values[0],
                    link=data.iloc[[i]]['link'].values[0],
                    rating=int(data.iloc[[i]]['Rating'].values[0]),
                    image_url=data.iloc[[i]]['image_link'].values[0],
                    length = data.iloc[[i]]['Length'].values[0],
                    genre = data.iloc[[i]]['Genre'].values[0],
                    release_date = data.iloc[[i]]['Released_date'].values[0],
                    )

        return JsonResponse('Movies created!',safe=False)
    except ValueError as e:
        print("----Error----")
        return response(e.args[0])