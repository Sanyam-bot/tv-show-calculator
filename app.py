from flask import Flask, request, render_template, jsonify
import requests
import json

# Configure
app = Flask(__name__)

app.config["TEMPLATES_AUTO_IMPLEMENTED"] = True

API_KEY = "22e6b43cfea401143c0e88ecdec5c66e"
API_url = "https://api.themoviedb.org/3"

headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMmU2YjQzY2ZlYTQwMTE0M2MwZTg4ZWNkZWM1YzY2ZSIsInN1YiI6IjY2MjY4NGUzY2I2ZGI1MDE2M2FlZmQ4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uvyOegDzpRqHXvc1FV6aJ1Mbk8-SrfciZHk8y86Vk4c"
}

def calculate_time(time):
    hours = int(time / 60)
    days = int(hours / 24)
    hours = hours % 24
    minutes = int(time % 60)

    return days, hours, minutes 

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template('index.html')

@app.route("/calculate", methods=["GET", "POST"])
def calculate():
    if request.method == "GET":
        # Get the Id from search bar
        show_id = request.args.get('show_id')

        # Getting the image from the API
        image_url = f"https://api.themoviedb.org/3/tv/{show_id}/images?api_key=22e6b43cfea401143c0e88ecdec5c66e"
        
        response_0 = requests.get(image_url, headers=headers) 
        if response_0:
            data_0 = response_0.json() 
            try:
                file_path = data_0["backdrops"][0]["file_path"] # Selecting the first image
            except IndexError:
                file_path = 0
        else:
            raise RuntimeError("Internal server error")
        
        # Getting the data from API
        url_0 = f"https://api.themoviedb.org/3/tv/{show_id}?api_key=22e6b43cfea401143c0e88ecdec5c66e"

        response_1 = requests.get(url_0, headers=headers)
        

        # To make sure there aren't any errors fetching API
        if response_1:
            # Getting the data to fill up the table
            data_1 = response_1.json() # Parsing the JSON file
            name = data_1["original_name"]
            season = data_1["number_of_seasons"]
            episodes = data_1["number_of_episodes"]
            rating = data_1["vote_average"]
            status = data_1["status"]
            runtime = data_1["episode_run_time"]

            # TO check if API even provided the runtime
            if runtime:
                # averaging all the runtimes given in episode_run_time
                total = 0
                for length in runtime: # Iterating over a list
                    total += length
                real_runtime = total / (len(runtime)) 
            else:
                # averaging the runtime of every episode in the first season
                url_1 = f"https://api.themoviedb.org/3/tv/{show_id}/season/1?api_key=22e6b43cfea401143c0e88ecdec5c66e" 
                response_2 = requests.get(url_1, headers=headers) # Making an another API call to get the runtime of every episode of first season
                
                if response_2:
                    data_2 = response_2.json() # Parsing the json file
                    s1_episodes = data_2["episodes"]
                    total = 0
                    for episode in s1_episodes: # Iterating over the list of dict
                        total += episode["runtime"]
                    real_runtime = total / (len(s1_episodes))              

                else:
                    raise RuntimeError("Internal server error")
            
            # Now calculating the total time
            total_time = real_runtime * episodes
            days, hours, minutes = calculate_time(total_time) 

            return render_template('calculate.html', name=name,season=season,episodes=episodes,rating=rating,status=status,days=days,hours=hours,minutes=minutes,total_time=total_time, file_path=file_path)
        else:
            raise RuntimeError("Internal server error")
    else:
        return render_template('calculate.html')